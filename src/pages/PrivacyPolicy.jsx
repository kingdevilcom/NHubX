import React, { useEffect } from 'react';

const PrivacyPolicy = () => {

  useEffect(() => {
    document.title = "Privacy Policy | NHubX";
  }, []);

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6 overflow-hidden">

      {/* glow */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-nhubx-glow-primary/[0.03] blur-[120px] rounded-full -z-10" />

      <div className="absolute bottom-10 left-10 w-[30rem] h-[30rem] bg-purple-500/[0.02] blur-[120px] rounded-full -z-10" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* header */}
        <div className="mb-16 max-w-3xl">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.02] border border-white/[0.06] text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-5 font-mono">

            Legal Documentation

          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white mb-6">

            Privacy{' '}

            <span className="glow-text-primary">
              Policy
            </span>

          </h1>

          <p className="text-gray-500 text-sm sm:text-base md:text-lg leading-relaxed">

            This Privacy Policy explains how NHubX collects,
            uses, protects, and manages your information.

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

              NHubX values user privacy and security.
              By using our services, you agree to the practices
              described in this Privacy Policy.

            </p>

          </section>

          {/* info collected */}
          <section className="space-y-4">

            <h2 className="text-2xl font-bold text-white">
              Information We Collect
            </h2>

            <div className="space-y-3 text-gray-500 leading-8">

              <p>• Name and contact information</p>

              <p>• Messages submitted through contact forms</p>

              <p>• Technical browser and device information</p>

              <p>• Usage analytics and interaction data</p>

            </div>

          </section>

          {/* usage */}
          <section className="space-y-4">

            <h2 className="text-2xl font-bold text-white">
              How We Use Information
            </h2>

            <div className="space-y-3 text-gray-500 leading-8">

              <p>• Improve platform functionality and security</p>

              <p>• Respond to support or business inquiries</p>

              <p>• Monitor system performance and reliability</p>

              <p>• Prevent abuse and unauthorized activity</p>

            </div>

          </section>

          {/* security */}
          <section className="space-y-4">

            <h2 className="text-2xl font-bold text-white">
              Data Protection
            </h2>

            <p className="text-gray-500 leading-8">

              NHubX uses secure systems, encryption methods,
              and access controls to help protect user data
              against unauthorized access or misuse.

            </p>

          </section>

          {/* sharing */}
          <section className="space-y-4">

            <h2 className="text-2xl font-bold text-white">
              Data Sharing
            </h2>

            <p className="text-gray-500 leading-8">

              NHubX does not sell personal information.
              Data may only be shared when legally required
              or necessary to protect platform integrity.

            </p>

          </section>

          {/* cookies */}
          <section className="space-y-4">

            <h2 className="text-2xl font-bold text-white">
              Cookies & Analytics
            </h2>

            <p className="text-gray-500 leading-8">

              Our platform may use cookies or analytics tools
              to improve user experience, monitor traffic,
              and optimize system performance.

            </p>

          </section>

          {/* rights */}
          <section className="space-y-4">

            <h2 className="text-2xl font-bold text-white">
              User Rights
            </h2>

            <div className="space-y-3 text-gray-500 leading-8">

              <p>• Request access to stored information</p>

              <p>• Request correction or deletion of data</p>

              <p>• Disable cookies through browser settings</p>

            </div>

          </section>

          {/* updates */}
          <section className="space-y-4">

            <h2 className="text-2xl font-bold text-white">
              Policy Updates
            </h2>

            <p className="text-gray-500 leading-8">

              This Privacy Policy may be updated periodically
              to reflect operational, legal, or technical changes.

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