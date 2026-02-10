import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import Profile from './Profile';
import OrganizerPanel from './OrganizerPanel';
import DateFilter from './DateFilter';
import { useToast } from './Toast';

// Komponent Sidebar (Menu boczne)
function Sidebar({ userRole, email, onLogout, isOpen, onClose, token, onShowLogin }) {
  const location = useLocation();
  
  return (
    <>
      {/* Overlay na mobile */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      />
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <i className="fa-solid fa-compass"></i>
            EVENT HOP
          </div>
          <button className="sidebar-close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <nav className="nav-menu">
          <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`} onClick={onClose}>
            <i className="fa-solid fa-house"></i> Strona główna
          </Link>
          {token && (
            <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`} onClick={onClose}>
              <i className="fa-solid fa-user"></i> Profil
            </Link>
          )}
          {userRole === 'organizer' && (
            <Link to="/organizer" className={`nav-item ${location.pathname === '/organizer' ? 'active' : ''}`} onClick={onClose}>
              <i className="fa-solid fa-plus-circle"></i> Dodaj wydarzenie
            </Link>
          )}
        </nav>

        <div className="nav-separator"></div>
        
        {token ? (
          <>
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
          </>
        ) : (
          <div style={{ padding: '0 12px', marginTop: 'auto' }}>
            <button onClick={() => { onShowLogin(); onClose(); }} className="btn-primary" style={{ width: '100%' }}>
              <i className="fa-solid fa-right-to-bracket" style={{ marginRight: '8px' }}></i>
              Zaloguj się
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

// Komponent Skeleton Loading
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-header"></div>
      <div className="skeleton-body">
        <div className="skeleton-line short"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line medium"></div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  );
}

function SkeletonLoader({ count = 6 }) {
  return (
    <div className="events-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

function App() {
  const toast = useToast();

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
  
  // NOWE STANY
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState(null); // null = wszystkie
  const [sortBy, setSortBy] = useState('date-asc'); // date-asc, date-desc, name-asc, name-desc
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '', date: '', location: '', categoryId: '', description: '', latitude: '', longitude: ''
  });

  // --- FUNKCJE POMOCNICZE ---
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/events');
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Błąd wydarzeń:", err);
    } finally {
      setIsLoading(false);
    }
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

  // Zamknij sidebar przy zmianie rozmiaru okna
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            toast.success("Rejestracja udana! Teraz się zaloguj.");
            setIsRegistering(false); 
        } else {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.user.role);
            setToken(data.token);
            setUserRole(data.user.role);
            setEmail(data.user.email);
            setShowLoginModal(false);
            toast.success("Zalogowano pomyślnie!");
        }
      } else { 
        toast.error("Błąd: " + data.error); 
      }
    } catch (error) { 
      console.error("Błąd uwierzytelniania:", error); 
      toast.error("Nie udało się połączyć z serwerem."); 
    }
  }

  function handleLogout() {
    localStorage.clear(); 
    setToken(null); 
    setUserRole(null);
    setSelectedInterests([]); 
    setSavedEventIds([]);
    setEmail('');
    setPassword('');
    setSidebarOpen(false);
    toast.info("Wylogowano pomyślnie");
  }

  function toggleInterest(id) {
    if (selectedInterests.includes(id)) setSelectedInterests(selectedInterests.filter(i => i !== id)); 
    else setSelectedInterests([...selectedInterests, id]); 
  }

  async function savePreferences() {
    try {
      await fetch('http://localhost:5000/api/user/interests', {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ categoryIds: selectedInterests }),
      });
      toast.success("Preferencje zapisane!");
    } catch {
      toast.error("Nie udało się zapisać preferencji");
    }
  }

  async function handleAddEvent(e) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/events', {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(newEvent),
      });
      if (response.ok) {
          toast.success("Wydarzenie zostało dodane!");
          setNewEvent({ title: '', date: '', location: '', categoryId: '', description: '', latitude: '', longitude: '' }); 
          fetchEvents(); 
      } else { 
        toast.error("Błąd dodawania wydarzenia."); 
      }
    } catch {
      toast.error("Nie udało się dodać wydarzenia");
    }
  }

  async function toggleSaveEvent(eventId) {
    if (!token) {
      setShowLoginModal(true);
      toast.info("Zaloguj się, aby zapisywać wydarzenia");
      return;
    }
    const response = await fetch(`http://localhost:5000/api/events/${eventId}/toggle-save`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
        if (savedEventIds.includes(eventId)) {
          setSavedEventIds(savedEventIds.filter(id => id !== eventId));
          toast.info("Usunięto z zapisanych");
        } else {
          setSavedEventIds([...savedEventIds, eventId]);
          toast.love("Dodano do ulubionych!");
        }
    }
  }

  // --- FILTROWANIE, WYSZUKIWANIE I SORTOWANIE ---
  const now = new Date();
  
  let filteredEvents = events.filter(event => 
    new Date(event.date) >= now && 
    (event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     event.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filtrowanie po kategorii
  if (filterCategory !== null) {
    filteredEvents = filteredEvents.filter(event => event.categoryId === filterCategory);
  }

  // Filtrowanie po dacie (zakres z kalendarza)
  if (dateFrom || dateTo) {
    filteredEvents = filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      
      if (dateFrom && dateTo) {
        const from = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate());
        const to = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate());
        return eventDay >= from && eventDay <= to;
      }
      if (dateFrom) {
        const from = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate());
        return eventDay >= from;
      }
      return true;
    });
  }

  // Daty wydarzeń do podświetlania w kalendarzu
  const allEventDates = events
    .filter(event => new Date(event.date) >= now)
    .map(event => event.date);

  // Callback do zmiany zakresu dat
  function handleDateChange(from, to) {
    setDateFrom(from);
    setDateTo(to);
  }

  // Sortowanie
  filteredEvents.sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'name-asc':
        return a.title.localeCompare(b.title, 'pl');
      case 'name-desc':
        return b.title.localeCompare(a.title, 'pl');
      default:
        return 0;
    }
  });

  const recommendedEvents = filteredEvents.filter(event => selectedInterests.includes(event.categoryId));
  const otherEvents = filteredEvents.filter(event => !selectedInterests.includes(event.categoryId));

  // --- WIDOK GŁÓWNY Z ROUTEREM ---
  return (
    <Router>
      <div className="app-container">
        <Sidebar 
          userRole={userRole} 
          email={email} 
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          token={token}
          onShowLogin={() => setShowLoginModal(true)}
        />

        <main className="main-content">
          {/* Mobile header z hamburger menu */}
          <div className="mobile-header">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
              <i className="fa-solid fa-bars"></i>
            </button>
            <div className="mobile-logo">
              <i className="fa-solid fa-compass"></i>
              EVENT HOP
            </div>
            <div style={{ width: '40px' }}></div> {/* Spacer dla wyrównania */}
          </div>

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

                {/* FILTRY I SORTOWANIE */}
                <div className="filters-bar">
                  <div className="category-filters">
                    <button 
                      className={`filter-btn ${filterCategory === null ? 'active' : ''}`}
                      onClick={() => setFilterCategory(null)}
                    >
                      Wszystkie
                    </button>
                    {categories.map(cat => (
                      <button 
                        key={cat.id}
                        className={`filter-btn ${filterCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setFilterCategory(filterCategory === cat.id ? null : cat.id)}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                  
                  <div className="sort-select">
                    <i className="fa-solid fa-arrow-up-wide-short"></i>
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="date-asc">Data (najwcześniej)</option>
                      <option value="date-desc">Data (najpóźniej)</option>
                      <option value="name-asc">Nazwa (A-Z)</option>
                      <option value="name-desc">Nazwa (Z-A)</option>
                    </select>
                  </div>
                </div>

                {/* FILTR PO DACIE - KALENDARZ */}
                <DateFilter 
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  onDateChange={handleDateChange}
                  eventDates={allEventDates}
                />

                <div className="stats-bar">
                  <span><i className="fa-solid fa-calendar-check" style={{ marginRight: '6px' }}></i>{filteredEvents.length} wydarzeń</span>
                  {selectedInterests.length > 0 && (
                    <span><i className="fa-solid fa-star" style={{ marginRight: '6px', color: 'var(--accent-lime)' }}></i>{recommendedEvents.length} polecanych</span>
                  )}
                  {filterCategory !== null && (
                    <span className="active-filter">
                      <i className="fa-solid fa-filter" style={{ marginRight: '6px' }}></i>
                      {categories.find(c => c.id === filterCategory)?.name}
                      <button onClick={() => setFilterCategory(null)} className="clear-filter">
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </span>
                  )}
                  {(dateFrom || dateTo) && (
                    <span className="active-filter date-active-filter">
                      <i className="fa-solid fa-calendar-days" style={{ marginRight: '6px' }}></i>
                      Filtr daty
                      <button onClick={() => handleDateChange(null, null)} className="clear-filter">
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </span>
                  )}
                </div>

                {isLoading ? (
                  <SkeletonLoader count={6} />
                ) : (
                  <Dashboard 
                    events={filteredEvents}
                    categories={categories} 
                    selectedInterests={selectedInterests} 
                    recommendedEvents={recommendedEvents} 
                    otherEvents={otherEvents} 
                    savedEventIds={savedEventIds} 
                    toggleSaveEvent={toggleSaveEvent} 
                  />
                )}
              </>
            } />
            
            {/* Profil - tylko zalogowani */}
            <Route path="/profile" element={
              token ? (
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
              ) : (
                <div className="empty-state">
                  <i className="fa-solid fa-lock"></i>
                  <p>Zaloguj się, aby zobaczyć swój profil</p>
                  <button 
                    className="btn-primary" 
                    style={{ marginTop: '16px' }}
                    onClick={() => setShowLoginModal(true)}
                  >
                    <i className="fa-solid fa-right-to-bracket" style={{ marginRight: '8px' }}></i>
                    Zaloguj się
                  </button>
                </div>
              )
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

      {/* MODAL LOGOWANIA */}
      {showLoginModal && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowLoginModal(false); }}>
          <div className="login-card fade-in" style={{ position: 'relative' }}>
            <button 
              className="modal-close" 
              onClick={() => setShowLoginModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px' }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

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
                    id="roleCheckModal" 
                    checked={isOrganizer} 
                    onChange={e => setIsOrganizer(e.target.checked)} 
                  />
                  <label htmlFor="roleCheckModal">Chcę być Organizatorem wydarzeń</label>
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
      )}
    </Router>
  );
}

export default App;