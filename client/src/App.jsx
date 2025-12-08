import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import MapComponent from './MapComponent'; 
import Dashboard from './Dashboard';
import Profile from './Profile';
import OrganizerPanel from './OrganizerPanel';

// Komponent Sidebar (Menu boczne)
function Sidebar({ userRole, email, onLogout }) {
  const location = useLocation();
  
  return (
    <aside className="sidebar">
      <div className="logo">
        <i className="fa-solid fa-compass"></i>
        EVENT HOP
      </div>
      
      <nav className="nav-menu">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <i className="fa-solid fa-house"></i> Strona główna
        </Link>
        <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
          <i className="fa-solid fa-user"></i> Profil
        </Link>
        {userRole === 'organizer' && (
          <Link to="/organizer" className={`nav-item ${location.pathname === '/organizer' ? 'active' : ''}`}>
            <i className="fa-solid fa-plus-circle"></i> Dodaj wydarzenie
          </Link>
        )}
      </nav>

      <div className="nav-separator"></div>
      
      <div className="user-info">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <i className="fa-solid fa-circle-user" style={{ color: 'var(--accent-blue)', fontSize: '1.2em' }}></i>
          {userRole === 'organizer' && <span className="organizer-badge">Organizator</span>}
        </div>
        <div className="user-email">{email}</div>
      </div>

      <div style={{ padding: '0 12px', marginTop: 'auto' }}>
        <button onClick={onLogout} className="btn-danger" style={{ width: '100%' }}>
          <i className="fa-solid fa-right-from-bracket" style={{ marginRight: '8px' }}></i>
          Wyloguj się
        </button>
      </div>
    </aside>
  );
}

function App() {
  // --- STANY APLIKACJI ---
  const [token, setToken] = useState(localStorage.getItem('token')); 
  const [userRole, setUserRole] = useState(localStorage.getItem('role')); 
  
  const [categories, setCategories] = useState([]); 
  const [selectedInterests, setSelectedInterests] = useState([]); 
  const [events, setEvents] = useState([]); 
  const [savedEventIds, setSavedEventIds] = useState([]); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); 
  const [isOrganizer, setIsOrganizer] = useState(false); 
  
  const [searchTerm, setSearchTerm] = useState('');

  const [newEvent, setNewEvent] = useState({
    title: '', date: '', location: '', categoryId: '', description: '', latitude: '', longitude: ''
  });

  // --- FUNKCJE POMOCNICZE ---
  const fetchEvents = useCallback(() => {
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("Błąd wydarzeń:", err)); 
  }, []);

  const fetchSavedEvents = useCallback(() => {
    if (!token) return;
    fetch('http://localhost:5000/api/events/saved-ids', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(ids => { if (Array.isArray(ids)) setSavedEventIds(ids); })
      .catch(err => console.error("Błąd ulubionych:", err));
  }, [token]);

  // --- EFEKTY ---
  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (token) {
      fetch('http://localhost:5000/api/user/me', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(user => {
        if(user.interests) setSelectedInterests(user.interests.map(cat => cat.id));
        if(user.email) setEmail(user.email);
      });
      fetchSavedEvents();
    }
  }, [token, fetchSavedEvents]);

  // --- FUNKCJE OBSŁUGI ---
  async function handleAuth(e) {
    e.preventDefault();
    const endpoint = isRegistering ? 'register' : 'login';
    const payload = { email, password };
    if (isRegistering) { payload.role = isOrganizer ? 'organizer' : 'user'; }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        if (isRegistering) {
            alert("Rejestracja udana! Teraz się zaloguj.");
            setIsRegistering(false); 
        } else {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.user.role);
            setToken(data.token);
            setUserRole(data.user.role);
            setEmail(data.user.email);
        }
      } else { alert("Błąd: " + data.error); }
    } catch (error) { console.error("Błąd uwierzytelniania:", error); alert("Nie udało się połączyć z serwerem."); }
  }

  function handleLogout() {
    localStorage.clear(); 
    setToken(null); 
    setUserRole(null);
    setSelectedInterests([]); 
    setSavedEventIds([]);
    setEmail('');
    setPassword('');
  }

  function toggleInterest(id) {
    if (selectedInterests.includes(id)) setSelectedInterests(selectedInterests.filter(i => i !== id)); 
    else setSelectedInterests([...selectedInterests, id]); 
  }

  async function savePreferences() {
    await fetch('http://localhost:5000/api/user/interests', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ categoryIds: selectedInterests }),
    });
    alert("Preferencje zapisane!");
  }

  async function handleAddEvent(e) {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(newEvent),
    });
    if (response.ok) {
        alert("Wydarzenie dodane!");
        setNewEvent({ title: '', date: '', location: '', categoryId: '', description: '', latitude: '', longitude: '' }); 
        fetchEvents(); 
    } else { alert("Błąd dodawania wydarzenia."); }
  }

  async function toggleSaveEvent(eventId) {
    const response = await fetch(`http://localhost:5000/api/events/${eventId}/toggle-save`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
        if (savedEventIds.includes(eventId)) setSavedEventIds(savedEventIds.filter(id => id !== eventId)); 
        else setSavedEventIds([...savedEventIds, eventId]); 
    }
  }

  // --- FILTROWANIE I WYSZUKIWANIE ---
  const now = new Date();
  
  const searchableEvents = events.filter(event => 
    new Date(event.date) >= now && 
    (event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     event.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const recommendedEvents = searchableEvents.filter(event => selectedInterests.includes(event.categoryId));
  const otherEvents = searchableEvents.filter(event => !selectedInterests.includes(event.categoryId));

  // --- WIDOK LOGOWANIA / REJESTRACJI ---
  if (!token) {
    return (
      <div className="login-screen">
        <div className="login-card fade-in">
          <div className="login-logo">
            <i className="fa-solid fa-compass"></i>
            <h1>Event Hop</h1>
          </div>
          
          <div className="login-tabs">
            <button 
              onClick={() => setIsRegistering(false)} 
              className={`login-tab ${!isRegistering ? 'active' : ''}`}
            >
              Logowanie
            </button>
            <button 
              onClick={() => setIsRegistering(true)} 
              className={`login-tab ${isRegistering ? 'active' : ''}`}
            >
              Rejestracja
            </button>
          </div>

          <form onSubmit={handleAuth}>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="twoj@email.pl" 
                className="form-input"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Hasło</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="form-input"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            {isRegistering && (
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="roleCheck" 
                  checked={isOrganizer} 
                  onChange={e => setIsOrganizer(e.target.checked)} 
                />
                <label htmlFor="roleCheck">Chcę być Organizatorem wydarzeń</label>
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              {isRegistering ? (
                <><i className="fa-solid fa-user-plus" style={{ marginRight: '8px' }}></i>Zarejestruj się</>
              ) : (
                <><i className="fa-solid fa-right-to-bracket" style={{ marginRight: '8px' }}></i>Zaloguj się</>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- WIDOK GŁÓWNY Z ROUTEREM ---
  return (
    <Router>
      <div className="app-container">
        <Sidebar userRole={userRole} email={email} onLogout={handleLogout} />

        <main className="main-content">
          <Routes>
            {/* Strona główna */}
            <Route path="/" element={
              <>
                <div className="page-header">
                  <h1>Witaj w Event Hop!</h1>
                  <p>Znajdź wydarzenia kulturalne dopasowane do Ciebie</p>
                </div>

                <div className="search-bar">
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <input 
                    type="text" 
                    placeholder="Szukaj wydarzeń, miejsc..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="stats-bar">
                  <span><i className="fa-solid fa-calendar-check" style={{ marginRight: '6px' }}></i>{searchableEvents.length} wydarzeń</span>
                  {selectedInterests.length > 0 && (
                    <span><i className="fa-solid fa-star" style={{ marginRight: '6px', color: 'var(--accent-lime)' }}></i>{recommendedEvents.length} polecanych</span>
                  )}
                </div>

                <Dashboard 
                  events={searchableEvents}
                  categories={categories} 
                  selectedInterests={selectedInterests} 
                  recommendedEvents={recommendedEvents} 
                  otherEvents={otherEvents} 
                  savedEventIds={savedEventIds} 
                  toggleSaveEvent={toggleSaveEvent} 
                />
              </>
            } />
            
            {/* Profil */}
            <Route path="/profile" element={
              <>
                <div className="page-header">
                  <h1>Twój Profil</h1>
                  <p>Zarządzaj preferencjami i zapisanymi wydarzeniami</p>
                </div>
                <Profile 
                  token={token}
                  categories={categories} 
                  selectedInterests={selectedInterests} 
                  toggleInterest={toggleInterest} 
                  savePreferences={savePreferences} 
                  savedEventIds={savedEventIds} 
                  onToggleSave={toggleSaveEvent}
                />
              </>
            } />

            {/* Panel Organizatora */}
            {userRole === 'organizer' && (
              <Route path="/organizer" element={
                <>
                  <div className="page-header">
                    <h1>Panel Organizatora</h1>
                    <p>Dodaj nowe wydarzenie kulturalne</p>
                  </div>
                  <OrganizerPanel 
                    categories={categories} 
                    newEvent={newEvent} 
                    setNewEvent={setNewEvent} 
                    handleAddEvent={handleAddEvent} 
                  />
                </>
              } />
            )}
            
            {/* 404 */}
            <Route path="*" element={
              <div className="empty-state">
                <i className="fa-solid fa-compass"></i>
                <p>Strona nie została znaleziona (404)</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
