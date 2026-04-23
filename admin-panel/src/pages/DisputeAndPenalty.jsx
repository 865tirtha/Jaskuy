import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DisputeAndPenalty = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPenalties = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/admin/disputes-penalties');
                if (response.data.success) {
                    setLogs(response.data.data);
                }
            } catch (error) {
                console.error("Gagal mengambil data penalti:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPenalties();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Memuat data log penalty AI & sengketa...</div>;
    }

    const handleManualAction = (offenderId, role, actionType) => {
        alert(`Manual Action '${actionType}' triggered for ${role} ID ${offenderId}`);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">AI Dispute & Penalty Logs</h2>
                <div className="flex gap-2">
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Filters ⚙️
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Log ID & Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offender</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Violation Details</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Punishment</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manual Override</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">#{log.id}</div>
                                    <div className="text-xs text-gray-500">{log.date}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-bold text-gray-800">{log.role}</div>
                                    <div className="text-sm text-gray-500">ID: {log.offenderId}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 border border-red-200 bg-red-50 p-2 rounded w-max inline-block font-mono">
                                        "{log.keyword}"
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">Regex Match (Strike {log.strike})</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-sm ${log.action.includes('BANNED') ? 'bg-red-600 text-white' : 'bg-orange-100 text-orange-800'}`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleManualAction(log.offenderId, log.role, 'UNBAN')}
                                            className="text-green-600 hover:text-green-900 font-bold bg-green-50 px-3 py-1 rounded transition-colors"
                                        >
                                            Unban
                                        </button>
                                        <button
                                            onClick={() => handleManualAction(log.offenderId, log.role, 'FORCE_BAN')}
                                            className="text-red-600 hover:text-red-900 font-bold bg-red-50 px-3 py-1 rounded transition-colors"
                                        >
                                            Force Ban
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DisputeAndPenalty;
