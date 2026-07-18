import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';

export default function PrivacyPage() {
  return (
    <Layout>
      <article className="card legal-page">
        <h1>Privacy policy</h1>
        <p>WorkProof Global is built on worker ownership and consent. Workers control what appears on public proof pages. Customer contact details are used only for verification and are never shown on public proof views without explicit visibility settings.</p>
        <p>Evidence files are stored securely. Audit logs record sensitive actions without exposing private payloads in public interfaces.</p>
        <p><Link to="/">Return home</Link></p>
      </article>
    </Layout>
  );
}

export function TermsPage() {
  return (
    <Layout>
      <article className="card legal-page">
        <h1>Terms of use</h1>
        <p>WorkProof Global provides a proof-of-work receipt platform. Verified receipts become immutable after customer confirmation. Disputes are recorded transparently and may be reviewed by platform administrators.</p>
        <p>This MVP is for demonstration and pilot programmes. It does not provide lending, escrow, payment processing, or legal contract services.</p>
        <p><Link to="/">Return home</Link></p>
      </article>
    </Layout>
  );
}
