import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';

const EFFECTIVE = '31 July 2026';
const OPERATOR = 'EmpowerEd Nexus Ltd';
const SUPPORT = 'support@empowerednexus.com';

function LegalShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <article className="card legal-page">
        <h1>{title}</h1>
        <p className="legal-meta">
          Operator: {OPERATOR} · Support: <a href={`mailto:${SUPPORT}`}>{SUPPORT}</a> · Effective:{' '}
          {EFFECTIVE}
        </p>
        {children}
        <p className="disclaimer">
          These documents should receive local legal review before unrestricted commercial launch.
        </p>
        <p>
          <Link to="/">Return home</Link>
        </p>
      </article>
    </Layout>
  );
}

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy">
      <p>
        WorkProof Global helps workers create customer-confirmed Verified Work Receipts. This policy
        explains what information we collect for the pilot web application and why.
      </p>
      <h2>Information collected</h2>
      <ul>
        <li>Account details: name, email, password hash, role, and consent timestamps</li>
        <li>Worker profile details you choose to provide (headline, bio, location, skills, private phone)</li>
        <li>Receipt content: service description, customer contact used for verification, work date, optional amount, skills, and visibility</li>
        <li>Evidence metadata and stored files or links you attach</li>
        <li>Verification, dispute, audit, and session security records</li>
        <li>Technical logs such as request identifiers and security events</li>
      </ul>
      <h2>Why we collect it</h2>
      <p>
        We collect information to operate authentication, create and verify work receipts, deliver
        transactional verification emails, protect accounts, investigate misuse, and provide support.
        WorkProof is not a lending platform, credit-scoring service, marketplace, payment processor,
        or blockchain product.
      </p>
      <h2>Customer verification emails</h2>
      <p>
        When a worker submits a receipt, we email the customer a private verification link. Customer
        contact details are used for verification delivery and related support — not for public
        marketing lists.
      </p>
      <h2>Evidence storage</h2>
      <p>
        Evidence files are stored through the configured private storage provider and are accessible
        only through authorised API download paths. Public proof pages do not expose private customer
        contact details.
      </p>
      <h2>Visibility and public proof</h2>
      <p>
        Workers choose receipt visibility. Public proof pages may show service details, worker name,
        verification status, skills, integrity summary, and amount only when visibility rules allow.
      </p>
      <h2>Security and retention</h2>
      <p>
        We use hashed passwords, rotating refresh sessions, access controls, and audit logging.
        Retention follows operational needs for verification integrity, dispute handling, and legal
        obligations. Account deletion requests can be sent to {SUPPORT}.
      </p>
      <h2>Corrections and disputes</h2>
      <p>
        Customers may request corrections or open disputes through verification flows. Administrators
        may resolve disputes and, where justified, revoke verified receipts.
      </p>
    </LegalShell>
  );
}

export function TermsPage() {
  return (
    <LegalShell title="Terms of Use">
      <p>
        These Terms govern use of the WorkProof Global pilot operated by {OPERATOR}. By creating an
        account you agree to these Terms and the Privacy Policy.
      </p>
      <h2>Service description</h2>
      <p>
        WorkProof provides tools to record completed work, request customer confirmation, store
        evidence, and share portable verified proof. It does not provide lending, credit decisions,
        escrow, payment processing, employment placement, or legal contract drafting.
      </p>
      <h2>Worker responsibilities</h2>
      <ul>
        <li>Provide accurate descriptions of completed work</li>
        <li>Use customer contact details only for legitimate verification</li>
        <li>Respect evidence and privacy obligations</li>
        <li>Not present revoked, disputed, or correction-pending receipts as valid proof</li>
      </ul>
      <h2>Customer verification</h2>
      <p>
        Customers confirm work through private links without creating an account. Confirmation creates
        a verification record; it is not a payment instruction.
      </p>
      <h2>Organisation access</h2>
      <p>
        Organisation programme accounts are invitation-based and are not created through public
        self-registration.
      </p>
      <h2>Service limitations</h2>
      <p>
        The pilot may change, experience downtime, or require additional verification steps. We may
        suspend accounts that abuse the platform or endanger trust in verification records.
      </p>
      <h2>Contact</h2>
      <p>
        Support: <a href={`mailto:${SUPPORT}`}>{SUPPORT}</a>
      </p>
    </LegalShell>
  );
}

export function EvidencePolicyPage() {
  return (
    <LegalShell title="Evidence and Verification Policy">
      <h2>Purpose of evidence</h2>
      <p>
        Evidence supports a worker&apos;s description of completed work. It may include photos,
        documents, or external links. Evidence strengthens trust but does not replace customer
        confirmation.
      </p>
      <h2>Allowed materials</h2>
      <p>
        The platform accepts approved file types and sizes configured by the API. Executable or spoofed
        content is rejected. Links must use safe protocols and must not target private-network
        destinations.
      </p>
      <h2>Verification process</h2>
      <ol>
        <li>Worker creates a draft and optionally attaches evidence</li>
        <li>Worker submits the receipt after verifying their own email</li>
        <li>Customer receives a private email link and confirms, requests correction, or disputes</li>
        <li>Confirmed receipts receive integrity protection for portable proof</li>
      </ol>
      <h2>Integrity and invalid states</h2>
      <p>
        Verified proof pages must never present revoked, disputed, correction-required, or unavailable
        receipts as valid. Integrity hashes summarise locked verified content.
      </p>
    </LegalShell>
  );
}

export function DisputePolicyPage() {
  return (
    <LegalShell title="Dispute Policy">
      <p>
        A dispute records that a customer contests a receipt during or after verification. Disputed
        receipts must not be presented as confirmed proof while review is open.
      </p>
      <h2>How disputes arise</h2>
      <p>
        Customers may open a dispute through the private verification response flow when they believe
        the recorded work is inaccurate or was not completed as described.
      </p>
      <h2>Review outcomes</h2>
      <p>Administrators may resolve an open dispute by setting the receipt to:</p>
      <ul>
        <li>Verified — confirmation stands after review</li>
        <li>Correction requested — worker must update and resubmit</li>
        <li>Revoked — proof is invalidated with a recorded reason</li>
      </ul>
      <h2>Contact</h2>
      <p>
        Questions about an open dispute: <a href={`mailto:${SUPPORT}`}>{SUPPORT}</a>
      </p>
    </LegalShell>
  );
}

export function SupportPage() {
  return (
    <LegalShell title="Support">
      <p>
        For pilot support, email <a href={`mailto:${SUPPORT}`}>{SUPPORT}</a>. Please include your
        account email and a clear description of the issue. Do not send passwords or full payment card
        details.
      </p>
      <h2>Common requests</h2>
      <ul>
        <li>Email verification or password recovery help</li>
        <li>Receipt or evidence access problems</li>
        <li>Dispute status questions</li>
        <li>Account deletion or pseudonymisation requests</li>
        <li>Organisation programme invitation questions</li>
      </ul>
      <h2>Account deletion requests</h2>
      <p>
        Automated self-serve deletion is not yet available. Email {SUPPORT} from your registered
        address with the subject “Account deletion request”. We will explain consequences and confirm
        before acting.
      </p>
      <h2>What WorkProof does not provide</h2>
      <p>
        We cannot process payments, issue loans, score creditworthiness, or place workers into jobs.
      </p>
    </LegalShell>
  );
}
