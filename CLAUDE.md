
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NASA Farm Simulation Game built with Next.js 15 and React 19. The game teaches sustainable agricultural practices using real-time NASA Earth observation data, including satellite imagery, soil moisture measurements, and climate data.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm install --legacy-peer-deps` - Install dependencies (resolves React 19 conflicts)

## Project Architecture

### Core Game System
The game engine is built around a singleton pattern with the main `FarmGameEngine` class in `lib/game-engine.ts`. This handles:
- Game state management with subscription-based updates
- Farm grid simulation (8x8 cell grid)
- Crop lifecycle management with realistic growth stages
- Resource management (water, fertilizer, seeds, money)
- Sustainability scoring system

### NASA API Integration
The `lib/nasa-api.ts` module provides:
- Authentication with NASA Earthdata Login
- AppEEARS API integration for soil moisture and vegetation data
- Mock data generators for development/testing
- Worldview snapshot URL generation

### State Management
- Uses React hook pattern with `hooks/use-game-state.ts`
- Game state flows through the singleton engine to React components
- Real-time updates via subscription pattern

### UI Architecture
- Next.js App Router with TypeScript
- Radix UI components with shadcn/ui styling
- Three main tabs: Farm management, Satellite data, Educational content
- Responsive design with Tailwind CSS

### Key Data Types
The `lib/game-types.ts` defines the core game entities:
- `FarmCell` - Individual grid cells with crop, soil data
- `Crop` - Growth stages, health, water levels
- `GameState` - Overall game state including resources and weather
- `CropType` - Five crop types with specific requirements

### Component Structure
- Main game interface in `app/page.tsx`
- Reusable UI components in `components/ui/`
- Game-specific components referenced from main page
- Tab-based navigation for different game modes

## NASA Data Integration

The game integrates with real NASA APIs for authentic Earth observation data:

### Live Data Sources
- **SMAP Soil Moisture** - Real-time soil moisture affects irrigation decisions
- **MODIS NDVI** - Vegetation health data influences crop growth
- **Land Surface Temperature** - Actual temperature data affects crop development

### Authentication Setup
1. Copy `.env.example` to `.env.local`
2. Sign up at https://urs.earthdata.nasa.gov/users/new
3. Add credentials to `.env.local`:
   ```
   NASA_EARTHDATA_USERNAME=your_username
   NASA_EARTHDATA_PASSWORD=your_password
   ```

### API Integration Features
- **Automatic fallback** to mock data if APIs unavailable
- **Smart data processing** converts raw NASA data to game mechanics
- **Real-time status monitoring** via NASA Status component
- **Manual authentication** option in game UI

### API Endpoints
- `/api/nasa/status` - Check authentication status (GET) or authenticate (POST)

## Game Mechanics

### Crop Management
- 5 crop types: wheat, corn, soybeans, cotton, rice
- Each crop has specific temperature, water, and growth requirements
- 6 growth stages from planted to harvest
- Health affected by water stress, temperature, and soil quality

### Sustainability System
- Tracks environmental impact of farming decisions
- Penalizes excessive irrigation and fertilizer use
- Rewards crop diversity and soil health maintenance
- Real-time scoring affects game progression

### Resource Economics
- Water and fertilizer management with costs
- Seed inventory tracking
- Market-based crop pricing with yield calculations
- Money earned through successful harvests

## Development Notes

- The project uses pnpm as package manager
- Built with Next.js 15 App Router and React 19
- TypeScript throughout with strict typing
- Uses Geist fonts for modern UI typography
- Vercel Analytics integration for usage tracking