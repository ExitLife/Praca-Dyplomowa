import React from 'react';

// Mapowanie kategorii na klasy CSS i ikony
const categoryStyles = {
  'Muzyka': { class: 'music', icon: 'fa-solid fa-music' },
  'Teatr': { class: 'theater', icon: 'fa-solid fa-masks-theater' },
  'Kino': { class: 'cinema', icon: 'fa-solid fa-film' },
  'Wystawy': { class: 'exhibition', icon: 'fa-solid fa-palette' },
  'Festiwale': { class: 'festival', icon: 'fa-solid fa-tent' },
  'Stand-up': { class: 'standup', icon: 'fa-solid fa-microphone-lines' },
  'Edukacja': { class: 'education', icon: 'fa-solid fa-graduation-cap' },
  'Dla dzieci': { class: 'kids', icon: 'fa-solid fa-child-reaching' },
};

function EventModal({ event, isSaved, onToggleSave, onClose }) {
    if (!event) return null;

    const categoryName = event.category?.name || 'Inne';
    const style = categoryStyles[categoryName] || { class: 'default', icon: 'fa-solid fa-calendar' };
    
    // Formatowanie daty
    const formattedDate = new Date(event.date).toLocaleDateString('pl-PL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const formattedTime = new Date(event.date).toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Zamknij modal po kliknięciu w tło
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content fade-in">
                {/* Przycisk zamknięcia */}
                <button className="modal-close" onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i>
                </button>

                {/* Nagłówek z ikoną kategorii */}
                <div className={`modal-header ${style.class}`}>
                    <i className={style.icon}></i>
                    <span className="modal-category">{categoryName}</span>
                </div>

                {/* Treść */}
                <div className="modal-body">
                    <h2 className="modal-title">{event.title}</h2>

                    {/* Informacje o wydarzeniu */}
                    <div className="modal-info-grid">
                        <div className="modal-info-item">
                            <i className="fa-solid fa-calendar-days"></i>
                            <div>
                                <span className="info-label">Data</span>
                                <span className="info-value">{formattedDate}</span>
                            </div>
                        </div>

                        <div className="modal-info-item">
                            <i className="fa-solid fa-clock"></i>
                            <div>
                                <span className="info-label">Godzina</span>
                                <span className="info-value">{formattedTime}</span>
                            </div>
                        </div>

                        <div className="modal-info-item">
                            <i className="fa-solid fa-location-dot"></i>
                            <div>
                                <span className="info-label">Lokalizacja</span>
                                <span className="info-value">{event.location}</span>
                            </div>
                        </div>

                        {event.organizer?.email && (
                            <div className="modal-info-item">
                                <i className="fa-solid fa-user"></i>
                                <div>
                                    <span className="info-label">Organizator</span>
                                    <span className="info-value">{event.organizer.email}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Opis wydarzenia */}
                    {event.description && (
                        <div className="modal-description">
                            <h3>
                                <i className="fa-solid fa-align-left" style={{ marginRight: '8px' }}></i>
                                Opis wydarzenia
                            </h3>
                            <p>{event.description}</p>
                        </div>
                    )}

                    {/* Mapa jeśli są współrzędne */}
                    {event.latitude && event.longitude && event.latitude !== 0 && event.longitude !== 0 && (
                        <div className="modal-map-link">
                            <a 
                                href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary"
                            >
                                <i className="fa-solid fa-map-location-dot" style={{ marginRight: '8px' }}></i>
                                Pokaż na mapie Google
                            </a>
                        </div>
                    )}
                </div>

                {/* Stopka z przyciskiem zapisania */}
                <div className="modal-footer">
                    <button 
                        onClick={onToggleSave}
                        className={`btn-save-large ${isSaved ? 'saved' : ''}`}
                    >
                        {isSaved ? (
                            <>
                                <i className="fa-solid fa-heart" style={{ marginRight: '8px' }}></i>
                                Zapisano
                            </>
                        ) : (
                            <>
                                <i className="fa-regular fa-heart" style={{ marginRight: '8px' }}></i>
                                Zapisz wydarzenie
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EventModal;
