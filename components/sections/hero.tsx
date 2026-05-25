export function Hero() {
  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-bg-site px-6 text-center">
      <p className="mb-4 text-xs uppercase tracking-[0.25em] text-accent-ice">
        Senior Software Engineer
      </p>
      <h1 className="mb-3 text-[28px] font-bold tracking-tight text-white sm:text-4xl md:text-[56px] md:leading-tight">
        Chun Lok Ling
      </h1>
      <p className="max-w-[560px] text-sm text-text-secondary sm:text-base md:text-lg">
        Distributed Systems · AI &amp; Agentic Engineering · High-Performance
        FinTech
      </p>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
        <p className="text-xs uppercase tracking-[0.15em] text-text-subtle">
          Scroll
        </p>
        <div className="mx-auto mt-2 h-10 w-px bg-text-subtle" />
      </div>
    </section>
  )
}
