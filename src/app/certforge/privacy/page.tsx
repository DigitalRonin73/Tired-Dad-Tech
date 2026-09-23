import type { Metadata } from "next";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy for CertForge | Tired Dad Tech",
  description:
    "How CertForge handles information, stores study progress on your device, and protects your privacy. Effective September 23, 2026.",
  alternates: { canonical: "https://www.tireddadtech.com/certforge/privacy" },
};

const sections = [
  ["information", "Information CertForge Collects"],
  ["study-data", "Study and Progress Data"],
  ["analytics", "Analytics and Tracking"],
  ["external-resources", "External Websites and Resources"],
  ["purchases", "Purchases"],
  ["deletion", "Data Retention and Deletion"],
  ["children", "Children’s Privacy"],
  ["security", "Security"],
  ["changes", "Changes to This Privacy Policy"],
  ["contact", "Contact"],
] as const;

export default function CertForgePrivacyPage() {
  return (
    <main className={styles.page} id="top">
      <article className={styles.document}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Tired Dad Tech · CertForge</p>
          <h1>Privacy Policy <span>for CertForge</span></h1>
          <p className={styles.date}>Effective Date: <time dateTime="2026-09-23">September 23, 2026</time></p>
          <p className={styles.intro}>CertForge is a cybersecurity certification study application developed by Tired Dad Tech. This Privacy Policy explains how information is handled when you use CertForge.</p>
        </header>

        <details className={styles.contents}>
          <summary>On this page</summary>
          <nav aria-label="Privacy policy sections">
            <ol>
              {sections.map(([id, title]) => (
                <li key={id}><a href={`#${id}`}>{title}</a></li>
              ))}
            </ol>
          </nav>
        </details>

        <div className={styles.body}>
          <section id="information" aria-labelledby="information-title">
            <h2 id="information-title">Information CertForge Collects</h2>
            <p>CertForge does not require you to create an account and does not collect personal information such as your name, email address, phone number, or physical address.</p>
            <p>CertForge does not use advertising trackers, third-party analytics SDKs, or behavioral tracking technologies.</p>
          </section>

          <section id="study-data" aria-labelledby="study-data-title">
            <h2 id="study-data-title">Study and Progress Data</h2>
            <p>CertForge stores information related to your use of the app, including study progress, flashcard review history, quiz results, gameplay progress, study activity, preferences, and other information needed to provide learning and review features.</p>
            <p>This information is stored locally on your device and is used to provide features such as:</p>
            <ul>
              <li>spaced-repetition scheduling</li>
              <li>study recommendations</li>
              <li>progress tracking</li>
              <li>quiz history</li>
              <li>gameplay progress</li>
              <li>review of concepts that may need additional study</li>
              <li>study streaks and activity statistics</li>
            </ul>
            <p>CertForge does not transmit this study data to Tired Dad Tech or operate a server that collects this information.</p>
          </section>

          <section id="analytics" aria-labelledby="analytics-title">
            <h2 id="analytics-title">Analytics and Tracking</h2>
            <p>CertForge does not use third-party analytics services and does not track your activity across other apps or websites.</p>
            <p>CertForge does not use your information for advertising.</p>
            <p>CertForge does not sell or share personal information with advertisers or data brokers.</p>
          </section>

          <section id="external-resources" aria-labelledby="external-resources-title">
            <h2 id="external-resources-title">External Websites and Resources</h2>
            <p>CertForge may contain links to external websites and educational resources.</p>
            <p>When you choose to open an external link, you leave CertForge and the destination website may collect information according to its own privacy policy and practices.</p>
            <p>CertForge and Tired Dad Tech are not responsible for the privacy practices of third-party websites.</p>
          </section>

          <section id="purchases" aria-labelledby="purchases-title">
            <h2 id="purchases-title">Purchases</h2>
            <p>If CertForge offers purchases through Apple’s App Store, transactions are processed by Apple.</p>
            <p>CertForge does not receive or store your complete payment card or banking information.</p>
            <p>Apple’s handling of purchase information is governed by Apple’s own privacy policies and App Store terms.</p>
          </section>

          <section id="deletion" aria-labelledby="deletion-title">
            <h2 id="deletion-title">Data Retention and Deletion</h2>
            <p>Study progress and other locally stored CertForge data remain on your device unless removed through functionality provided by the app, by deleting the app and its associated data, or through applicable iOS data-management features.</p>
            <p>Because CertForge does not operate user accounts or a server containing your study history, Tired Dad Tech does not maintain a remote copy of that study history that can be retrieved or deleted on your behalf.</p>
          </section>

          <section id="children" aria-labelledby="children-title">
            <h2 id="children-title">Children’s Privacy</h2>
            <p>CertForge is an educational application and does not knowingly collect personal information from children.</p>
            <p>Because CertForge does not require accounts or transmit study history to Tired Dad Tech, the app does not intentionally collect personal information from children through its own services.</p>
          </section>

          <section id="security" aria-labelledby="security-title">
            <h2 id="security-title">Security</h2>
            <p>CertForge is designed to minimize privacy risk by keeping learning and progress information locally on the user’s device and by avoiding unnecessary collection of personal information.</p>
            <p>No method of electronic storage or software operation can be guaranteed to be completely secure.</p>
          </section>

          <section id="changes" aria-labelledby="changes-title">
            <h2 id="changes-title">Changes to This Privacy Policy</h2>
            <p>This Privacy Policy may be updated if CertForge’s features or data practices change.</p>
            <p>When material changes are made, the effective date at the top of this policy will be updated.</p>
          </section>

          <section id="contact" aria-labelledby="contact-title" className={styles.contact}>
            <h2 id="contact-title">Contact</h2>
            <p>Questions regarding this Privacy Policy can be directed to:</p>
            <address>Tired Dad Tech<br />Email: <a href="mailto:Support@TiredDadTech.com">Support@TiredDadTech.com</a></address>
          </section>
        </div>

        <footer className={styles.footer}>
          <span>CertForge · Tired Dad Tech</span>
          <a href="#top">Back to top ↑</a>
        </footer>
      </article>
    </main>
  );
}
