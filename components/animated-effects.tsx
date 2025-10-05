"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Droplets, Sparkles, Plus, TrendingUp, Award, Zap } from "lucide-react"

interface FloatingEffect {
  id: string
  type: "water" | "fertilizer" | "money" | "exp" | "achievement" | "damage"
  value?: string | number
  x: number
  y: number
  timestamp: number
}

interface AnimatedEffectsProps {
  className?: string
}

export function AnimatedEffectsProvider({ className }: AnimatedEffectsProps) {
  const [effects, setEffects] = useState<FloatingEffect[]>([])

  // Clean up old effects
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setEffects(prev => prev.filter(effect => now - effect.timestamp < 3000))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const addEffect = (effect: Omit<FloatingEffect, "id" | "timestamp">) => {
    const newEffect: FloatingEffect = {
      ...effect,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    }
    setEffects(prev => [...prev, newEffect])
  }

  // Expose addEffect globally
  useEffect(() => {
    ;(window as typeof window & { addFloatingEffect?: typeof addEffect }).addFloatingEffect = addEffect
  }, [])

  const getEffectIcon = (type: FloatingEffect["type"]) => {
    switch (type) {
      case "water":
        return <Droplets className="w-4 h-4 text-blue-500" />
      case "fertilizer":
        return <Sparkles className="w-4 h-4 text-green-500" />
      case "money":
        return <Plus className="w-4 h-4 text-green-600" />
      case "exp":
        return <TrendingUp className="w-4 h-4 text-purple-500" />
      case "achievement":
        return <Award className="w-4 h-4 text-yellow-500" />
      case "damage":
        return <Zap className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getEffectColor = (type: FloatingEffect["type"]) => {
    switch (type) {
      case "water":
        return "text-blue-500 border-blue-500 bg-blue-50"
      case "fertilizer":
        return "text-green-500 border-green-500 bg-green-50"
      case "money":
        return "text-green-600 border-green-600 bg-green-50"
      case "exp":
        return "text-purple-500 border-purple-500 bg-purple-50"
      case "achievement":
        return "text-yellow-500 border-yellow-500 bg-yellow-50"
      case "damage":
        return "text-red-500 border-red-500 bg-red-50"
      default:
        return "text-gray-500 border-gray-500 bg-gray-50"
    }
  }

  return (
    <div className={cn("fixed inset-0 pointer-events-none z-50", className)}>
      {effects.map((effect) => (
        <div
          key={effect.id}
          className={cn(
            "absolute flex items-center gap-1 px-2 py-1 rounded-md border text-sm font-semibold",
            "animate-bounce transform transition-all duration-3000 ease-out",
            getEffectColor(effect.type)
          )}
          style={{
            left: `${effect.x}px`,
            top: `${effect.y}px`,
            animation: "floatUp 3s ease-out forwards",
            transform: `translateY(0px) scale(1)`,
          }}
        >
          {getEffectIcon(effect.type)}
          {effect.value && <span>{effect.value}</span>}
        </div>
      ))}

      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-80px) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

// Utility functions to trigger effects
export const triggerFloatingEffect = (
  type: FloatingEffect["type"],
  value: string | number,
  element?: HTMLElement
) => {
  if (typeof window === 'undefined') return

  let x = window.innerWidth / 2
  let y = window.innerHeight / 2

  if (element) {
    const rect = element.getBoundingClientRect()
    x = rect.left + rect.width / 2
    y = rect.top + rect.height / 2
  }

  ;(window as typeof window & { addFloatingEffect?: (effect: Omit<FloatingEffect, "id" | "timestamp">) => void }).addFloatingEffect?.({
    type,
    value,
    x: x + (Math.random() - 0.5) * 40, // Add some randomness
    y: y + (Math.random() - 0.5) * 40,
  })
}

// Specific effect triggers
export const effects = {
  water: (amount: number, element?: HTMLElement) =>
    triggerFloatingEffect("water", `-${amount}L`, element),

  fertilizer: (amount: number, element?: HTMLElement) =>
    triggerFloatingEffect("fertilizer", `-${amount}kg`, element),

  money: (amount: number, element?: HTMLElement) =>
    triggerFloatingEffect("money", `+$${amount}`, element),

  exp: (amount: number, element?: HTMLElement) =>
    triggerFloatingEffect("exp", `+${amount} XP`, element),

  achievement: (name: string, element?: HTMLElement) =>
    triggerFloatingEffect("achievement", name, element),

  damage: (amount: number, element?: HTMLElement) =>
    triggerFloatingEffect("damage", `-${amount}`, element),
}

// Particle system for more complex animations
interface Particle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

export function ParticleSystem({ className }: { className?: string }) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.1, // gravity
            life: p.life - 1
          }))
          .filter(p => p.life > 0)
      )
    }, 16) // ~60fps

    return () => clearInterval(interval)
  }, [])

  const createParticles = (x: number, y: number, count: number, color: string) => {
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Math.random().toString(36),
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4 - 2,
        life: 60,
        maxLife: 60,
        color,
        size: Math.random() * 3 + 2
      })
    }
    setParticles(prev => [...prev, ...newParticles])
  }

  // Expose particle creation globally
  useEffect(() => {
    ;(window as typeof window & { createParticles?: typeof createParticles }).createParticles = createParticles
  }, [])

  return (
    <div className={cn("fixed inset-0 pointer-events-none z-40", className)}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.life / particle.maxLife,
          }}
        />
      ))}
    </div>
  )
}

// Celebration effect
export const celebrate = (element?: HTMLElement) => {
  if (typeof window === 'undefined') return

  let x = window.innerWidth / 2
  let y = window.innerHeight / 2

  if (element) {
    const rect = element.getBoundingClientRect()
    x = rect.left + rect.width / 2
    y = rect.top + rect.height / 2
  }

  // Create colorful particles
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
  colors.forEach((color, index) => {
    setTimeout(() => {
      ;(window as typeof window & { createParticles?: (x: number, y: number, count: number, color: string) => void }).createParticles?.(x, y, 10, color)
    }, index * 50)
  })
}