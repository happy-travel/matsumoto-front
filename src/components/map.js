import React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';


let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: null,
    iconSize: [24,36],
    iconAnchor: [12,36]
});

L.Marker.prototype.options.icon = DefaultIcon;

class MapComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            center: [51.505, -0.09],
            mapRef: null,
            isLoadedScript: false,
        }
    }

    componentDidMount() {
    }

    render() {
        var { marker } = this.props,
            center = [marker.latitude, marker.longitude];

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
    }
}

export default MapComponent;
