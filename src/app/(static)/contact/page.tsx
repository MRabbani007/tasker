"use client";

import { useState } from "react";
import { MessageSquare, LifeBuoy, Send, Loader2, Globe } from "lucide-react";

const contactMethods = [
  {
    title: "Technical Support",
    description: "Get help with your account or report a bug.",
    email: "support@tasker.com",
    icon: <LifeBuoy className="text-indigo-600" size={24} />,
  },
  {
    title: "Sales & Partnerships",
    description: "Looking to deploy Tasker for your whole team?",
    email: "sales@tasker.com",
    icon: <Globe className="text-emerald-600" size={24} />,
  },
  {
    title: "General Inquiries",
    description: "Feedback, press, or just want to say hi.",
    email: "hello@tasker.com",
    icon: <MessageSquare className="text-amber-500" size={24} />,
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSent(true);
  }

  return (
    <main className="flex-1 bg-white">
      {/* Hero Header */}
      <section className="py-20 lg:py-28 border-b border-slate-50 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
            How can we <span className="text-indigo-600">help you?</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Whether you have a question about features, pricing, or anything
            else, our team is ready to answer.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 flex flex-col lg:flex-row gap-16">
          {/* Left: Quick Access Cards */}
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              Reach out directly
            </h2>
            <div className="grid gap-6">
              {contactMethods.map((method, i) => (
                <div
                  key={i}
                  className="group p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-indigo-100/40 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      {method.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {method.title}
                      </h3>
                      <p className="text-sm text-slate-500 mb-1">
                        {method.description}
                      </p>
                      <a
                        href={`mailto:${method.email}`}
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
                      >
                        {method.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Modern Contact Form */}
          <div className="flex-1">
            <div className="p-8 lg:p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50">
              {!isSent ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                        Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="john@example.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How can we help?"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Send size={18} /> Send Message
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="py-12 text-center space-y-6 animate-in zoom-in duration-300">
                  <div className="mx-auto h-20 w-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                    <LifeBuoy size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Message Received!
                  </h3>
                  <p className="text-slate-500 max-w-xs mx-auto">
                    We&apos;ve received your inquiry and our team will get back
                    to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSent(false)}
                    className="text-sm font-bold text-indigo-600 hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
