const stats = [
  { value: "15+", label: "Years Experience" },
  { value: "4", label: "Industries" },
  { value: "6", label: "Companies" },
]

export function About() {
  return (
    <section className="mx-auto max-w-[800px] px-6 py-16 md:py-24">
      <div className="mb-8 h-px w-10 bg-accent-ice opacity-40" />
      <p className="mb-8 text-xs uppercase tracking-[0.25em] text-accent-ice">
        About
      </p>
      <p className="max-w-[600px] text-lg leading-relaxed text-text-secondary md:text-xl md:leading-relaxed">
        I am a high-execution software engineer specializing in building robust,
        high-performance systems across FinTech, HealthTech, and Blockchain. I
        thrive in fast-paced environments where technical complexity meets the
        need for rapid, pragmatic delivery.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-10">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="text-3xl font-bold text-accent-ice md:text-4xl">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-text-dimmed">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
