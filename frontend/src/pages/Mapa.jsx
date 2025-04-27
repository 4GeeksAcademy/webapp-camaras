import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '../assets/Map.css';


function Mapa() {
    return(
        <div className="content-container">
            <MapContainer center={[40.4168, -3.7038]} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[40.4168, -3.7038]}>
                    <Popup>
                    ¡Hola! Estoy en Madrid.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>    
    )
}

export default Mapa;