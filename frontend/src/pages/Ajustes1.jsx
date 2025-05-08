import React, { useEffect, useState } from "react";
import { getAuthHeader, getUser } from "../utils/auth";

function Ajustes1() {
  const [cameras, setCameras] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({});
  const user = getUser();

  useEffect(() => {
    fetch("/api/cameras", {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => setCameras(data))
      .catch((err) => console.error("Error al cargar cámaras:", err));
  }, []);

  const handleEditClick = (camera) => {
    setEditId(camera.id);
    setFormData({
      name: camera.name,
      ip_address: camera.ip_address,
      username: camera.username,
      password: camera.password,
      connection_method: camera.connection_method,
      location_lat: camera.location.lat,
      location_lng: camera.location.lng,
      is_active: camera.is_active,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (id) => {
    fetch(`/api/cameras/${id}`, {
      method: "PUT",
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar cámara");
        return res.json();
      })
      .then(() => {
        setCameras((prev) => prev.map((cam) => cam.id === id ? { ...cam, ...formData } : cam));
        setEditId(null);
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta cámara?")) return;
    fetch(`/api/cameras/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar cámara");
        setCameras((prev) => prev.filter((cam) => cam.id !== id));
      })
      .catch((err) => console.error(err));
  };

  const handleAddCamera = () => {
    const newCam = {
      name: "",
      ip_address: "",
      username: "",
      password: "",
      connection_method: "mjpeg",
      location_lat: "",
      location_lng: "",
      is_active: true,
    };
    fetch("/api/cameras", {
      method: "POST",
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCam),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al crear cámara");
        return res.json();
      })
      .then((newCamera) => setCameras((prev) => [...prev, newCamera]))
      .catch((err) => console.error(err));
  };

  return (
    <div className="content-container">
      <h1>Cámaras</h1>
      {user && user.role === 'admin' && (
        <button onClick={handleAddCamera}>+ Añadir cámara</button>
      )}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>IP</th>
            <th>Usuario</th>
            <th>Contraseña</th>
            <th>Método</th>
            <th>Lat</th>
            <th>Lng</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cameras.map((cam) => (
            <tr key={cam.id}>
              {editId === cam.id ? (
                <>
                  <td><input name="name" value={formData.name} onChange={handleInputChange} /></td>
                  <td><input name="ip_address" value={formData.ip_address} onChange={handleInputChange} /></td>
                  <td><input name="username" value={formData.username} onChange={handleInputChange} /></td>
                  <td><input name="password" value={formData.password} onChange={handleInputChange} /></td>
                  <td>
                    <select name="connection_method" value={formData.connection_method} onChange={handleInputChange}>
                      <option value="mjpeg">MJPEG</option>
                      <option value="rtsp">RTSP</option>
                    </select>
                  </td>
                  <td><input name="location_lat" value={formData.location_lat} onChange={handleInputChange} /></td>
                  <td><input name="location_lng" value={formData.location_lng} onChange={handleInputChange} /></td>
                  <td>
                    <select name="is_active" value={formData.is_active} onChange={handleInputChange}>
                      <option value={true}>Sí</option>
                      <option value={false}>No</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleSave(cam.id)}>💾 Guardar</button>
                    <button onClick={() => setEditId(null)}>❌ Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{cam.name}</td>
                  <td>{cam.ip_address}</td>
                  <td>{cam.username}</td>
                  <td>{cam.password}</td>
                  <td>{cam.connection_method}</td>
                  <td>{cam.location.lat}</td>
                  <td>{cam.location.lng}</td>
                  <td>{cam.is_active ? "Sí" : "No"}</td>
                  <td>
                    {user && user.role === 'admin' && (
                      <>
                        <button onClick={() => handleEditClick(cam)}>✏️</button>
                        <button onClick={() => handleDelete(cam.id)}>🗑️</button>
                      </>
                    )}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Ajustes1;
