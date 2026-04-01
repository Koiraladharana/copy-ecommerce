import { useState, useEffect, useCallback } from "react";

const API_KEY = "5a98b5ca6bc67580f4a130fe6268e609";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";

// ─── Utility ────────────────────────────────────────────────────────────────
const getUser = () => JSON.parse(localStorage.getItem("currentUser") || "null");
const getFavorites = (username) => JSON.parse(localStorage.getItem(`favorites_${username}`) || "[]");
const saveFavorites = (username, favs) => localStorage.setItem(`favorites_${username}`, JSON.stringify(favs));

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #090909;
    --dark: #111111;
    --card: #181818;
    --border: #2a2a2a;
    --gold: #f5c518;
    --gold-dim: #c9a112;
    --red: #e50914;
    --white: #f0f0f0;
    --gray: #888;
    --light-gray: #bbb;
  }

  body { background: var(--black); color: var(--white); font-family: 'DM Sans', sans-serif; min-height: 100vh; }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--dark); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  /* NAVBAR */
  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; height: 64px;
    background: linear-gradient(to bottom, rgba(9,9,9,0.98), rgba(9,9,9,0.7));
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }
  .navbar-logo {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem;
    letter-spacing: 3px; color: var(--gold);
    text-shadow: 0 0 20px rgba(245,197,24,0.3);
  }
  .navbar-logo span { color: var(--red); }
  .navbar-right { display: flex; align-items: center; gap: 1rem; }
  .nav-btn {
    background: none; border: 1px solid var(--border); color: var(--light-gray);
    padding: 0.4rem 1rem; border-radius: 6px; cursor: pointer; font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; transition: all 0.2s;
  }
  .nav-btn:hover { border-color: var(--gold); color: var(--gold); }
  .nav-btn.active { background: var(--gold); color: var(--black); border-color: var(--gold); font-weight: 600; }
  .nav-user { color: var(--gray); font-size: 0.85rem; }
  .nav-user span { color: var(--gold); font-weight: 600; }

  /* SEARCH BAR */
  .search-wrap {
    position: relative; display: flex; align-items: center;
  }
  .search-input {
    background: var(--card); border: 1px solid var(--border); color: var(--white);
    padding: 0.45rem 1rem 0.45rem 2.5rem; border-radius: 8px; width: 220px;
    font-family: 'DM Sans', sans-serif; font-size: 0.88rem; transition: all 0.2s;
    outline: none;
  }
  .search-input:focus { border-color: var(--gold); width: 280px; }
  .search-icon { position: absolute; left: 0.7rem; color: var(--gray); font-size: 0.9rem; pointer-events: none; }

  /* HERO */
  .hero {
    position: relative; height: 520px; margin-top: 64px;
    overflow: hidden; display: flex; align-items: flex-end;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center top;
    transition: all 0.8s ease;
  }
  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to right, rgba(9,9,9,0.95) 30%, rgba(9,9,9,0.3) 70%, transparent),
                linear-gradient(to top, rgba(9,9,9,1) 0%, transparent 50%);
  }
  .hero-content { position: relative; z-index: 2; padding: 2.5rem 2.5rem; max-width: 560px; }
  .hero-badge {
    display: inline-block; background: var(--red); color: white;
    font-size: 0.7rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
    padding: 0.25rem 0.7rem; border-radius: 4px; margin-bottom: 0.8rem;
  }
  .hero-title {
    font-family: 'Bebas Neue', sans-serif; font-size: 3.5rem;
    line-height: 1; letter-spacing: 2px; margin-bottom: 0.8rem;
    text-shadow: 0 2px 20px rgba(0,0,0,0.5);
  }
  .hero-meta { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.8rem; }
  .hero-rating { color: var(--gold); font-weight: 600; font-size: 0.95rem; }
  .hero-year { color: var(--gray); font-size: 0.88rem; }
  .hero-overview {
    color: var(--light-gray); font-size: 0.9rem; line-height: 1.6;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
    margin-bottom: 1.2rem;
  }
  .hero-actions { display: flex; gap: 0.8rem; }
  .btn-primary {
    background: var(--gold); color: var(--black); border: none;
    padding: 0.6rem 1.5rem; border-radius: 8px; font-family: 'DM Sans', sans-serif;
    font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s;
  }
  .btn-primary:hover { background: var(--gold-dim); transform: translateY(-1px); }
  .btn-outline {
    background: rgba(255,255,255,0.1); color: var(--white); border: 1px solid rgba(255,255,255,0.2);
    padding: 0.6rem 1.5rem; border-radius: 8px; font-family: 'DM Sans', sans-serif;
    font-weight: 500; font-size: 0.9rem; cursor: pointer; transition: all 0.2s;
    backdrop-filter: blur(4px);
  }
  .btn-outline:hover { background: rgba(255,255,255,0.18); }

  /* SECTIONS */
  .section { padding: 2rem 2.5rem; }
  .section-title {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 2px;
    color: var(--white); margin-bottom: 1.2rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .section-title::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }
  .section-title .accent { color: var(--gold); }

  /* GRID */
  .movies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }

  /* MOVIE CARD */
  .movie-card {
    position: relative; border-radius: 10px; overflow: hidden;
    background: var(--card); cursor: pointer;
    transition: transform 0.25s, box-shadow 0.25s;
    border: 1px solid var(--border);
    animation: fadeUp 0.4s ease both;
  }
  .movie-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 16px 40px rgba(0,0,0,0.6); }
  .movie-card:hover .card-overlay { opacity: 1; }
  .card-poster { width: 100%; aspect-ratio: 2/3; object-fit: cover; display: block; }
  .card-no-poster {
    width: 100%; aspect-ratio: 2/3; background: var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--gray); font-size: 2.5rem;
  }
  .card-overlay {
    position: absolute; inset: 0; opacity: 0; transition: opacity 0.25s;
    background: linear-gradient(to top, rgba(9,9,9,0.95) 0%, rgba(9,9,9,0.3) 60%, transparent);
    display: flex; flex-direction: column; justify-content: flex-end; padding: 0.8rem;
  }
  .card-title { font-weight: 600; font-size: 0.85rem; line-height: 1.3; margin-bottom: 0.3rem; }
  .card-meta { display: flex; justify-content: space-between; align-items: center; }
  .card-rating { color: var(--gold); font-size: 0.78rem; font-weight: 600; }
  .card-year { color: var(--gray); font-size: 0.75rem; }
  .card-fav-btn {
    position: absolute; top: 0.5rem; right: 0.5rem;
    background: rgba(9,9,9,0.75); border: none; border-radius: 50%;
    width: 30px; height: 30px; cursor: pointer; font-size: 0.9rem;
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.2s; backdrop-filter: blur(4px);
  }
  .card-fav-btn:hover { transform: scale(1.2); }

  /* MODAL */
  .modal-backdrop {
    position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.85);
    display: flex; align-items: center; justify-content: center;
    padding: 1rem; backdrop-filter: blur(6px);
    animation: fadeIn 0.2s ease;
  }
  .modal {
    background: var(--dark); border: 1px solid var(--border); border-radius: 16px;
    width: 100%; max-width: 800px; max-height: 90vh; overflow-y: auto;
    animation: slideUp 0.3s ease;
  }
  .modal-hero {
    position: relative; height: 300px; overflow: hidden; border-radius: 16px 16px 0 0;
  }
  .modal-hero img { width: 100%; height: 100%; object-fit: cover; }
  .modal-hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, var(--dark) 0%, transparent 50%);
  }
  .modal-close {
    position: absolute; top: 1rem; right: 1rem; z-index: 10;
    background: rgba(9,9,9,0.8); border: 1px solid var(--border); color: var(--white);
    width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 1rem;
    display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  }
  .modal-close:hover { background: var(--red); border-color: var(--red); }
  .modal-body { padding: 1.5rem; }
  .modal-title {
    font-family: 'Bebas Neue', sans-serif; font-size: 2.2rem; letter-spacing: 1px; margin-bottom: 0.5rem;
  }
  .modal-meta { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem; align-items: center; }
  .modal-rating { color: var(--gold); font-weight: 700; font-size: 1rem; }
  .modal-tag {
    background: var(--card); border: 1px solid var(--border); color: var(--light-gray);
    padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.78rem;
  }
  .modal-overview { color: var(--light-gray); line-height: 1.7; font-size: 0.92rem; margin-bottom: 1.2rem; }
  .modal-fav-btn {
    background: var(--gold); color: var(--black); border: none;
    padding: 0.6rem 1.5rem; border-radius: 8px; font-family: 'DM Sans', sans-serif;
    font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s;
  }
  .modal-fav-btn:hover { background: var(--gold-dim); }
  .modal-fav-btn.remove { background: var(--card); color: var(--red); border: 1px solid var(--red); }

  /* TABS */
  .tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .tab {
    background: var(--card); border: 1px solid var(--border); color: var(--gray);
    padding: 0.4rem 1rem; border-radius: 20px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; transition: all 0.2s;
  }
  .tab:hover { border-color: var(--gold); color: var(--gold); }
  .tab.active { background: var(--gold); color: var(--black); border-color: var(--gold); font-weight: 600; }

  /* EMPTY STATE */
  .empty-state {
    text-align: center; padding: 4rem 2rem; color: var(--gray);
  }
  .empty-state .icon { font-size: 3rem; margin-bottom: 1rem; }
  .empty-state h3 { color: var(--light-gray); margin-bottom: 0.5rem; font-size: 1.1rem; }
  .empty-state p { font-size: 0.88rem; }

  /* LOADING */
  .loading { display: flex; justify-content: center; padding: 3rem; }
  .spinner {
    width: 36px; height: 36px; border: 3px solid var(--border);
    border-top-color: var(--gold); border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  /* LOGIN GATE */
  .login-gate {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: radial-gradient(ellipse at center, #1a1200 0%, var(--black) 70%);
  }
  .login-box {
    background: var(--dark); border: 1px solid var(--border); border-radius: 16px;
    padding: 2.5rem; width: 100%; max-width: 400px; text-align: center;
  }
  .login-logo {
    font-family: 'Bebas Neue', sans-serif; font-size: 2.5rem; letter-spacing: 4px;
    color: var(--gold); margin-bottom: 0.5rem;
  }
  .login-logo span { color: var(--red); }
  .login-sub { color: var(--gray); font-size: 0.88rem; margin-bottom: 2rem; }
  .login-input {
    width: 100%; background: var(--card); border: 1px solid var(--border); color: var(--white);
    padding: 0.7rem 1rem; border-radius: 8px; font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem; margin-bottom: 0.8rem; outline: none; transition: border 0.2s;
  }
  .login-input:focus { border-color: var(--gold); }
  .login-btn {
    width: 100%; background: var(--gold); color: var(--black); border: none;
    padding: 0.75rem; border-radius: 8px; font-family: 'DM Sans', sans-serif;
    font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.2s;
    margin-bottom: 0.8rem;
  }
  .login-btn:hover { background: var(--gold-dim); }
  .login-switch { color: var(--gray); font-size: 0.85rem; }
  .login-switch button {
    background: none; border: none; color: var(--gold); cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
  }
  .error-msg { color: var(--red); font-size: 0.82rem; margin-bottom: 0.8rem; }

  /* ANIMATIONS */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* RESPONSIVE */
  @media (max-width: 600px) {
    .navbar { padding: 0 1rem; }
    .section { padding: 1.5rem 1rem; }
    .hero-content { padding: 1.5rem 1rem; }
    .hero-title { font-size: 2.4rem; }
    .movies-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); }
    .search-input { width: 160px; }
    .search-input:focus { width: 200px; }
  }
`;

// ─── Auth Screen ─────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handle = () => {
    setError("");
    if (!username.trim() || !password.trim()) return setError("Please fill all fields.");
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (mode === "signup") {
      if (users.find(u => u.username === username)) return setError("Username already exists.");
      users.push({ username, password });
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify({ username }));
      onLogin({ username });
    } else {
      const user = users.find(u => u.username === username && u.password === password);
      if (!user) return setError("Invalid username or password.");
      localStorage.setItem("currentUser", JSON.stringify({ username }));
      onLogin({ username });
    }
  };

  return (
    <div className="login-gate">
      <div className="login-box">
        <div className="login-logo">CINE<span>VAULT</span></div>
        <p className="login-sub">{mode === "login" ? "Welcome back! Sign in to continue." : "Create your account to get started."}</p>
        {error && <p className="error-msg">{error}</p>}
        <input className="login-input" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} />
        <input className="login-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} />
        <button className="login-btn" onClick={handle}>{mode === "login" ? "Sign In" : "Create Account"}</button>
        <p className="login-switch">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
            {mode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── Movie Card ───────────────────────────────────────────────────────────────
function MovieCard({ movie, onSelect, isFav, onToggleFav }) {
  return (
    <div className="movie-card" onClick={() => onSelect(movie)}>
      {movie.poster_path
        ? <img className="card-poster" src={IMG_BASE + movie.poster_path} alt={movie.title} loading="lazy" />
        : <div className="card-no-poster">🎬</div>}
      <div className="card-overlay">
        <div className="card-title">{movie.title}</div>
        <div className="card-meta">
          <span className="card-rating">⭐ {movie.vote_average?.toFixed(1)}</span>
          <span className="card-year">{movie.release_date?.slice(0, 4)}</span>
        </div>
      </div>
      <button className="card-fav-btn" onClick={e => { e.stopPropagation(); onToggleFav(movie); }}>
        {isFav ? "❤️" : "🤍"}
      </button>
    </div>
  );
}

// ─── Movie Modal ──────────────────────────────────────────────────────────────
function MovieModal({ movie, onClose, isFav, onToggleFav }) {
  useEffect(() => {
    const onKey = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hero">
          {movie.backdrop_path
            ? <img src={IMG_ORIGINAL + movie.backdrop_path} alt="" />
            : <div style={{ background: "#222", width: "100%", height: "100%" }} />}
          <div className="modal-hero-overlay" />
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <h2 className="modal-title">{movie.title}</h2>
          <div className="modal-meta">
            <span className="modal-rating">⭐ {movie.vote_average?.toFixed(1)} / 10</span>
            {movie.release_date && <span className="modal-tag">📅 {movie.release_date.slice(0, 4)}</span>}
            {movie.original_language && <span className="modal-tag">🌐 {movie.original_language.toUpperCase()}</span>}
            {movie.vote_count && <span className="modal-tag">🗳️ {movie.vote_count.toLocaleString()} votes</span>}
          </div>
          {movie.overview && <p className="modal-overview">{movie.overview}</p>}
          <button
            className={`modal-fav-btn ${isFav ? "remove" : ""}`}
            onClick={() => onToggleFav(movie)}
          >
            {isFav ? "💔 Remove from Favorites" : "❤️ Add to Favorites"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(getUser);
  const [page, setPage] = useState("home"); // home | favorites | search
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState(user ? getFavorites(user.username) : []);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [heroIdx, setHeroIdx] = useState(0);
  const [tab, setTab] = useState("trending");

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const [t, tr, u] = await Promise.all([
        fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`).then(r => r.json()),
        fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`).then(r => r.json()),
        fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`).then(r => r.json()),
      ]);
      setTrending(t.results || []);
      setTopRated(tr.results || []);
      setUpcoming(u.results || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { if (user) fetchMovies(); }, [user]);

  useEffect(() => {
    if (trending.length === 0) return;
    const interval = setInterval(() => setHeroIdx(i => (i + 1) % Math.min(5, trending.length)), 5000);
    return () => clearInterval(interval);
  }, [trending]);

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); setPage("home"); return; }
    setPage("search");
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(q)}`).then(r => r.json());
    setSearchResults(res.results || []);
  };

  const toggleFav = (movie) => {
    if (!user) return;
    const favs = getFavorites(user.username);
    const exists = favs.find(f => f.id === movie.id);
    const updated = exists ? favs.filter(f => f.id !== movie.id) : [...favs, movie];
    saveFavorites(user.username, updated);
    setFavorites(updated);
  };

  const isFav = (movie) => favorites.some(f => f.id === movie.id);
  const heroMovie = trending[heroIdx];

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  const currentMovies = tab === "trending" ? trending : tab === "toprated" ? topRated : upcoming;

  if (!user) return (
    <>
      <style>{styles}</style>
      <AuthScreen onLogin={u => { setUser(u); setFavorites(getFavorites(u.username)); }} />
    </>
  );

  return (
    <>
      <style>{styles}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-logo">CINE<span>VAULT</span></div>
        <div className="navbar-right">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>
          <button className={`nav-btn ${page === "home" ? "active" : ""}`} onClick={() => { setPage("home"); setSearchQuery(""); }}>🏠 Home</button>
          <button className={`nav-btn ${page === "favorites" ? "active" : ""}`} onClick={() => setPage("favorites")}>❤️ Favorites {favorites.length > 0 && `(${favorites.length})`}</button>
          <span className="nav-user">Hi, <span>{user.username}</span></span>
          <button className="nav-btn" onClick={logout}>Sign Out</button>
        </div>
      </nav>

      {/* HERO */}
      {page === "home" && heroMovie && (
        <div className="hero">
          <div className="hero-bg" style={{ backgroundImage: `url(${IMG_ORIGINAL + heroMovie.backdrop_path})` }} />
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="hero-badge">🔥 Trending Now</span>
            <h1 className="hero-title">{heroMovie.title}</h1>
            <div className="hero-meta">
              <span className="hero-rating">⭐ {heroMovie.vote_average?.toFixed(1)}</span>
              <span className="hero-year">{heroMovie.release_date?.slice(0, 4)}</span>
            </div>
            <p className="hero-overview">{heroMovie.overview}</p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => setSelected(heroMovie)}>▶ View Details</button>
              <button className="btn-outline" onClick={() => toggleFav(heroMovie)}>
                {isFav(heroMovie) ? "❤️ Saved" : "🤍 Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HOME PAGE */}
      {page === "home" && (
        <div>
          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : (
            <div className="section">
              <div className="tabs">
                <button className={`tab ${tab === "trending" ? "active" : ""}`} onClick={() => setTab("trending")}>🔥 Trending</button>
                <button className={`tab ${tab === "toprated" ? "active" : ""}`} onClick={() => setTab("toprated")}>⭐ Top Rated</button>
                <button className={`tab ${tab === "upcoming" ? "active" : ""}`} onClick={() => setTab("upcoming")}>🎬 Upcoming</button>
              </div>
              <div className="section-title">
                <span className="accent">{tab === "trending" ? "Trending" : tab === "toprated" ? "Top Rated" : "Upcoming"}</span> Movies
              </div>
              <div className="movies-grid">
                {currentMovies.map(m => (
                  <MovieCard key={m.id} movie={m} onSelect={setSelected} isFav={isFav(m)} onToggleFav={toggleFav} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SEARCH PAGE */}
      {page === "search" && (
        <div style={{ marginTop: 64 }}>
          <div className="section">
            <div className="section-title">
              Results for <span className="accent">"{searchQuery}"</span>
            </div>
            {searchResults.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🎭</div>
                <h3>No results found</h3>
                <p>Try a different search term</p>
              </div>
            ) : (
              <div className="movies-grid">
                {searchResults.map(m => (
                  <MovieCard key={m.id} movie={m} onSelect={setSelected} isFav={isFav(m)} onToggleFav={toggleFav} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FAVORITES PAGE */}
      {page === "favorites" && (
        <div style={{ marginTop: 64 }}>
          <div className="section">
            <div className="section-title">
              Your <span className="accent">Favorites</span>
            </div>
            {favorites.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🤍</div>
                <h3>No favorites yet</h3>
                <p>Click the heart icon on any movie to save it here</p>
              </div>
            ) : (
              <div className="movies-grid">
                {favorites.map(m => (
                  <MovieCard key={m.id} movie={m} onSelect={setSelected} isFav={true} onToggleFav={toggleFav} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL */}
      {selected && (
        <MovieModal
          movie={selected}
          onClose={() => setSelected(null)}
          isFav={isFav(selected)}
          onToggleFav={(m) => { toggleFav(m); }}
        />
      )}
    </>
  );
  
}