import React from 'react';
import MapComponent from './MapComponent';
import EventCard from './EventCard'; 

const Dashboard = ({ events, selectedInterests, recommendedEvents, otherEvents, savedEventIds, toggleSaveEvent }) => {
    
    // Filtrowanie wydarzeń z lokalizacją dla mapy
    const mapEvents = events.filter(e => e.latitude && e.longitude && e.latitude !== 0 && e.longitude !== 0);

    return (
        <div className="fade-in">
            {/* MAPA LOKALIZACJI */}
            {mapEvents.length > 0 && (
                <div className="map-container">
                    <MapComponent events={mapEvents} />
                </div>
            )}

            {/* SEKCJA: POLECANE DLA CIEBIE */}
            {selectedInterests.length > 0 && recommendedEvents.length > 0 && (
                <section style={{ marginBottom: '40px' }}>
                    <h2 className="section-title recommended">
                        <i className="fa-solid fa-star"></i>
                        Polecane dla Ciebie
                    </h2>
                    <div className="events-grid">
                        {recommendedEvents.map(event => (
                            <EventCard 
                                key={event.id} 
                                event={event} 
                                isRecommended={true} 
                                isSaved={savedEventIds.includes(event.id)} 
                                onToggleSave={() => toggleSaveEvent(event.id)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* SEKCJA: POZOSTAŁE/WSZYSTKIE WYDARZENIA */}
            <section>
                <h2 className="section-title">
                    <i className="fa-solid fa-fire"></i>
                    {selectedInterests.length > 0 && recommendedEvents.length > 0 
                        ? "Pozostałe wydarzenia" 
                        : "Wszystkie wydarzenia"}
                </h2>
                
                {otherEvents.length > 0 ? (
                    <div className="events-grid">
                        {otherEvents.map(event => (
                            <EventCard 
                                key={event.id} 
                                event={event} 
                                isRecommended={false}
                                isSaved={savedEventIds.includes(event.id)}
                                onToggleSave={() => toggleSaveEvent(event.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <i className="fa-solid fa-calendar-xmark"></i>
                        <p>Brak wydarzeń do wyświetlenia</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Dashboard;
