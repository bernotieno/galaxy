"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Menu,
  X,
  Moon,
  Sun,
  Sprout,
  Satellite,
  Leaf,
  Droplets,
  TrendingUp,
  Globe,
  GraduationCap,
  Zap,
  Trophy,
  Target,
  Star,
  Gamepad2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "next-themes"

export default function GeoHarvestLanding() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-card">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold font-[family-name:var(--font-poppins)]">
            <Sprout className="size-8 text-[hsl(145,65%,45%)]" />
            <span className="text-foreground text-xl">GeoHarvest</span>
            <Badge className="ml-2 bg-[hsl(45,100%,55%)] text-[hsl(220,40%,8%)] border-0">GAME</Badge>
          </div>

          <nav className="hidden md:flex gap-8">
            <Link
              href="#gameplay"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Gameplay
            </Link>
            <Link
              href="#missions"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Missions
            </Link>
            <Link
              href="#achievements"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Achievements
            </Link>
            <Link
              href="#leaderboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Leaderboard
            </Link>
          </nav>

          <div className="hidden md:flex gap-4 items-center">
            {/* <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              <span className="sr-only">Toggle theme</span>
            </Button> */}
            <Link href="https://lakegalaxygame.onrender.com/" target="_blank">
              <Button className="rounded-full bg-[hsl(45,100%,55%)] text-[hsl(220,40%,8%)] hover:bg-[hsl(45,100%,50%)] font-bold shadow-lg">
                <Gamepad2 className="size-4 mr-2" />
                Play Now
              </Button>
            </Link>
          </div>

          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border"
          >
            <div className="container py-4 flex flex-col gap-4">
              <Link
                href="#gameplay"
                className="py-2 text-sm font-medium text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gameplay
              </Link>
              <Link
                href="#missions"
                className="py-2 text-sm font-medium text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Missions
              </Link>
              <Link
                href="#achievements"
                className="py-2 text-sm font-medium text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Achievements
              </Link>
              <Link
                href="#leaderboard"
                className="py-2 text-sm font-medium text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Leaderboard
              </Link>
              <Link href="https://lakegalaxygame.onrender.com/" target="_blank">
                <Button className="w-full rounded-full bg-[hsl(45,100%,55%)] text-[hsl(220,40%,8%)] hover:bg-[hsl(45,100%,50%)] font-bold shadow-lg">
                  <Gamepad2 className="size-4 mr-2" />
                  Play Now
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-[url('/farm-field-aerial-view.jpg')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/80" />
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="mb-6 bg-white/0 text-white/50 border-white/30 text-sm px-4 py-1">
                <Zap className="size-3 mr-1" />
                FREE TO PLAY • NASA-POWERED
              </Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-foreground font-[family-name:var(--font-poppins)] text-balance">
                Build Your Farm Empire with Real NASA Satellite Data!
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Plant crops, unlock achievements, and climb the leaderboard while learning real climate science. Every
                decision matters in this epic farming adventure!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="https://lakegalaxygame.onrender.com/" target="_blank">
                  <Button
                    size="lg"
                    className="rounded-full h-14 px-10 text-lg bg-[hsl(45,100%,55%)] text-[hsl(220,40%,8%)] hover:bg-[hsl(45,100%,50%)] font-bold shadow-lg"
                  >
                    <Gamepad2 className="size-5 mr-2" />
                    START PLAYING NOW
                  </Button>
                </Link>
                {/* <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-14 px-10 text-lg font-semibold bg-transparent"
                >
                  Watch Trailer
                </Button> */}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-16 max-w-5xl mx-auto"
            >
              <div className="relative rounded-2xl overflow-hidden glass p-8 shadow-2xl">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Star className="size-6 text-[hsl(45,100%,55%)]" />
                  <h3 className="text-2xl font-bold text-foreground font-[family-name:var(--font-poppins)]">
                    Game Stats
                  </h3>
                  <Star className="size-6 text-[hsl(45,100%,55%)]" />
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 rounded-xl bg-accent/10 border border-accent hover:scale-105 transition-transform">
                    <Trophy className="size-12  mx-auto mb-3" />
                    <div className="text-4xl font-bold  mb-2">50+</div>
                    <div className="text-sm font-semibold text-foreground">Achievements to Unlock</div>
                    <div className="text-xs text-muted-foreground mt-1">Master Farmer, Eco Warrior & More</div>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-[hsl(145,65%,45%)]/10 border border-[hsl(145,65%,45%)]/20 hover:scale-105 transition-transform">
                    <Target className="size-12 text-[hsl(145,65%,45%)] mx-auto mb-3" />
                    <div className="text-4xl font-bold text-[hsl(145,65%,45%)] mb-2">100+</div>
                    <div className="text-sm font-semibold text-foreground">Daily Missions</div>
                    <div className="text-xs text-muted-foreground mt-1">New Challenges Every Day</div>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-[hsl(45,100%,55%)]/10 border border-[hsl(45,100%,55%)]/20 hover:scale-105 transition-transform">
                    <Satellite className="size-12 text-[hsl(45,100%,55%)] mx-auto mb-3" />
                    <div className="text-4xl font-bold text-[hsl(45,100%,55%)] mb-2">3</div>
                    <div className="text-sm font-semibold text-foreground">NASA Satellites</div>
                    <div className="text-xs text-muted-foreground mt-1">SMAP • MODIS • GPM</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="gameplay" className="w-full py-20 md:py-32 relative">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-[hsl(45,100%,55%)]/20 text-[hsl(45,100%,55%)] border-[hsl(45,100%,55%)]/30">
                HOW TO PLAY
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-[family-name:var(--font-poppins)]">
                Master the Gameplay Loop
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to farming greatness. Rinse and repeat to dominate the leaderboard!
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  title: "PLANT & GROW",
                  icon: <Sprout className="size-8" />,
                  description:
                    "Choose from wheat, corn, soybeans, and cotton. Each crop has unique growth patterns and profit potential. Plant wisely!",
                  color: "hsl(145,65%,45%)",
                  badge: "STEP 1",
                },
                {
                  title: "USE NASA DATA",
                  icon: <Satellite className="size-8" />,
                  description:
                    "Check real-time soil moisture, vegetation health (NDVI), and weather forecasts. Make data-driven decisions like a pro!",
                  color: "hsl(210,85%,55%)",
                  badge: "STEP 2",
                },
                {
                  title: "SCORE BIG",
                  icon: <Trophy className="size-8" />,
                  description:
                    "Harvest crops, earn coins, and boost your Sustainability Score. Unlock achievements and climb the global leaderboard!",
                  color: "white",
                  badge: "STEP 3",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                >
                  <Card className="h-full glass hover:border-muted transition-all hover:scale-105">
                    <CardContent className="p-8 flex flex-col items-center text-center relative">
                      <Badge className="absolute top-4 right-4 bg-white/0 text-white/30 border-white/30 text-xs">
                        {item.badge}
                      </Badge>
                      <div
                        className="size-16 rounded-full flex items-center justify-center mb-6"
                        style={{ backgroundColor: `${item.color}20`, color: item.color }}
                      >
                        {item.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-4 font-[family-name:var(--font-poppins)]">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="missions" className="w-full py-20 md:py-32 bg-gradient-to-b from-transparent to-card">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-white/0 text-white/30 border-white/30">DAILY CHALLENGES</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-[family-name:var(--font-poppins)]">
                Complete Epic Missions
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Take on daily challenges and special events to earn bonus rewards and XP!
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  title: "Water Wizard",
                  icon: <Droplets className="size-6" />,
                  description:
                    "Use NASA SMAP soil moisture data to optimize irrigation. Save water, boost yields, and earn the Water Conservation badge!",
                  reward: "+500 XP",
                },
                {
                  title: "Satellite Scout",
                  icon: <Satellite className="size-6" />,
                  description:
                    "Monitor crop health with MODIS NDVI data. Spot stress early and prevent crop failure. Unlock the Eagle Eye achievement!",
                  reward: "+750 XP",
                },
                {
                  title: "Climate Champion",
                  icon: <Globe className="size-6" />,
                  description:
                    "Use GPM precipitation forecasts to plan perfect planting schedules. Master the seasons and dominate the leaderboard!",
                  reward: "+1000 XP",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <Card className="h-full glass hover:scale-105 transition-transform">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="size-10 rounded-lg bg-[hsl(45,100%,55%)]/20 flex items-center justify-center text-[hsl(45,100%,55%)]">
                          {item.icon}
                        </div>
                        <h3 className="text-xl font-bold text-foreground font-[family-name:var(--font-poppins)]">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                      <Badge className="bg-[hsl(145,65%,45%)]/20 text-[hsl(145,65%,45%)] border-[hsl(145,65%,45%)]/30">
                        {item.reward}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="achievements"
          className="w-full py-20 md:py-32 bg-gradient-to-br from-[hsl(45,100%,55%)]/10 to-transparent"
        >
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-[hsl(145,65%,45%)]/20 text-[hsl(145,65%,45%)] border-[hsl(145,65%,45%)]/30">
                  UNLOCK REWARDS
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-[family-name:var(--font-poppins)]">
                  Level Up Your Sustainability Score!
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  It's not just about profit—it's about saving the planet! Every eco-friendly decision boosts your{" "}
                  <span className="text-[hsl(145,65%,45%)] font-bold">Sustainability Score</span> and unlocks exclusive
                  rewards.
                </p>
              </div>
              <Card className="glass">
                <CardContent className="p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-[hsl(145,65%,45%)]/10 rounded-xl p-6 border border-[hsl(145,65%,45%)]/20 hover:scale-105 transition-transform">
                      <div className="flex items-center gap-3 mb-3">
                        <Leaf className="size-6 text-[hsl(145,65%,45%)]" />
                        <h4 className="text-xl font-bold text-[hsl(145,65%,45%)]">Eco Warrior Badge</h4>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        Reach 1000 Sustainability Points to unlock green technologies and special crops!
                      </p>
                      <Badge className="bg-[hsl(145,65%,45%)]/20 text-[hsl(145,65%,45%)] border-0">+2000 XP</Badge>
                    </div>
                    <div className="bg-accent/10 rounded-xl p-6 border border hover:scale-105 transition-transform">
                      <div className="flex items-center gap-3 mb-3">
                        <TrendingUp className="size-6 " />
                        <h4 className="text-xl font-bold ">Carbon Neutral</h4>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        Reduce your farm's carbon footprint to zero and earn the ultimate achievement!
                      </p>
                      <Badge className="bg-accent/20 text-white border-white/30">+5000 XP</Badge>
                    </div>
                  </div>
                  <p className="text-center text-muted-foreground italic">
                    "The best farmers think long-term. Build a legacy that lasts!"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section id="leaderboard" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="mb-4 bg-[hsl(45,100%,55%)]/20 text-[hsl(45,100%,55%)] border-[hsl(45,100%,55%)]/30">
                COMPETE GLOBALLY
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-[family-name:var(--font-poppins)]">
                Climb the Global Leaderboard!
              </h2>
              <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
                Compete with farmers worldwide! Track your rank, compare scores, and prove you're the ultimate
                GeoHarvest champion.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { rank: "#1", name: "FarmKing2025", score: "15,420", badge: "Legend" },
                  { rank: "#2", name: "EcoWarrior", score: "14,890", badge: "Master" },
                  { rank: "#3", name: "DataFarmer", score: "13,750", badge: "Expert" },
                ].map((player, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="glass hover:border-[hsl(45,100%,55%)]/50 transition-all">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold mb-2">{player.rank}</div>
                        <div className="text-lg font-bold text-foreground mb-1">{player.name}</div>
                        <Badge className="mb-3 bg-accent/0 text-white/30 border-white/30">{player.badge}</Badge>
                        <div className="text-2xl font-bold text-[hsl(45,100%,55%)]">{player.score} pts</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32 bg-gradient-to-b from-transparent to-card">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <GraduationCap className="size-16 text-[hsl(45,100%,55%)] mx-auto mb-6" />
                <Badge className="mb-4 bg-accent/20 text-white/30 border-white/30">LEARN WHILE YOU PLAY</Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-[family-name:var(--font-poppins)]">
                  Level Up Your Brain Too!
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  GeoHarvest isn't just fun;it's educational! Learn real climate science, data analysis, and sustainable
                  farming while you play.
                </p>
              </div>

              <Card className="bg-gradient-to-br from-accent/10 to-[hsl(145,65%,45%)]/10 glass">
                <CardContent className="p-8 md:p-12">
                  <blockquote className="text-xl italic text-foreground mb-4">
                    "My students are OBSESSED! They're learning about NASA missions, climate data, and sustainability
                    without even realizing it. This game is a classroom game-changer!"
                  </blockquote>
                  <p className="text-muted-foreground font-semibold">
                    — Dr. Anya Sharma, Environmental Science Teacher
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-[hsl(45,100%,55%)]/20" />
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <Badge className="mb-6 bg-[hsl(45,100%,55%)]/20 text-[hsl(45,100%,55%)] border-[hsl(45,100%,55%)]/30 text-lg px-6 py-2">
                <Zap className="size-4 mr-2" />
                100% FREE • NO ADS • NO DOWNLOADS
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-[family-name:var(--font-poppins)] text-balance">
                Ready to Become a Farming Legend?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Join thousands of players building sustainable farms with real NASA data. Your adventure starts NOW!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="https://lakegalaxygame.onrender.com/" target="_blank">
                  <Button
                    size="lg"
                    className="rounded-full h-16 px-12 text-xl bg-[hsl(45,100%,55%)] text-[hsl(220,40%,8%)] hover:bg-[hsl(45,100%,50%)] font-bold shadow-2xl"
                  >
                    <Gamepad2 className="size-6 mr-2" />
                    START YOUR FARM NOW
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground">⚡ Play instantly in your browser</p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border bg-card/80 backdrop-blur-xl">
        <div className="container px-4 py-12 md:px-6">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold font-[family-name:var(--font-poppins)]">
                <Sprout className="size-8 text-[hsl(145,65%,45%)]" />
                <span className="text-foreground text-xl">GeoHarvest</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The ultimate NASA-powered farming game. Build, learn, and dominate!
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Game</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#gameplay" className="text-muted-foreground hover:text-foreground transition-colors">
                    How to Play
                  </Link>
                </li>
                <li>
                  <Link href="#missions" className="text-muted-foreground hover:text-foreground transition-colors">
                    Missions
                  </Link>
                </li>
                <li>
                  <Link href="#achievements" className="text-muted-foreground hover:text-foreground transition-colors">
                    Achievements
                  </Link>
                </li>
                <li>
                  <Link href="#leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">
                    Leaderboard
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Community</h4>
              <div className="flex gap-3">
                <Link
                  href="#"
                  className="size-10 rounded-full glass hover:bg-muted flex items-center justify-center text-foreground transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="size-10 rounded-full glass hover:bg-muted flex items-center justify-center text-foreground transition-colors"
                >
                  <span className="sr-only">Discord</span>
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 GeoHarvest. Powered by NASA Earth Science Data. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
