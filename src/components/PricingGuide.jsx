const questions = [
  ['How long will my website take?', 'We confirm a delivery schedule in your quote. Timing depends on the number of pages, integrations, and when we receive your content and feedback.'],
  ['How do revisions work?', 'Mini includes one revision and Starter includes two. Your quote lists the revisions for the other plans. Additional revisions are LKR 500 each.'],
  ['What do I need to provide?', 'Send your business details, the pages or features you need, and any logo, copy, and images you want to use. If you already have a domain or hosting, let us know so we can plan the handover.'],
  ['Who owns the website and its accounts?', 'The proposal will spell out what files and account access you receive at handover and which assets are subject to third-party licences. Ask about ownership or transfer before approving the quote.'],
  ['What will I pay after launch?', 'Hosting is renewed annually. Domain registration and renewals are billed separately at the registrar’s rates. Paid third-party services are charged by their providers.'],
];

export default function PricingGuide({ plans }) {
  return (
    <>
      <section aria-labelledby="plan-comparison-title" className="mt-16">
        <h2 id="plan-comparison-title" className="text-2xl sm:text-3xl font-bold mb-2">Compare website plans</h2>
        <p className="text-gray-400 text-sm mb-4">Development is paid once. Hosting renews yearly, and domains and optional extras are billed separately.</p>
        <div tabIndex={0} role="region" aria-label="Scrollable plan comparison" className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-white/[0.04]">
              <tr>
                <th scope="col" className="px-4 py-3">Plan</th>
                <th scope="col" className="px-4 py-3">Best suited for</th>
                <th scope="col" className="px-4 py-3">Development</th>
                <th scope="col" className="px-4 py-3">Annual hosting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {plans.map((plan) => (
                <tr key={plan.name}>
                  <th scope="row" className="px-4 py-3">{plan.name}</th>
                  <td className="px-4 py-3 text-gray-400">{plan.bestFor}</td>
                  <td className="px-4 py-3 whitespace-nowrap">LKR {plan.price}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{plan.hosting}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section aria-labelledby="pricing-faq-title" className="mt-16">
        <h2 id="pricing-faq-title" className="text-2xl sm:text-3xl font-bold mb-4">Frequently asked questions</h2>
        <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02]">
          {questions.map(([question, answer]) => (
            <details key={question} className="px-5 py-4">
              <summary className="cursor-pointer font-semibold">{question}</summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
