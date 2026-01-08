import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms of Service</h1>
          <p className="text-slate-600 mb-8">Last updated: January 2025</p>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-600 mb-4">
                By accessing and using the Oromo Platform, you agree to be bound by these Terms
                of Service. If you do not agree to these terms, please do not use our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Description of Service</h2>
              <p className="text-slate-600 mb-4">
                Oromo Platform provides educational resources, career opportunities, and a
                community knowledge base for the Oromo diaspora. Our services include:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4">
                <li>Academy - Educational courses and lessons</li>
                <li>Careers - Job listings and professional networking</li>
                <li>Wiki - Community-contributed knowledge base</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. User Accounts</h2>
              <p className="text-slate-600 mb-4">
                To access certain features, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4">
                <li>Maintaining the confidentiality of your account</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
                <li>Updating your information as needed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. User Content</h2>
              <p className="text-slate-600 mb-4">
                When you submit content to our platform, you grant us a non-exclusive, worldwide,
                royalty-free license to use, display, and distribute that content. You agree not to submit content that:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4">
                <li>Is false, misleading, or fraudulent</li>
                <li>Infringes on intellectual property rights</li>
                <li>Is harmful, threatening, or harassing</li>
                <li>Contains malware or harmful code</li>
                <li>Violates any applicable laws</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Intellectual Property</h2>
              <p className="text-slate-600 mb-4">
                The Oromo Platform and its original content, features, and functionality are
                owned by Oromo Platform and are protected by international copyright, trademark,
                and other intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Job Listings</h2>
              <p className="text-slate-600 mb-4">
                Employers posting jobs on our platform are responsible for the accuracy of their
                listings. We do not guarantee employment or verify all job postings. Users should
                exercise caution and conduct their own due diligence.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Limitation of Liability</h2>
              <p className="text-slate-600 mb-4">
                Oromo Platform shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages resulting from your use of or inability
                to use the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Termination</h2>
              <p className="text-slate-600 mb-4">
                We may terminate or suspend your account and access to our services immediately,
                without prior notice, for any reason, including breach of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Changes to Terms</h2>
              <p className="text-slate-600 mb-4">
                We reserve the right to modify these terms at any time. We will notify users
                of any material changes by posting the new Terms on this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Contact Us</h2>
              <p className="text-slate-600 mb-4">
                If you have questions about these Terms, please contact us at:
              </p>
              <p className="text-slate-600">
                Email: legal@oromoplatform.com<br />
                Address: Minneapolis, MN, United States
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
