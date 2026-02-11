import Carousel from "@/components/Carousel";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  Zap,
  Layout,
  Repeat,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "Tasks",
    text: "quick add & track",
    color: "from-indigo-500 to-blue-600",
  },
  {
    title: "Planner",
    text: "organize, plan & action",
    color: "from-violet-500 to-indigo-600",
  },
  {
    title: "Journal",
    text: "your daily diary",
    color: "from-cyan-500 to-blue-600",
  },
  {
    title: "Notes",
    text: "fast & simple",
    color: "from-slate-700 to-slate-900",
  },
];

const features = [
  {
    title: "Unified Dashboard",
    description: "Your tasks, calendar, and journal in one high-velocity view.",
    icon: <Layout className="text-indigo-600" size={24} />,
  },
  {
    title: "Keyboard-First",
    description: "Quick-add tasks and navigate with ⌘+K command palette.",
    icon: <Zap className="text-amber-500" size={24} />,
  },
  {
    title: "Smart Routines",
    description: "Automate your habits with powerful recurring task logic.",
    icon: <Repeat className="text-emerald-500" size={24} />,
  },
];

const tiers = [
  {
    name: "Starter",
    price: "0",
    description: "Perfect for individuals tracking daily habits.",
    features: ["Up to 3 Lists", "Basic Journaling", "Mobile App Access"],
    cta: "Start for Free",
    featured: false,
  },
  {
    name: "Pro",
    price: "9",
    description: "For power users who need total organization.",
    features: [
      "Unlimited Lists & Tasks",
      "Kanban Boards",
      "Custom Routines",
      "Advanced Filters",
      "Priority Support",
    ],
    cta: "Upgrade to Pro",
    featured: true,
  },
];

export default function HomePage() {
  const user = null; // Replace with your auth logic

  return (
    <main className="flex-1 bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
          {/* Left: Copy & CTAs */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in">
              <Star size={14} className="fill-indigo-700" />
              <span>The #1 Task Manager for 2026</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Master your day, <br />
              <span className="text-indigo-600">one task at a time.</span>
            </h1>

            <p className="text-lg lg:text-xl text-slate-500 font-medium max-w-2xl mb-10 leading-relaxed">
              Tasker helps you organize, plan, and action your daily adventure.
              From rapid journaling to complex project kanbans.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              {user ? (
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-white font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-105"
                >
                  Go to Dashboard <ArrowRight size={18} />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-white font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-105"
                  >
                    Start for Free <ArrowRight size={18} />
                  </Link>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-8 py-4 text-slate-700 font-bold hover:bg-slate-50 transition-all"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>

            {/* Social Proof */}
            <div className="mt-10 flex flex-wrap justify-center lg:justify-start items-center gap-6 opacity-60 grayscale">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Trusted by builders at
              </span>
              <div className="flex gap-4 font-bold text-slate-600 italic">
                GITHUB · VERCEL · LINEAR
              </div>
            </div>
          </div>

          {/* Right: Visual Carousel */}
          <div className="flex-1 w-full max-w-2xl">
            <div className="relative p-2 rounded-4xl bg-slate-100 border border-slate-200 shadow-2xl">
              <div className="overflow-hidden rounded-3xl bg-white aspect-4/3 lg:aspect-squar">
                <Carousel autoplay autoplaySpeed={4000} className="">
                  {slides.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "h-full flex flex-col items-center justify-center text-white gap-4 p-8 bg-linear-to-br transition-all",
                        item.color,
                      )}
                    >
                      <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic">
                        {item.title}
                      </h2>
                      <p className="text-lg lg:text-2xl font-semibold opacity-90 uppercase tracking-widest">
                        {item.text}
                      </p>
                      <div className="mt-8 h-1 w-24 bg-white/30 rounded-full" />
                    </div>
                  ))}
                </Carousel>
              </div>

              {/* Decorative UI elements */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">
                      Status
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      Task Completed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((f, i) => (
              <div
                key={i}
                className="group p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {f.title}
                </h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contextual Preview */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden rounded-[3rem] mx-4 mb-24">
        <div className="mx-auto max-w-7xl px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-4xl font-extrabold tracking-tight mb-8">
              Built for the <span className="text-indigo-400">Deep Work</span>{" "}
              era.
            </h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 flex shrink-0 items-center justify-center font-bold text-xs">
                  1
                </div>
                <p className="text-slate-400 text-lg">
                  <strong className="text-white">Capture</strong> thoughts in
                  the Journal before they vanish.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 flex shrink-0 items-center justify-center font-bold text-xs">
                  2
                </div>
                <p className="text-slate-400 text-lg">
                  <strong className="text-white">Organize</strong> into Kanban
                  boards or simple Lists.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 flex shrink-0 items-center justify-center font-bold text-xs">
                  3
                </div>
                <p className="text-slate-400 text-lg">
                  <strong className="text-white">Review</strong> your progress
                  with weekly automated insights.
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/10 aspect-video flex items-center justify-center italic text-white/20 font-bold">
            [ Insert Application Screenshot Here ]
          </div>
        </div>
      </section>

      {/* Fair Pricing */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-500 mb-16 font-medium">
            No hidden fees. Scale your productivity as you grow.
          </p>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  "flex flex-col p-8 rounded-3xl border transition-all duration-300",
                  tier.featured
                    ? "border-indigo-600 bg-white shadow-2xl shadow-indigo-100 ring-1 ring-indigo-600 scale-105"
                    : "border-slate-200 bg-slate-50/50 hover:border-slate-300",
                )}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-slate-900">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {tier.description}
                    </p>
                  </div>
                  {tier.featured && (
                    <span className="bg-indigo-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>

                <div className="text-left mb-8">
                  <span className="text-4xl font-black text-slate-900">
                    ${tier.price}
                  </span>
                  <span className="text-slate-400 font-medium ml-2">
                    /month
                  </span>
                </div>

                <ul className="flex-1 space-y-4 mb-8">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-3 text-sm font-medium text-slate-600"
                    >
                      <Check size={18} className="text-indigo-600 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={cn(
                    "w-full py-4 rounded-xl font-bold text-sm transition-all",
                    tier.featured
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
                  )}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden bg-indigo-600 rounded-[3rem] px-8 py-16 md:px-16 text-center">
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Ready to reclaim your focus?
            </h2>
            <p className="text-indigo-100 text-lg max-w-xl mx-auto mb-10 font-medium">
              Join 10,000+ builders using Tasker to organize their day. Start
              your 14-day Pro trial today.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-xl"
              >
                Get Started Now
              </Link>
              <Link
                href="/demo"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-400 transition-all border border-indigo-400"
              >
                View Interactive Demo
              </Link>
            </div>

            <p className="mt-8 text-indigo-200/60 text-xs font-medium uppercase tracking-widest">
              No credit card required · Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
