import React, { useState, useCallback, useEffect } from 'react';
import { AppState, EvaluationResult, User } from './types';
import { evaluateHandwriting } from './services/geminiService';
import FileUpload from './components/FileUpload';
import ProcessingView from './components/ProcessingView';
import ResultsView from './components/ResultsView';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import CEOWelcome from './components/CEOWelcome';
import CEOSecurityCheck from './components/CEOSecurityCheck';

// NOTE: This is a simple client-side user store for demonstration.
// In a real application, this should be handled by a secure backend service.
const getStoredUsers = (): User[] => {
    try {
        const users = localStorage.getItem('handwriting-eval-users');
        return users ? JSON.parse(users) : [];
    } catch (e) {
        return [];
    }
};

const storeUsers = (users: User[]) => {
    localStorage.setItem('handwriting-eval-users', JSON.stringify(users));
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'AUTH' | 'ADMIN' | 'EVALUATOR' | 'CEO_WELCOME' | 'CEO_SECURITY_CHECK'>('AUTH');

  useEffect(() => {
    const sessionUser = sessionStorage.getItem('handwriting-eval-user');
    const sessionIsAdmin = sessionStorage.getItem('handwriting-eval-isAdmin') === 'true';
    if (sessionUser) {
        // For security, always force CEO/Admin to re-authenticate on page load
        if (sessionIsAdmin) {
            handleLogout();
        } else {
            setCurrentUser(sessionUser);
            setIsAdmin(false);
            setCurrentView('EVALUATOR');
        }
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    // Hardcoded admin/CEO check
    if (email.toLowerCase() === 'dhanush31101@gmail.com' && password === 'test112') {
        setCurrentUser(email);
        setIsAdmin(true);
        setCurrentView('CEO_SECURITY_CHECK'); // Show security check first
        sessionStorage.setItem('handwriting-eval-user', email);
        sessionStorage.setItem('handwriting-eval-isAdmin', 'true');
        return { success: true };
    }

    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
        setCurrentUser(user.email);
        setIsAdmin(false);
        setCurrentView('EVALUATOR');
        sessionStorage.setItem('handwriting-eval-user', user.email);
        sessionStorage.setItem('handwriting-eval-isAdmin', 'false');
        return { success: true };
    }
    return { success: false, message: 'Invalid email or password.' };
  };

  const handleSignup = (email: string, password: string) => {
    const users = getStoredUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: 'An account with this email already exists.' };
    }
    const newUsers = [...users, { email, password }];
    storeUsers(newUsers);
    return handleLogin(email, password);
  };

  const handleLogout = () => {
      setCurrentUser(null);
      setIsAdmin(false);
      setCurrentView('AUTH');
      sessionStorage.removeItem('handwriting-eval-user');
      sessionStorage.removeItem('handwriting-eval-isAdmin');
      handleReset();
  };

  const handleFileUpload = useCallback((file: File) => {
    setCurrentFile(file);
    setError(null);
  }, []);

  const handleEvaluation = async () => {
    if (!currentFile) {
      setError("Please select a file first.");
      return;
    }

    setAppState(AppState.PROCESSING);
    setError(null);

    try {
      const result = await evaluateHandwriting(currentFile);
      setEvaluationResult(result);
      setAppState(AppState.RESULTS);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setCurrentFile(null);
    setEvaluationResult(null);
    setError(null);
  };

  const renderEvaluatorContent = () => {
    switch (appState) {
      case AppState.PROCESSING:
        return <ProcessingView />;
      case AppState.RESULTS:
        return evaluationResult ? <ResultsView result={evaluationResult} onReset={handleReset} /> : null;
      case AppState.ERROR:
      case AppState.IDLE:
      default:
        return (
          <div className="w-full max-w-2xl mx-auto">
             <header className="text-center mb-8 md:mb-12">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                      Evaluator <span className="text-blue-400">AI</span>
                  </h1>
                  <p className="mt-4 text-lg text-slate-300 max-w-3xl mx-auto">
                      Upload your handwritten assignments or notes for detailed feedback and a score.
                  </p>
              </header>
            <FileUpload onFileUpload={handleFileUpload} disabled={false} />
            {error && <p className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
            <div className="mt-8 text-center">
              <button
                onClick={handleEvaluation}
                disabled={!currentFile}
                className="px-10 py-4 font-bold text-lg text-white transition-all duration-300 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105 disabled:transform-none"
              >
                {'Start Evaluation'}
              </button>
            </div>
          </div>
        );
    }
  };
  
  const renderMainView = () => {
    switch (currentView) {
        case 'CEO_SECURITY_CHECK':
            return <CEOSecurityCheck onVerifySuccess={() => setCurrentView('CEO_WELCOME')} onLogout={handleLogout} />;
        case 'CEO_WELCOME':
            return <CEOWelcome onComplete={() => setCurrentView('ADMIN')} />;
        case 'ADMIN':
            return <AdminDashboard onLogout={handleLogout} onSwitchView={() => setCurrentView('EVALUATOR')} users={getStoredUsers()} />;
        case 'EVALUATOR':
            return (
                <div className="w-full">
                    <div className="absolute top-4 right-4 md:top-6 md:right-6 text-right">
                         <p className="text-sm text-slate-400">Logged in as:</p>
                         <p className="font-medium text-slate-200 mb-2">{currentUser}</p>
                       <button onClick={handleLogout} className="px-4 py-2 font-semibold text-white transition-colors bg-slate-700/80 rounded-md hover:bg-red-600">Logout</button>
                    </div>

                    <main className="w-full flex-grow flex items-center justify-center">
                       {renderEvaluatorContent()}
                    </main>
                </div>
            );
        case 'AUTH':
        default:
            return <Auth onLogin={handleLogin} onSignup={handleSignup} />;
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto flex-grow flex items-center justify-center view-fade-in">
        {renderMainView()}
      </div>
       <footer className="text-center text-slate-500 py-4 mt-auto">
          <p>Powered by Google Gemini</p>
        </footer>
    </div>
  );
};

export default App;
