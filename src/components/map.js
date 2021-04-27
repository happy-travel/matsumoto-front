import React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: null,
    iconSize: [24,36],
    iconAnchor: [12,36]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ marker }) => {
    const center = marker ? [marker.latitude, marker.longitude] : [51.505, -0.09];

    return (
        <div className="map-component">
            <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution=""
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center} />
            </MapContainer>
        </div>
    );
};

export default MapComponent;
