import React, { useState } from 'react';
import { User } from '../types';

interface AdminDashboardProps {
    onLogout: () => void;
    onSwitchView: () => void;
    users: User[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onSwitchView, users }) => {
    const [showPasswords, setShowPasswords] = useState(false);
    const [isPromptingForCode, setIsPromptingForCode] = useState(false);
    const [codeInput, setCodeInput] = useState('');
    const [codeError, setCodeError] = useState('');
    const correctCode = "977845997828";

    const handleToggleClick = () => {
        if (showPasswords) {
            setShowPasswords(false);
        } else {
            setIsPromptingForCode(true);
            setCodeInput('');
            setCodeError('');
        }
    };

    const handleCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (codeInput === correctCode) {
            setShowPasswords(true);
            setIsPromptingForCode(false);
        } else {
            setCodeError('Invalid code. Access denied.');
        }
    };

    const handleCancelPrompt = () => {
        setIsPromptingForCode(false);
        setCodeInput('');
        setCodeError('');
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-white">
            {isPromptingForCode && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 view-fade-in">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold text-white mb-2">Security Verification</h3>
                        <p className="text-sm text-slate-400 mb-4">Please enter the 12-digit security code to view passwords.</p>
                        <form onSubmit={handleCodeSubmit}>
                            <input
                                type="password"
                                value={codeInput}
                                onChange={(e) => setCodeInput(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter security code"
                                maxLength={12}
                                autoFocus
                            />
                            {codeError && <p className="text-red-400 text-sm mt-2">{codeError}</p>}
                            <div className="flex justify-end gap-4 mt-6">
                                <button type="button" onClick={handleCancelPrompt} className="px-4 py-2 text-sm font-semibold rounded-md bg-slate-600 hover:bg-slate-500 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 text-sm font-semibold rounded-md bg-blue-600 hover:bg-blue-700 transition-colors">
                                    Verify
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl p-6 md:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-slate-400">Welcome, Developer!</p>
                    </div>
                    <div className="flex gap-4">
                       <button
                         onClick={onSwitchView}
                         className="px-4 py-2 font-semibold text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500"
                        >
                            Go to App
                        </button>
                        <button
                         onClick={onLogout}
                         className="px-4 py-2 font-semibold text-white transition-colors bg-slate-700 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-lg">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
                        <div>
                           <h2 className="text-xl font-semibold text-blue-400">Registered User Monitoring</h2>
                            <p className="text-sm text-slate-400 mt-1">
                                An access code is required to view passwords.
                            </p>
                        </div>
                        <button
                            onClick={handleToggleClick}
                            className="px-4 py-2 text-sm font-semibold text-white transition-colors bg-slate-700 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 self-start sm:self-center shrink-0"
                        >
                            {showPasswords ? 'Hide Passwords' : 'Show Passwords'}
                        </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto border border-slate-700 rounded-md">
                        <table className="w-full text-sm text-left text-slate-300">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-800 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        #
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        User Email Address
                                    </th>
                                     <th scope="col" className="px-6 py-3">
                                        Password
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user, index) => (
                                        <tr key={index} className="bg-slate-900 border-b border-slate-800 hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4 font-medium">{index + 1}</td>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4 font-mono text-slate-400">
                                                {showPasswords ? user.password : '••••••••'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-center text-slate-500">
                                            No users have registered yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;