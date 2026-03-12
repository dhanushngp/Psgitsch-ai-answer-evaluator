import React, { useState } from 'react';
import { User } from '../types';

interface AdminDashboardProps {
    onLogout: () => void;
    onSwitchView: () => void;
    users: User[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onSwitchView, users }) => {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-white">
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
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-blue-400">Registered User Monitoring</h2>
                        <p className="text-sm text-slate-400 mt-1">
                            View user activity and history.
                        </p>
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
                                        Essential History
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user, index) => {
                                        const lastEval = user.history && user.history.length > 0 ? user.history[user.history.length - 1] : null;
                                        return (
                                            <tr key={index} className="bg-slate-900 border-b border-slate-800 hover:bg-slate-700/50 transition-colors">
                                                <td className="px-6 py-4 font-medium">{index + 1}</td>
                                                <td className="px-6 py-4">{user.email}</td>
                                                <td className="px-6 py-4 text-slate-400">
                                                    {user.history && user.history.length > 0 ? (
                                                        <div>
                                                            <div className="font-medium text-slate-200">Total Evaluations: {user.history.length}</div>
                                                            {lastEval && <div className="text-xs mt-1">Last Score: <span className={lastEval.score >= 70 ? "text-green-400" : "text-yellow-400"}>{lastEval.score}</span></div>}
                                                        </div>
                                                    ) : (
                                                        <span className="italic text-slate-500">No history yet</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })
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