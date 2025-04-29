import React, { useState } from 'react';

function CameraModal({ onClose, addCameraToList }) {
    const [formData, setFormData] = useState({
        name: '',
        ip_address: '',
        username: '',
        password: '',
        connection_method: 'mjpeg',
        location_lat: '',
        location_lng: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/cameras', {  // RUTA RELATIVA, correcto
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.status === 201) {
                const data = await response.json();
                alert('Cámara añadida correctamente');

                // Actualiza la lista de cámaras en el VideoWallMenu
                if (addCameraToList) {
                    addCameraToList(data); 
                }

                onClose();  // Cierra el modal
            } else {
                const error = await response.json();
                alert('Error al añadir la cámara: ' + error.error);
            }
        } catch (err) {
            console.error('Error de conexión:', err);
            alert('Error de conexión con el servidor');
        }
    };

    return (
        <div className="modal">
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Nombre" onChange={handleChange} required />
                <input type="text" name="ip_address" placeholder="IP" onChange={handleChange} required />
                <input type="text" name="username" placeholder="Usuario" onChange={handleChange} />
                <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} />
                <select name="connection_method" onChange={handleChange}>
                    <option value="mjpeg">MJPEG</option>
                    <option value="rtsp">RTSP</option>
                </select>
                <input type="text" name="location_lat" placeholder="Latitud" onChange={handleChange} />
                <input type="text" name="location_lng" placeholder="Longitud" onChange={handleChange} />
                <button type="submit">Añadir Cámara</button>
                <button type="button" onClick={onClose}>Cancelar</button>
            </form>
        </div>
    );
}

export default CameraModal;
