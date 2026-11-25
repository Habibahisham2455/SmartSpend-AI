import { Sparkles, CheckCircle2 } from 'lucide-react';
import slides from '../data/slides.json';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';

export default function AboutPage() {
  return (
    <div className="space-y-8 pb-12 max-w-5xl">
      {/* Header */}
      <PageHeader
        title="About SmartSpend AI"
        subtitle="University Project Pitch & Presentation Deck"
      />

      {/* Hero Pitch Banner */}
      <div className="rounded-3xl bg-brand-gradient text-white p-6 sm:p-8 shadow-xl shadow-[#8C52FF]/20 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>PITCH PRESENTATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            SmartSpend AI — Financial Wellness for the Next Generation
          </h2>
          <p className="text-sm sm:text-base text-white/85 max-w-2xl leading-relaxed">
            Helping university students, young professionals, and families gain financial clarity, build savings habits, and stop living paycheck to paycheck through accessible, intelligent financial tools.
          </p>
        </div>
      </div>

      {/* Slide Cards Grid */}
      <div className="space-y-4">
        {slides.map((slide, index) => (
          <Card key={index} padding="md" className="border border-[var(--border-subtle)]">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#8C52FF] font-black text-sm flex items-center justify-center shrink-0">
                0{index + 1}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h3 className="text-lg font-bold text-[var(--text-main)]">
                    {slide.title}
                  </h3>
                  {slide.subtitle && (
                    <span className="text-xs font-bold text-[#8C52FF]">
                      {slide.subtitle}
                    </span>
                  )}
                </div>

                <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                  {slide.content.split('\n').map((line, lIdx) => {
                    if (line.startsWith('•')) {
                      return (
                        <div key={lIdx} className="flex items-center gap-2 py-0.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{line.replace('•', '').trim()}</span>
                        </div>
                      );
                    }
                    return <p key={lIdx}>{line}</p>;
                  })}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
