import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Naprawienie ikon Leaflet dla Vite/React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapComponent = ({ events }) => {
    // Domyślna lokalizacja (Kraków)
    const defaultPosition = [50.0647, 19.9450];
    
    // Filtruj wydarzenia z poprawnymi współrzędnymi
    const validEvents = events.filter(e => 
        e.latitude && e.longitude && 
        !isNaN(parseFloat(e.latitude)) && 
        !isNaN(parseFloat(e.longitude))
    );
    
    // Centrum mapy - pierwsze wydarzenie lub domyślna pozycja
    const center = validEvents.length > 0 
        ? [parseFloat(validEvents[0].latitude), parseFloat(validEvents[0].longitude)] 
        : defaultPosition;

    return (
        <MapContainer 
            center={center} 
            zoom={12} 
            style={{ height: '400px', width: '100%' }} 
            scrollWheelZoom={true}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            />
            
            {validEvents.map((event) => (
                <Marker 
                    key={event.id} 
                    position={[parseFloat(event.latitude), parseFloat(event.longitude)]}
                >
                    <Popup>
                        <div style={{ minWidth: '180px' }}>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: '1em', fontWeight: '600' }}>
                                {event.title}
                            </h4>
                            <p style={{ margin: '0 0 4px 0', fontSize: '0.85em', color: '#666' }}>
                                📅 {new Date(event.date).toLocaleDateString('pl-PL', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </p>
                            <p style={{ margin: '0', fontSize: '0.85em', color: '#666' }}>
                                📍 {event.location}
                            </p>
                            {event.category && (
                                <span style={{ 
                                    display: 'inline-block',
                                    marginTop: '8px',
                                    padding: '2px 8px',
                                    background: '#00BFFF',
                                    color: 'white',
                                    borderRadius: '10px',
                                    fontSize: '0.75em'
                                }}>
                                    {event.category.name}
                                </span>
                            )}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
