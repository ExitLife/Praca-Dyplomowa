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

function EventCard({ event, isRecommended, isSaved, onToggleSave }) {
    const categoryName = event.category?.name || 'Inne';
    const style = categoryStyles[categoryName] || { class: 'default', icon: 'fa-solid fa-calendar' };
    
    const formattedDate = new Date(event.date).toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <article className={`event-card ${isRecommended ? 'recommended' : ''} fade-in`}>
            <div className={`event-card-header ${style.class}`}>
                <i className={style.icon}></i>
                <button 
                    onClick={onToggleSave}
                    className={`save-btn ${isSaved ? 'saved' : ''}`}
                    title={isSaved ? "Usuń z zapisanych" : "Zapisz wydarzenie"}
                >
                    {isSaved ? '❤️' : '🤍'}
                </button>
            </div>
            
            <div className="event-card-body">
                <div className="event-card-meta">
                    <span className="event-category">{categoryName}</span>
                    <span className="event-date">{formattedDate}</span>
                </div>
                
                <h3>{event.title}</h3>
                
                <div className="event-location">
                    <i className="fa-solid fa-location-dot"></i>
                    {event.location}
                </div>
                
                <button className="btn-details">
                    <i className="fa-solid fa-arrow-right" style={{ marginRight: '6px' }}></i>
                    Szczegóły
                </button>
            </div>
        </article>
    );
}

export default EventCard;
