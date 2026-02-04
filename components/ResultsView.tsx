import React, { useState, useEffect } from 'react';
import { EvaluationResult, QAPair } from '../types';
import StreamedText from './StreamedText';

interface ResultsViewProps {
  result: EvaluationResult;
  onReset: () => void;
}

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  const percentage = score * 10;
  const circumference = 2 * Math.PI * 45;
  const [strokeDashoffset, setStrokeDashoffset] = useState(circumference);

  useEffect(() => {
    const finalOffset = circumference - (percentage / 100) * circumference;
    // Delay the animation start slightly for better visual effect
    const timer = setTimeout(() => setStrokeDashoffset(finalOffset), 100);
    return () => clearTimeout(timer);
  }, [score, percentage, circumference]);


  let colorClass = 'stroke-green-500';
  if (score < 7) colorClass = 'stroke-yellow-500';
  if (score < 4) colorClass = 'stroke-red-500';

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-slate-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          className={`${colorClass} transition-all duration-1000 ease-out`}
          strokeWidth="10"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white">{score.toFixed(1)}</span>
        <span className="text-sm text-slate-400">/ 10</span>
      </div>
    </div>
  );
};

const QACard: React.FC<{ qa: QAPair; index: number }> = ({ qa, index }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, index * 150); // Staggered delay
        return () => clearTimeout(timer);
    }, [index]);


    let scoreColor = 'bg-green-500/20 text-green-300';
    if (qa.score < 7) scoreColor = 'bg-yellow-500/20 text-yellow-300';
    if (qa.score < 4) scoreColor = 'bg-red-500/20 text-red-300';

  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-lg p-6 mb-4 transition-all duration-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} hover:shadow-lg hover:shadow-blue-900/20 hover:-translate-y-1`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-blue-400">Question {index + 1}</h3>
        <div className={`px-3 py-1 text-sm font-bold rounded-full ${scoreColor}`}>
          Score: {qa.score}/10
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">Identified Question:</p>
          <p className="text-slate-200 bg-slate-900/50 p-3 rounded-md">{qa.question}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">Your Answer:</p>
          <p className="text-slate-200 bg-slate-900/50 p-3 rounded-md">{qa.answer}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">AI Feedback:</p>
          <StreamedText text={qa.feedback} />
        </div>
      </div>
    </div>
  );
};


const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl p-6 md:p-8 mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Evaluation Complete</h2>
        <p className="text-slate-300 mb-6">Here is the AI-powered analysis of your work.</p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <ScoreCircle score={result.overallScore} />
            <div className="text-left max-w-md">
                <h3 className="text-xl font-semibold text-white mb-2">Overall Score</h3>
                <p className="text-slate-300">{result.generalFeedback}</p>
            </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Detailed Breakdown</h3>
        {result.evaluations.map((qa, index) => (
          <QACard key={index} qa={qa} index={index} />
        ))}
      </div>
      
      <div className="text-center">
         <button
          onClick={onReset}
          className="px-8 py-3 font-bold text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transform hover:scale-105"
        >
          Evaluate Another Document
        </button>
      </div>
    </div>
  );
};

export default ResultsView;