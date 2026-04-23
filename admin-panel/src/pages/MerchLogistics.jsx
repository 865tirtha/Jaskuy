import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MerchLogistics = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/admin/merch-logistics');
                if (response.data.success) {
                    setOrders(response.data.data);
                }
            } catch (error) {
                console.error("Gagal mengambil data logistik:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleShip = async (id) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/admin/action/ship-merch/${id}`);
            if (response.data.success) {
                setOrders(orders.map(o => o.id === id ? { ...o, status: 'SHIPPED' } : o));
                alert(`Merch untuk ID ${id} ditandai SHIPPED. Mitra kini ACTIVE!`);
            } else {
                alert(`Gagal mengupdate status merch untuk ID ${id}`);
            }
        } catch (error) {
            console.error("Gagal melakukan shipping:", error);
            alert("Terjadi kesalahan server saat update shipping");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Merchandise (Pin) Delivery Pipeline</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Reference</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mitra & Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-bold text-gray-900 font-mono">{order.id}</div>
                                    <div className="text-xs text-gray-400 mt-1">{order.date}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{order.mitra}</div>
                                    <div className="text-sm text-gray-500">{order.phone}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-700 max-w-xs truncate">{order.address}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'SHIPPED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {order.status === 'PENDING' ? (
                                        <button
                                            onClick={() => handleShip(order.id)}
                                            className="text-blue-600 hover:text-blue-900 font-bold bg-blue-50 px-3 py-1 rounded transition-colors"
                                        >
                                            Mark as SHIPPED
                                        </button>
                                    ) : (
                                        <span className="text-gray-400 italic">Dispatched</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MerchLogistics;
