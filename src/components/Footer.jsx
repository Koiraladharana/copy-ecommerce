import { Link } from "react-router-dom";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">

        {/* BRAND */}
        <div className="footer-brand">
          <div className="footer-logo">Movie<span>Fetch</span></div>
          <p className="footer-tagline">Your ultimate destination for discovering movies. Search, explore, and save your favorites.</p>
          <div className="footer-socials">
            <a href="#" className="social-btn">𝕏</a>
            <a href="#" className="social-btn">in</a>
            <a href="#" className="social-btn">📷</a>
            <a href="#" className="social-btn">▶</a>
          </div>
        </div>

        {/* ALL LINK COLUMNS wrapped in grid */}
        <div className="footer-links-grid">

          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <Link to="/" className="footer-link">🏠 Home</Link>
            <Link to="/favorites" className="footer-link">❤️ Favorites</Link>
            <Link to="/login" className="footer-link">🔑 Sign In</Link>
            <Link to="/signup" className="footer-link">✨ Sign Up</Link>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Explore</h4>
            <a href="#" className="footer-link">🔥 Trending</a>
            <a href="#" className="footer-link">⭐ Top Rated</a>
            <a href="#" className="footer-link">🎬 Upcoming</a>
            <a href="#" className="footer-link">🎭 By Genre</a>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Powered By</h4>
            <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="footer-link">🎥 TMDB API</a>
            <a href="https://react.dev" target="_blank" rel="noreferrer" className="footer-link">⚛️ React</a>
            <a href="https://vitejs.dev" target="_blank" rel="noreferrer" className="footer-link">⚡ Vite</a>
          </div>

        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <p className="footer-copy">© {new Date().getFullYear()} MovieFetch. All rights reserved.</p>
        <p className="footer-tmdb">
          Movie data provided by{" "}
          <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">TMDB</a>.
          This product uses the TMDB API but is not endorsed by TMDB.
        </p>
      </div>

    </footer>
  );
}

export default Footer;