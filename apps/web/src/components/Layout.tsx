import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="brand">
          <span className="brand-mark">WP</span>
          <span>
            <strong>WorkProof</strong> Global
          </span>
        </Link>
        <nav className="site-nav" aria-label="Main">
          {user ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              {user.role === 'WORKER' && (
                <>
                  <NavLink to="/receipts">Receipts</NavLink>
                  <NavLink to="/profile">Profile</NavLink>
                </>
              )}
              {user.role === 'ORGANISATION' && <NavLink to="/organisation">Organisation</NavLink>}
              {user.role === 'ADMIN' && <NavLink to="/admin">Admin</NavLink>}
              <button type="button" className="btn btn-ghost" onClick={() => void handleLogout()}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Sign in</NavLink>
              <Link to="/register" className="btn btn-primary btn-sm">
                Create profile
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <p>Worker-owned portable proof · EmpowerEd Nexus innovation</p>
        <div className="footer-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </footer>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status.toLowerCase()}`}>{status.replace(/_/g, ' ')}</span>;
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
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

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

export function Alert({ tone, message }: { tone: 'error' | 'success' | 'info'; message: string }) {
  return <div className={`alert alert-${tone}`} role="alert">{message}</div>;
}
