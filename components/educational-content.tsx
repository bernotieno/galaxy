"use client"

import { TutorialCard } from "@/components/tutorial-card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Satellite, Droplets, Leaf, TrendingUp, Globe, Sprout, CloudRain, Sun } from "lucide-react"

export function EducationalContent() {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-bold">Learn Sustainable Farming</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover how NASA satellite data and technology help farmers around the world make better decisions for
          sustainable agriculture
        </p>
      </div>

      {/* NASA Satellite Data */}
      <TutorialCard
        title="NASA Satellite Data for Agriculture"
        description="Learn how satellites monitor Earth's farmlands from space"
        icon={Satellite}
        difficulty="beginner"
      >
        <div className="space-y-4">
          <p className="text-sm">
            NASA operates multiple satellites that continuously monitor Earth's surface, providing valuable data for
            farmers worldwide. This data helps optimize crop yields while protecting the environment.
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="smap">
              <AccordionTrigger className="text-sm font-semibold">SMAP - Soil Moisture Active Passive</AccordionTrigger>
              <AccordionContent className="text-sm space-y-2">
                <p>
                  Launched in 2015, SMAP measures soil moisture across the globe every 2-3 days. It uses radar and
                  radiometer instruments to detect water content in the top 5cm of soil.
                </p>
                <p className="font-medium">Why it matters:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Helps farmers decide when to irrigate</li>
                  <li>Predicts drought conditions</li>
                  <li>Reduces water waste by 20-30%</li>
                  <li>Improves crop yield predictions</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="modis">
              <AccordionTrigger className="text-sm font-semibold">MODIS - Vegetation Monitoring</AccordionTrigger>
              <AccordionContent className="text-sm space-y-2">
                <p>
                  MODIS (Moderate Resolution Imaging Spectroradiometer) aboard Terra and Aqua satellites captures images
                  of Earth's entire surface every 1-2 days.
                </p>
                <p className="font-medium">Key measurements:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>NDVI (Normalized Difference Vegetation Index) - measures plant health</li>
                  <li>Detects crop stress before visible to human eye</li>
                  <li>Monitors crop growth stages</li>
                  <li>Identifies pest or disease outbreaks early</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="landsat">
              <AccordionTrigger className="text-sm font-semibold">Landsat - Long-term Monitoring</AccordionTrigger>
              <AccordionContent className="text-sm space-y-2">
                <p>
                  The Landsat program has been collecting Earth imagery since 1972, providing the longest continuous
                  record of Earth's surface from space.
                </p>
                <p className="font-medium">Applications:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Track land use changes over decades</li>
                  <li>Monitor deforestation and reforestation</li>
                  <li>Assess irrigation efficiency</li>
                  <li>Study climate change impacts on agriculture</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </TutorialCard>

      {/* Soil Moisture */}
      <TutorialCard
        title="Understanding Soil Moisture"
        description="Why water management is crucial for sustainable farming"
        icon={Droplets}
        difficulty="beginner"
      >
        <div className="space-y-4">
          <p className="text-sm">
            Soil moisture is the amount of water held in the soil. Proper moisture levels are critical for crop health,
            and satellite data helps farmers optimize irrigation.
          </p>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 border rounded-lg">
              <div className="font-semibold text-red-600 mb-2">Too Dry (&lt;20%)</div>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Crop stress and wilting</li>
                <li>• Reduced growth rate</li>
                <li>• Lower yields</li>
                <li>• Increased vulnerability to pests</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg bg-green-50">
              <div className="font-semibold text-green-600 mb-2">Optimal (30-50%)</div>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Healthy root development</li>
                <li>• Maximum nutrient uptake</li>
                <li>• Strong plant growth</li>
                <li>• Best crop yields</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="font-semibold text-blue-600 mb-2">Too Wet (&gt;60%)</div>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Root rot and disease</li>
                <li>• Oxygen deprivation</li>
                <li>• Nutrient leaching</li>
                <li>• Soil erosion risk</li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-semibold mb-2">Game Tip:</p>
            <p className="text-sm text-muted-foreground">
              Monitor your soil moisture levels in the game. Use irrigation when levels drop below 30%, but avoid
              over-watering to maintain your sustainability score.
            </p>
          </div>
        </div>
      </TutorialCard>

      {/* NDVI and Crop Health */}
      <TutorialCard
        title="NDVI and Crop Health Monitoring"
        description="How satellites detect plant health from space"
        icon={Leaf}
        difficulty="intermediate"
      >
        <div className="space-y-4">
          <p className="text-sm">
            NDVI (Normalized Difference Vegetation Index) measures how much red and near-infrared light is reflected by
            plants. Healthy plants absorb red light and reflect infrared light.
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-20 h-8 bg-gradient-to-r from-red-500 to-green-600 rounded" />
              <div className="text-sm">
                <div className="font-semibold">NDVI Scale: -1 to +1</div>
                <div className="text-xs text-muted-foreground">Red = bare soil, Green = healthy vegetation</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="p-3 border rounded-lg">
                <div className="font-semibold mb-1">NDVI &lt; 0.2</div>
                <p className="text-xs text-muted-foreground">Bare soil, rocks, water, or dead vegetation</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-semibold mb-1">NDVI 0.2 - 0.5</div>
                <p className="text-xs text-muted-foreground">Sparse vegetation, grasslands, or stressed crops</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-semibold mb-1">NDVI 0.5 - 0.7</div>
                <p className="text-xs text-muted-foreground">Moderate vegetation, healthy crops in growth</p>
              </div>
              <div className="p-3 border rounded-lg bg-green-50">
                <div className="font-semibold mb-1">NDVI 0.7 - 0.9</div>
                <p className="text-xs text-muted-foreground">Dense, healthy vegetation at peak growth</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-semibold mb-2">Real-World Application:</p>
            <p className="text-sm text-muted-foreground">
              Farmers use NDVI maps to identify problem areas in their fields. A sudden drop in NDVI can indicate pest
              infestations, disease, or nutrient deficiencies - often before visible to the naked eye.
            </p>
          </div>
        </div>
      </TutorialCard>

      {/* Sustainable Farming Practices */}
      <TutorialCard
        title="Sustainable Farming Practices"
        description="Balance productivity with environmental protection"
        icon={TrendingUp}
        difficulty="intermediate"
      >
        <div className="space-y-4">
          <p className="text-sm">
            Sustainable farming meets current food needs without compromising future generations' ability to produce
            food. NASA data helps farmers achieve this balance.
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="precision">
              <AccordionTrigger className="text-sm font-semibold">Precision Agriculture</AccordionTrigger>
              <AccordionContent className="text-sm space-y-2">
                <p>Using satellite data to apply resources only where and when needed:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Variable rate irrigation - water only dry areas</li>
                  <li>Targeted fertilizer application - reduce chemical runoff</li>
                  <li>Pest management - treat only affected zones</li>
                  <li>Result: 15-30% reduction in water and fertilizer use</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="rotation">
              <AccordionTrigger className="text-sm font-semibold">Crop Rotation</AccordionTrigger>
              <AccordionContent className="text-sm space-y-2">
                <p>Growing different crops in sequence on the same land:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Prevents soil nutrient depletion</li>
                  <li>Breaks pest and disease cycles</li>
                  <li>Improves soil structure and health</li>
                  <li>Reduces need for chemical inputs</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="conservation">
              <AccordionTrigger className="text-sm font-semibold">Water Conservation</AccordionTrigger>
              <AccordionContent className="text-sm space-y-2">
                <p>Strategies to reduce water usage while maintaining yields:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Drip irrigation - 90% efficiency vs 60% for sprinklers</li>
                  <li>Mulching - reduces evaporation by 50-70%</li>
                  <li>Drought-resistant crop varieties</li>
                  <li>Timing irrigation based on satellite soil moisture data</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-semibold mb-2">In the Game:</p>
            <p className="text-sm text-muted-foreground">
              Your sustainability score reflects these practices. Excessive irrigation and fertilizer use lower your
              score. Try to maximize yields while minimizing resource use.
            </p>
          </div>
        </div>
      </TutorialCard>

      {/* Climate and Weather */}
      <TutorialCard
        title="Climate Change and Agriculture"
        description="How NASA helps farmers adapt to changing conditions"
        icon={Globe}
        difficulty="advanced"
      >
        <div className="space-y-4">
          <p className="text-sm">
            Climate change is altering growing seasons, precipitation patterns, and temperature ranges. NASA's Earth
            observation systems help farmers adapt to these changes.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Observed Changes:</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <Sun className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Average temperatures rising 0.2°C per decade</span>
                </li>
                <li className="flex gap-2">
                  <CloudRain className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>More frequent extreme weather events</span>
                </li>
                <li className="flex gap-2">
                  <Droplets className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Shifting precipitation patterns</span>
                </li>
                <li className="flex gap-2">
                  <Sprout className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Extended growing seasons in some regions</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Adaptation Strategies:</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Select heat and drought-tolerant crop varieties</li>
                <li>• Adjust planting dates based on temperature forecasts</li>
                <li>• Implement water storage and conservation systems</li>
                <li>• Diversify crops to spread climate risk</li>
                <li>• Use satellite data for early warning systems</li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-semibold mb-2">NASA's Role:</p>
            <p className="text-sm text-muted-foreground">
              NASA's Earth observation satellites provide critical data for climate models, helping predict future
              conditions and enabling farmers to make informed long-term decisions about crop selection and land
              management.
            </p>
          </div>
        </div>
      </TutorialCard>

      {/* Resources */}
      <div className="p-6 border rounded-lg bg-card">
        <h3 className="font-semibold mb-4">Additional Resources</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">NASA Resources:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• NASA Earth Observatory</li>
              <li>• AppEEARS Data Portal</li>
              <li>• NASA Harvest Program</li>
              <li>• Worldview Satellite Imagery</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Learn More:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• USDA Sustainable Agriculture</li>
              <li>• FAO Climate-Smart Agriculture</li>
              <li>• Precision Agriculture Basics</li>
              <li>• Water Conservation Techniques</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
