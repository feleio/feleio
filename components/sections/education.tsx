const education = [
  {
    date: "2007 — 2010",
    school: "The Hong Kong University of Science and Technology",
    degree: "Bachelor's Degree, Computer Science · First Class Honours",
  },
  {
    date: "2009",
    school: "University of Southampton",
    degree: "Exchange Programme, Computer Science",
  },
]

export function Education() {
  return (
    <section className="mx-auto max-w-[800px] px-6 py-16 md:py-24">
      <div className="mb-8 h-px w-10 bg-accent-ice opacity-40" />
      <p className="mb-8 text-xs uppercase tracking-[0.25em] text-accent-ice">
        Education
      </p>
      <div className="flex flex-col">
        {education.map((edu) => (
          <div
            key={edu.school}
            className="flex flex-col gap-2 border-b border-card-border py-5 last:border-b-0 md:flex-row md:gap-6"
          >
            <div className="min-w-[100px] text-xs text-accent-ice md:pt-1">
              {edu.date}
            </div>
            <div>
              <div className="text-base font-semibold text-text-primary">
                {edu.school}
              </div>
              <div className="text-sm text-text-secondary">
                {edu.degree}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
