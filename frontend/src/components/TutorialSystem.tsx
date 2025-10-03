'use client';

import { useState, useEffect } from 'react';

interface Tutorial {
  step: number;
  title: string;
  description: string;
  dataFocus: string;
  tip: string;
}

export default function TutorialSystem() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const response = await fetch('/api/tutorials');
        const result = await response.json();
        setTutorials(result);
      } catch (error) {
        console.error('Failed to fetch tutorials:', error);
      }
    };

    fetchTutorials();
  }, []);

  const nextStep = () => {
    if (currentStep < tutorials.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowTutorial(false);
      setCurrentStep(0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!showTutorial) {
    return (
      <button
        onClick={() => setShowTutorial(true)}
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg transition-colors z-50"
      >
        📚 Learn NASA Data
      </button>
    );
  }

  const tutorial = tutorials[currentStep];
  if (!tutorial) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-800">
            Step {tutorial.step}: {tutorial.title}
          </h2>
          <button
            onClick={() => setShowTutorial(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">Understanding the Data</h3>
            <p className="text-gray-700">{tutorial.description}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">💡 Pro Tip</h3>
            <p className="text-gray-700">{tutorial.tip}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / tutorials.length) * 100}%` }}
            />
          </div>
          <div className="text-sm text-gray-600 mt-2 text-center">
            {currentStep + 1} of {tutorials.length}
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={nextStep}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            {currentStep === tutorials.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}