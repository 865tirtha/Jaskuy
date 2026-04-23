import React, { useState, useEffect } from 'react';
import axios from 'axios';

const KycApproval = () => {
    const [mitras, setMitras] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchKycList = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/admin/kyc-approvals');
                if (response.data.success) {
                    setMitras(response.data.data);
                }
            } catch (error) {
                console.error("Gagal mengambil data KYC:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchKycList();
    }, []);

    const handleApprove = async (id) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/admin/action/approve-kyc/${id}`);
            if (response.data.success) {
                setMitras(mitras.filter(m => m.id !== id));
                alert(`Mitra ID ${id} Approved dan diteruskan ke Logistik (Merch)!`);
            } else {
                alert(`Gagal approve Mitra ID ${id}`);
            }
        } catch (error) {
            console.error("Gagal melakukan aksi approve:", error);
            alert("Terjadi kesalahan server saat approve");
        }
    };

    const handleReject = (id) => {
        setMitras(mitras.filter(m => m.id !== id));
        alert(`Mitra ID ${id} Rejected!`);
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Memuat antrean KYC dari Supabase...</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">KYC Approval Queue</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mitra Info</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KTP Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selfie With KTP</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {mitras.map(mitra => (
                            <tr key={mitra.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{mitra.name}</div>
                                    <div className="text-sm text-gray-500">NIK: {mitra.nik}</div>
                                    <div className="text-sm text-gray-500">Phone: {mitra.phone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img src={mitra.ktpUrl} alt="KTP" className="h-20 w-32 object-cover rounded shadow-sm border border-gray-200 cursor-pointer hover:opacity-80" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img src={mitra.selfieUrl} alt="Selfie" className="h-20 w-20 object-cover rounded-full shadow-sm border border-gray-200 cursor-pointer hover:opacity-80" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleApprove(mitra.id)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(mitra.id)}
                                            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {mitras.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">
                                    No Mitras waiting for KYC Approval.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default KycApproval;
