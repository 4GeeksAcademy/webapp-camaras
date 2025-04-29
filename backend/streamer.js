// backend/streamer.js
require('dotenv').config();
const WebSocket = require('ws');
const { Pool } = require('pg');
const { spawn } = require('child_process');

// Carga la URL de la base de datos desde backend/.env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Arranca un servidor WebSocket en el puerto 9999
const wss = new WebSocket.Server({ port: 9999 });

wss.on('connection', async (ws, req) => {
  // URL esperada: ws://host:9999/stream/<cameraId>
  const parts = req.url.split('/');
  const cameraId = parseInt(parts.pop(), 10);
  if (!cameraId) {
    ws.close(1008, 'ID de cámara inválido');
    return;
  }

  try {
    // Consulta credenciales e IP de la cámara en Postgres
    const res = await pool.query(
      'SELECT username, password, ip_address FROM cameras WHERE id=$1',
      [cameraId]
    );
    if (res.rows.length === 0) {
      ws.close(1008, 'Cámara no encontrada');
      return;
    }
    const { username, password, ip_address } = res.rows[0];
    const rtspUrl = `rtsp://${username}:${password}@${ip_address}/axis-media/media.amp`;
    console.log(`▶️ Conectando cámara ${cameraId}: ${rtspUrl}`);

    // Lanza ffmpeg para leer RTSP y sacar MPEG-TS por stdout
    const ffmpeg = spawn('ffmpeg', [
      '-rtsp_transport', 'tcp',
      '-i', rtspUrl,
      '-f', 'mpegts',
      '-codec:v', 'mpeg1video',
      '-r', '30',
      '-b:v', '1000k',
      '-'
    ]);

    // Cada chunk de stdout lo enviamos por WS
    ffmpeg.stdout.on('data', chunk => ws.send(chunk));

    ffmpeg.stderr.on('data', data =>
      console.error(`FFmpeg [${cameraId}]:`, data.toString())
    );

    ffmpeg.on('close', code =>
      console.log(`❌ FFmpeg cámara ${cameraId} finalizado con código ${code}`)
    );

    // Al cerrar el WS, mata ffmpeg
    ws.on('close', () => ffmpeg.kill('SIGKILL'));

  } catch (err) {
    console.error('Error interno streamer:', err);
    ws.close(1011, 'Error interno');
  }
});

console.log('WebSocket streamer listening on ws://0.0.0.0:9999/stream/<cameraId>');
