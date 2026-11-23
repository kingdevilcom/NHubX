import { caseStudies } from '../projectCaseStudies';

const examples = [
  ['nextpath', 'Starter', 'A consultancy website with service pages and a consultation enquiry flow.'],
  ['routinex', 'Advanced', 'A web app with sign-in, progress tracking, and cloud-synced data.'],
];

export default function PricingExamples() {
  return (
    <section aria-labelledby="pricing-examples-title" className="mt-16">
      <h2 id="pricing-examples-title" className="mb-2 text-2xl font-bold sm:text-3xl">See what we can build</h2>
      <p className="mb-5 text-sm text-gray-400">These live projects illustrate what each plan can support. Your quote covers the features you choose.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        {examples.map(([id, plan, description]) => {
          const project = caseStudies.find((study) => study.id === id);
          return (
            <article key={id} className="glass-card overflow-hidden">
              <img src={project.image} alt={project.alt} width="1280" height="800" loading="lazy" decoding="async" className="aspect-video w-full object-cover object-top" />
              <div className="space-y-2 p-5">
                <p className="text-sm font-semibold text-nhubx-glow-primary">{plan} example</p>
                <h3 className="text-xl font-bold">{project.name}</h3>
                <p className="text-sm text-gray-400">{description}</p>
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="inline-block pt-1 text-sm font-semibold text-nhubx-glow-primary hover:underline" aria-label={'Open ' + project.name + ' live demo (new tab)'}>Open live demo</a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
