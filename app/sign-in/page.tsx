"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!password.trim()) {
      newErrors.password = "Password is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setError(null)
    
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setIsLoading(false)
      return
    }
    
    router.push("/chat")
  }

  const [showAutofill, setShowAutofill] = useState(true)

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black p-4 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md z-10">
        <Card className="border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardHeader className="space-y-4 pb-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 transform hover:scale-105 transition-transform duration-300">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold tracking-tight text-white">Welcome back</CardTitle>
              <CardDescription className="text-slate-400">Sign in to continue your conversations</CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-8">
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive-foreground">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 transition-colors ${errors.email ? "border-destructive" : ""}`}
                />
                {errors.email && (
                  <p className="text-xs font-medium text-destructive">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" title="password" className="text-slate-200">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 transition-colors ${errors.password ? "border-destructive pr-10" : "pr-10"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs font-medium text-destructive">{errors.password}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-6 pt-6 pb-8">
              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-11 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              <div className="flex flex-col items-center gap-2">
                <p className="text-center text-sm text-slate-400">
                  {"Don't have an account? "}
                  <Link href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors underline-offset-4 hover:underline">
                    Register
                  </Link>
                </p>
                <button 
                  type="button"
                  onClick={() => setShowAutofill(true)}
                  className="text-xs text-indigo-400/60 hover:text-indigo-400 transition-colors"
                >
                  Show Test Accounts
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Recruiter Autofill Popup */}
      {showAutofill && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 cursor-pointer"
          onClick={() => setShowAutofill(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl shadow-indigo-500/10 cursor-default"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Recruiter Access</h3>
              </div>
              <button 
                onClick={() => setShowAutofill(false)}
                className="rounded-full p-1 hover:bg-white/10 text-slate-400 transition-colors"
              >
                <EyeOff className="h-4 w-4" />
              </button>
            </div>
            
            <p className="text-sm text-slate-400 mb-6">
              Use these pre-configured accounts to explore the real-time chat features immediately.
            </p>

            <div className="space-y-3">
              {[
                { email: "ritesh763250@gmail.com", label: "Account A (Ritesh)" },
                { email: "chatgpteeai@gmail.com", label: "Account B (Vedansh)" }
              ].map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => {
                    setEmail(acc.email)
                    setPassword("@RK.com00")
                    setShowAutofill(false)
                  }}
                  className="w-full group flex items-center justify-between rounded-2xl bg-white/5 px-5 py-4 text-sm text-slate-300 transition-all hover:bg-indigo-600 hover:text-white border border-white/5 active:scale-[0.98]"
                >
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 group-hover:text-white/80 mb-0.5">{acc.label}</p>
                    <p className="font-medium truncate max-w-[220px]">{acc.email}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </button>
              ))}
            </div>
            
            <p className="mt-6 text-center text-[11px] text-slate-500">
              Password: <span className="text-slate-300 font-mono">@RK.com00</span>
            </p>
          </motion.div>
        </div>
      )}
    </div>
  )
}
