import { useEffect } from 'react';

const TermsAndConditions = () => {

  useEffect(() => {
    document.title = "Terms & Conditions | NHubX";
  }, []);

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6 overflow-hidden">

      {/* background glow */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-nhubx-glow-primary/[0.03] blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-10 left-10 w-[30rem] h-[30rem] bg-purple-500/[0.02] blur-[120px] rounded-full -z-10" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* header */}
        <div className="mb-16 max-w-3xl">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.02] border border-white/[0.06] text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-5 font-mono">
            Legal Documentation
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white mb-6">
            Terms & <span className="glow-text-primary">Conditions</span>
          </h1>

          <p className="text-gray-500 text-sm sm:text-base md:text-lg leading-relaxed">
            These Terms & Conditions govern the use of the NHubX
            platform, services, systems, and digital infrastructure.
          </p>

        </div>

        {/* content */}
        <div className="glass-panel border border-white/[0.06] rounded-[32px] p-6 sm:p-10 md:p-12 space-y-14">

          {/* acceptance */}
          <section className="space-y-4">

            <h2 className="text-2xl font-bold text-white">
              Acceptance of Terms
            </h2>

            <p className="text-gray-500 leading-8">
              By accessing or using NHubX services, you agree
              to comply with these Terms & Conditions.
              If you do not agree with any part of these terms,
              please discontinue use of the platform immediately.
            </p>

          </section>

          {/* services */}
          <section className="space-y-4">

            <h2 className="text-2xl font-bold text-white">
              Services
            </h2>

            <p className="text-gray-500 leading-8">
              NHubX provides web development, cybersecurity solutions,
              automation systems, AI-powered tools, dashboards,
              hosting infrastructure, and related digital services.
            </p>

          </section>

          {/* responsibilities */}
          <section className="space-y-4">

            <h2 className="text-2xl font-bold text-white">
              User Responsibilities
            </h2>

            <div className="space-y-3 text-gray-500 leading-8">
              <p>• Use services legally and responsibly</p>
              <p>• Avoid harmful or malicious activity</p>
              <p>• Protect account credentials and access</p>
              <p>• Respect infrastructure stability and security</p>
            </div>

          </section>

          {/* prohibited */}
          <section className="space-y-4">

            <h2 className="text-2xl font-bold text-white">
              Prohibited Activities
            </h2>

            <div className="space-y-3 text-gray-500 leading-8">
              <p>• Unauthorized access attempts</p>
              <p>• Malware distribution or exploitation</p>
              <p>• Infrastructure abuse or spam activity</p>
              <p>• Illegal usage of NHubX systems or services</p>
            </div>

          </section>

          {/* intellectual */}
          <section className="space-y-4">

            <h2 className="text-2xl font-bold text-white">
              Intellectual Property
            </h2>

            <p className="text-gray-500 leading-8">
              All branding, visuals, source code, systems,
              interfaces, and technologies related to NHubX
              remain protected intellectual property unless stated otherwise.
            </p>

          </section>

          {/* availability */}
          <section className="space-y-4">

            <h2 className="text-2xl font-bold text-white">
              Service Availability
            </h2>

            <p className="text-gray-500 leading-8">
              We aim to provide reliable uptime and performance,
              but services may occasionally be interrupted during
              maintenance, upgrades, or unforeseen technical issues.
            </p>

          </section>

          {/* limitation */}
          <section className="space-y-4">

            <h2 className="text-2xl font-bold text-white">
              Limitation of Liability
            </h2>

            <p className="text-gray-500 leading-8">
              NHubX is not responsible for indirect,
              incidental, or consequential damages resulting
              from the use or inability to use our services.
            </p>

          </section>

          {/* termination */}
          <section className="space-y-4">

            <h2 className="text-2xl font-bold text-white">
              Termination
            </h2>

            <p className="text-gray-500 leading-8">
              We reserve the right to suspend or terminate access
              to users who violate these Terms & Conditions
              or compromise platform security.
            </p>

          </section>

          {/* updates */}
          <section className="space-y-4">

            <h2 className="text-2xl font-bold text-white">
              Updates to Terms
            </h2>

            <p className="text-gray-500 leading-8">
              These terms may be updated periodically to reflect
              legal, technical, or operational changes within NHubX services.
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

export default TermsAndConditions;
