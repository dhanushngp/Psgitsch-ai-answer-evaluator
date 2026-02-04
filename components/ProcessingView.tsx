import React, { useState, useEffect } from 'react';

const processingSteps = [
    "Uploading and securing your document...",
    "AI is reading the handwritten text...",
    "Identifying questions and answers...",
    "Evaluating the provided answers...",
    "Calculating scores and feedback...",
    "Finalizing the evaluation report..."
];

const ProcessingView: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [displayedText, setDisplayedText] = useState(processingSteps[0]);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsFading(true);
            setTimeout(() => {
                setCurrentStep(prev => {
                    const nextStep = (prev + 1) % processingSteps.length;
                    setDisplayedText(processingSteps[nextStep]);
                    setIsFading(false);
                    return nextStep;
                });
            }, 500); // Fade-out duration
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center text-white p-8">
            <div className="flex justify-center items-center space-x-2 h-24 mb-6">
              <div className="w-4 h-16 bg-blue-500 rounded-full animate-pulse-bar" style={{ animationDelay: '0s' }}></div>
              <div className="w-4 h-16 bg-blue-500 rounded-full animate-pulse-bar" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-4 h-16 bg-blue-500 rounded-full animate-pulse-bar" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <h2 className="text-2xl font-bold mb-2">AI Evaluation in Progress</h2>
            <p className="text-slate-300 max-w-md mb-6">
                Our AI is carefully analyzing your document. This may take a moment. Please be patient.
            </p>
            <div className="w-full max-w-md h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-full animate-shimmer"></div>
            </div>
            <p className={`mt-4 text-slate-400 font-medium transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                {displayedText}
            </p>
        </div>
    );
};

export default ProcessingView;