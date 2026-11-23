const caseStudies = [
  {
    name: 'NextPath Advisory',
    image: '/case-studies/nextpath.jpg',
    alt: 'NextPath Advisory homepage introducing its business consulting services',
    problem: 'Sri Lankan SMEs needed a clear way to understand the consultancy’s services and request a consultation.',
    solution: 'A responsive site that explains business solutions, presents success stories, and connects visitors with booking and WhatsApp.',
    demo: 'https://nextpath.profhelper.com',
  },
  {
    name: 'RoutineX',
    image: '/case-studies/routinex.jpg',
    alt: 'RoutineX homepage showing its study timer and progress dashboard',
    problem: 'A/L students needed one place to plan study sessions, practice past papers, and see their progress across subjects.',
    solution: 'A study workspace with focus timers, past-paper tracking, and subject-level analytics that sync across devices.',
    demo: 'https://routinex.nhubx.com/',
  },
];

export default function ProjectCaseStudies() {
  return (
    <section aria-labelledby="case-studies-title" className="mb-14">
      <h2 id="case-studies-title" className="text-2xl sm:text-3xl font-bold mb-5">Project case studies</h2>
      <div className="grid gap-5 md:grid-cols-2">
        {caseStudies.map((study) => (
          <article key={study.name} className="glass-card overflow-hidden">
            <img src={study.image} alt={study.alt} width="1280" height="800" loading="lazy" decoding="async" className="w-full h-auto border-b border-white/10" />
            <div className="p-5 sm:p-6">
              <h3 className="text-xl font-bold mb-4">{study.name}</h3>
              <dl className="space-y-3 text-sm leading-relaxed">
                <div><dt className="font-semibold">The problem</dt><dd className="text-gray-400">{study.problem}</dd></div>
                <div><dt className="font-semibold">What we built</dt><dd className="text-gray-400">{study.solution}</dd></div>
              </dl>
              <a href={study.demo} target="_blank" rel="noopener noreferrer" className="inline-flex mt-5 rounded-lg bg-nhubx-glow-primary px-4 py-2 text-sm font-bold" aria-label={'Open ' + study.name + ' live demo (new tab)'}>Open live demo</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
