import React from 'react';

const OrganizerPanel = ({ categories, newEvent, setNewEvent, handleAddEvent }) => {
    return (
        <div className="organizer-panel fade-in">
            <h3 className="card-title">
                <i className="fa-solid fa-plus-circle" style={{ marginRight: '10px' }}></i>
                Dodaj nowe wydarzenie
            </h3>
            
            <form onSubmit={handleAddEvent}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    
                    <div className="form-group">
                        <label>
                            <i className="fa-solid fa-heading" style={{ marginRight: '8px', color: 'var(--accent-orange)' }}></i>
                            Nazwa wydarzenia *
                        </label>
                        <input 
                            required 
                            placeholder="np. Koncert zespołu XYZ" 
                            className="form-input" 
                            value={newEvent.title} 
                            onChange={e => setNewEvent({...newEvent, title: e.target.value})} 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>
                            <i className="fa-solid fa-calendar" style={{ marginRight: '8px', color: 'var(--accent-orange)' }}></i>
                            Data i godzina *
                        </label>
                        <input 
                            required 
                            type="datetime-local" 
                            className="form-input" 
                            value={newEvent.date} 
                            onChange={e => setNewEvent({...newEvent, date: e.target.value})} 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>
                            <i className="fa-solid fa-location-dot" style={{ marginRight: '8px', color: 'var(--accent-orange)' }}></i>
                            Lokalizacja *
                        </label>
                        <input 
                            required 
                            placeholder="np. Filharmonia Krakowska" 
                            className="form-input" 
                            value={newEvent.location} 
                            onChange={e => setNewEvent({...newEvent, location: e.target.value})} 
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <i className="fa-solid fa-tag" style={{ marginRight: '8px', color: 'var(--accent-orange)' }}></i>
                            Kategoria *
                        </label>
                        <select 
                            required 
                            className="form-input" 
                            value={newEvent.categoryId} 
                            onChange={e => setNewEvent({...newEvent, categoryId: e.target.value})}
                        >
                            <option value="">-- Wybierz kategorię --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>
                            <i className="fa-solid fa-map" style={{ marginRight: '8px', color: 'var(--accent-orange)' }}></i>
                            Szerokość geograficzna (opcjonalnie)
                        </label>
                        <input 
                            type="number"
                            step="any"
                            placeholder="np. 50.0647" 
                            className="form-input" 
                            value={newEvent.latitude} 
                            onChange={e => setNewEvent({...newEvent, latitude: e.target.value})} 
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <i className="fa-solid fa-map" style={{ marginRight: '8px', color: 'var(--accent-orange)' }}></i>
                            Długość geograficzna (opcjonalnie)
                        </label>
                        <input 
                            type="number"
                            step="any"
                            placeholder="np. 19.9450" 
                            className="form-input" 
                            value={newEvent.longitude} 
                            onChange={e => setNewEvent({...newEvent, longitude: e.target.value})} 
                        />
                    </div>
                </div>

                <div className="form-group" style={{ marginTop: '20px' }}>
                    <label>
                        <i className="fa-solid fa-align-left" style={{ marginRight: '8px', color: 'var(--accent-orange)' }}></i>
                        Opis wydarzenia (opcjonalnie)
                    </label>
                    <textarea 
                        placeholder="Opisz wydarzenie..." 
                        className="form-input" 
                        rows="4"
                        style={{ resize: 'vertical' }}
                        value={newEvent.description} 
                        onChange={e => setNewEvent({...newEvent, description: e.target.value})} 
                    />
                </div>

                <div style={{ marginTop: '24px' }}>
                    <button type="submit" className="btn-primary" style={{ 
                        background: 'linear-gradient(135deg, var(--accent-orange), #FF6B35)',
                        padding: '14px 32px'
                    }}>
                        <i className="fa-solid fa-paper-plane" style={{ marginRight: '10px' }}></i>
                        Opublikuj wydarzenie
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OrganizerPanel;
