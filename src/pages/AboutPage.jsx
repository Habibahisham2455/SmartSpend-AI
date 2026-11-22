import slides from '../data/slides.json';

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-white">About SmartSpend AI</h1>
        <p className="text-slate-400 mt-2 text-sm">
          Project overview and presentation slides.
        </p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-3xl p-8"
          >
            <h3 className="text-2xl font-black text-white mb-3">
              {slide.title}
            </h3>

            {slide.subtitle && (
              <p className="text-green-300 mb-3 text-sm font-medium">
                {slide.subtitle}
              </p>
            )}

            <p className="text-slate-300 whitespace-pre-line leading-relaxed text-sm">
              {slide.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
