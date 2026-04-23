import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardHome = () => {
    const [statsData, setStatsData] = useState({
        revenue: 'Rp 0',
        escrow: 'Rp 0',
        total_mitras: '0',
        total_users: '0',
        total_sales: '0'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                // Using localhost:3000 to connect directly to the local backend
                const response = await axios.get('http://localhost:3000/api/admin/dashboard-stats');
                if (response.data.success) {
                    setStatsData(response.data.data);
                }
            } catch (error) {
                console.error("Gagal mengambil data dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    const stats = [
        { title: 'Total Revenue Kas', value: statsData.revenue, label: '10% Sales + 90% Company', color: 'bg-green-500' },
        { title: 'Total Escrow Tertahan', value: statsData.escrow, label: 'Awaiting User Confirmation', color: 'bg-blue-500' },
        { title: 'Jumlah Mitra Aktif', value: statsData.total_mitras.toString(), label: 'Registered & KYC Verified', color: 'bg-yellow-500' },
        { title: 'Jumlah Konsumen Aktif', value: statsData.total_users.toString(), label: 'Active Consumer Accounts', color: 'bg-purple-500' },
        { title: 'Jumlah Sales Agents', value: statsData.total_sales.toString(), label: 'Jaskuy Field Marketers', color: 'bg-indigo-500' }
    ];

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Memuat data dari Supabase...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
                        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.title}</h3>
                        <div className="mt-4 flex items-baseline">
                            <span className="text-3xl font-extrabold text-gray-900">{stat.value}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500 border-l-4 pl-2 border-gray-200">
                            {stat.label}
                        </div>
                        <div className={`mt-4 h-1 w-full rounded-full ${stat.color} opacity-75`}></div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Grafik Transaksi Bulan Ini (Mockup)</h2>
                <div className="h-64 w-full bg-gray-50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 font-medium">[ Area Chart Placeholder ]</span>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
