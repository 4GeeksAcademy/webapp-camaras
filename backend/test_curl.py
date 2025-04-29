import requests

def test_camera_connection():
    url = "http://alphanet:@Lph@N3t.2024$@81.60.17.64:10001/axis-cgi/mjpg/video.cgi"
    
    try:
        response = requests.get(url, stream=True, timeout=5)
        if response.status_code == 200:
            print("[✅] Conexión correcta a la cámara.")
            print("Content-Type:", response.headers.get('Content-Type'))
        else:
            print(f"[❌] Error de conexión. Código de estado: {response.status_code}")
    except Exception as e:
        print(f"[❌] Excepción durante la conexión: {e}")

if __name__ == "__main__":
    test_camera_connection()
