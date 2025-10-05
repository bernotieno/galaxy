"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HelpTooltip } from "@/components/help-tooltip"
import type { GameState } from "@/lib/game-types"
import {
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Zap,
  Star,
  CheckCircle,
  AlertTriangle,
  Gift
} from "lucide-react"

interface GameDashboardProps {
  gameState: GameState
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  progress: number
  target: number
  completed: boolean
  reward: string
}

interface Challenge {
  id: string
  name: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  timeLimit?: number
  reward: { money?: number; exp?: number; item?: string }
  progress: number
  target: number
  completed: boolean
}

export function GameDashboard({ gameState }: GameDashboardProps) {
  const [level, setLevel] = useState(1)
  const [experience, setExperience] = useState(0)
  const [streak, setStreak] = useState(0)

  // Calculate achievements based on game state
  const calculateAchievements = (): Achievement[] => {
    const totalCrops = gameState.farmGrid.flat().filter(cell => cell.crop).length
    const harvestedCrops = gameState.score.cropYield
    const sustainabilityScore = gameState.score.sustainability

    return [
      {
        id: "first_plant",
        name: "Green Thumb",
        description: "Plant your first crop",
        icon: "🌱",
        progress: totalCrops > 0 ? 1 : 0,
        target: 1,
        completed: totalCrops > 0,
        reward: "50 XP"
      },
      {
        id: "farmer",
        name: "Dedicated Farmer",
        description: "Plant 10 crops",
        icon: "🚜",
        progress: Math.min(totalCrops, 10),
        target: 10,
        completed: totalCrops >= 10,
        reward: "200 XP + Fertilizer Boost"
      },
      {
        id: "harvest_master",
        name: "Harvest Master",
        description: "Harvest 100 crops",
        icon: "🌾",
        progress: Math.min(harvestedCrops, 100),
        target: 100,
        completed: harvestedCrops >= 100,
        reward: "500 XP + Seed Pack"
      },
      {
        id: "eco_warrior",
        name: "Eco Warrior",
        description: "Maintain 90% sustainability",
        icon: "🌍",
        progress: sustainabilityScore >= 90 ? 1 : 0,
        target: 1,
        completed: sustainabilityScore >= 90,
        reward: "300 XP + Green Certification"
      },
      {
        id: "millionaire",
        name: "Farm Tycoon",
        description: "Earn $50,000",
        icon: "💰",
        progress: Math.min(gameState.resources.money, 50000),
        target: 50000,
        completed: gameState.resources.money >= 50000,
        reward: "1000 XP + Premium Tools"
      }
    ]
  }

  // Calculate daily challenges
  const calculateChallenges = (): Challenge[] => {
    return [
      {
        id: "daily_plant",
        name: "Daily Planter",
        description: "Plant 5 crops today",
        difficulty: "easy",
        timeLimit: 24,
        reward: { money: 500, exp: 100 },
        progress: 0, // Would track daily progress
        target: 5,
        completed: false
      },
      {
        id: "efficiency_expert",
        name: "Efficiency Expert",
        description: "Achieve 95% efficiency score",
        difficulty: "medium",
        reward: { money: 1000, exp: 250 },
        progress: gameState.score.efficiency,
        target: 95,
        completed: gameState.score.efficiency >= 95
      },
      {
        id: "drought_survivor",
        name: "Drought Survivor",
        description: "Survive 3 days with <20% soil moisture",
        difficulty: "hard",
        reward: { money: 2000, exp: 500, item: "Drought Resistant Seeds" },
        progress: 0, // Would track across days
        target: 3,
        completed: false
      }
    ]
  }

  const achievements = calculateAchievements()
  const challenges = calculateChallenges()
  const completedAchievements = achievements.filter(a => a.completed).length
  const totalAchievements = achievements.length

  useEffect(() => {
    // Calculate level and experience based on game progress
    const totalExp = gameState.score.cropYield * 10 + gameState.resources.money / 100
    const newLevel = Math.floor(totalExp / 1000) + 1
    setLevel(newLevel)
    setExperience(Math.floor(totalExp % 1000))
  }, [gameState])

  return (
    <div className="space-y-6">
      {/* Player Progress */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Farmer Level {level}
            <Badge variant="outline" className="ml-auto">
              {experience}/1000 XP
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={(experience / 1000) * 100} className="h-3" />

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">{streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">{completedAchievements}/{totalAchievements}</div>
              <div className="text-xs text-muted-foreground">Achievements</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-600">{level}</div>
              <div className="text-xs text-muted-foreground">Level</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500" />
            Daily Challenges
            <Badge variant="secondary" className="ml-auto">
              <Clock className="w-3 h-3 mr-1" />
              Resets in 12h
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`p-3 rounded-lg border transition-all ${
                challenge.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    {challenge.completed ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Target className="w-4 h-4" />}
                    {challenge.name}
                    <Badge
                      variant={challenge.difficulty === 'easy' ? 'default' : challenge.difficulty === 'medium' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {challenge.difficulty}
                    </Badge>
                  </h4>
                  <p className="text-xs text-muted-foreground">{challenge.description}</p>
                </div>
                {challenge.completed && <Gift className="w-5 h-5 text-yellow-500" />}
              </div>

              <div className="space-y-2">
                <Progress
                  value={(challenge.progress / challenge.target) * 100}
                  className="h-2"
                />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {challenge.progress}/{challenge.target}
                  </span>
                  <span className="font-medium text-green-600">
                    {challenge.reward.money && `$${challenge.reward.money}`}
                    {challenge.reward.exp && ` +${challenge.reward.exp} XP`}
                    {challenge.reward.item && ` +${challenge.reward.item}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Achievements
            <Badge variant="outline" className="ml-auto">
              {completedAchievements}/{totalAchievements}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-3 rounded-lg border transition-all ${
                achievement.completed
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    {achievement.name}
                    {achievement.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </h4>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  <div className="mt-2 space-y-1">
                    <Progress
                      value={(achievement.progress / achievement.target) * 100}
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {achievement.progress}/{achievement.target}
                      </span>
                      <span className="font-medium text-blue-600">
                        {achievement.reward}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Farm Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Crops:</span>
              <span className="font-bold">{gameState.farmGrid.flat().filter(cell => cell.crop).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ready to Harvest:</span>
              <span className="font-bold text-green-600">
                {gameState.farmGrid.flat().filter(cell => cell.crop?.stage === 'harvest').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Soil Quality:</span>
              <span className="font-bold">
                {Math.floor(gameState.farmGrid.flat().reduce((sum, cell) => sum + cell.soilQuality, 0) / 64)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Water Efficiency:</span>
              <span className="font-bold text-blue-600">
                {Math.floor((gameState.resources.water / 2000) * 100)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}