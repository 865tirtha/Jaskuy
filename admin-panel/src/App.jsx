import React, { useState } from 'react';
import DashboardHome from './pages/DashboardHome';
import KycApproval from './pages/KycApproval';
import SalesPerformance from './pages/SalesPerformance';
import MerchLogistics from './pages/MerchLogistics';
import DisputeAndPenalty from './pages/DisputeAndPenalty';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardHome />;
            case 'kyc': return <KycApproval />;
            case 'sales': return <SalesPerformance />;
            case 'merch': return <MerchLogistics />;
            case 'dispute': return <DisputeAndPenalty />;
            default: return <DashboardHome />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-gray-800 text-center">
                    Jaskuy <span className="text-yellow-400">Admin</span>
                </div>
                <nav className="flex-1 mt-6">
                    <ul className="space-y-2 px-4">
                        <li>
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-yellow-500 text-gray-900 font-semibold' : 'hover:bg-gray-800'}`}
                            >
                                📊 Dashboard
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('kyc')}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'kyc' ? 'bg-yellow-500 text-gray-900 font-semibold' : 'hover:bg-gray-800'}`}
                            >
                                👤 KYC Approvals
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('sales')}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'sales' ? 'bg-yellow-500 text-gray-900 font-semibold' : 'hover:bg-gray-800'}`}
                            >
                                📈 Sales Performance
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('merch')}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'merch' ? 'bg-yellow-500 text-gray-900 font-semibold' : 'hover:bg-gray-800'}`}
                            >
                                📦 Merch Logistics
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('dispute')}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'dispute' ? 'bg-yellow-500 text-gray-900 font-semibold' : 'hover:bg-gray-800'}`}
                            >
                                ⚖️ Dispute & Penalty
                            </button>
                        </li>
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-800 text-sm text-gray-400 text-center">
                    Logged in as Super Admin
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800 capitalize">
                        {activeTab === 'dashboard' ? 'Overview' : activeTab.replace(/([A-Z])/g, ' $1').trim()}
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                            Live Production
                        </span>
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    </div>
                </header>

                <div className="p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

export default App;
