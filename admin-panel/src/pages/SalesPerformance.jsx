import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SalesPerformance = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/admin/sales-performance');
                if (response.data.success) {
                    setSales(response.data.data);
                }
            } catch (error) {
                console.error("Gagal mengambil data Sales Performance:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSales();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Memuat data performa tim sales dari database...</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Sales Agent Commission Payout</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
                    Export CSV
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent Details</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mitras Recruited</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Commission (Rp)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sales.map((agent, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-semibold text-gray-900">{agent.name}</div>
                                    <div className="text-sm text-gray-500 font-mono">{agent.id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${agent.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {agent.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                                    {agent.recruited} <span className="text-gray-400 text-sm font-normal">people</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-900">
                                    Rp {agent.commission.toLocaleString('id-ID')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesPerformance;
