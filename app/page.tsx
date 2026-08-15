"use client";

import { motion } from "framer-motion";
import { ChevronDown, Clock, Heart, Compass, Sparkles, CheckCircle, ArrowRight, Mail, Instagram, Youtube, Podcast } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail("");
    }, 3000);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.15 } },
    viewport: { once: true, margin: "-100px" },
  };

  return (
    <main className="min-h-screen bg-ivory">
      {/* Hero Section - Full Image (entire image links to registration) */}
      <section className="relative w-full overflow-hidden bg-ivory">
        <a
          href="https://command-shift-app.vercel.app/register"
          aria-label="Register free for The Command Shift 21-Day Challenge"
          className="block w-full cursor-pointer"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full"
          >
            <img
              src="/hero-image.jpg"
              alt="The Command Shift - 21 Day Challenge with AmiLynne Carroll"
              className="w-full h-auto"
            />
          </motion.div>
        </a>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="font-ui text-[11px] uppercase tracking-eyebrow text-plum mb-4">The Problem</p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-indigo-rich">
              The scramble isn&apos;t a character flaw
            </h2>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8"
          >
            <motion.p variants={fadeInUp} className="font-body text-xl text-indigo-rich/80 leading-relaxed text-center">
              It&apos;s a signal. A yellow light saying: <em>something needs your attention</em>.
            </motion.p>
            
            <motion.p variants={fadeInUp} className="font-body text-lg text-indigo-rich/70 leading-relaxed text-center max-w-3xl mx-auto">
              You wake up already behind. Your calendar owns you. Your energy is scattered across a dozen half-finished priorities. You&apos;re not lazy—you&apos;re <em>reactive</em>. And reactivity is exhausting.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="bg-lavender/30 rounded-lg p-8 my-12">
              <p className="font-body text-xl text-indigo-rich text-center italic leading-relaxed">
                &ldquo;The scramble is what happens when we&apos;re trying to survive our own lives instead of commanding them.&rdquo;
              </p>
            </motion.div>
            
            <motion.p variants={fadeInUp} className="font-body text-lg text-indigo-rich/70 leading-relaxed text-center max-w-3xl mx-auto">
              You don&apos;t need more discipline. You don&apos;t need another productivity hack. You need a <strong>shift in how you relate to your own life</strong>.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* The Shift Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-indigo-rich">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="font-ui text-[11px] uppercase tracking-eyebrow text-gold mb-4">The Shift</p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-ivory">
              From white-knuckling to aligned command
            </h2>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.div variants={fadeInUp} className="bg-indigo/50 p-8 rounded-lg border border-gold/20">
              <h3 className="font-display text-2xl font-semibold text-gold mb-4">What You&apos;re Leaving</h3>
              <ul className="space-y-3 font-body text-ivory/80">
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">•</span>
                  <span>Waking up in emergency mode</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">•</span>
                  <span>Saying yes to everything</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">•</span>
                  <span>Energy scattered, focus fractured</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">•</span>
                  <span>Living by other people&apos;s urgency</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="bg-gold/10 p-8 rounded-lg border border-gold/30">
              <h3 className="font-display text-2xl font-semibold text-gold mb-4">What You&apos;re Moving Toward</h3>
              <ul className="space-y-3 font-body text-ivory">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <span>Intentional morning command</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <span>Clear yeses and empowered nos</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <span>Energy directed, focus protected</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <span>Living by your own aligned priorities</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What It Is Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-ivory">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="font-ui text-[11px] uppercase tracking-eyebrow text-plum mb-4">What It Is</p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-indigo-rich mb-6">
              A 21-day recalibration
            </h2>
            <p className="font-body text-xl text-indigo-rich/70 max-w-2xl mx-auto">
              Not a course. Not a bootcamp. A <em>practice</em>—delivered daily, designed to fit into the life you already have.
            </p>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-3 gap-6"
          >
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-lg shadow-sm border border-lavender/50 text-center">
              <Clock className="w-10 h-10 text-teal mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-indigo-rich mb-2">Daily Practice</h3>
              <p className="font-body text-indigo-rich/70">10-15 minutes of guided reflection and aligned action</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-lg shadow-sm border border-lavender/50 text-center">
              <Heart className="w-10 h-10 text-plum mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-indigo-rich mb-2">Inner Work</h3>
              <p className="font-body text-indigo-rich/70">Examine patterns, reclaim agency, build new rhythms</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-lg shadow-sm border border-lavender/50 text-center">
              <Compass className="w-10 h-10 text-gold mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-indigo-rich mb-2">Practical Tools</h3>
              <p className="font-body text-indigo-rich/70">Worksheets, prompts, and frameworks you keep forever</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="font-ui text-[11px] uppercase tracking-eyebrow text-plum mb-4">How It Works</p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-indigo-rich">
              Three weeks. Three shifts.
            </h2>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center">
                <span className="font-display text-2xl font-semibold text-teal">1</span>
              </div>
              <div className="flex-1 bg-lavender/20 p-8 rounded-lg">
                <h3 className="font-display text-2xl font-semibold text-indigo-rich mb-3">Week 1: Recognition</h3>
                <p className="font-body text-lg text-indigo-rich/70 leading-relaxed">
                  See your current patterns clearly. Where does reactivity show up? What triggers the scramble? You&apos;ll map your energy leaks and identify your personal yellow lights.
                </p>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-plum/10 flex items-center justify-center">
                <span className="font-display text-2xl font-semibold text-plum">2</span>
              </div>
              <div className="flex-1 bg-lavender/20 p-8 rounded-lg">
                <h3 className="font-display text-2xl font-semibold text-indigo-rich mb-3">Week 2: Reclamation</h3>
                <p className="font-body text-lg text-indigo-rich/70 leading-relaxed">
                  Take back your time, attention, and energy. Practice empowered boundaries. Build your morning command ritual. Learn to pause before reacting.
                </p>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
                <span className="font-display text-2xl font-semibold text-gold">3</span>
              </div>
              <div className="flex-1 bg-lavender/20 p-8 rounded-lg">
                <h3 className="font-display text-2xl font-semibold text-indigo-rich mb-3">Week 3: Integration</h3>
                <p className="font-body text-lg text-indigo-rich/70 leading-relaxed">
                  Anchor the practices into sustainable rhythms. Create your personal Command Framework. Design your ongoing support system for continued aligned living.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-ivory">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="font-ui text-[11px] uppercase tracking-eyebrow text-plum mb-4">What You Get</p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-indigo-rich">
              Daily deliverables
            </h2>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {[
              { icon: Sparkles, title: "Daily Audio Teaching", desc: "5-7 minutes of guided insight from Babs" },
              { icon: CheckCircle, title: "Practice Prompt", desc: "One aligned action to take that day" },
              { icon: Compass, title: "Reflection Question", desc: "Journal prompt for deeper self-awareness" },
              { icon: Heart, title: "Community Support", desc: "Optional sharing in private community space" },
              { icon: Clock, title: "Lifetime Access", desc: "Keep all materials and revisit anytime" },
              { icon: ArrowRight, title: "Bonus Resources", desc: "Worksheets, frameworks, and integration tools" },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-lavender/50 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-indigo-rich" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-indigo-rich mb-1">{item.title}</h3>
                  <p className="font-body text-indigo-rich/70">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-indigo-rich">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="font-ui text-[11px] uppercase tracking-eyebrow text-gold mb-4">Who It&apos;s For</p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-ivory">
              This is for you if...
            </h2>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-4"
          >
            {[
              "You're tired of living in reactive mode",
              "You know there's a more aligned way but don't know how to get there",
              "You've tried productivity systems that didn't stick",
              "You want practical tools rooted in spiritual wisdom",
              "You're ready to command your life instead of surviving it",
              "You value community and shared journey",
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex items-center gap-4 bg-indigo/30 p-6 rounded-lg border border-gold/20"
              >
                <CheckCircle className="w-6 h-6 text-gold flex-shrink-0" />
                <p className="font-body text-lg text-ivory">{item}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-ivory">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="font-ui text-[11px] uppercase tracking-eyebrow text-plum mb-4">Your Guide</p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-indigo-rich">
              Meet AmiLynne Carroll
            </h2>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            <motion.div variants={fadeInUp} className="flex-shrink-0">
              <div className="w-64 h-64 rounded-full overflow-hidden bg-gradient-to-br from-lavender to-plum/30">
                <img
                  src="https://ik.imagekit.io/amilynne/Babs%20Headshots/ChatGPT%20Image%20May%2022,%202026,%2002_09_12%20PM.png?updatedAt=1780355364768"
                  alt="AmiLynne Carroll (Babs)"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex-1 space-y-6">
              <p className="font-body text-xl text-indigo-rich/80 leading-relaxed">
                Also known as &ldquo;Babs,&rdquo; AmiLynne is the creator of LifeCharter and founder of Sacred Kaleidoscope Community. She&apos;s an Alignment Architect who helps people move from fear, self-doubt, and survival patterns into purpose, clarity, and aligned action.
              </p>
              <p className="font-body text-lg text-indigo-rich/70 leading-relaxed">
                Through her daily podcast <em>Conversations of Consequence</em>, her coaching work, and her writing, Babs has guided thousands toward remembering who they are and choosing their next aligned step.
              </p>
              <p className="font-body text-lg text-indigo-rich/70 leading-relaxed">
                Her approach blends spiritual wisdom with practical tools—because transformation happens when the inner and outer work meet.
              </p>
              <p className="font-display text-2xl text-plum italic">
                &ldquo;Head up, wings out.&rdquo;
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="font-ui text-[11px] uppercase tracking-eyebrow text-plum mb-4">FAQ</p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-indigo-rich">
              Questions & Answers
            </h2>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6"
          >
            {[
              {
                q: "How much time will this take each day?",
                a: "The daily practice is designed to take 10-15 minutes. The audio teaching is 5-7 minutes, and the reflection/action prompts take another 5-10 minutes. It's built to fit into busy lives.",
              },
              {
                q: "What if I fall behind?",
                a: "Life happens. You'll have lifetime access to all materials, so you can go at your own pace. The community and live elements are time-bound, but the core content is yours forever.",
              },
              {
                q: "Is this a religious program?",
                a: "No. The Command Shift is spiritually grounded but not religious. We work with universal principles of alignment, presence, and intentional living that can complement any faith tradition or none at all.",
              },
              {
                q: "What's the difference between this and LifeCharter?",
                a: "LifeCharter is Babs' comprehensive lifestyle design system covering all 12 dimensions of life. The Command Shift is a focused 21-day intensive specifically on moving from reactivity to command. It's a powerful entry point and also complements deeper LifeCharter work.",
              },
              {
                q: "Will there be live calls?",
                a: "Yes — Alignment Calls are open to everyone and run weekly on Thursdays at 1:00 PM Mountain Time on Zoom. Come connect live with Babs and the community, ask your questions, and get support as you make your shift.",
              },
              {
                q: "What if it's not for me?",
                a: "The Command Shift is completely free — there's no cost and nothing to refund. Give it the first week; if it's not your fit, simply step away, no strings attached. Whatever clarity you build in that time is yours to keep.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-lavender/20 p-8 rounded-lg"
              >
                <h3 className="font-display text-xl font-semibold text-indigo-rich mb-3">{faq.q}</h3>
                <p className="font-body text-indigo-rich/70 leading-relaxed">{faq.a}</p>
                {faq.q === "Will there be live calls?" && (
                  <a
                    href="https://us02web.zoom.us/j/87052226903?pwd=4KdrLaVD6cpAHgGLawKVh5voPFoJQn.1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 font-ui text-sm font-semibold text-plum hover:text-indigo-rich"
                  >
                    Join the Alignment Call — Thursdays, 1 PM MT →
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="join" className="py-24 px-4 sm:px-6 lg:px-8 bg-indigo-rich">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <p className="font-ui text-[11px] uppercase tracking-eyebrow text-gold mb-4">Ready to Shift?</p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-ivory mb-6">
              Your command begins now
            </h2>
            <p className="font-body text-xl text-ivory/80 mb-4">
              21 days. One shift. A new way of being.
            </p>
            <p className="font-body text-lg text-ivory/60 mb-10">
              Registrations are live now.
            </p>
          </motion.div>
          
          <motion.div {...fadeInUp}>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-6 py-4 rounded-sm font-body text-indigo-rich bg-ivory border-0 focus:ring-2 focus:ring-gold outline-none"
                />
                <button
                  type="submit"
                  className="bg-gold text-indigo-rich font-ui text-xs uppercase tracking-button font-semibold px-8 py-4 rounded-sm hover:bg-gold-rich transition-all duration-300 hover:shadow-lg whitespace-nowrap"
                >
                  {isSubmitted ? "You're on the list!" : "Notify Me"}
                </button>
              </div>
            </form>
            <p className="font-body text-sm text-ivory/50 mt-4">
              No spam. Unsubscribe anytime. Your information is protected.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-indigo border-t border-gold/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h3 className="font-display text-2xl font-semibold text-ivory mb-2">The Command Shift</h3>
              <p className="font-body text-ivory/60">A Sacred Kaleidoscope Community offering</p>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-ivory/60 hover:text-gold transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-ivory/60 hover:text-gold transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
              <a href="#" className="text-ivory/60 hover:text-gold transition-colors">
                <Podcast className="w-6 h-6" />
              </a>
              <a href="#" className="text-ivory/60 hover:text-gold transition-colors">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          <div className="border-t border-gold/10 mt-8 pt-8 text-center">
            <p className="font-body text-sm text-ivory/40">
              © {new Date().getFullYear()} Sacred Kaleidoscope Community LLC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
