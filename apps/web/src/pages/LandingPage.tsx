import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';

export default function LandingPage() {
  return (
    <Layout>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-content">
          <p className="eyebrow">Worker ownership · Trusted verification</p>
          <h1 id="hero-title">Turn completed jobs into Verified Work Receipts.</h1>
          <p className="lead">
            WorkProof Global helps workers record finished work, invite customers to confirm it, and
            keep portable proof they own — without becoming a marketplace, lender, or payment
            processor.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Create your work profile
            </Link>
            <a href="#how-it-works" className="btn btn-secondary btn-lg">
              How verification works
            </a>
          </div>
        </div>
        <div className="hero-card" aria-labelledby="vwr-title">
          <h2 id="vwr-title">Verified Work Receipt</h2>
          <ol>
            <li>Worker records completed work and optional evidence</li>
            <li>Customer confirms through a private email link</li>
            <li>Receipt locks with an integrity hash the worker can share</li>
          </ol>
        </div>
      </section>

      <section id="how-it-works" className="section-block" aria-labelledby="steps-title">
        <h2 id="steps-title">How verification works</h2>
        <p className="section-lead">
          Customer confirmation happens through a private link sent to the customer — not through a
          public “verify” button on this website.
        </p>
        <div className="steps-grid">
          <article className="card step-card">
            <span className="step-number" aria-hidden="true">
              1
            </span>
            <h3>Record completed work</h3>
            <p>Describe the service, customer, date, and skills demonstrated. Attach photos, documents, or links when helpful.</p>
          </article>
          <article className="card step-card">
            <span className="step-number" aria-hidden="true">
              2
            </span>
            <h3>Customer confirms it</h3>
            <p>Your customer receives a private verification email and can confirm, request a correction, or open a dispute — without creating an account.</p>
          </article>
          <article className="card step-card">
            <span className="step-number" aria-hidden="true">
              3
            </span>
            <h3>Own and share verified proof</h3>
            <p>Once confirmed, you receive a portable proof page with integrity information you control sharing.</p>
          </article>
        </div>
      </section>

      <section className="section-block" aria-labelledby="who-title">
        <h2 id="who-title">Who WorkProof serves</h2>
        <div className="grid-section">
          <article className="card">
            <h3>Workers</h3>
            <p>Build a portfolio of completed, customer-confirmed work you can show to future customers and programmes — without surrendering ownership of your records.</p>
          </article>
          <article className="card">
            <h3>Customers</h3>
            <p>Confirm work through a private link. You do not need an account, and your contact details are not published on public proof pages.</p>
          </article>
          <article className="card">
            <h3>Employers</h3>
            <p>Review verified outcomes when a worker chooses to share proof — without WorkProof acting as a credit score or hiring marketplace.</p>
          </article>
          <article className="card">
            <h3>Programmes and organisations</h3>
            <p>Invitation-based programme access can later connect assigned workers to verified outcomes. Organisation accounts are not opened through public self-registration.</p>
          </article>
        </div>
      </section>

      <section className="section-block" aria-labelledby="privacy-title">
        <h2 id="privacy-title">Privacy and worker control</h2>
        <div className="card">
          <p>
            Workers choose receipt visibility. Public proof pages show service and verification
            details that are safe to share. Customer contact details, private evidence downloads, and
            income figures remain protected according to visibility rules and platform policy.
          </p>
          <p className="muted">
            WorkProof Global is operated for pilot programmes by EmpowerEd Nexus Ltd. It does not
            provide lending, credit decisions, escrow, or blockchain settlement.
          </p>
          <div className="action-row">
            <Link to="/privacy" className="btn btn-secondary">
              Privacy Policy
            </Link>
            <Link to="/terms" className="btn btn-secondary">
              Terms of Use
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
