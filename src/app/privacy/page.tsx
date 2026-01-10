import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
          <p className="text-slate-600 mb-8">Last updated: January 2025</p>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Introduction</h2>
              <p className="text-slate-600 mb-4">
                ODDA (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you use our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Information We Collect</h2>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Personal Information</h3>
              <ul className="list-disc pl-6 text-slate-600 mb-4">
                <li>Name and email address when you create an account</li>
                <li>Profile information you choose to provide</li>
                <li>Content you submit, including articles and comments</li>
                <li>Job applications and career information</li>
              </ul>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Automatically Collected Information</h3>
              <ul className="list-disc pl-6 text-slate-600 mb-4">
                <li>Device and browser information</li>
                <li>IP address and location data</li>
                <li>Usage patterns and preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-slate-600 mb-4">
                <li>Provide and maintain our services</li>
                <li>Personalize your experience</li>
                <li>Process job applications</li>
                <li>Send important notifications</li>
                <li>Improve our platform</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Information Sharing</h2>
              <p className="text-slate-600 mb-4">
                We do not sell your personal information. We may share information with:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4">
                <li>Service providers who assist in operating our platform</li>
                <li>Employers when you apply for jobs (with your consent)</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Data Security</h2>
              <p className="text-slate-600 mb-4">
                We implement appropriate technical and organizational measures to protect your
                personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Your Rights</h2>
              <p className="text-slate-600 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-slate-600 mb-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Contact Us</h2>
              <p className="text-slate-600 mb-4">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-slate-600">
                Email: privacy@odda.org<br />
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
