"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { SmoothScroll } from "@/components/ui/smooth-scroll"
import { Button } from "@/components/ui/button"
import { 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  Mic, 
  ArrowRight, 
  Github,
  Layout,
  Zap,
  Globe
} from "lucide-react"

export default function LandingPage() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#030303] text-white selection:bg-primary/30">
        {/* Navigation */}
        <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/20 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">TogetherMind</span>
            </div>
            <div className="hidden items-center gap-8 md:flex">
              <a href="#features" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">Features</a>
              <a href="#about" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">About</a>
              <Link href="/chat">
                <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
                  Launch App
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-600/20 blur-[128px]" />
            <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-violet-600/20 blur-[128px]" />
          </div>

          <div className="container relative z-10 mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-indigo-300">
                Next Generation Messaging
              </span>
              <h1 className="mt-8 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
                Chatting Reimagined <br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  With Intelligence.
                </span>
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-lg text-zinc-400 md:text-xl">
                A premium real-time communication platform built for modern teams. 
                Experience seamless messaging.
              </p>
              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/chat">
                  <Button size="lg" className="h-14 px-8 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold border-white/10 bg-white/5 hover:bg-white/10">
                    Login Now
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mt-24 relative"
            >
              <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">
                <div className="flex h-8 items-center gap-1.5 border-b border-white/5 bg-white/5 px-4">
                  <div className="h-2 w-2 rounded-full bg-red-500/50" />
                  <div className="h-2 w-2 rounded-full bg-amber-500/50" />
                  <div className="h-2 w-2 rounded-full bg-green-500/50" />
                </div>
                <img 
                  src="/preview.png" 
                  alt="App Preview" 
                  className="w-full object-cover opacity-80"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 relative">
          <div className="container mx-auto px-6">
            <div className="mb-20 text-center">
              <h2 className="text-3xl font-bold md:text-5xl">Engineered for Performance.</h2>
              <p className="mt-4 text-zinc-400">Everything you need in a modern messaging experience.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Direct & Group Chats",
                  desc: "Seamlessly switch between private DMs and collaborative group conversations.",
                  icon: MessageSquare,
                  color: "text-indigo-400"
                },
                {
                  desc: "Find friends and teammates instantly using their email address.",
                  icon: Zap,
                  color: "text-amber-400"
                },
                {
                  title: "Rich Messaging",
                  desc: "Reply to messages, delete sent items, and share documents with ease.",
                  icon: Layout,
                  color: "text-cyan-400"
                },
                {
                  title: "Supabase Backend",
                  desc: "Robust architecture built with Supabase for real-time data and security.",
                  icon: Globe,
                  color: "text-emerald-400"
                },
                {
                  title: "Dynamic Themes",
                  desc: "Full support for light and dark modes to suit your viewing preference.",
                  icon: Sparkles,
                  color: "text-purple-400"
                },
                {
                  title: "Next.js Powered",
                  desc: "Blazing fast performance and SEO optimization with Next.js 14+.",
                  icon: Zap,
                  color: "text-rose-400"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative rounded-3xl border border-white/5 bg-white/5 p-8 transition-colors hover:bg-white/[0.08]"
                >
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ${feature.color}`}>
                    {feature.icon ? <feature.icon className="h-6 w-6" /> : null}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-zinc-400">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About the Builder Section */}
        <section id="about" className="py-32 border-t border-white/5 bg-white/[0.02]">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl text-center lg:text-left">
                <h2 className="text-3xl font-bold md:text-5xl italic">Built with passion by Ritesh.</h2>
                <p className="mt-6 text-lg text-zinc-400 leading-relaxed">
                  This project was built to demonstrate proficiency in modern full-stack development. 
                  From real-time database architecture in Supabase to aesthetic frontend engineering 
                  with Next.js and Tailwind, every line of code is written to provide a premium user experience.
                </p>
                <div className="mt-8 flex justify-center lg:justify-start gap-4">
                  <a href="https://github.com/rtshk" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2 border-white/10 bg-white/5 hover:bg-white/10">
                      <Github className="h-5 w-5" /> GitHub
                    </Button>
                  </a>
                  <a href="https://www.linkedin.com/in/rtshkr/" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2 border-white/10 bg-white/5 hover:bg-white/10">
                      <Globe className="h-5 w-5" /> LinkedIn
                    </Button>
                  </a>
                </div>
              </div>
              <div className="relative aspect-square w-full max-w-[400px] rounded-3xl border border-white/10 bg-zinc-900 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="h-32 w-32 rounded-full border-4 border-indigo-500/40 mx-auto overflow-hidden shadow-2xl">
                        <img 
                          src="/dp.png" 
                          alt="Ritesh" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="mt-6 font-bold text-2xl text-white tracking-tight">Ritesh</p>
                      <p className="text-indigo-400 font-medium">Full Stack Developer</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12 text-center text-zinc-500">
          <p>© 2026 TogetherMind. Built for recruiters and tech enthusiasts.</p>
        </footer>
      </div>
    </SmoothScroll>
  )
}
