import React, { useState } from 'react';

interface CEOSecurityCheckProps {
    onVerifySuccess: () => void;
    onLogout: () => void;
}

const CEOSecurityCheck: React.FC<CEOSecurityCheckProps> = ({ onVerifySuccess, onLogout }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const correctCode = "ceo112";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code === correctCode) {
            onVerifySuccess();
        } else {
            setError('Invalid verification code. Access denied.');
            setCode('');
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto view-fade-in">
             <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl p-8">
                 <div className="text-center mb-6">
                    <svg className="w-16 h-16 text-yellow-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-white mt-4">Secondary Verification</h2>
                    <p className="text-slate-300 mt-2">Enter the CEO verification code to access the admin dashboard.</p>
                 </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="ceo-code" className="sr-only">CEO Code</label>
                        <input
                            id="ceo-code"
                            type="password"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="block w-full px-3 py-3 bg-slate-900 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-center tracking-widest font-mono"
                            placeholder="••••••"
                            autoFocus
                        />
                    </div>

                    {error && <p className="text-sm text-red-400 bg-red-900/50 p-3 rounded-md text-center">{error}</p>}

                    <div className="flex flex-col gap-4">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 transition-colors"
                        >
                            Verify Access
                        </button>
                        <button
                            type="button"
                            onClick={onLogout}
                            className="w-full flex justify-center py-3 px-4 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-300 bg-transparent hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CEOSecurityCheck;
