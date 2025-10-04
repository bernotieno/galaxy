"use client"

import { useEffect, useRef } from "react"

export class SoundManager {
  private static instance: SoundManager
  private audioContext: AudioContext | null = null
  private gainNode: GainNode | null = null
  private enabled = true

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager()
    }
    return SoundManager.instance
  }

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioContext()
    }
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.gainNode = this.audioContext.createGain()
      this.gainNode.connect(this.audioContext.destination)
      this.gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime) // Set volume to 30%
    } catch (error) {
      console.warn('Audio context not supported:', error)
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(volume, this.audioContext!.currentTime)
    }
  }

  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext || !this.gainNode || !this.enabled) return

    const oscillator = this.audioContext.createOscillator()
    const envelope = this.audioContext.createGain()

    oscillator.connect(envelope)
    envelope.connect(this.gainNode)

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
    oscillator.type = type

    // Create envelope for smoother sound
    envelope.gain.setValueAtTime(0, this.audioContext.currentTime)
    envelope.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.01)
    envelope.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  private playSequence(frequencies: number[], duration: number = 0.1, interval: number = 0.05) {
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.createTone(freq, duration)
      }, index * interval * 1000)
    })
  }

  // Game sound effects
  plantCrop() {
    this.playSequence([200, 300, 400], 0.15, 0.05)
  }

  harvestCrop() {
    this.playSequence([400, 500, 600, 700], 0.2, 0.06)
  }

  irrigate() {
    this.playSequence([150, 180, 150, 180], 0.1, 0.08)
  }

  fertilize() {
    this.playSequence([300, 350, 400, 350, 300], 0.12, 0.04)
  }

  dayAdvance() {
    this.playSequence([220, 330, 440], 0.3, 0.1)
  }

  achievement() {
    this.playSequence([523, 659, 784, 1047], 0.4, 0.15)
  }

  warning() {
    this.playSequence([150, 100, 150, 100], 0.2, 0.1)
  }

  success() {
    this.playSequence([440, 554, 659, 880], 0.25, 0.08)
  }

  error() {
    this.createTone(120, 0.3, 'sawtooth')
  }

  levelUp() {
    this.playSequence([262, 330, 392, 523, 659, 784, 1047], 0.3, 0.1)
  }

  click() {
    this.createTone(800, 0.05, 'square')
  }

  hover() {
    this.createTone(600, 0.03, 'sine')
  }
}

interface SoundEffectsProps {
  children: React.ReactNode
}

export function SoundEffectsProvider({ children }: SoundEffectsProps) {
  const soundManager = useRef<SoundManager>()

  useEffect(() => {
    soundManager.current = SoundManager.getInstance()
  }, [])

  return <>{children}</>
}

// Hook for using sound effects
export function useSoundEffects() {
  const soundManager = useRef<SoundManager>()

  useEffect(() => {
    soundManager.current = SoundManager.getInstance()
  }, [])

  return {
    playPlantCrop: () => soundManager.current?.plantCrop(),
    playHarvestCrop: () => soundManager.current?.harvestCrop(),
    playIrrigate: () => soundManager.current?.irrigate(),
    playFertilize: () => soundManager.current?.fertilize(),
    playDayAdvance: () => soundManager.current?.dayAdvance(),
    playAchievement: () => soundManager.current?.achievement(),
    playWarning: () => soundManager.current?.warning(),
    playSuccess: () => soundManager.current?.success(),
    playError: () => soundManager.current?.error(),
    playLevelUp: () => soundManager.current?.levelUp(),
    playClick: () => soundManager.current?.click(),
    playHover: () => soundManager.current?.hover(),
    setVolume: (volume: number) => soundManager.current?.setVolume(volume),
    setEnabled: (enabled: boolean) => soundManager.current?.setEnabled(enabled),
  }
}