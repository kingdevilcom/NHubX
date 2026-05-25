const PrivacyPolicy = () => {
  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6 overflow-hidden">

      {/* background glow */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-nhubx-glow-primary/[0.03] blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-10 left-10 w-[30rem] h-[30rem] bg-orange-500/[0.02] blur-[120px] rounded-full -z-10" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* header */}
        <div className="mb-16 max-w-3xl">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.02] border border-white/[0.06] text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-5 font-mono">
            Legal Documentation
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white mb-6">
            Privacy <span className="glow-text-primary">Policy</span>
          </h1>

          <p className="text-gray-500 text-sm sm:text-base md:text-lg leading-relaxed">
            This Privacy Policy explains how NHubX collects,
            uses, protects, and manages information when users
            interact with our platform, infrastructure, and services.
          </p>
        </div>

        {/* content */}
        <div className="glass-panel border border-white/[0.06] rounded-[32px] p-6 sm:p-10 md:p-12 space-y-14">

          {/* intro */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Introduction
            </h2>

            <p className="text-gray-500 leading-8">
              NHubX values user privacy, cybersecurity,
              transparency, and responsible data handling.
              By accessing or using our services, you agree
              to the practices outlined within this policy.
            </p>
          </section>

          {/* data collection */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Information We Collect
            </h2>

            <div className="space-y-3 text-gray-500 leading-8">
              <p>• Name and contact information</p>
              <p>• Email addresses submitted through forms</p>
              <p>• Device, browser, and operating system data</p>
              <p>• Website interaction and analytics information</p>
              <p>• Technical logs related to security and performance</p>
            </div>
          </section>

          {/* usage */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              How We Use Information
            </h2>

            <div className="space-y-3 text-gray-500 leading-8">
              <p>• Improve website performance and stability</p>
              <p>• Respond to support or project inquiries</p>
              <p>• Enhance cybersecurity and monitoring systems</p>
              <p>• Detect suspicious or malicious activity</p>
              <p>• Optimize user experience and infrastructure</p>
            </div>
          </section>

          {/* infrastructure */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Infrastructure & Security
            </h2>

            <p className="text-gray-500 leading-8">
              NHubX is designed around secure infrastructure,
              modern cybersecurity practices, and encrypted
              digital systems. We implement protective measures
              to reduce unauthorized access, misuse, data leaks,
              and malicious attacks.
            </p>

            <p className="text-gray-500 leading-8">
              Some services may utilize distributed systems,
              automation tools, analytics technologies,
              authentication frameworks, and cloud-based
              infrastructure to improve platform reliability
              and operational performance.
            </p>
          </section>

          {/* analytics */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Analytics & Performance
            </h2>

            <p className="text-gray-500 leading-8">
              Anonymous analytics and technical performance
              information may be collected to monitor traffic,
              detect errors, improve responsiveness, and
              maintain system reliability.
            </p>
          </section>

          {/* cookies */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Cookies
            </h2>

            <p className="text-gray-500 leading-8">
              NHubX may use cookies or similar technologies
              to improve user experience, maintain sessions,
              remember preferences, and analyze website activity.
            </p>
          </section>

          {/* third party */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Third-Party Services
            </h2>

            <p className="text-gray-500 leading-8">
              Certain features may rely on trusted third-party
              services such as hosting providers, analytics
              platforms, APIs, authentication systems, or
              communication services. These platforms operate
              under their own privacy policies and standards.
            </p>
          </section>

          {/* user rights */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              User Rights
            </h2>

            <div className="space-y-3 text-gray-500 leading-8">
              <p>• Request access to stored information</p>
              <p>• Request corrections or deletion of data</p>
              <p>• Disable cookies through browser settings</p>
              <p>• Contact us regarding privacy concerns</p>
            </div>
          </section>

          {/* policy updates */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Policy Updates
            </h2>

            <p className="text-gray-500 leading-8">
              NHubX reserves the right to update or modify
              this Privacy Policy at any time to reflect
              platform improvements, legal changes, or
              infrastructure updates.
            </p>
          </section>

          {/* contact */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Contact Information
            </h2>

            <div className="space-y-3 text-gray-500 leading-8">
              <p>Email: contact@nhubx.com</p>
              <p>Website: https://www.nhubx.com</p>
              <p>Location: Sri Lanka</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
