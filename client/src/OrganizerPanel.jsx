import React, { useState } from 'react';

const OrganizerPanel = ({ categories, newEvent, setNewEvent, handleAddEvent }) => {
    const [addressSearch, setAddressSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');

    // Wyszukiwanie adresu przez Nominatim API (OpenStreetMap)
    const searchAddress = async () => {
        if (!addressSearch.trim()) {
            setSearchError('Wpisz adres do wyszukania');
            return;
        }

        setIsSearching(true);
        setSearchError('');
        setSearchResults([]);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressSearch)}&countrycodes=pl&limit=5`,
                {
                    headers: {
                        'Accept-Language': 'pl'
                    }
                }
            );
            
            const data = await response.json();
            
            if (data.length === 0) {
                setSearchError('Nie znaleziono lokalizacji. Spróbuj innego adresu.');
            } else {
                setSearchResults(data);
            }
        } catch (error) {
            console.error('Błąd wyszukiwania:', error);
            setSearchError('Błąd podczas wyszukiwania. Spróbuj ponownie.');
        } finally {
            setIsSearching(false);
        }
    };

    // Wybór lokalizacji z wyników wyszukiwania
    const selectLocation = (result) => {
        setNewEvent({
            ...newEvent,
            location: result.display_name.split(',').slice(0, 3).join(','), // Skrócony adres
            latitude: result.lat,
            longitude: result.lon
        });
        setSearchResults([]);
        setAddressSearch('');
    };

    // Obsługa Enter w polu wyszukiwania
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchAddress();
        }
    };

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
                </div>

                {/* SEKCJA WYSZUKIWANIA LOKALIZACJI */}
                <div className="location-search-section" style={{ marginTop: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>
                        <i className="fa-solid fa-map-location-dot" style={{ marginRight: '8px', color: 'var(--accent-orange)' }}></i>
                        Wyszukaj lokalizację *
                    </label>
                    
                    <div className="search-input-wrapper" style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                        <input 
                            type="text"
                            placeholder="Wpisz adres, np. Filharmonia Krakowska" 
                            className="form-input" 
                            style={{ flex: 1 }}
                            value={addressSearch}
                            onChange={e => setAddressSearch(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button 
                            type="button"
                            onClick={searchAddress}
                            disabled={isSearching}
                            className="btn-search"
                            style={{
                                padding: '12px 20px',
                                background: 'var(--accent-blue)',
                                color: 'var(--color-dark-bg)',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: isSearching ? 'wait' : 'pointer',
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {isSearching ? (
                                <i className="fa-solid fa-spinner fa-spin"></i>
                            ) : (
                                <i className="fa-solid fa-magnifying-glass"></i>
                            )}
                            Szukaj
                        </button>
                    </div>

                    {/* Komunikat o błędzie */}
                    {searchError && (
                        <div style={{ 
                            color: 'var(--accent-red)', 
                            fontSize: '0.85em', 
                            marginBottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <i className="fa-solid fa-circle-exclamation"></i>
                            {searchError}
                        </div>
                    )}

                    {/* Wyniki wyszukiwania */}
                    {searchResults.length > 0 && (
                        <div className="search-results" style={{
                            background: 'var(--color-sidebar-bg)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            marginBottom: '16px'
                        }}>
                            <div style={{ 
                                padding: '10px 16px', 
                                fontSize: '0.8em', 
                                color: 'var(--color-text-dim)',
                                borderBottom: '1px solid rgba(160, 160, 160, 0.2)'
                            }}>
                                Wybierz lokalizację:
                            </div>
                            {searchResults.map((result, index) => (
                                <div 
                                    key={index}
                                    onClick={() => selectLocation(result)}
                                    style={{
                                        padding: '12px 16px',
                                        cursor: 'pointer',
                                        borderBottom: index < searchResults.length - 1 ? '1px solid rgba(160, 160, 160, 0.1)' : 'none',
                                        transition: 'background 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '10px'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 191, 255, 0.1)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <i className="fa-solid fa-location-dot" style={{ color: 'var(--accent-blue)', marginTop: '3px' }}></i>
                                    <span style={{ fontSize: '0.9em', lineHeight: '1.4' }}>{result.display_name}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Wybrana lokalizacja */}
                    {newEvent.location && newEvent.latitude && newEvent.longitude && (
                        <div className="selected-location" style={{
                            background: 'rgba(167, 255, 131, 0.1)',
                            border: '1px solid var(--accent-lime)',
                            borderRadius: '12px',
                            padding: '16px',
                            marginBottom: '16px'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px', 
                                marginBottom: '8px',
                                color: 'var(--accent-lime)',
                                fontWeight: '600'
                            }}>
                                <i className="fa-solid fa-check-circle"></i>
                                Wybrana lokalizacja
                            </div>
                            <div style={{ fontSize: '0.95em', marginBottom: '8px' }}>
                                <i className="fa-solid fa-location-dot" style={{ marginRight: '8px', color: 'var(--accent-blue)' }}></i>
                                {newEvent.location}
                            </div>
                            <div style={{ fontSize: '0.8em', color: 'var(--color-text-dim)' }}>
                                <i className="fa-solid fa-map" style={{ marginRight: '8px' }}></i>
                                Współrzędne: {parseFloat(newEvent.latitude).toFixed(4)}, {parseFloat(newEvent.longitude).toFixed(4)}
                            </div>
                        </div>
                    )}

                    {/* Lub wpisz ręcznie */}
                    {!newEvent.latitude && !newEvent.longitude && (
                        <div style={{ 
                            fontSize: '0.8em', 
                            color: 'var(--color-text-dim)',
                            marginTop: '8px'
                        }}>
                            <i className="fa-solid fa-info-circle" style={{ marginRight: '6px' }}></i>
                            Wyszukaj adres powyżej, aby automatycznie dodać lokalizację na mapie
                        </div>
                    )}
                </div>

                {/* Opis wydarzenia */}
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
