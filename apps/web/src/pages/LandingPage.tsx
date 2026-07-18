import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';

export default function LandingPage() {
  return (
    <Layout>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">African innovation · Worker ownership</p>
          <h1>Turn every completed job into portable proof.</h1>
          <p className="lead">
            Millions of workers complete valuable work without contracts, payslips, references, or
            portable professional records. WorkProof transforms completed jobs into client-confirmed
            Verified Work Receipts.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Create your work profile</Link>
            <Link to="/login" className="btn btn-secondary btn-lg">Verify a receipt</Link>
          </div>
        </div>
        <div className="hero-card">
          <h2>Verified Work Receipt</h2>
          <ul>
            <li>Worker declares completed work</li>
            <li>Evidence attached securely</li>
            <li>Customer confirms via private link</li>
            <li>Receipt locked with integrity hash</li>
            <li>Portable proof the worker owns</li>
          </ul>
        </div>
      </section>

      <section className="grid-section">
        <article className="card">
          <h3>Who it serves</h3>
          <p>Informal workers, freelancers, artisans, caregivers, tutors, drivers, farmers, volunteers, and small service businesses across Africa and beyond.</p>
        </article>
        <article className="card">
          <h3>Customer trust</h3>
          <p>Customers confirm work without creating an account. Their decision creates a tamper-evident record both parties can reference.</p>
        </article>
        <article className="card">
          <h3>Programme impact</h3>
          <p>Organisations gain visibility into verified outcomes while workers retain ownership of their proof portfolio.</p>
        </article>
        <article className="card">
          <h3>Privacy & consent</h3>
          <p>Workers choose visibility. Public proof pages never expose private customer contact or income without consent.</p>
        </article>
      </section>
    </Layout>
  );
}
