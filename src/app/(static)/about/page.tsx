import Link from "next/link";
import { Target, Heart, ShieldCheck, ArrowRight } from "lucide-react";

const values = [
  {
    title: "Radical Focus",
    text: "We build tools that remove noise, not add to it.",
    icon: <Target className="text-indigo-600" size={24} />,
  },
  {
    title: "Privacy First",
    text: "Your data is yours. We never sell or share your personal information.",
    icon: <ShieldCheck className="text-emerald-600" size={24} />,
  },
  {
    title: "Human Centered",
    text: "Productivity is about people, not just ticking boxes.",
    icon: <Heart className="text-rose-500" size={24} />,
  },
];

export default function AboutPage() {
  return (
    <main className="flex-1 bg-white">
      {/* Hero Section: The "Why" */}
      <section className="py-24 lg:py-32 border-b border-slate-50">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight mb-8">
            We&apos;re on a mission to <br />
            <span className="text-indigo-600 italic">reclaim your focus.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Tasker was born out of a simple frustration: modern tools are too
            loud. We built a workspace that respects your attention and scales
            with your ambition.
          </p>
        </div>
      </section>

      {/* Value Grid: The "How" */}
      <section className="py-24 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mb-3">
              Our Core Values
            </h2>
            <p className="text-3xl font-bold text-slate-900">
              The principles that guide us
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-6 h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {v.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section: The Journey */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              From a side project to a global movement.
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Tasker started in 2024 as a internal tool for a small team of
              developers who were tired of juggling five different apps just to
              get through a Monday.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Today, we&apos;re a fully remote team of 15, serving over 50,000
              users worldwide. We don&apos;t answer to venture capitalists; we
              answer to our users. Our growth is entirely self-funded and
              community-driven.
            </p>
            <div className="pt-4">
              <div className="flex items-center gap-4 text-slate-900 font-bold italic">
                <div className="h-px w-12 bg-indigo-600" />
                The Tasker Founding Team
              </div>
            </div>
          </div>
          {/* Visual: Use a real team photo or abstract art */}
          <div className="flex-1 w-full bg-slate-200 aspect-video rounded-[2.5rem] overflow-hidden relative shadow-2xl">
            <div className="absolute inset-0 bg-linear-to-tr from-indigo-600/20 to-transparent pointer-events-none" />
            <div className="flex items-center justify-center h-full text-slate-400 font-bold uppercase tracking-widest text-sm">
              [ Team / Culture Visual ]
            </div>
          </div>
        </div>
      </section>

      {/* CTA: Join the mission */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="bg-indigo-600 rounded-[3rem] p-12 lg:p-20 text-center text-white relative overflow-hidden">
            <h2 className="text-3xl lg:text-5xl font-black mb-6">
              Build the future of work with us.
            </h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
              Whether you&apos;re a user or looking to join our team,
              there&apos;s a place for you in the Tasker story.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/signup"
                className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight size={18} />
              </Link>
              <Link
                href="/careers"
                className="bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold border border-indigo-400 hover:bg-indigo-400 transition-all"
              >
                View Open Roles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
