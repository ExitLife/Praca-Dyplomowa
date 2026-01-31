import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import EventModal from './EventModal';

const Profile = ({ token, categories, selectedInterests, toggleInterest, savePreferences, savedEventIds, onToggleSave }) => {
    
    const [savedEvents, setSavedEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Pobierz pełną listę ulubionych wydarzeń
    useEffect(() => {
        if (!token) return;

        fetch('http://localhost:5000/api/events/saved', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) setSavedEvents(data);
        })
        .catch(err => console.error("Błąd pobierania ulubionych wydarzeń:", err));

    }, [token, savedEventIds]);

    // Otwórz modal ze szczegółami
    const handleShowDetails = (event) => {
        setSelectedEvent(event);
    };

    // Zamknij modal
    const handleCloseModal = () => {
        setSelectedEvent(null);
    };

    return (
        <div className="fade-in">
            
            {/* SEKCJA: ZAINTERESOWANIA */}
            <div className="card">
                <h3 className="card-title">
                    <i className="fa-solid fa-heart" style={{ color: 'var(--accent-pink)', marginRight: '10px' }}></i>
                    Twoje Zainteresowania
                </h3>
                <p style={{ color: 'var(--color-text-dim)', marginBottom: '20px', fontSize: '0.9em' }}>
                    Wybierz kategorie, które Cię interesują. Na ich podstawie będziemy polecać Ci wydarzenia.
                </p>
                
                <div className="interests-grid">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => toggleInterest(cat.id)}
                            className={`interest-tile ${selectedInterests.includes(cat.id) ? 'selected' : ''}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
                
                <div style={{ marginTop: '24px' }}>
                    <button onClick={savePreferences} className="btn-primary">
                        <i className="fa-solid fa-check" style={{ marginRight: '8px' }}></i>
                        Zapisz preferencje
                    </button>
                </div>
            </div>

            {/* SEKCJA: ZAPISANE WYDARZENIA */}
            <div className="card">
                <h3 className="card-title">
                    <i className="fa-solid fa-bookmark" style={{ color: 'var(--accent-red)', marginRight: '10px' }}></i>
                    Zapisane wydarzenia ({savedEvents.length})
                </h3>

                {savedEvents.length === 0 ? (
                    <div className="empty-state">
                        <i className="fa-regular fa-bookmark"></i>
                        <p>Nie zapisałeś jeszcze żadnego wydarzenia</p>
                        <p style={{ fontSize: '0.85em', marginTop: '8px' }}>
                            Kliknij serduszko na karcie wydarzenia, aby je zapisać!
                        </p>
                    </div>
                ) : (
                    <div className="events-grid">
                        {savedEvents.map(event => (
                            <EventCard 
                                key={event.id} 
                                event={event} 
                                isRecommended={false} 
                                isSaved={savedEventIds.includes(event.id)}
                                onToggleSave={() => onToggleSave(event.id)}
                                onShowDetails={() => handleShowDetails(event)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL ZE SZCZEGÓŁAMI */}
            {selectedEvent && (
                <EventModal 
                    event={selectedEvent}
                    isSaved={savedEventIds.includes(selectedEvent.id)}
                    onToggleSave={() => onToggleSave(selectedEvent.id)}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default Profile;
