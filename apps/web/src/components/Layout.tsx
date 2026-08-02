import { useEffect, useId, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('nav-open', menuOpen);
    return () => document.body.classList.remove('nav-open');
  }, [menuOpen]);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const navLinks = user ? (
    <>
      <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>
        Dashboard
      </NavLink>
      {user.role === 'WORKER' && (
        <>
          <NavLink to="/receipts" onClick={() => setMenuOpen(false)}>
            Receipts
          </NavLink>
          <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
            Profile
          </NavLink>
        </>
      )}
      {user.role === 'ORGANISATION' && (
        <NavLink to="/organisation" onClick={() => setMenuOpen(false)}>
          Organisation
        </NavLink>
      )}
      {user.role === 'ADMIN' && (
        <NavLink to="/admin" onClick={() => setMenuOpen(false)}>
          Admin
        </NavLink>
      )}
      <button type="button" className="btn btn-ghost nav-action" onClick={() => void handleLogout()}>
        Sign out
      </button>
    </>
  ) : (
    <>
      <NavLink to="/login" onClick={() => setMenuOpen(false)}>
        Sign in
      </NavLink>
      <Link to="/register" className="btn btn-primary btn-sm nav-action" onClick={() => setMenuOpen(false)}>
        Create profile
      </Link>
    </>
  );

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            WP
          </span>
          <span>
            <strong>WorkProof</strong> Global
          </span>
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
        </button>
        <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`} id={menuId} aria-label="Main">
          {navLinks}
        </nav>
      </header>
      <main id="main-content" className="site-main" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <div>
          <p>
            <strong>WorkProof Global</strong>
          </p>
          <p className="footer-tagline">Worker-owned portable proof · EmpowerEd Nexus Ltd</p>
        </div>
        <div className="footer-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/evidence-policy">Evidence policy</Link>
          <Link to="/dispute-policy">Dispute policy</Link>
          <Link to="/support">Support</Link>
          <Link to="/login">Sign in</Link>
          <Link to="/register">Create profile</Link>
        </div>
      </footer>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status.toLowerCase()}`}>{status.replace(/_/g, ' ')}</span>;
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

export function Alert({ tone, message }: { tone: 'error' | 'success' | 'info'; message: string }) {
  return (
    <div className={`alert alert-${tone}`} role="alert">
      {message}
    </div>
  );
}
