import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="empty-state">
        <h1>Page not found</h1>
        <p>The page you requested does not exist.</p>
        <Link to="/" className="btn btn-primary">Return home</Link>
      </div>
    </Layout>
  );
}
