# Laporan Kodingan Jaskuy

> Dokumen ini berisi kompilasi dari seluruh file kode yang ada di folder ini beserta isinya.

## Struktur File

- `.env`
- `admin-panel/index.html`
- `admin-panel/package.json`
- `admin-panel/postcss.config.js`
- `admin-panel/src/App.jsx`
- `admin-panel/src/index.css`
- `admin-panel/src/main.jsx`
- `admin-panel/src/pages/DashboardHome.jsx`
- `admin-panel/src/pages/DisputeAndPenalty.jsx`
- `admin-panel/src/pages/KycApproval.jsx`
- `admin-panel/src/pages/MerchLogistics.jsx`
- `admin-panel/src/pages/SalesPerformance.jsx`
- `admin-panel/tailwind.config.js`
- `admin-panel/vite.config.js`
- `api-tunnel.js`
- `debug_data.json`
- `generate_report.js`
- `laporan_backend_jaskuy.md`
- `laporan_implementasi_fase_1_hingga_4.md`
- `laporan_proyek_jaskuy_komprehensif.md`
- `migrasi_schema_supabase.md`
- `migrate_sales.js`
- `output_data.json`
- `package.json`
- `panduan_migrasi_supabase.md`
- `panduan_migrasi_supabase_v2.md`
- `pm2_list.json`
- `query_tables.js`
- `query_tables2.js`
- `sales-app/lib/main.dart`
- `sales-app/lib/providers/auth_provider.dart`
- `sales-app/lib/screens/dashboard_screen.dart`
- `sales-app/lib/screens/history_screen.dart`
- `sales-app/lib/screens/login_screen.dart`
- `sales-app/lib/screens/mitra_registration_screen.dart`
- `sales-app/lib/screens/register_screen.dart`
- `sales-app/lib/services/api_service.dart`
- `sales-app/README.md`
- `sales-app/test/widget_test.dart`
- `show_latest_data.js`
- `src/app.js`
- `src/config/db.js`
- `src/core/middlewares/auth.js`
- `src/core/middlewares/auth.middleware.js`
- `src/core/middlewares/errorHandler.js`
- `src/core/middlewares/strike.middleware.js`
- `src/core/utils/regexModerator.js`
- `src/cron.js`
- `src/domains/admin/admin.controller.js`
- `src/domains/auth/auth.controller.js`
- `src/domains/auth/auth.routes.js`
- `src/domains/auth/auth.service.js`
- `src/domains/bookings/booking.controller.js`
- `src/domains/bookings/booking.routes.js`
- `src/domains/bookings/booking.service.js`
- `src/domains/bookings/escrow.worker.js`
- `src/domains/mitras/kyc.controller.js`
- `src/domains/mitras/kyc.service.js`
- `src/domains/mitras/mitra.controller.js`
- `src/domains/mitras/mitra.routes.js`
- `src/domains/mitras/mitra.service.js`
- `src/domains/mitras/registration.controller.js`
- `src/domains/mitras/registration.service.js`
- `src/domains/penalties/penalty.service.js`
- `src/domains/reviews/review.controller.js`
- `src/domains/reviews/review.routes.js`
- `src/domains/reviews/review.service.js`
- `src/infrastructure/database/db.js`
- `src/infrastructure/websocket/chatModerator.js`
- `src/routes/index.routes.js`
- `src/server.js`
- `src/workers/chatGarbageCollector.js`
- `start-ngrok.js`
- `start-tunnel.js`
- `test_supa.js`
- `update_sistem_ngrok.md`
- `update_sistem_online.md`

---

## Detail File

### File: `.env`

```env
PORT=3000
DATABASE_URL="postgresql://postgres.acepmeqeomyfxzkxenou:ht7LhGfvElCQxJL5@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jaskuy
JWT_SECRET=super_secret_high_end_jaskuy_key_2026
```

### File: `admin-panel/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jaskuy Super Admin</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### File: `admin-panel/package.json`

```json
{
    "name": "admin-panel",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
        "preview": "vite preview"
    },
    "dependencies": {
        "axios": "^1.13.5",
        "react": "^18.3.1",
        "react-dom": "^18.3.1"
    },
    "devDependencies": {
        "@types/react": "^18.3.3",
        "@types/react-dom": "^18.3.0",
        "@vitejs/plugin-react": "^4.3.0",
        "autoprefixer": "^10.4.19",
        "eslint": "^8.57.0",
        "eslint-plugin-react": "^7.34.2",
        "eslint-plugin-react-hooks": "^4.6.2",
        "eslint-plugin-react-refresh": "^0.4.7",
        "postcss": "^8.4.38",
        "tailwindcss": "^3.4.4",
        "vite": "^5.2.0"
    }
}
```

### File: `admin-panel/postcss.config.js`

```javascript
export default {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
}
```

### File: `admin-panel/src/App.jsx`

```jsx
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
```

### File: `admin-panel/src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #f3f4f6;
  font-family: 'Inter', sans-serif;
}
```

### File: `admin-panel/src/main.jsx`

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
```

### File: `admin-panel/src/pages/DashboardHome.jsx`

```jsx
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
```

### File: `admin-panel/src/pages/DisputeAndPenalty.jsx`

```jsx
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
```

### File: `admin-panel/src/pages/KycApproval.jsx`

```jsx
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
```

### File: `admin-panel/src/pages/MerchLogistics.jsx`

```jsx
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
```

### File: `admin-panel/src/pages/SalesPerformance.jsx`

```jsx
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
```

### File: `admin-panel/tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
```

### File: `admin-panel/vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true, // Exposes to local network IP
    }
})
```

### File: `api-tunnel.js`

```javascript
const localtunnel = require('localtunnel');

(async () => {
    try {
        const tunnel = await localtunnel({ port: 3000, subdomain: 'jaskuyb2026' });
        console.log(`🚀 Tunnel running at: ${tunnel.url}`);

        tunnel.on('close', () => {
            console.log('Tunnel closed naturally. PM2 will revive it.');
            process.exit(1);
        });

        tunnel.on('error', (err) => {
            console.error('Tunnel error:', err);
            process.exit(1);
        });
    } catch (err) {
        console.error('Failed to start tunnel:', err);
        process.exit(1);
    }
})();
```

### File: `debug_data.json`

```json
{
  "commissions": [
    {
      "id": "00de8bf5-6758-4a87-91be-bbdc5e02a8cc",
      "sales_id": "e44af473-01d2-4697-9fde-5db572fab660",
      "mitra_id": "1f249dbf-e1ec-4479-a7f8-35194d613a1f",
      "base_fee_net": "15000.00",
      "commission_amount": "1500.00",
      "company_revenue": "13500.00",
      "status": "PENDING",
      "created_at": "2026-02-27T02:24:08.323Z"
    }
  ],
  "mitras": [
    {
      "id": "5455eb54-66ed-45f7-ad51-6072f53d717d",
      "name": "hes",
      "referred_by_sales_id": "e44af473-01d2-4697-9fde-5db572fab660"
    },
    {
      "id": "1f249dbf-e1ec-4479-a7f8-35194d613a1f",
      "name": "hesa",
      "referred_by_sales_id": "e44af473-01d2-4697-9fde-5db572fab660"
    }
  ],
  "sales": [
    {
      "id": "8734f2e1-930d-46a9-b952-424289d8a6f2",
      "name": "Tester Fixed Pooler"
    },
    {
      "id": "e44af473-01d2-4697-9fde-5db572fab660",
      "name": "mahesa"
    },
    {
      "id": "b24c656f-5717-4316-9020-be7e5c3dc349",
      "name": "monyet"
    }
  ]
}
```

### File: `generate_report.js`

```javascript
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const outputFile = path.join(rootDir, 'laporan_kodingan_jaskuy.md');

const ignoreDirs = [
    'node_modules', '.git', 'build', 'dist', '.dart_tool', 
    'android', 'ios', 'web', 'windows', 'macos', 'linux', 
    'public', 'assets', '.next', '.expo'
];

const allowedExts = ['.js', '.dart', '.json', '.md', '.html', '.css', '.env', '.ts', '.tsx', '.jsx'];
const ignoreFiles = ['package-lock.json', 'yarn.lock', 'laporan_kodingan_jaskuy.md'];

function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (!ignoreDirs.includes(file)) {
                getFiles(fullPath, fileList);
            }
        } else {
            const ext = path.extname(file);
            if (
                (allowedExts.includes(ext) || file.startsWith('.env')) && 
                !ignoreFiles.includes(file) && !file.includes('.log') && !file.includes('.txt')
            ) {
                fileList.push(fullPath);
            }
        }
    }
    return fileList;
}

const files = getFiles(rootDir);
let markdown = '# Laporan Kodingan Jaskuy\n\n';
markdown += '> Dokumen ini berisi kompilasi dari seluruh file kode yang ada di folder ini beserta isinya.\n\n';

markdown += '## Struktur File\n\n';
for (const file of files) {
    markdown += `- \`${path.relative(rootDir, file).replace(/\\/g, '/')}\`\n`;
}
markdown += '\n---\n\n';

markdown += '## Detail File\n\n';

for (const file of files) {
    const relativePath = path.relative(rootDir, file).replace(/\\/g, '/');
    try {
        const content = fs.readFileSync(file, 'utf-8');
        if (content.length < 150000) {
            markdown += `### File: \`${relativePath}\`\n\n`;
            let lang = path.extname(file).replace('.', '');
            if (lang === 'js') lang = 'javascript';
            if (lang === 'ts') lang = 'typescript';
            if (file.endsWith('.env')) lang = 'env';
            markdown += `\`\`\`${lang}\n`;
            markdown += content;
            if (!content.endsWith('\n')) markdown += '\n';
            markdown += `\`\`\`\n\n`;
        } else {
             markdown += `### File: \`${relativePath}\`\n\n`;
             markdown += `*File terlalu besar untuk ditampilkan (hanya ringkasan).* \n\n`;
        }
    } catch (e) {
         markdown += `### File: \`${relativePath}\`\n\n`;
         markdown += `*Gagal membaca file.*\n\n`;
    }
}

fs.writeFileSync(outputFile, markdown);
console.log('Report generated at ' + outputFile);
```

### File: `laporan_backend_jaskuy.md`

```md
# Laporan Arsitektur Backend Jaskuy V3
## Skema Database & Logika Bisnis Kompleks

Laporan ini ditujukan untuk panduan Tim Developer yang memegang Backend (Express.js) & Database Administrator (PostgreSQL). Sistem Jaskuy telah berevolusi ke tahap fitur kompleks tinggi untuk memastikan stabilitas transaksi Gig Economy.

---

### 1. Struktur Database PostgreSQL + PostGIS

Sistem Database V3 berfokus pada fitur **Escrow**, **Pemisahan Uang Tips**, **Dynamic Geofencing**, dan sistem **Recovery Ads**.

```sql
-- Mengaktifkan ekstensi untuk Geofencing Bumi
CREATE EXTENSION IF NOT EXISTS postgis;

-- --------------------------------------------------------
-- 1. ENUMS (Tipe Data Standar Aplikasi)
-- --------------------------------------------------------
CREATE TYPE service_category AS ENUM ('PHYSICAL', 'DIGITAL');
CREATE TYPE tier_badge AS ENUM ('GREEN', 'BLUE', 'RED');
CREATE TYPE account_status AS ENUM ('ACTIVE', 'DISABLED', 'FROZEN', 'BANNED_TEMP', 'BANNED_PERM');
CREATE TYPE user_role AS ENUM ('USER', 'MITRA');
CREATE TYPE booking_status AS ENUM ('SEARCHING', 'MATCHED', 'WORKING', 'AWAITING_CONFIRMATION', 'COMPLETED', 'CANCELLED');
CREATE TYPE mitra_work_status AS ENUM ('AVAILABLE', 'WORKING', 'OFFLINE');
CREATE TYPE ad_tier_rank AS ENUM ('RANK_1_NEWBIE', 'RANK_2_RECOVERY', 'ORGANIC');

CREATE TABLE blacklisted_niks (
    nik VARCHAR(20) PRIMARY KEY,
    reason TEXT NOT NULL,
    banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    strike_count INT DEFAULT 0,
    rating_avg DECIMAL(3,2) DEFAULT 0.00,
    status account_status DEFAULT 'ACTIVE',
    suspended_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mitras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nik VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    dob DATE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    is_kyc_verified BOOLEAN DEFAULT FALSE,
    work_status mitra_work_status DEFAULT 'OFFLINE',
    current_location GEOGRAPHY(POINT, 4326),
    
    -- Kapasitas Multitasking (Fisik = max 1, Digital = max N)
    max_concurrent_slots INT DEFAULT 1,
    active_working_slots INT DEFAULT 0,
    
    total_users_served INT DEFAULT 0,
    rating_avg DECIMAL(3,2) DEFAULT 0.00,
    badge_tier tier_badge DEFAULT 'GREEN',
    wallet_balance DECIMAL(15,2) DEFAULT 0.00,
    
    strike_count INT DEFAULT 0,
    status account_status DEFAULT 'ACTIVE',
    suspended_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- IKLAN PRIORITAS (RANK 1 vs RANK 2)
CREATE TABLE mitra_priority_ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mitra_id UUID REFERENCES mitras(id) ON DELETE CASCADE,
    ad_rank ad_tier_rank NOT NULL, -- Penentu prioritas di Algoritma Search
    amount_paid DECIMAL(15,2) NOT NULL, 
    initial_quota INT DEFAULT 15,
    quota_remaining INT DEFAULT 15,
    visibility_score DECIMAL(5,2) DEFAULT 100.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category service_category NOT NULL,
    avg_market_price DECIMAL(15,2) DEFAULT 0.00
);

CREATE TABLE mitra_services (
    mitra_id UUID REFERENCES mitras(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    base_price DECIMAL(15,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (mitra_id, service_id)
);

-- SISTEM BOOKING & ESCROW
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    mitra_id UUID REFERENCES mitras(id),
    service_id UUID REFERENCES services(id),
    status booking_status DEFAULT 'SEARCHING',
    
    -- Jarak Terhitung Otomatis dari Logika Geofencing Dinamis
    user_booking_location GEOGRAPHY(POINT, 4326),
    distance_km DECIMAL(6,2), 
    is_out_of_range BOOLEAN DEFAULT FALSE, 
    out_of_range_fee DECIMAL(10,2) DEFAULT 0.00,
    priority_ad_consumed_id UUID REFERENCES mitra_priority_ads(id), 
    
    original_service_price DECIMAL(15,2) NOT NULL, -- Kolom untuk perhitungan 20%
    admin_fee DECIMAL(10,2) DEFAULT 1500.00,       
    
    management_cut_percent INT NOT NULL,             
    management_cut_amount DECIMAL(15,2) NOT NULL,    
    insurance_fee_amount DECIMAL(15,2) NOT NULL,     
    cashback_bonus_amount DECIMAL(15,2) DEFAULT 0,   
    
    -- KOLOM TIPS DI PISAH AGAR UANG 100% MASUK KE MITRA
    tips_amount DECIMAL(15,2) DEFAULT 0.00,
    
    -- Accounting
    total_paid_by_user DECIMAL(15,2) NOT NULL,       
    net_earned_by_mitra DECIMAL(15,2) NOT NULL,      
    
    -- Escrow (Hold Payments)
    started_at TIMESTAMP,
    mitra_finished_at TIMESTAMP, -- Mitra klik selesai, status naik ke 'AWAITING_CONFIRMATION'
    completed_at TIMESTAMP,      -- Duit diteruskan saat user klik Konfirmasi / lewat 24 jam bot cron
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    reviewer_role user_role NOT NULL, 
    reviewer_user_id UUID,  
    reviewer_mitra_id UUID, 
    target_user_id UUID,    
    target_mitra_id UUID,   
    rating DECIMAL(2,1) CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (booking_id, reviewer_role)
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    sender_role user_role NOT NULL, 
    sender_id UUID NOT NULL,
    message_content TEXT NOT NULL,
    is_censored BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE regex_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID REFERENCES chat_messages(id),
    violator_role user_role NOT NULL,
    violator_id UUID NOT NULL,
    violation_keyword TEXT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE penalty_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offender_role user_role NOT NULL, 
    offender_id UUID NOT NULL,
    triggered_by UUID,
    strike_number INT NOT NULL, 
    action_taken VARCHAR(100) NOT NULL, 
    reason TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 2. Arsitektur Folder Enterprise 

Arsitektur aplikasi ditulis berdasarkan *Domain-Driven*, memisahkan fitur berdasarkan ruang lingkup logika fungsional, bukan hanya tipe teknisnya.

```text
📦 jaskuy-backend (Express.js)
 ┣ 📂 src
 ┃ ┣ 📂 core              # Modul Agnostic & Utility Reusable
 ┃ ┃ ┣ 📂 middlewares     # auth.js (JWT Middleware & Role checking), errorHandler.js
 ┃ ┃ ┣ 📂 utils           # regexModerator.js, geoMath.js
 ┃ ┃ ┗ 📂 constants       # ENUM
 ┃ ┣ 📂 domains           # ✨ BUSINESS LOGIC (Pusat Fungsional Aplikasi)
 ┃ ┃ ┣ 📂 auth            # auth.controller.js, auth.routes.js, auth.service.js
 ┃ ┃ ┣ 📂 users           # Kelola profil, metode bayar (opsional), dan histori strike User
 ┃ ┃ ┣ 📂 mitras          # Algoritma Pencarian Geofencing & Iklan Prioritas
 ┃ ┃ ┃ ┣ 📜 kyc.service.js
 ┃ ┃ ┃ ┣ 📜 mitra.controller.js
 ┃ ┃ ┃ ┣ 📜 mitra.routes.js
 ┃ ┃ ┃ ┗ 📜 mitra.service.js 
 ┃ ┃ ┣ 📂 bookings        # Sistem Escrow, Management Cut (Rupiah Constraints), dan Kalkulasi Tip
 ┃ ┃ ┃ ┣ 📜 escrowWorker.js   # Script Cronjob memindahkan status ke Completed jika lewat 24 Jam
 ┃ ┃ ┃ ┣ 📜 booking.controller.js
 ┃ ┃ ┃ ┣ 📜 booking.routes.js
 ┃ ┃ ┃ ┗ 📜 booking.service.js
 ┃ ┃ ┣ 📂 reviews         # Rating Dua Arah & Dynamic Tiering Sistem
 ┃ ┃ ┃ ┣ 📜 review.controller.js
 ┃ ┃ ┃ ┣ 📜 review.routes.js
 ┃ ┃ ┃ ┗ 📜 review.service.js
 ┃ ┃ ┗ 📂 penalties       # Eksekutor Penalty 3-Strikes (User & Mitra) & Blocking NIK
 ┃ ┣ 📂 infrastructure    # Komunikasi External IO & Database Core
 ┃ ┃ ┣ 📂 database        # Konektivitas Pool Postgres (db.js) & Skema init.sql
 ┃ ┃ ┗ 📂 websocket       # chatModerator.js (Bot AI Regex)
 ┃ ┣ 📜 app.js            # Node API Middleware Router Registry
 ┃ ┗ 📜 server.js         # Titik Endpoint Start Server & Socket.io Binding
```

---

### 3. Logika Fungsi Kunci (Core Implementation)

#### A. Algoritma Pencarian Mitra Berbasis Geofencing Radius Dinamis
Fungsi `findAvailableMitras` di dalam `mitra.service.js` akan secara mandiri di-looping saat mencari tukang:
1. Ia menggunakan kueri basis PostGIS *ST_DWithin* untuk Radius dasar `5KM` (5000 Meter).
2. Jika database tidak menemukan Mitra Tukang `AVAILABLE` di dalam lingkaran radius tersebut, Kode di *service* otomatis melakukan extend pencarian dengan `Radius + 5000` (10KM) dan berjalan ulang.
3. Maksimal iterasi radius adalah 3 kali (15KM MAX). Jika ditemukan pada perulangan ke-2 atau ke-3, algoritma mencantumkan Flag `is_out_of_range = true` dan nilai `out_of_range_fee = 15000` Rupiah ke *response body API*.

#### B. Sistem Jasa Digital Multitasking Slots
Jika `service_category` bernilai `DIGITAL`, kode di atas membypass Query GPS. Pengalihan batasannya jatuh kepada jumlah Slot. Cek klausa `WHERE m.active_working_slots < m.max_concurrent_slots`. User Programmer/Drafter bisa diset untuk menangani **4 Job Berbarengan** jika diperlukan.

#### C. Logika Priority Ads Recovery vs Newbie (Sorting Kueri)
Sorting hasil pencarian (`ORDER BY`) telah dipastikan di dalam `mitra.service.js` berdasarkan:
```sql
ORDER BY 
    CASE WHEN pa.ad_rank = 'RANK_1_NEWBIE' THEN 1      
         WHEN pa.ad_rank = 'RANK_2_RECOVERY' THEN 2    
         ELSE 3 END ASC,                               
    pa.visibility_score DESC,                         
    m.rating_avg DESC                                  
LIMIT 20
```
Jika tukang AC memiliki Rating 2.9 (Hancur), dia bebas membeli lagi Iklan pemulihan (*Rank_2_Recovery*) seharga 175rb melalui App/Web Admin, asalkan masih ada slot. Selama dia punya Priority Ads Aktif, ia akan terus menduduki ranking di bawah tukang baru namun jauh di atas algoritma organik.

#### D. Sistem Pembayaran & Tips Escrow
`total_paid_by_user` terdiri dari: `original_service_price` + `admin_fee` + `out_of_range_fee` (jika ada) + `tips_amount`.  
Namun, Backend memastikan bahwa potongan persen 20/25% (Management Cut) HANYA dikenakan pada angka di dalam kolom `original_service_price`. Tips Murni 100% dialirkan kepada parameter hitungan `net_earned_by_mitra`.

---

### 4. V4 Revisions (Onboarding & Iklan)

#### A. Biaya Pendaftaran Rp 50.000 & Komisi Sales (Referral)
Mitra baru tidak lagi dipaksa membeli Iklan Rp 200.000 di awal. Biaya pendaftaran (Base Fee) ditekan menjadi **Rp 50.000**, di mana **Rp 35.000** adalah Harga Pokok Penjualan (HPP) untuk pembuatan Pin Merchandise. 

Sisa bersih **Rp 15.000** dibagi secara otomatis oleh Backend di `registration.service.js` saat route `POST /api/mitra/registration-payment` dipanggil:
- Jika Mendaftar dengan kode Referral Sales Internal: Sales mendapatkan **10% Komisi** (Rp 1.500) yang tercatat di tabel `sales_commissions`. Sisanya **90%** (Rp 13.500) menjadi Revenue Kas OTT / Perusahaan.

#### B. Sistem Tier Iklan (Add-ons)
Iklan tidak lagi wajib di awal, melainkan Opsional:
1. **RANK_1_NEWBIE (Rp 200.000)**: Kuota 15 Pelanggan, tampil paling atas.
2. **RANK_2_RECOVERY (Rp 175.000)**: Khusus Mitra dengan rating di bawah 3.0 untuk memulihkan skor. Tampil di bawah iklan Newbie.
3. **PREMIUM PRO (Rp 3.000.000)**: Endpoint `POST /api/mitra/premium-ads`. Dikunci secara eksklusif untuk Badge **BIRU** & **MERAH**. Backend akan memvalidasi *maksimal 3 Mitra Premium PRO* per kota (`city`) yang memiliki status keaktifan dalam batas rentang waktu **1.5 Bulan**.
```

### File: `laporan_implementasi_fase_1_hingga_4.md`

```md
# 🚀 Laporan Implementasi Backend Jaskuy (Fase 1 - 4)

Dokumen ini merangkum seluruh hasil pengembangan REST API, WebSockets, dan Background Workers pada aplikasi Jaskuy yang telah dibangun menggunakan standar kelas *Enterprise* (Arsitektur *Domain-Driven Design* / Service-Controller Pattern), NodeJS, Express, dan PostgreSQL (*node-postgres*).

---

## 🏗️ 1. Arsitektur & Teknologi Utama
- **Framework**: Express.js (REST API Endpoint Server)
- **Database**: PostgreSQL dengan query *native* (`pg`) untuk optimasi perfoma (tanpa ORM) dan **PostGIS** untuk Geofencing koordinat bumi.
- **Real-time Server**: Socket.IO (Chatting & Moderasi AI)
- **Background CronJobs**: `node-cron` (Escrow Worker & Chat Garbage Collector)
- **Security Checkers**: `jsonwebtoken` (JWT), `bcrypt`, Custom API Middlewares (Strike & Hukuman 3-Lapis).
- **Transaction Manager**: DB Pooling dengan pola `BEGIN` & `COMMIT` untuk memastikan integritas aliran uang jika error (Atomicity).

---

## 🔒 2. Fase 1: Setup & Autentikasi (V4 Rules)

- **Strike Middleware (`strike.middleware.js`)**: 
  Pengaman otomatis (Gatekeeper) di tingkat router. Berfungsi memblokir User atau Mitra yang akunnya berstatus terkena sanksi moderasi (`DISABLED`, `FROZEN`, `BANNED_PERM`). Otomatis membaca status _suspended_until_.

- **Mitra Registration / KYC (`auth.controller.js`)**:
  - Hash password `bcrypt`.
  - Sistem Pengecekan *NIK Blacklist* (AI 3-Strike). Jika NIK terdaftar, pendaftaran diblokir.

- **Pembayaran Onboarding (Rp 50.000) & Referral Sales V4 (`registration.service.js`)**:
  - Dibuat sesuai revisi V4 Jaskuy—Biaya pendaftaran dasar di-hardcode di **Rp 50.000**.
  - **Rp 35.000**: Dialihkan sistem sebagai HPP Pembuatan Pin Merchandise (mengubah `merch_status` menjadi 'PENDING').
  - **Rp 15.000 Sisa Bersih**: Jika Mitra memasukkan kode Referral, Sales mendapatkan **10% (Rp 1.500)** yang disuntik langsung ke tabel `sales_commissions` dan update saldo Sales (`sales_agents`). Sisanya **90% (Rp 13.500)** adalah pendapatan Kas Jaskuy.

---

## 📍 3. Fase 2: Core Booking & Geofencing (V4)

- **Search Geofencing Berlapis (`mitra.service.js`)**:  
  - **Jarak Relasional (PostGIS ST_DWithin)**: Di Jasa Fisik, Backend memanipulasi loop dinamis Node.js dengan ekstensi Spasial PostgreSQL. Mulai dari _Scanning_ 5KM. Jika nihil, diperbesar ke 10KM, hingga puncaknya 15KM.
  - Tambahan Flag Otomatis `is_out_of_range: true` dan pembebanan `out_of_range_fee: 15.000` (Jarak > 5KM).
  - **Jasa Digital (*Multitasking Slot*)**: Bypass pembacaan radius bumi. Menyeleksi berdasarkan perbandingan kuota `active_working_slots` vs `max_concurrent_slots`.

- **Sorting Algoritma Prioritas Iklan V4**:
  Peringkat urutan di query SQL dijamin dengan fungsi `CASE WHEN`:
  1. Iklan RANK_1_NEWBIE (Rp 200rb) di posisi satu.
  2. Iklan RANK_2_RECOVERY (Rp 175rb) di posisi dua.
  3. Sisanya diurutkan lewat *Rating Rata-rata* alami.

- **Escrow & Tip Murni (`booking.service.js`)**:  
  - Menjaga Dynamic Pricing V3 (Mitra Biru maks *Markup Limit 1.75x*, Merah *2.0x*, Hijau dilarang ngeset *Service Price* di bawah Rp 50.000).
  - Pada `completeBooking()`, Potongan Manajemen (Management Cut 20% Fisik & 25% Digital_Under_5_Stars) **HANYA DIKENAKAN** pada nilai `original_service_price`.
  - Uang asuransi (*Insurance Fee*) sebesar 10% diambil sistem dari *Management Cut*, lalu Mitra level MERAH mendapatkan bonus **Cashback 5%**!
  - **TIPS**: Masuk kantong Mitra secara murni (100% Bebas Potongan). 

---

## 💸 4. Fase 3: Automated Escrow CronJobs

- **Escrow Release Worker (`escrow.worker.js`)**:
  - Background Job murni Node (`node-cron`).
  - Menyala otomatis pada setiap awal jam (`0 * * * *`).
  - Menyeleksi transaksi yang status di Database adalah `AWAITING_CONFIRMATION` dari User (setelah Mitra memencet tombol Selesai Kerjakan) yang mandek melebih batas **24 Jam**.
  - Membuka Gembok Escrow dan mencairkan uangnya (menambah poin di `wallet_balance` tabel `mitras`) tanpa harus menunggu User mencetaknya secara manual.

---

## 🤖 5. Fase 4: WebSocket AI Moderation & Auto-Delete Chat

- **Regex Terminator Server (`chatModerator.js` & `regexModerator.js`)**:  
  - Terpisah namun bersatu dengan Server Express (Socket.IO).
  - Memiliki *Array Expressions* tajam (Regex) untuk mencegat niat jahat pengguna menyebar kata kunci: WhatsApp, Nomer Handphone licik (`o lapan`, `kosong 8`), Sosmed (IG/FB/Tele), hingga Tautan (Link web luar).
  - Jika dicurigai: Teks asli tidak akan tersebar menuju lawan chat. Melainkan dikonversi menjadi `[Pesan disensor oleh Sistem karena melanggar Aturan]`.

- **Integrasi 3-Strikes System Backend (`penalty.service.js`)**:  
  Server WebSocket tidak hanya melarang pesan, tetapi memanggil Service Penalti:
  - **Pelanggaran Pertama**: Akun di non-aktifkan 48 JAM (`DISABLED_2_DAYS`).
  - **Pelanggaran Kedua**: Akun dibekukan 1 MINGGU (`FROZEN_1_WEEK`).
  - **Pelanggaran Ketiga (MATI)**: Status `BANNED_PERM`. Jika dia bermitra, NIK KTP-nya masuk tabel The Blacklist (`blacklisted_niks`) mencegah pembuatan akun selamanya. Socket langsung melakukan `socket.disconnect()`.
  
- **Auto-Delete Chat (Garbage Collection)**: (`chatGarbageCollector.js`):
  - Job Cron lain yang berjalan pada jadwal *Menit 30* di tiap Jam (`30 * * * *`).
  - Menghemat memory PostgreSQL App Jaskuy secara radikal: Mencari pesanan (`bookings`) dengan status `COMPLETED` yang usianya lewat 24 Jam.
  - Eksekusi `DELETE FROM chat_messages` (Operasi Cascasde/Sweep masal). Keamanan dan privasi (Privacy By Design) tereksekusi paripurna. 

---

### End. 
*Architected and Crafted using Domain-Driven NodeJS Paradigm by Antigravity AI.*
```

### File: `laporan_proyek_jaskuy_komprehensif.md`

```md
# 🚀 Laporan Komprehensif Pengembangan Jaskuy (V3 - V4)

Dokumen ini merupakan rangkuman terintegrasi dari seluruh fase pengembangan Backend, Infrastruktur, dan Business Logic aplikasi Jaskuy. Laporan ini menggabungkan detail teknis arsitektur, skema database, aturan bisnis terbaru (V4), hingga sistem manajemen tunnel yang digunakan untuk stabilitas aplikasi.

---

## 🏗️ 1. Arsitektur & Teknologi Utama
Sistem Jaskuy dibangun dengan standar *Enterprise* menggunakan arsitektur **Domain-Driven Design (DDD)** untuk memisahkan logika fungsional secara modular.

- **Backend Stack**: Node.js & Express.js (REST API).
- **Database**: PostgreSQL dengan ekstensi **PostGIS** untuk kalkulasi jarak geografis (Geofencing).
- **Real-time**: Socket.IO untuk sistem Chatting & Moderasi AI instan.
- **Worker**: `node-cron` untuk menangani *Escrow Release* dan *Chat Garbage Collection*.
- **Security**: JWT Authentication, bcrypt, dan Middleware Penalti 3-Lapis.
- **Process Management**: **PM2** untuk menjamin persistensi server (Backend, Admin, & Tunnel).

---

## 📊 2. Skema Database & Logika Bisnis Kompleks

### A. Geofencing Radius Dinamis (PostGIS)
Untuk Jasa Fisik, sistem menggunakan algoritma pencarian bertingkat di `mitra.service.js`:
1. **Radius Awal**: 5 KM.
2. **Iterasi**: Jika tidak ditemukan, radius diperluas ke 10 KM, lalu maksimal 15 KM.
3. **Biaya Tambahan**: Jika ditemukan di luar 5 KM, flag `is_out_of_range` diset `true` dengan biaya tambahan `out_of_range_fee` sebesar **Rp 15.000**.

### B. Multitasking Jasa Digital
Untuk Jasa Digital, batasan geografis diabaikan. Validasi berpindah ke **Slot Kapasitas**:
- `active_working_slots` vs `max_concurrent_slots`.
- Memungkinkan satu Mitra (misal: Drafter/Programmer) menangani hingga **4 Job sekaligus**.

### C. Sistem Escrow & Tips Murni
- **Escrow**: Dana ditahan sistem hingga pekerjaan selesai. Jika User tidak konfirmasi dalam **24 Jam**, CronJob `escrow.worker.js` akan mencairkan dana otomatis ke dompet Mitra.
- **Tips**: 100% dana Tips masuk ke Mitra tanpa potongan.
- **Management Cut**: Potongan 20% (Fisik) atau 25% (Digital) **hanya** dikenakan pada harga layanan asli (`original_service_price`).

---

## 💰 3. Aturan Bisnis V4 (Registration & Iklan)

### A. Biaya Pendaftaran & Referral Sales
Berdasarkan revisi terbaru, biaya pendaftaran Mitra disederhanakan:
- **Total Biaya**: **Rp 50.000**.
- **HPP Merchandise**: Rp 35.000 (Pembuatan Pin & Kit).
- **Sisa Bersih**: Rp 15.000.
- **Komisi Sales**: Jika menggunakan kode referral, Sales mendapatkan **10% (Rp 1.500)**. Sisa **90% (Rp 13.500)** masuk ke pendapatan perusahaan.

### B. Tiering Iklan (Sorting Priority)
Algoritma pencarian mengurutkan mitra berdasarkan status iklan mereka:
1. **RANK_1_NEWBIE (Rp 200.000)**: Prioritas tertinggi, kuota 15 pelanggan.
2. **RANK_2_RECOVERY (Rp 175.000)**: Untuk mitra dengan rating < 3.0 guna memulihkan reputasi.
3. **PREMIUM PRO (Rp 3.000.000)**: Eksklusif untuk Badge Biru/Merah (Maks 3 mitra per kota).

---

## 🤖 4. Moderasi AI & Keamanan

### A. Chat Moderation (Regex System)
Sistem menggunakan `chatModerator.js` untuk mencegah transaksi di luar platform (off-platform):
- Mencegat kata kunci: WhatsApp, nomor HP, link eksternal, dan username media sosial.
- Pesan yang melanggar akan otomatis disensor: `[Pesan disensor oleh Sistem karena melanggar Aturan]`.

### B. Sistem Penalti 3-Strikes
Pelanggaran moderasi atau perilaku buruk akan memicu sanksi otomatis:
- **Strike 1**: Non-aktif 48 Jam.
- **Strike 2**: Beku 1 Minggu.
- **Strike 3 (Permanent)**: Banned Permanen & NIK masuk ke `blacklisted_niks`.

---

## 🌐 5. Infrastruktur Online & Tunnel Management

### A. Migrasi Tunnel (Ngrok)
Setelah mengalami ketidakstabilan dengan Localtunnel, sistem kini beralih menggunakan **Ngrok** dengan domain statis untuk menjamin koneksi Sales App (APK) yang selalu aktif.
- **Domain API**: `https://nonmoderately-catechetical-iker.ngrok-free.dev`

### B. Konfigurasi Client (Flutter)
Aplikasi Sales telah diperbarui dengan logic "Bypass Tunnel Reminder":
- Header `Bypass-Tunnel-Reminder: true` dan `localtunnel-skip-warning: true` disematkan pada setiap request API.
- Proteksi `try-catch` pada parsing JSON untuk menangani error jaringan secara elegan dengan SnackBar merah.

### C. Persistensi via PM2
Seluruh jantung aplikasi dikelola oleh PM2 agar hidup otomatis saat server/laptop restart:
- `jaskuy-backend`: Server utama (Port 3000).
- `jaskuy-admin`: Dashboard React/Vite (Port 5173).
- `api-tunnel`: Script monitoring tunnel.

---

## ✅ Status Sistem: ONLINE & SIAP UJI COBA
Semua komponen kini terhubung. Aplikasi **Sales App (Flutter)** versi terbaru siap digunakan untuk pendaftaran dan pengelolaan Mitra secara real-time melalui jaringan internet publik.

---
*Laporan ini dihasilkan secara otomatis oleh Antigravity AI sebagai dokumentasi final proyek Jaskuy.*
```

### File: `migrasi_schema_supabase.md`

```md
# Walkthrough: Supabase Schema Migration

Ayo kita setup database Supabasenya gan:

```sql
-- 1. ENUMS (Tipe Data Standar Aplikasi)
CREATE TYPE service_category AS ENUM ('PHYSICAL', 'DIGITAL');
CREATE TYPE tier_badge AS ENUM ('GREEN', 'BLUE', 'RED');
CREATE TYPE account_status AS ENUM ('ACTIVE', 'DISABLED', 'FROZEN', 'BANNED_TEMP', 'BANNED_PERM');
CREATE TYPE user_role AS ENUM ('USER', 'MITRA');
CREATE TYPE booking_status AS ENUM ('SEARCHING', 'MATCHED', 'WORKING', 'AWAITING_CONFIRMATION', 'COMPLETED', 'CANCELLED');
CREATE TYPE mitra_work_status AS ENUM ('AVAILABLE', 'WORKING', 'OFFLINE');
CREATE TYPE ad_tier_rank AS ENUM ('RANK_1_NEWBIE', 'RANK_2_RECOVERY', 'ORGANIC');

-- 2. TABEL BLACKLIST (NIK)
CREATE TABLE blacklisted_niks (
    nik VARCHAR(20) PRIMARY KEY,
    reason TEXT NOT NULL,
    banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABEL USER (Konsumen)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    strike_count INT DEFAULT 0,
    rating_avg DECIMAL(3,2) DEFAULT 0.00,
    status account_status DEFAULT 'ACTIVE',
    suspended_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABEL MITRA (Penyedia Jasa) PLUS V4 COLUMNS
CREATE TABLE mitras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nik VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    dob DATE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    is_kyc_verified BOOLEAN DEFAULT FALSE,
    work_status mitra_work_status DEFAULT 'OFFLINE',
    current_location GEOGRAPHY(POINT, 4326),
    
    max_concurrent_slots INT DEFAULT 1,
    active_working_slots INT DEFAULT 0,
    
    total_users_served INT DEFAULT 0,
    rating_avg DECIMAL(3,2) DEFAULT 0.00,
    badge_tier tier_badge DEFAULT 'GREEN',
    wallet_balance DECIMAL(15,2) DEFAULT 0.00,
    
    strike_count INT DEFAULT 0,
    status account_status DEFAULT 'ACTIVE',
    suspended_until TIMESTAMP WITH TIME ZONE,
    
    -- V4 & Merch Columns
    referred_by_sales_id UUID REFERENCES sales_agents(id) ON DELETE SET NULL,
    city VARCHAR(100),
    registration_paid BOOLEAN DEFAULT FALSE,
    merch_status VARCHAR(50) DEFAULT 'NONE',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABEL IKLAN PRIORITAS
CREATE TABLE mitra_priority_ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mitra_id UUID REFERENCES mitras(id) ON DELETE CASCADE,
    ad_rank ad_tier_rank NOT NULL,
    amount_paid DECIMAL(15,2) NOT NULL, 
    initial_quota INT DEFAULT 15,
    quota_remaining INT DEFAULT 15,
    visibility_score DECIMAL(5,2) DEFAULT 100.00, 
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABEL KATALOG JASA
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category service_category NOT NULL, 
    avg_market_price DECIMAL(15,2) DEFAULT 0.00
);

CREATE TABLE mitra_services (
    mitra_id UUID REFERENCES mitras(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    base_price DECIMAL(15,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (mitra_id, service_id)
);

-- 7. TABEL BOOKING 
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    mitra_id UUID REFERENCES mitras(id),
    service_id UUID REFERENCES services(id),
    status booking_status DEFAULT 'SEARCHING',
    
    user_booking_location GEOGRAPHY(POINT, 4326),
    distance_km DECIMAL(6,2), 
    is_out_of_range BOOLEAN DEFAULT FALSE, 
    out_of_range_fee DECIMAL(10,2) DEFAULT 0.00,
    priority_ad_consumed_id UUID REFERENCES mitra_priority_ads(id), 
    
    original_service_price DECIMAL(15,2) NOT NULL, 
    admin_fee DECIMAL(10,2) DEFAULT 1500.00,       
    
    management_cut_percent INT NOT NULL,             
    management_cut_amount DECIMAL(15,2) NOT NULL,    
    insurance_fee_amount DECIMAL(15,2) NOT NULL,     
    cashback_bonus_amount DECIMAL(15,2) DEFAULT 0,   
    
    tips_amount DECIMAL(15,2) DEFAULT 0.00,
    
    total_paid_by_user DECIMAL(15,2) NOT NULL,       
    net_earned_by_mitra DECIMAL(15,2) NOT NULL,      
    
    started_at TIMESTAMP,
    mitra_finished_at TIMESTAMP, 
    completed_at TIMESTAMP,      
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. TABEL REVIEWS 
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    reviewer_role user_role NOT NULL, 
    reviewer_user_id UUID,  
    reviewer_mitra_id UUID, 
    target_user_id UUID,    
    target_mitra_id UUID,   
    rating DECIMAL(2,1) CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (booking_id, reviewer_role)
);

-- 9. TABEL MODERASI CHAT
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    sender_role user_role NOT NULL, 
    sender_id UUID NOT NULL,
    message_content TEXT NOT NULL,
    is_censored BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE regex_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID REFERENCES chat_messages(id),
    violator_role user_role NOT NULL,
    violator_id UUID NOT NULL,
    violation_keyword TEXT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. TABEL PENALTI 3-STRIKES 
CREATE TABLE penalty_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offender_role user_role NOT NULL, 
    offender_id UUID NOT NULL,
    triggered_by UUID, 
    strike_number INT NOT NULL, 
    action_taken VARCHAR(100) NOT NULL, 
    reason TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. TABEL KOMISI SALES
CREATE TABLE sales_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sales_id UUID REFERENCES sales_agents(id) ON DELETE CASCADE,
    mitra_id UUID REFERENCES mitras(id) ON DELETE CASCADE,
    base_fee_net DECIMAL(15,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL, 
    company_revenue DECIMAL(10,2) NOT NULL, 
    status VARCHAR(50) DEFAULT 'PENDING', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. TABEL IKLAN PREMIUM PRO 
CREATE TABLE premium_pro_ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mitra_id UUID REFERENCES mitras(id) ON DELETE CASCADE,
    city VARCHAR(100) NOT NULL,
    amount_paid DECIMAL(15,2) DEFAULT 3000000.00,
    active_until TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
```

### File: `migrate_sales.js`

```javascript
const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'jaskuy',
    password: 'postgres',
    port: 5432,
});

async function migrateSales() {
    try {
        await pool.query(`ALTER TABLE sales_agents ADD COLUMN IF NOT EXISTS email VARCHAR(150) UNIQUE`);
        await pool.query(`ALTER TABLE sales_agents ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)`);
        console.log('Successfully altered sales_agents table on IPv4.');
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}

migrateSales();
```

### File: `output_data.json`

```json
��= = =   D A T A   T E R A K H I R   D A R I   D A T A B A S E   = = =  
 
```

### File: `package.json`

```json
{
  "name": "jaskuy-backend",
  "version": "1.0.0",
  "description": "Backend for High-End Gig Economy App",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "tunnel:backend": "lt --port 3000 --subdomain jaskuyb2026"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.1",
    "jsonwebtoken": "^9.0.2",
    "localtunnel": "^2.0.2",
    "node-cron": "^4.2.1",
    "pg": "^8.13.1",
    "socket.io": "^4.8.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.7"
  }
}
```

### File: `panduan_migrasi_supabase.md`

```md
# Panduan Lengkap Migrasi Database ke Supabase

Laporan ini ditujukan sebagai dokumentasi panduan perpindahan lingkungan database dari lokal (PostgreSQL) ke Cloud menggunakan **Supabase**. Langkah ini krusial untuk meringankan beban *laptop/server* lokal dan sebagai pondasi dasar menuju *Production Phase*.

---

## 1. Perbaikan File `.env` (Environment Variables)

Untuk menggunakan URL Connection String yang ringkas, tambahkan variabel baru `DATABASE_URL` ke dalam file `.env` proyek agan:

```env
# Tambahkan ini di file .env agan:
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.acepmeqeomyfxzkxenou.supabase.co:5432/postgres"

# Jangan lupa ganti [YOUR-PASSWORD] dengan password database Supabase agan.
```

---

## 2. Pembaruan Konfigurasi Koneksi (Node.js/Express)

Supabase mewajibkan koneksi dienskripsi menggunakan mode SSL. Oleh karena itu, semua file konfigurasi *Connection Pool* Node.js harus diperbarui.
Saya akan langsung **memperbaiki dua file database** milik agan, yaitu:
1. `src/config/db.js`
2. `src/infrastructure/database/db.js`

Kedua file tersebut akan saya perbarui logic `new Pool(...)`-nya menjadi seperti ini:

```javascript
const pool = new Pool({
    // Menggunakan Connection String Supabase jika ada
    connectionString: process.env.DATABASE_URL,
    
    // Atau fallback ke credentials lama jika DATABASE_URL tidak diset
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    
    // [WAJIB SUPABASE] Menambahkan konfigurasi SSL agar tidak ditolak
    ssl: { 
        rejectUnauthorized: false 
    }
});
```

---

## 3. Pembuatan Tabel Awal (SQL Migration untuk Supabase)

Karena Supabase agan saat ini kosong melompong secara struktur tabel, untuk mencegah *error 500* saat registrasi Sales App, agan harus membuat ulang tabel `sales_agents` terlebih dahulu. 

Silakan **Copy - Paste** *script* SQL di bawah ini ke fitur **SQL Editor di Dashboard Supabase** agan lalu jalankan (Run):

```sql
-- Mengaktifkan ekstensi utilitas uuid (Opsional namun direkomendasikan Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Membuat tabel utama Sales Agent
CREATE TABLE IF NOT EXISTS sales_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone_number VARCHAR(20),       -- Menambahkan kolom nomor HP sesuai instruksi
    password_hash VARCHAR(255) NOT NULL,
    referral_code VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

Setelah tabel ini terbentuk, *endpoint* POST `/api/auth/sales/register` tidak lagi mengalami error 500 asalkan koneksi `.env` telah sesuai.
```

### File: `panduan_migrasi_supabase_v2.md`

```md
# Panduan Migrasi Supabase V2 (IPv4 Connection Pooler)

Panduan ini berisi langkah-langkah final untuk migrasi PostgreSQL server lokal agan menuju **Supabase Cloud**, lengkap beserta struktur tabel yang dibutuhkan agar aplikasi *backend* dan Flutter Sales App agan tidak mengalami Error 500 / 502 Bad Gateway.

---

## 1. Perbaikan File `.env` (Selesai)

Saya baru saja memperbarui file `.env` di sistem agan untuk menggunakan Connection Pooler (Jaringan IPv4) dari Supabase sesuai yang agan instruksikan:

```env
DATABASE_URL="postgresql://postgres.acepmeqeomyfxzkxenou:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```
**LANGKAH AGAN:** Buka file `.env` di laptop agan, lalu ganti teks `[YOUR-PASSWORD]` dengan kata sandi Supabase agan dan **Save/Simpan**.

---

## 2. Perbaikan Konfigurasi Koneksi SSL (Selesai)

Saya **sudah menyematkan aturan SSL Wajib** (`ssl: { rejectUnauthorized: false }`) pada kedua file koneksi Node.js agan di langkah sebelumnya.
Kode di `src/config/db.js` dan `src/infrastructure/database/db.js` sudah sepenuhnya kompatibel dan tidak akan menolak koneksi dari Supabase:

```javascript
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // KODE INI SUDAH TERPASANG
    // ...
});
```
Agan **tidak perlu mengubah file kode Node.js apa pun lagi**.

---

## 3. Pembuatan Tabel Awal (SQL Migration)

Karena Supabase yang agan buat masih kosongan, API backend untuk registrasi Sales akan otomatis *crash* jika tidak menemukan tabel dan kolom yang sesuai.

Silakan **Copy - Paste kueri SQL di bawah ini ke SQL Editor di dashboard Supabase agan** lalu jalankan (Run).
Kueri ini akan membuat tabel khusus agen *sales* lengkap dengan 4 kolom wajib (`name, email, password_hash, phone_number`):

```sql
-- Mengaktifkan ekstensi UUID generator bawaan PostgreSQL/Supabase
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Membuat struktur tabel sales_agents yang sejalan dengan kode backend agan
CREATE TABLE IF NOT EXISTS sales_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone_number VARCHAR(20),       -- Tambahan kolom nomor handphone
    password_hash VARCHAR(255) NOT NULL,
    referral_code VARCHAR(50) UNIQUE NOT NULL, -- Di-generate auto oleh Backend
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## ✅ Langkah Terakhir Instalasi
1. Ganti `[YOUR-PASSWORD]` di `.env`.
2. Eksekusi Kueri `CREATE TABLE` di atas melalui Dashboard Supabase.
3. Kabari saya lagi, agar saya merestart *server backend* agan (`pm2 restart`) dan melakukan testing pendaftaran API melalui Node.js.
```

### File: `pm2_list.json`

```json
��[ ]  
 
```

### File: `query_tables.js`

```javascript
require('dotenv').config();
const db = require('./src/infrastructure/database/db');

async function checkSchema() {
    try {
        const res = await db.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log("TABLES IN DATABASE:");
        res.rows.forEach(r => console.log(r.table_name));

        const users = await db.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'`);
        console.log("\nUSERS TABLE COLUMNS:");
        users.rows.forEach(r => console.log(r.column_name, r.data_type));

        const sales = await db.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'sales_agents'`);
        console.log("\nSALES_AGENTS TABLE COLUMNS:");
        sales.rows.forEach(r => console.log(r.column_name, r.data_type));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkSchema();
```

### File: `query_tables2.js`

```javascript
require('dotenv').config();
const db = require('./src/infrastructure/database/db');

async function checkSchema2() {
    try {
        const res = await db.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log("ALL PUBLIC TABLES:");
        res.rows.forEach(r => console.log(r.table_name));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkSchema2();
```

### File: `sales-app/lib/main.dart`

```dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'screens/login_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: const JaskuySalesApp(),
    ),
  );
}

class JaskuySalesApp extends StatelessWidget {
  const JaskuySalesApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Jaskuy Sales',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFEAB308), // Tailwind Yellow 500
          primary: const Color(0xFFEAB308),
          secondary: const Color(0xFF111827), // Gray 900
          background: const Color(0xFFF3F4F6), // Gray 100
        ),
        textTheme: GoogleFonts.interTextTheme(
          Theme.of(context).textTheme,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFEAB308),
            foregroundColor: const Color(0xFF111827),
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            padding: const EdgeInsets.symmetric(vertical: 16),
            textStyle: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.5,
            ),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.white,
          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFFEAB308), width: 2),
          ),
        ),
      ),
      home: const LoginScreen(),
    );
  }
}
```

### File: `sales-app/lib/providers/auth_provider.dart`

```dart
import 'package:flutter/material.dart';

class AuthProvider extends ChangeNotifier {
  String? _token;
  String? _salesId;
  String? _salesName;

  String? get token => _token;
  String? get salesId => _salesId;
  String? get salesName => _salesName;
  bool get isAuthenticated => _token != null;

  void setAuthData(String token, String id, String name) {
    _token = token;
    _salesId = id;
    _salesName = name;
    notifyListeners();
  }

  void logout() {
    _token = null;
    _salesId = null;
    _salesName = null;
    notifyListeners();
  }
}
```

### File: `sales-app/lib/screens/dashboard_screen.dart`

```dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';
import 'login_screen.dart';
import 'mitra_registration_screen.dart';
import 'history_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final ApiService _apiService = ApiService();
  int _totalRecruited = 0;
  int _totalCommission = 0;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadSalesData();
  }

  Future<void> _loadSalesData() async {
    try {
      final response = await _apiService.get('/sales/profile');

      print("DASHBOARD Response Status: ${response.statusCode}");
      print("DASHBOARD Response Body: ${response.body}");

      dynamic data;
      try {
        data = jsonDecode(response.body);
      } catch (e) {
        throw Exception(
            "Gagal membaca JSON dari server.\nRespons: ${response.body.length > 50 ? response.body.substring(0, 50) : response.body}...");
      }

      if (response.statusCode == 200 && data['success'] == true) {
        setState(() {
          _totalRecruited = data['data']['total_recruited'] ?? 0;
          _totalCommission = data['data']['total_commission'] ?? 0;
          _isLoading = false;
        });
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
              content: Text(data['message'] ?? 'Gagal memuat data dashboard'),
              backgroundColor: Colors.red));
        }
        setState(() => _isLoading = false);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: Text(e.toString().replaceAll("Exception: ", "")),
            backgroundColor: Colors.red));
        setState(() => _isLoading = false);
      }
    }
  }

  void _logout() async {
    context.read<AuthProvider>().logout();
    if (mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LoginScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Jaskuy Sales Team',
            style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.history, color: Colors.black87),
            onPressed: () => Navigator.push(context,
                MaterialPageRoute(builder: (context) => const HistoryScreen())),
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.black87),
            onPressed: _logout,
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Halo, ${auth.salesName ?? 'Agen'}! 👋',
                style:
                    const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text('Terus semangat cari Mitra, komisi menanti!',
                  style: TextStyle(color: Colors.grey)),
              const SizedBox(height: 32),
              if (_isLoading)
                const Center(child: CircularProgressIndicator())
              else
                Row(
                  children: [
                    Expanded(
                      child: _buildStatCard(
                        'Total Direkrut',
                        '$_totalRecruited',
                        Icons.people_alt_rounded,
                        Colors.blue.shade100,
                        Colors.blue.shade700,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _buildStatCard(
                        'Komisi Estimasi',
                        'Rp ${_totalCommission.toString().replaceAll(RegExp(r'\\B(?=(\\d{3})+(?!\\d))'), '.')}',
                        Icons.payments_rounded,
                        Colors.green.shade100,
                        Colors.green.shade700,
                      ),
                    ),
                  ],
                ),
              const Spacer(),
              Container(
                width: double.infinity,
                height: 80,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                        color: Theme.of(context)
                            .colorScheme
                            .primary
                            .withOpacity(0.3),
                        blurRadius: 20,
                        offset: const Offset(0, 10))
                  ],
                ),
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) =>
                                const MitraRegistrationScreen())).then((_) =>
                        _loadSalesData()); // Reload stats when coming back
                  },
                  icon: const Icon(Icons.person_add_alt_1_rounded, size: 32),
                  label: const Text('DAFTARKAN MITRA BARU',
                      style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1)),
                  style: ElevatedButton.styleFrom(
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20))),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon,
      Color bgColor, Color iconColor) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(
              color: Colors.grey.shade100,
              blurRadius: 10,
              offset: const Offset(0, 4))
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
                color: bgColor, borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: iconColor, size: 24),
          ),
          const SizedBox(height: 16),
          Text(title,
              style: TextStyle(
                  fontSize: 13,
                  color: Colors.grey.shade600,
                  fontWeight: FontWeight.w500)),
          const SizedBox(height: 4),
          Text(value,
              style:
                  const TextStyle(fontSize: 22, fontWeight: FontWeight.w900)),
        ],
      ),
    );
  }
}
```

### File: `sales-app/lib/screens/history_screen.dart`

```dart
import 'dart:convert';
import 'package:flutter/material.dart';
import '../services/api_service.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  final ApiService _apiService = ApiService();
  List<dynamic> _historyData = [];
  bool _isLoading = true;
  String _errorMessage = '';

  @override
  void initState() {
    super.initState();
    _fetchHistory();
  }

  Future<void> _fetchHistory() async {
    try {
      final response = await _apiService.get('/sales/mitra-history');
      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        setState(() {
          _historyData = data['data'];
          _isLoading = false;
        });
      } else {
        setState(() {
          _errorMessage = data['message'] ?? 'Gagal mengambil data';
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Gagal terhubung ke server Jaskuy.';
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Riwayat Recruitment', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black87),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage.isNotEmpty
              ? Center(child: Text(_errorMessage, style: const TextStyle(color: Colors.red)))
              : _historyData.isEmpty
                  ? const Center(child: Text('Belum ada mitra yang direkrut.', style: TextStyle(color: Colors.grey)))
                  : ListView.separated(
                      itemCount: _historyData.length,
                      separatorBuilder: (context, index) => Divider(color: Colors.grey.shade200, height: 1),
                      itemBuilder: (context, index) {
                        final item = _historyData[index];
                        final category = item['category'] ?? 'PHYSICAL';
                        final status = item['status'] ?? 'UNKNOWN';

                        Color statusColor = Colors.grey;
                        String statusText = status;

                        if (status == 'REGISTERED_PAID') {
                          statusColor = Colors.green;
                          statusText = 'Paid (Komisi Rp 1.500)';
                        } else if (status == 'PENDING_PAYMENT') {
                          statusColor = Colors.orange;
                          statusText = 'Menunggu Pembayaran';
                        }

                        return ListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                          leading: CircleAvatar(
                            backgroundColor: category == 'PHYSICAL' ? Colors.blue.shade100 : Colors.purple.shade100,
                            child: Icon(category == 'PHYSICAL' ? Icons.directions_run : Icons.computer, color: category == 'PHYSICAL' ? Colors.blue.shade700 : Colors.purple.shade700),
                          ),
                          title: Text(item['name'] ?? 'No Name', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 4),
                              Text('NIK: ${item['nik'] ?? '-'}', style: const TextStyle(fontFamily: 'monospace', fontSize: 12)),
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  Icon(Icons.circle, size: 8, color: statusColor),
                                  const SizedBox(width: 6),
                                  Text(statusText, style: TextStyle(color: statusColor, fontWeight: FontWeight.bold, fontSize: 12)),
                                ],
                              )
                            ],
                          ),
                          trailing: Text(item['date'] ?? '-', style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
                        );
                      },
                    ),
    );
  }
}
```

### File: `sales-app/lib/screens/login_screen.dart`

```dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';
import 'mitra_registration_screen.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final ApiService _apiService = ApiService();
  bool _isLoading = false;

  void _login() async {
    if (_emailController.text.isEmpty || _passwordController.text.isEmpty) {
      _showError('Email/Nama dan Password tidak boleh kosong!');
      return;
    }

    setState(() => _isLoading = true);

    try {
      final response = await _apiService.post('/auth/sales/login', {
        'email_or_name': _emailController.text,
        'password': _passwordController.text,
      });

      print("LOGIN Response Status: ${response.statusCode}");
      print("LOGIN Response Body: ${response.body}");

      dynamic data;
      try {
        data = jsonDecode(response.body);
      } catch (e) {
        throw Exception(
            "Gagal membaca JSON. Localtunnel mungkin memblokir koneksi.\nRespons: ${response.body.length > 50 ? response.body.substring(0, 50) : response.body}...");
      }

      if (response.statusCode == 200 && data['success'] == true) {
        final token = data['data']['token'];
        final sales = data['data']['sales'];

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('jwt_token', token);
        await prefs.setString('sales_name', sales['name']);
        await prefs.setString('sales_id', sales['id'].toString());

        if (mounted) {
          context
              .read<AuthProvider>()
              .setAuthData(token, sales['id'].toString(), sales['name']);

          // Simpan referral_code ke SharedPreferences
          await prefs.setString(
              'sales_referral_code', sales['referral_code'] ?? '');

          // LANGSUNG MASUK KE UI PENDAFTARAN MITRA BARU (Sesuai Permintaan)
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
                builder: (context) => const MitraRegistrationScreen()),
          );
        }
      } else {
        _showError(data['message'] ?? 'Login gagal, periksa kredensial Anda.');
      }
    } catch (e) {
      _showError(e.toString().replaceAll("Exception: ", ""));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: Colors.red),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 60),
              Center(
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color:
                        Theme.of(context).colorScheme.primary.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(Icons.rocket_launch_rounded,
                      size: 80, color: Theme.of(context).colorScheme.primary),
                ),
              ),
              const SizedBox(height: 32),
              const Text(
                'Jaskuy Sales V1.0.1',
                style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF111827)),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              const Text(
                'Portal khusus mendaftarkan Mitra Baru ke ekosistem Jaskuy.',
                style: TextStyle(fontSize: 14, color: Color(0xFF6B7280)),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 48),
              TextField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(
                    labelText: 'Email atau Nama Sales',
                    prefixIcon: Icon(Icons.email_outlined)),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _passwordController,
                obscureText: true,
                decoration: const InputDecoration(
                    labelText: 'Password',
                    prefixIcon: Icon(Icons.lock_outline)),
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: _isLoading ? null : _login,
                child: _isLoading
                    ? const SizedBox(
                        height: 24,
                        width: 24,
                        child: CircularProgressIndicator(
                            strokeWidth: 2, color: Colors.black))
                    : const Text('MASUK'),
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Belum punya akun?',
                      style: TextStyle(color: Colors.grey)),
                  TextButton(
                    onPressed: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => const RegisterScreen()));
                    },
                    child: const Text('Daftar Penyalur',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                  )
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
```

### File: `sales-app/lib/screens/mitra_registration_screen.dart`

```dart
import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';

class MitraRegistrationScreen extends StatefulWidget {
  const MitraRegistrationScreen({super.key});

  @override
  State<MitraRegistrationScreen> createState() =>
      _MitraRegistrationScreenState();
}

class _MitraRegistrationScreenState extends State<MitraRegistrationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _nikController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController(); // NEW
  final _dobController = TextEditingController(); // NEW
  final _passwordController = TextEditingController();
  String _selectedCategory = 'PHYSICAL';

  File? _ktpImage;
  File? _selfieImage;
  bool _isSubmitting = false;
  int _recruitedCount = 0;
  bool _isLoadingStats = true;

  final ImagePicker _picker = ImagePicker();
  final ApiService _apiService = ApiService();

  @override
  void initState() {
    super.initState();
    _fetchStats();
  }

  Future<void> _fetchStats() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final referralCode = prefs.getString('sales_referral_code') ?? '';
      if (referralCode.isEmpty) return;

      final response =
          await _apiService.get('/sales/stats?referral_code=$referralCode');
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success']) {
          setState(() {
            _recruitedCount = data['recruited'];
          });
        }
      }
    } catch (e) {
      print("Gagal mengambil stats: $e");
    } finally {
      if (mounted) setState(() => _isLoadingStats = false);
    }
  }

  Future<void> _pickImage(bool isKtp) async {
    final XFile? image =
        await _picker.pickImage(source: ImageSource.camera, imageQuality: 80);
    if (image != null) {
      setState(() {
        if (isKtp) {
          _ktpImage = File(image.path);
        } else {
          _selfieImage = File(image.path);
        }
      });
    }
  }

  void _submitData() async {
    if (!_formKey.currentState!.validate()) return;
    if (_ktpImage == null || _selfieImage == null) {
      _showMessage('Foto KTP dan Wajah wajib dilampirkan!', isError: true);
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      final prefs = await SharedPreferences.getInstance();
      final referralCode = prefs.getString('sales_referral_code') ?? '';

      final response = await _apiService.post(
        '/auth/mitra/register',
        {
          'nik': _nikController.text,
          'name': _nameController.text,
          'dob': _dobController.text,
          'phone': _phoneController.text,
          'email': _emailController.text,
          'password': _passwordController.text,
          'category': _selectedCategory,
          'referred_by_sales_code': referralCode,
        },
      );

      print("REGISTRATION Response Status: \${response.statusCode}");
      print("REGISTRATION Response Body: \${response.body}");

      dynamic data;
      try {
        data = jsonDecode(response.body);
      } catch (e) {
        throw Exception(
            "Gagal membaca JSON. Localtunnel mungkin memblokir koneksi.\\nRespons: \${response.body.length > 50 ? response.body.substring(0, 50) : response.body}...");
      }

      if (response.statusCode == 200 || response.statusCode == 201) {
        if (mounted) _showSuccessDialog();
      } else {
        _showMessage(data['message'] ?? 'Pendaftaran gagal', isError: true);
      }
    } catch (e) {
      _showMessage(e.toString().replaceAll("Exception: ", ""), isError: true);
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  void _showMessage(String text, {required bool isError}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
          content: Text(text),
          backgroundColor: isError ? Colors.red : Colors.green),
    );
  }

  void _resetForm() {
    _nameController.clear();
    _nikController.clear();
    _phoneController.clear();
    _emailController.clear();
    _dobController.clear();
    _passwordController.clear();
    setState(() {
      _ktpImage = null;
      _selfieImage = null;
      _selectedCategory = 'PHYSICAL';
      _recruitedCount++; // Optimistically increment
    });
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Center(
            child: Icon(Icons.check_circle_rounded,
                color: Colors.green, size: 60)),
        content: const Text(
          'Pendaftaran Sukses!\nData mitra berhasil ditambahkan. Silahkan daftarkan mitra selanjutnya.',
          textAlign: TextAlign.center,
        ),
        actions: [
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close dialog
                _resetForm(); // Reset instead of going back
              },
              child: const Text('DAFTARKAN LAGI'),
            ),
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Buat Akun Mitra',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black87),
        actions: [
          if (!_isLoadingStats)
            Center(
              child: Container(
                margin: const EdgeInsets.only(right: 16),
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    Icon(Icons.people_alt,
                        color: Theme.of(context).colorScheme.primary, size: 16),
                    const SizedBox(width: 4),
                    Text(
                      '$_recruitedCount Mitra',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.primary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                    labelText: 'Nama Lengkap (Sesuai KTP)',
                    prefixIcon: Icon(Icons.person)),
                validator: (val) => val!.isEmpty ? 'Wajib diisi' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _nikController,
                keyboardType: TextInputType.number,
                maxLength: 16,
                decoration: const InputDecoration(
                    labelText: 'NIK KTP (16 Digit)',
                    prefixIcon: Icon(Icons.credit_card)),
                validator: (val) => val!.length != 16 ? 'Harus 16 digit' : null,
              ),
              const SizedBox(height: 4),
              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                    labelText: 'No. WhatsApp',
                    prefixIcon: Icon(Icons.phone_android)),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(
                    labelText: 'Email Aktif', prefixIcon: Icon(Icons.email)),
                validator: (val) => val!.isEmpty ? 'Email wajib diisi' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _dobController,
                readOnly: true,
                decoration: const InputDecoration(
                    labelText: 'Tanggal Lahir (YYYY-MM-DD)',
                    prefixIcon: Icon(Icons.calendar_today)),
                onTap: () async {
                  DateTime? picked = await showDatePicker(
                    context: context,
                    initialDate: DateTime(2000),
                    firstDate: DateTime(1950),
                    lastDate: DateTime.now(),
                  );
                  if (picked != null) {
                    setState(() {
                      _dobController.text =
                          "${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}";
                    });
                  }
                },
                validator: (val) => val!.isEmpty ? 'DOB wajib diisi' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _passwordController,
                obscureText: true,
                decoration: const InputDecoration(
                    labelText: 'Password Akun Mitra',
                    prefixIcon: Icon(Icons.lock)),
              ),
              const SizedBox(height: 24),
              DropdownButtonFormField<String>(
                initialValue: _selectedCategory,
                decoration:
                    const InputDecoration(labelText: 'Kategori Jasa Utama'),
                items: const [
                  DropdownMenuItem(
                      value: 'PHYSICAL',
                      child: Text('Jasa Fisik (Berdasarkan Lokasi)')),
                  DropdownMenuItem(
                      value: 'DIGITAL', child: Text('Jasa Digital (Remote)')),
                ],
                onChanged: (val) => setState(() => _selectedCategory = val!),
              ),
              const SizedBox(height: 32),
              const Text('Dokumen Wajib (Camera Only)',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                      child: _buildPhotoUploader(
                          'Foto KTP', _ktpImage, () => _pickImage(true))),
                  const SizedBox(width: 16),
                  Expanded(
                      child: _buildPhotoUploader('Selfie dgn KTP', _selfieImage,
                          () => _pickImage(false))),
                ],
              ),
              const SizedBox(height: 40),
              ElevatedButton(
                onPressed: _isSubmitting ? null : _submitData,
                child: _isSubmitting
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                            strokeWidth: 2, color: Colors.black))
                    : const Text('SUBMIT PENDAFTARAN (MULTIPART)'),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPhotoUploader(
      String title, File? imageFile, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        height: 140,
        decoration: BoxDecoration(
            color: Colors.grey.shade100,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.grey.shade300)),
        child: imageFile != null
            ? ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.file(imageFile,
                    fit: BoxFit.cover, width: double.infinity))
            : Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.camera_alt_outlined,
                      color: Colors.grey.shade500, size: 36),
                  const SizedBox(height: 8),
                  Text(title,
                      style: TextStyle(
                          color: Colors.grey.shade600,
                          fontSize: 13,
                          fontWeight: FontWeight.bold)),
                ],
              ),
      ),
    );
  }
}
```

### File: `sales-app/lib/screens/register_screen.dart`

```dart
import 'dart:convert';
import 'package:flutter/material.dart';
import '../services/api_service.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final ApiService _apiService = ApiService();
  bool _isLoading = false;

  void _register() async {
    if (_nameController.text.isEmpty ||
        _emailController.text.isEmpty ||
        _passwordController.text.isEmpty) {
      _showError('Semua kolom wajib diisi!');
      return;
    }

    if (_passwordController.text.length < 3) {
      _showError('Password minimal 3 karakter!');
      return;
    }

    setState(() => _isLoading = true);

    try {
      final response = await _apiService.post('/auth/sales/register', {
        'name': _nameController.text,
        'email': _emailController.text,
        'password': _passwordController.text,
      });

      print("REGISTER Response Status: ${response.statusCode}");
      print("REGISTER Response Body: ${response.body}");

      dynamic data;
      try {
        data = jsonDecode(response.body);
      } catch (e) {
        throw Exception(
            "Gagal membaca JSON. Localtunnel mungkin memblokir koneksi.\nRespons: ${response.body.length > 50 ? response.body.substring(0, 50) : response.body}...");
      }

      if (response.statusCode == 201 && data['success'] == true) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
                content:
                    Text('Pendaftaran berhasil! Silakan login untuk masuk.'),
                backgroundColor: Colors.green),
          );
          Navigator.pop(context); // Kembali ke layar Login
        }
      } else {
        String errorMsg = data['message'] ?? 'Pendaftaran gagal.';
        if (data['error'] != null) {
          errorMsg += '\nDetail: ${data['error']}';
        }
        _showError('Error ${response.statusCode}: $errorMsg');
      }
    } catch (e) {
      _showError(e.toString().replaceAll("Exception: ", ""));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: Colors.red),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Daftar Sales Baru',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black87),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 20),
              TextField(
                controller: _nameController,
                decoration: const InputDecoration(
                    labelText: 'Nama Lengkap',
                    prefixIcon: Icon(Icons.person_outline)),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(
                    labelText: 'Email', prefixIcon: Icon(Icons.email_outlined)),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _passwordController,
                obscureText: true,
                decoration: const InputDecoration(
                    labelText: 'Password (Min 3 Karakter)',
                    prefixIcon: Icon(Icons.lock_outline)),
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: _isLoading ? null : _register,
                child: _isLoading
                    ? const SizedBox(
                        height: 24,
                        width: 24,
                        child: CircularProgressIndicator(
                            strokeWidth: 2, color: Colors.black))
                    : const Text('DAFTAR SEKARANG'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

### File: `sales-app/lib/services/api_service.dart`

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  // Configured to physical network IP so APK works on real Android devices globally
  static const String baseUrl =
      'https://nonmoderately-catechetical-iker.ngrok-free.dev/api';

  Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('jwt_token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      'Bypass-Tunnel-Reminder': 'true',
      'localtunnel-skip-warning': 'true',
      'User-Agent': 'PostmanRuntime/7.28.4',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<http.Response> post(String endpoint, Map<String, dynamic> body) async {
    final headers = await _getHeaders();
    return await http.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: headers,
      body: jsonEncode(body),
    );
  }

  Future<http.Response> get(String endpoint) async {
    final headers = await _getHeaders();
    return await http.get(
      Uri.parse('$baseUrl$endpoint'),
      headers: headers,
    );
  }

  // Khusus untuk Multipart Request (Upload KTP & Selfie)
  Future<http.StreamedResponse> postMultipart({
    required String endpoint,
    required Map<String, String> fields,
    required String ktpFilePath,
    required String selfieFilePath,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('jwt_token');

    var request = http.MultipartRequest('POST', Uri.parse('$baseUrl$endpoint'));

    // Add Headers
    request.headers['ngrok-skip-browser-warning'] = 'true';
    request.headers['Bypass-Tunnel-Reminder'] = 'true';
    request.headers['localtunnel-skip-warning'] = 'true';
    request.headers['User-Agent'] = 'PostmanRuntime/7.28.4';
    if (token != null) {
      request.headers['Authorization'] = 'Bearer $token';
    }

    // Add Text Fields
    request.fields.addAll(fields);

    // Add Files
    request.files
        .add(await http.MultipartFile.fromPath('ktp_image', ktpFilePath));
    request.files
        .add(await http.MultipartFile.fromPath('selfie_image', selfieFilePath));

    return await request.send();
  }
}
```

### File: `sales-app/README.md`

```md
# jaskuy_sales_app

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Learn Flutter](https://docs.flutter.dev/get-started/learn-flutter)
- [Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Flutter learning resources](https://docs.flutter.dev/reference/learning-resources)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.
```

### File: `sales-app/test/widget_test.dart`

```dart
// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:jaskuy_sales_app/main.dart';

void main() {
  testWidgets('Counter increments smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const MyApp());

    // Verify that our counter starts at 0.
    expect(find.text('0'), findsOneWidget);
    expect(find.text('1'), findsNothing);

    // Tap the '+' icon and trigger a frame.
    await tester.tap(find.byIcon(Icons.add));
    await tester.pump();

    // Verify that our counter has incremented.
    expect(find.text('0'), findsNothing);
    expect(find.text('1'), findsOneWidget);
  });
}
```

### File: `show_latest_data.js`

```javascript
require('dotenv').config();
const db = require('./src/infrastructure/database/db');

async function showLatestData() {
    try {
        console.log("=== DATA TERAKHIR DARI DATABASE ===");

        // Latest Users
        const users = await db.query(`SELECT id, email, role, created_at, phone FROM users ORDER BY created_at DESC LIMIT 3`);
        console.log("\n[Users Terbaru]:");
        console.log(JSON.stringify(users.rows, null, 2));

        // Latest Mitras
        const mitras = await db.query(`SELECT id, user_id, status, type, display_name, created_at FROM mitras ORDER BY created_at DESC LIMIT 3`);
        console.log("\n[Mitra Terbaru]:");
        console.log(JSON.stringify(mitras.rows, null, 2));

        // Latest Sales
        const sales = await db.query(`SELECT id, user_id, referral_code, current_commission, total_earned, created_at FROM sales_agents ORDER BY created_at DESC LIMIT 3`);
        console.log("\n[Sales Terbaru]:");
        console.log(JSON.stringify(sales.rows, null, 2));

        process.exit(0);
    } catch (e) {
        console.error("Error fetching data:", e.message);
        process.exit(1);
    }
}

showLatestData();
```

### File: `src/app.js`

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import domain routes
const authRoutes = require('./domains/auth/auth.routes');
const mitraRoutes = require('./domains/mitras/mitra.routes');
const bookingRoutes = require('./domains/bookings/booking.routes');
const reviewRoutes = require('./domains/reviews/review.routes');

app.use('/api/auth', authRoutes);
app.use('/api/mitra', mitraRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/review', reviewRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Global Error Handler
app.use(require('./core/middlewares/errorHandler'));

module.exports = app;
```

### File: `src/config/db.js`

```javascript
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Konfigurasi node-postgres Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20, // Set pool max size
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, // Increased to 10 seconds for Cloud DB handshake
    ssl: { rejectUnauthorized: false }
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = {
    // Digunakan untuk single query
    query: (text, params) => pool.query(text, params),
    // Digunakan untuk Transactions (BEGIN, COMMIT, ROLLBACK)
    getClient: () => pool.connect()
};
```

### File: `src/core/middlewares/auth.js`

```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'No token provided. Unauthorized.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // { id, role }
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
};

const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden. Only ${allowedRoles.join(' or ')} can access this route.`
            });
        }
        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };
```

### File: `src/core/middlewares/auth.middleware.js`

```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Missing or invalid token' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Simpan data decoded ke req.user ({ id, role })
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Token expired or invalid' });
    }
};

const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Forbidden: You do not have the required permissions' });
        }
        next();
    };
};

module.exports = {
    authMiddleware,
    roleMiddleware
};
```

### File: `src/core/middlewares/errorHandler.js`

```javascript
module.exports = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
```

### File: `src/core/middlewares/strike.middleware.js`

```javascript
const db = require('../../config/db');

/**
 * Middleware untuk memblokir akses jika akun sedang terkena penalti (Strike 1, 2, atau 3)
 */
const strikeMiddleware = async (req, res, next) => {
    try {
        const { id, role } = req.user; // Didapat dari authMiddleware sebelumnya

        let queryText = '';
        if (role === 'USER') {
            queryText = 'SELECT status, suspended_until FROM users WHERE id = $1';
        } else if (role === 'MITRA') {
            queryText = 'SELECT status, suspended_until FROM mitras WHERE id = $1';
        } else {
            return res.status(403).json({ success: false, message: 'Invalid role' });
        }

        const result = await db.query(queryText, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        const { status, suspended_until } = result.rows[0];

        // Jika statusnya bukan ACTIVE (contoh: DISABLED, FROZEN, BANNED_PERM)
        if (status !== 'ACTIVE') {
            // Cek apakah masa suspensi sudah lewat 
            if (suspended_until && new Date() > new Date(suspended_until)) {
                // Auto-recovery jika masa hukuman selesai (Bisa dipindah ke CronJob, tapi ini *lazy-evaluation*)
                const updateQuery = role === 'USER'
                    ? 'UPDATE users SET status = $1, suspended_until = NULL WHERE id = $2'
                    : 'UPDATE mitras SET status = $1, suspended_until = NULL WHERE id = $2';

                await db.query(updateQuery, ['ACTIVE', id]);
                return next();
            }

            return res.status(403).json({
                success: false,
                message: `Account is restricted. Current status: ${status}`,
                suspended_until: suspended_until || 'Permanent'
            });
        }

        next();
    } catch (error) {
        console.error('[Strike Middleware] Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error during account validation' });
    }
};

module.exports = strikeMiddleware;
```

### File: `src/core/utils/regexModerator.js`

```javascript
/**
 * Regex pintar untuk mendeteksi bypass komunikasi di luar aplikasi
 * Mendeteksi variasi kata WhatsApp, Sosmed, dan Nomor Telepon
 */

const REGEX_PATTERNS = [
    // 1. Deteksi Nomor Handphone dengan variasi penulisan licik
    // Contoh: 0812, kosong lapan, +62, 0 8 1 2, nol delapan
    /(\+?62|0?8)[-\s]?([0-9]{3,4})[-\s]?([0-9]{3,4})[-\s]?([0-9]{3,4})/i,
    /(kosong|nol|o|O)[\s\-\_]*(lapan|delapan|8)[\s\-\_]*(satu|1|2|3|4|5|6|7|8|9|0)/i,

    // 2. Deteksi Ajakan pindah aplikasi (WhatsApp)
    /(wa|w a|wasap|whatsapp|w@|we a)[\s\-\_]*((nomor|no|pindah|chat|hubung|call|telp)[a-z]*)/i,

    // 3. Deteksi Sosial Media
    /(instagram|ig|instgrm|telegram|tele|tioktok|fb|facebook)[a-z\s\-\_]*(@[\w.]+)/i,

    // 4. Deteksi link
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/i
];

/**
 * Mencocokkan pesan dengan Regex. Jika terdeteksi masalah, return info pelanggaran.
 */
const checkViolation = (message) => {
    for (let i = 0; i < REGEX_PATTERNS.length; i++) {
        const match = message.match(REGEX_PATTERNS[i]);
        if (match) {
            return {
                isViolating: true,
                keywordMatched: match[0],
                patternIndex: i
            };
        }
    }
    return { isViolating: false };
};

module.exports = {
    checkViolation
};
```

### File: `src/cron.js`

```javascript
const cron = require('node-cron');
const escrowWorker = require('./domains/bookings/escrow.worker');
const chatGarbageCollector = require('./workers/chatGarbageCollector');

/**
 * Setup Cron Jobs terpusat
 */
const initiateCronJobs = () => {
    // 1. Jalankan pengecekan Escrow setiap jam di menit 00 (0 * * * *)
    cron.schedule('0 * * * *', async () => {
        console.log('[Cron] Running Auto Release Escrow Worker...');
        try {
            await escrowWorker.autoReleaseEscrowFunds();
        } catch (error) {
            console.error('[Cron] Escrow Worker Failed:', error);
        }
    });

    // 2. Jalankan Auto-Delete Chat setiap jam di menit 30 (30 * * * *)
    cron.schedule('30 * * * *', async () => {
        console.log('[Cron] Running Chat Garbage Collector...');
        try {
            await chatGarbageCollector.cleanUpOldChats();
        } catch (error) {
            console.error('[Cron] Chat Garbage Collector Failed:', error);
        }
    });

    console.log('✅ Background CronJobs Registered (Escrow & Chat Garbage Collector).');
};

module.exports = initiateCronJobs;
```

### File: `src/domains/admin/admin.controller.js`

```javascript
const db = require('../../infrastructure/database/db');

exports.getDashboardStats = async (req, res) => {
    try {
        // Query 1: Total Escrow Tertahan
        const escrowData = await db.query("SELECT COALESCE(SUM(total_paid_by_user), 0) as total FROM bookings WHERE status IN ('WORKING', 'AWAITING_CONFIRMATION')");
        const escrowAmount = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(escrowData.rows[0].total || 0).replace('IDR', 'Rp');

        // Query 2: Jumlah Mitra Aktif (Status ACTIVE means they've received merch and are working)
        const mitrasData = await db.query("SELECT COUNT(*) FROM mitras WHERE status = 'ACTIVE'");
        const mitrasCount = mitrasData.rows[0].count;

        // Query 3: Jumlah User (Consumer) Aktif
        const usersData = await db.query("SELECT COUNT(*) FROM users WHERE status = 'ACTIVE'");
        const usersCount = usersData.rows[0].count;

        // Query 4: Total Revenue
        const revComm = await db.query("SELECT COALESCE(SUM(company_revenue), 0) as total FROM sales_commissions");
        const revManage = await db.query("SELECT COALESCE(SUM(management_cut_amount), 0) as total FROM bookings WHERE status = 'COMPLETED'");
        // Fallback calculation: mitras who have a sales agent but NO record in sales_commissions
        const missingCommissionsData = await db.query(`
            SELECT COUNT(m.id) as missing_count
            FROM mitras m
            LEFT JOIN sales_commissions sc ON m.id = sc.mitra_id
            WHERE m.referred_by_sales_id IS NOT NULL AND sc.id IS NULL
        `);
        const missingCount = parseInt(missingCommissionsData.rows[0].missing_count || 0);

        let totalRevenue = parseFloat(revComm.rows[0].total) + parseFloat(revManage.rows[0].total) + (missingCount * 13500);
        const revenueAmount = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalRevenue).replace('IDR', 'Rp');

        // Query 5: Total Sales Agents 
        const salesData = await db.query('SELECT COUNT(*) FROM sales_agents');
        const salesCount = salesData.rows[0].count;

        res.status(200).json({
            success: true,
            data: {
                revenue: revenueAmount,
                escrow: escrowAmount,
                total_mitras: mitrasCount,
                total_users: usersCount,
                total_sales: salesCount
            }
        });
    } catch (error) {
        console.error("ADMIN DASHBOARD ERROR:", error);
        res.status(500).json({ success: false, message: "Gagal mengambil data statistik Dashboard" });
    }
};

exports.getKycApprovals = async (req, res) => {
    try {
        // Find MITRAs who have not been KYC verified
        const result = await db.query(`
            SELECT id, name, nik, phone, status 
            FROM mitras 
            WHERE is_kyc_verified = FALSE
            ORDER BY created_at ASC
        `);

        // Mock KTP/Selfie URLs for the dashboard since we didn't build an image upload system yet
        const mappedData = result.rows.map(m => ({
            ...m,
            ktpUrl: 'https://via.placeholder.com/150?text=KTP+Placeholder',
            selfieUrl: 'https://via.placeholder.com/150?text=Selfie+Placeholder'
        }));

        res.status(200).json({ success: true, data: mappedData });
    } catch (e) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getSalesPerformance = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                s.id, s.name, s.referral_code, 
                COUNT(m.id) as recruited,
                SUM(COALESCE(sc.commission_amount, 0)) + 
                (CAST(COUNT(m.id) AS INTEGER) - CAST(COUNT(sc.id) AS INTEGER)) * 1500 as commission
            FROM sales_agents s
            LEFT JOIN mitras m ON m.referred_by_sales_id = s.id
            LEFT JOIN sales_commissions sc ON sc.mitra_id = m.id AND sc.sales_id = s.id
            GROUP BY s.id, s.name, s.referral_code
        `);
        // We'll map status simply to ACTIVE for the demo
        const mapped = result.rows.map(r => ({
            id: r.referral_code,
            name: r.name,
            status: 'ACTIVE',
            recruited: parseInt(r.recruited),
            commission: parseFloat(r.commission)
        }));
        res.status(200).json({ success: true, data: mapped });
    } catch (e) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getMerchLogistics = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT id, name as mitra, phone, city as address, merch_status as status, created_at as date
            FROM mitras
            WHERE merch_status IN ('PENDING', 'SHIPPED')
            ORDER BY created_at DESC
        `);
        res.status(200).json({ success: true, data: result.rows });
    } catch (e) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getDisputesPenalties = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                p.id, p.offender_role as role, p.offender_id as "offenderId", 
                p.strike_number as strike, p.action_taken as action, p.created_at as date,
                r.violation_keyword as keyword
            FROM penalty_logs p
            LEFT JOIN regex_violations r ON r.id = p.triggered_by
            ORDER BY p.created_at DESC
        `);
        res.status(200).json({ success: true, data: result.rows });
    } catch (e) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ==========================================
// NEW ACTION ENDPOINTS
// ==========================================

exports.approveKyc = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("UPDATE mitras SET is_kyc_verified = TRUE, merch_status = 'PENDING' WHERE id = $1", [id]);
        res.status(200).json({ success: true, message: 'KYC Approved, Merch Pending' });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.shipMerch = async (req, res) => {
    try {
        const { id } = req.params;
        // Setting status to ACTIVE makes them count towards Active Mitras on the Dashboard
        await db.query("UPDATE mitras SET merch_status = 'SHIPPED', status = 'ACTIVE' WHERE id = $1", [id]);
        res.status(200).json({ success: true, message: 'Merch Shipped, Mitra is now ACTIVE' });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getSalesStats = async (req, res) => {
    try {
        const { referral_code } = req.query;
        if (!referral_code) {
            return res.status(400).json({ success: false, message: "Missing referral_code" });
        }

        const result = await db.query(`
            SELECT COUNT(m.id) as recruited 
            FROM mitras m
            JOIN sales_agents s ON m.referred_by_sales_id = s.id
            WHERE s.referral_code = $1
        `, [referral_code]);

        res.status(200).json({ success: true, recruited: parseInt(result.rows[0].recruited) });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
```

### File: `src/domains/auth/auth.controller.js`

```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');

class AuthController {

    // ==========================================
    // REGISTER USER
    // ==========================================
    async registerUser(req, res, next) {
        try {
            const { name, phone, email, password } = req.body;

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            const result = await db.query(`
                INSERT INTO users (name, phone, email, password_hash)
                VALUES ($1, $2, $3, $4)
                RETURNING id, name, email
            `, [name, phone, email, passwordHash]);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result.rows[0]
            });
        } catch (error) {
            if (error.code === '23505') { // Unique violation Postgres
                return res.status(400).json({ success: false, message: 'Email or phone already exists' });
            }
            next(error);
        }
    }

    // ==========================================
    // LOGIN USER
    // ==========================================
    async loginUser(req, res, next) {
        try {
            const { email, password } = req.body;

            const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
            if (result.rowCount === 0) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const user = result.rows[0];
            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id, role: 'USER' }, process.env.JWT_SECRET, { expiresIn: '30d' });

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    user: { id: user.id, name: user.name, status: user.status }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // ==========================================
    // REGISTER MITRA (is_kyc_verified = FALSE default)
    // ==========================================
    async registerMitra(req, res, next) {
        try {
            const { nik, name, dob, phone, email, password, referred_by_sales_code } = req.body;

            // 1. Cek NIK di tabel blacklisted_niks
            const blacklistRes = await db.query('SELECT reason FROM blacklisted_niks WHERE nik = $1', [nik]);
            if (blacklistRes.rowCount > 0) {
                return res.status(403).json({
                    success: false,
                    message: `NIK is blacklisted. Reason: ${blacklistRes.rows[0].reason}`
                });
            }

            // 2. Cek Referral Code (Opsional)
            let salesId = null;
            if (referred_by_sales_code) {
                const salesRes = await db.query('SELECT id FROM sales_agents WHERE referral_code = $1', [referred_by_sales_code]);
                if (salesRes.rowCount === 0) {
                    return res.status(400).json({ success: false, message: 'Invalid sales referral code' });
                }
                salesId = salesRes.rows[0].id;
            }

            // 3. Hash Password & Insert
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            // Perhatikan kolom: merch_status (jika ada, defaultnya 'NONE'), registration_paid (default false) di schema V4
            // Cek status schema dan insert
            const result = await db.query(`
                INSERT INTO mitras (nik, name, dob, phone, email, password_hash, referred_by_sales_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id, name, email, registration_paid
            `, [nik, name, dob, phone, email, passwordHash, salesId]);

            const newMitraId = result.rows[0].id;

            // Jika mendaftar lewat Sales, auto-generate hak komisi Sales & Revenue Perusahaan
            if (salesId) {
                const netRevenue = 15000;
                const salesCommission = 1500;
                const companyRevenue = 13500;

                await db.query(`
                  INSERT INTO sales_commissions (
                      sales_id, mitra_id, base_fee_net, commission_amount, company_revenue, status
                  ) VALUES ($1, $2, $3, $4, $5, 'PENDING')
                `, [salesId, newMitraId, netRevenue, salesCommission, companyRevenue]);

                await db.query(`
                  UPDATE sales_agents 
                  SET total_earnings = total_earnings + $1 
                  WHERE id = $2
                `, [salesCommission, salesId]);
            }

            res.status(201).json({
                success: true,
                message: 'Mitra registered successfully. Please proceed to pay the Rp 50.000 registration fee.',
                data: result.rows[0]
            });

        } catch (error) {
            if (error.code === '23505') {
                return res.status(400).json({ success: false, message: 'NIK, Email or phone already exists' });
            }
            next(error);
        }
    }

    // ==========================================
    // LOGIN MITRA
    // ==========================================
    async loginMitra(req, res, next) {
        try {
            const { email, password } = req.body;

            const result = await db.query('SELECT * FROM mitras WHERE email = $1', [email]);
            if (result.rowCount === 0) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const mitra = result.rows[0];
            const isMatch = await bcrypt.compare(password, mitra.password_hash);

            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: mitra.id, role: 'MITRA' }, process.env.JWT_SECRET, { expiresIn: '30d' });

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    mitra: {
                        id: mitra.id,
                        name: mitra.name,
                        status: mitra.status,
                        is_kyc_verified: mitra.is_kyc_verified,
                        registration_paid: mitra.registration_paid
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // ==========================================
    // REGISTER SALES APP
    // ==========================================
    async registerSales(req, res, next) {
        try {
            const { name, email, password } = req.body;

            // Input Validation
            if (!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Kolom Nama, Email, dan Password wajib diisi!"
                });
            }

            // Generate referral code based on name (mock)
            const referralCode = name.replace(/\s+/g, '').toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            const result = await db.query(`
                INSERT INTO sales_agents (name, email, password_hash, referral_code)
                VALUES ($1, $2, $3, $4)
                RETURNING id, name, email, referral_code
            `, [name, email, passwordHash, referralCode]);

            res.status(201).json({
                success: true,
                message: 'Sales registered successfully',
                data: result.rows[0]
            });
        } catch (error) {
            console.error("ERROR REGISTRASI:", error);

            if (error.code === '23505') {
                return res.status(400).json({ success: false, message: 'Email already exists' });
            }

            // Safe Response 500
            res.status(500).json({
                success: false,
                message: "Terjadi kesalahan di server",
                error: error.message
            });
        }
    }

    // ==========================================
    // LOGIN SALES APP
    // ==========================================
    async loginSales(req, res, next) {
        try {
            const { email_or_name, password } = req.body;

            const result = await db.query('SELECT * FROM sales_agents WHERE email = $1 OR name = $1', [email_or_name]);
            if (result.rowCount === 0) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const sales = result.rows[0];
            const isMatch = await bcrypt.compare(password, sales.password_hash);

            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: sales.id, role: 'SALES' }, process.env.JWT_SECRET, { expiresIn: '30d' });

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    sales: { id: sales.id, name: sales.name, email: sales.email, referral_code: sales.referral_code }
                }
            });
        } catch (error) {
            console.error("ERROR LOGIN:", error);
            res.status(500).json({
                success: false,
                message: "Terjadi kesalahan di server saat verifikasi login",
                error: error.message
            });
        }
    }
}

module.exports = new AuthController();
```

### File: `src/domains/auth/auth.routes.js`

```javascript
const express = require('express');
const authController = require('./auth.controller');

const router = express.Router();

router.post('/user/register', authController.registerUser);
router.post('/mitra/register', authController.registerMitra);

router.post('/user/login', authController.loginUser);
router.post('/mitra/login', authController.loginMitra);

module.exports = router;
```

### File: `src/domains/auth/auth.service.js`

```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../infrastructure/database/db');

class AuthService {
    async register(data, role) {
        const { name, phone, email, password, nik, dob } = data;
        const tableName = role === 'MITRA' ? 'mitras' : 'users';

        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            const existing = await client.query(`SELECT id FROM ${tableName} WHERE email = $1 OR phone = $2`, [email, phone]);
            if (existing.rowCount > 0) throw new Error('Email or phone already registered');

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            let insertQuery;
            let params;

            if (role === 'MITRA') {
                if (!nik || !dob) throw new Error('NIK and Date of Birth are required for Mitra');

                // Check if NIK is blacklisted
                const blacklistCheck = await client.query('SELECT nik FROM blacklisted_niks WHERE nik = $1', [nik]);
                if (blacklistCheck.rowCount > 0) throw new Error('This NIK has been blacklisted due to severe violations.');

                insertQuery = `
                    INSERT INTO mitras (name, phone, email, password_hash, nik, dob, is_kyc_verified, status)
                    VALUES ($1, $2, $3, $4, $5, $6, FALSE, 'ACTIVE') RETURNING id, email
                `;
                params = [name, phone, email, hash, nik, dob];
            } else {
                insertQuery = `
                    INSERT INTO users (name, phone, email, password_hash, status)
                    VALUES ($1, $2, $3, $4, 'ACTIVE') RETURNING id, email
                `;
                params = [name, phone, email, hash];
            }

            const result = await client.query(insertQuery, params);
            await client.query('COMMIT');

            return result.rows[0];
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }

    async login(email, password, role) {
        const tableName = role === 'MITRA' ? 'mitras' : 'users';

        const result = await db.query(`SELECT id, password_hash, status FROM ${tableName} WHERE email = $1`, [email]);
        if (result.rowCount === 0) throw new Error('Invalid credentials');

        const user = result.rows[0];

        // Ensure user is not banned or disabled
        if (user.status !== 'ACTIVE') {
            throw new Error(`Account is currently ${user.status}`);
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) throw new Error('Invalid credentials');

        const token = jwt.sign(
            { id: user.id, role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        return { token, user: { id: user.id, role } };
    }
}

module.exports = new AuthService();
```

### File: `src/domains/bookings/booking.controller.js`

```javascript
const bookingService = require('./booking.service');

class BookingController {

    // ==========================================
    // CREATE ORDER (Dipanggil oleh User)
    // ==========================================
    async createBooking(req, res, next) {
        try {
            const userId = req.user.id; // From Auth MW
            const { mitraId, serviceId, userLon, userLat, originalServicePrice } = req.body;

            // Basic Validation
            if (!mitraId || !serviceId || !originalServicePrice) {
                return res.status(400).json({ success: false, message: 'Missing required booking parameters' });
            }

            const data = await bookingService.createBooking({
                userId,
                mitraId,
                serviceId,
                userLon: userLon ? parseFloat(userLon) : null,
                userLat: userLat ? parseFloat(userLat) : null,
                originalServicePrice: parseFloat(originalServicePrice)
            });

            res.status(201).json({
                success: true,
                message: 'Booking match created successfully. Mitra has been locked for work.',
                data
            });
        } catch (error) {
            if (error.message.includes('Mitra not found') || error.message.includes('Minimal harga')) {
                return res.status(400).json({ success: false, message: error.message });
            }
            next(error);
        }
    }

    // ==========================================
    // COMPLETE ORDER (Dipanggil oleh Mitra)
    // ==========================================
    async completeBooking(req, res, next) {
        try {
            const mitraId = req.user.id;
            const { bookingId, tipsAmount } = req.body;

            if (!bookingId) {
                return res.status(400).json({ success: false, message: 'Missing bookingId' });
            }

            // Validasi kepemilikan
            const bookingRes = await db.query('SELECT mitra_id FROM bookings WHERE id = $1', [bookingId]);
            if (bookingRes.rowCount === 0 || bookingRes.rows[0].mitra_id !== mitraId) {
                return res.status(403).json({ success: false, message: 'Not authorized for this booking' });
            }

            const data = await bookingService.completeBooking(bookingId, tipsAmount);

            res.status(200).json({
                success: true,
                message: data.message,
                data: { bookingId: data.bookingId }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BookingController();
```

### File: `src/domains/bookings/booking.routes.js`

```javascript
const express = require('express');
const bookingController = require('./booking.controller');
const { authMiddleware, roleMiddleware } = require('../../core/middlewares/auth');

const router = express.Router();

// User Routes
router.post('/create', authMiddleware, roleMiddleware(['USER']), bookingController.createBooking);

// Mitra Routes
router.post('/complete', authMiddleware, roleMiddleware(['MITRA']), bookingController.completeBooking);

module.exports = router;
```

### File: `src/domains/bookings/booking.service.js`

```javascript
const db = require('../../config/db');

class BookingService {

    /**
     * REQUEST BOOKING AWAL (Oleh USER)
     * Mengunci slot Mitra, mencatat origin price & ongkos luar radius
     */
    async createBooking({ userId, mitraId, serviceId, userLon, userLat, originalServicePrice }) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // 1. Validasi Status Mitra (Bebas dari Hukuman & Aktif & Sudah Bayar Rp 50k & KYC)
            const mitraRes = await client.query(`
                SELECT work_status, status, is_kyc_verified, registration_paid,
                       active_working_slots, max_concurrent_slots, badge_tier
                FROM mitras 
                WHERE id = $1
            `, [mitraId]);

            if (mitraRes.rowCount === 0) throw new Error('Mitra not found');
            const mitra = mitraRes.rows[0];

            if (mitra.status !== 'ACTIVE') throw new Error('Mitra is currently restricted');
            if (!mitra.is_kyc_verified) throw new Error('Mitra has not passed KYC System');
            if (!mitra.registration_paid) throw new Error('Mitra has not paid the registration fee');

            // 2. Validasi Jasa & Pricing Rules (Rp 50rb minimum untuk Hijau)
            const serviceRes = await client.query('SELECT category, avg_market_price FROM services WHERE id = $1', [serviceId]);
            if (serviceRes.rowCount === 0) throw new Error('Service not found');

            const category = serviceRes.rows[0].category;
            const avgMarketPrice = parseFloat(serviceRes.rows[0].avg_market_price);

            if (mitra.badge_tier === 'GREEN' && originalServicePrice < 50000) {
                throw new Error('Minimal harga untuk Mitra Pemula (Hijau) adalah Rp 50.000');
            } else if (mitra.badge_tier === 'BLUE') {
                const maxAllowedPrice = avgMarketPrice * 1.75;
                if (originalServicePrice < avgMarketPrice || originalServicePrice > maxAllowedPrice) {
                    throw new Error(`Harga Mitra (Biru) harus di antara Rp ${avgMarketPrice} hingga maksimal Rp ${maxAllowedPrice}`);
                }
            } else if (mitra.badge_tier === 'RED') {
                const maxAllowedPrice = avgMarketPrice * 2.0;
                if (originalServicePrice < avgMarketPrice || originalServicePrice > maxAllowedPrice) {
                    throw new Error(`Harga Mitra (Merah) harus di antara Rp ${avgMarketPrice} hingga maksimal Rp ${maxAllowedPrice}`);
                }
            }

            // 3. Pengecekan Ketersediaan Kapasitas Slot & Iklan
            let priorityAdConsumedId = null;

            if (category === 'PHYSICAL') {
                if (mitra.work_status !== 'AVAILABLE') throw new Error('Mitra Jasa Fisik sedang penuh (Booking limit tercapai)');

                // Cek Iklan berjalan mana yang sedang aktif untuk dikurangi kuotanya di fase Complete
                const adRes = await client.query(`
                    SELECT id FROM mitra_priority_ads 
                    WHERE mitra_id = $1 AND is_active = TRUE
                    ORDER BY 
                      CASE WHEN ad_rank = 'RANK_1_NEWBIE' THEN 1 ELSE 2 END ASC
                    LIMIT 1
                `, [mitraId]);

                if (adRes.rowCount > 0) priorityAdConsumedId = adRes.rows[0].id;

            } else {
                // Jasa DIGITAL Multitasking
                if (mitra.active_working_slots >= mitra.max_concurrent_slots) {
                    throw new Error('Mitra Jasa Digital telah mencapai kapasitas maksimum kerja berbarengan');
                }
            }

            // 4. Kalkulasi Jarak Geofencing (Jika ada) -> Catat ongkos *out_of_range*
            let locationQuery = 'NULL';
            let isOutOfRange = false;
            let outOfRangeFee = 0;

            if (userLon && userLat) {
                locationQuery = `ST_SetSRID(ST_MakePoint(${userLon}, ${userLat}), 4326)`;

                // Cari jarak riil
                const distRes = await client.query(`
                    SELECT ST_Distance(current_location, ST_SetSRID(ST_MakePoint($1, $2), 4326)) as dist_meters
                    FROM mitras WHERE id = $3
                `, [userLon, userLat, mitraId]);

                if (distRes.rowCount > 0 && distRes.rows[0].dist_meters > 5000) {
                    isOutOfRange = true;
                    outOfRangeFee = 15000;
                }
            }

            // 5. Insert Sistem Escrow & Booking
            const insertRes = await client.query(`
              INSERT INTO bookings (
                  user_id, mitra_id, service_id, status, user_booking_location, 
                  is_out_of_range, out_of_range_fee, priority_ad_consumed_id, 
                  original_service_price, management_cut_percent, management_cut_amount, 
                  insurance_fee_amount, total_paid_by_user, net_earned_by_mitra, started_at
              ) VALUES (
                  $1, $2, $3, 'MATCHED', ${locationQuery !== 'NULL' ? locationQuery : 'NULL'}, 
                  $4, $5, $6, $7, 0, 0, 0, 0, 0, CURRENT_TIMESTAMP
              ) RETURNING id
            `, [userId, mitraId, serviceId, isOutOfRange, outOfRangeFee, priorityAdConsumedId, originalServicePrice]);

            // 6. Update Tracker Mitra (Kunci Slot Kerja)
            if (category === 'PHYSICAL') {
                await client.query(`UPDATE mitras SET work_status = 'WORKING' WHERE id = $1`, [mitraId]);
            } else {
                await client.query(`UPDATE mitras SET active_working_slots = active_working_slots + 1 WHERE id = $1`, [mitraId]);
            }

            await client.query('COMMIT');
            return { bookingId: insertRes.rows[0].id, status: 'MATCHED' };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } // <-- MISSING BRACE ADDED HERE

    /**
     * SELESAIKAN BOOKING (Oleh MITRA) -> Uang Masuk Escrow (AWAITING_CONFIRMATION)
     * Mengkalkulasi 20/25% fee, Cashback, Tip, dan memotong kuota Iklan Fisik
     */
    async completeBooking(bookingId, tipsAmount = 0) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            const bookingRes = await client.query(`
                SELECT b.*, s.category, m.rating_avg, m.badge_tier, m.id as mitra_id
                FROM bookings b
                JOIN services s ON b.service_id = s.id
                JOIN mitras m ON b.mitra_id = m.id
                WHERE b.id = $1 AND b.status = 'WORKING'
            `, [bookingId]);

            if (bookingRes.rowCount === 0) throw new Error('Invalid booking state or ID');
            const booking = bookingRes.rows[0];

            let managementCutPercent = 20;

            // DIGITAL -> potongan 25% jika rating < 5
            if (booking.category === 'DIGITAL') {
                if (parseFloat(booking.rating_avg) < 5.0) managementCutPercent = 25;
            }

            const originalPrice = parseFloat(booking.original_service_price);
            const outOfRangeFee = parseFloat(booking.out_of_range_fee) || 0;
            const receivedTips = parseFloat(tipsAmount) || 0;

            // Perhatian: Hanya Original Price yang dipotong persen manajemen
            let managementCutAmount = originalPrice * (managementCutPercent / 100);
            let cashbackBonusAmount = 0;

            // Cashback 5% untuk RED tier
            if (booking.badge_tier === 'RED') {
                cashbackBonusAmount = originalPrice * (5 / 100);
            }

            const adminFee = 1500;
            const totalPaidByUser = originalPrice + outOfRangeFee + adminFee + receivedTips;
            // Formula: original - (management cut) + outOfRangeFee + cashback + 100% Tips
            const netEarnedByMitra = (originalPrice - managementCutAmount) + outOfRangeFee + cashbackBonusAmount + receivedTips;
            const insuranceFeeAmount = managementCutAmount * 0.10;

            // Update Booking -> Masuk Escrow (AWAITING_CONFIRMATION)
            await client.query(`
                UPDATE bookings SET 
                  status = 'AWAITING_CONFIRMATION',
                  mitra_finished_at = CURRENT_TIMESTAMP,
                  management_cut_percent = $1,
                  management_cut_amount = $2,
                  insurance_fee_amount = $3,
                  cashback_bonus_amount = $4,
                  tips_amount = $5,
                  total_paid_by_user = $6,
                  net_earned_by_mitra = $7
                WHERE id = $8
            `, [
                managementCutPercent, managementCutAmount, insuranceFeeAmount,
                cashbackBonusAmount, receivedTips, totalPaidByUser, netEarnedByMitra, bookingId
            ]);

            // Release Slot Kerja Mitra
            if (booking.category === 'PHYSICAL') {
                await client.query(`UPDATE mitras SET work_status = 'AVAILABLE' WHERE id = $1`, [booking.mitra_id]);

                // Potong kuota Iklan jika ada
                if (booking.priority_ad_consumed_id) {
                    await client.query(`
                        UPDATE mitra_priority_ads 
                        SET quota_remaining = quota_remaining - 1,
                            visibility_score = ((quota_remaining - 1)::float / initial_quota) * 100,
                            is_active = CASE WHEN (quota_remaining - 1) <= 0 THEN FALSE ELSE TRUE END
                        WHERE id = $1
                    `, [booking.priority_ad_consumed_id]);
                }
            } else {
                await client.query(`UPDATE mitras SET active_working_slots = active_working_slots - 1 WHERE id = $1`, [booking.mitra_id]);
            }

            await client.query('COMMIT');
            return { success: true, message: 'Booking completed by Mitra. Escrow is awaiting User confirmation.', bookingId };
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }
}

module.exports = new BookingService();
```

### File: `src/domains/bookings/escrow.worker.js`

```javascript
const db = require('../../config/db');

class EscrowWorker {
    /**
     * Berjalan setiap Jam/Menit via Node-Cron
     * Mencari booking dengan status AWAITING_CONFIRMATION yang sudah lewat dari 24 jam
     */
    async autoReleaseEscrowFunds() {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // Cari semua booking yang selesai oleh mitra > 24 jam lalu
            const expiredBookingsRes = await client.query(`
                SELECT id, mitra_id, net_earned_by_mitra 
                FROM bookings 
                WHERE status = 'AWAITING_CONFIRMATION' 
                  AND mitra_finished_at <= NOW() - INTERVAL '24 HOURS'
            `);

            if (expiredBookingsRes.rowCount === 0) {
                await client.query('COMMIT');
                return { processedCount: 0 };
            }

            for (const booking of expiredBookingsRes.rows) {
                // 1. Cairkan Dana ke Mitra Wallet
                await client.query(`
                    UPDATE mitras 
                    SET wallet_balance = wallet_balance + $1 
                    WHERE id = $2
                `, [booking.net_earned_by_mitra, booking.mitra_id]);

                // 2. Tandai Booking sebagai COMPLETED secara sepihak oleh sistem
                await client.query(`
                    UPDATE bookings 
                    SET status = 'COMPLETED', completed_at = CURRENT_TIMESTAMP 
                    WHERE id = $1
                `, [booking.id]);
            }

            await client.query('COMMIT');
            console.log(`[Escrow Worker] Successfully auto-released funds for ${expiredBookingsRes.rowCount} bookings.`);

            return { processedCount: expiredBookingsRes.rowCount };
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('[Escrow Worker] Error during auto release:', error);
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new EscrowWorker();
```

### File: `src/domains/mitras/kyc.controller.js`

```javascript
const kycService = require('./kyc.service');

exports.uploadKyc = async (req, res, next) => {
    try {
        const mitraId = req.user.id; // From authMiddleware
        const { ktpUrl, selfieUrl } = req.body; // In reality, this might be multipart/form-data with multer

        if (!ktpUrl || !selfieUrl) {
            return res.status(400).json({ success: false, message: 'KTP and Selfie URLs are required.' });
        }

        const data = await kycService.uploadKycDocument(mitraId, ktpUrl, selfieUrl);
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};
```

### File: `src/domains/mitras/kyc.service.js`

```javascript
const db = require('../../infrastructure/database/db');

class KycService {
    async uploadKycDocument(mitraId, ktpUrl, selfieUrl) {
        // In a real scenario, these URLs would come from an S3 bucket or similar storage
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // Check if mitra exists and is not yet verified
            const existing = await client.query('SELECT is_kyc_verified, status FROM mitras WHERE id = $1', [mitraId]);
            if (existing.rowCount === 0) throw new Error('Mitra not found');
            if (existing.rows[0].is_kyc_verified) throw new Error('Mitra is already verified');

            // Set status to OFFLINE (can't work until approved)
            // Assuming there's a hypothetical kyc_documents table, we would insert there.
            // For now, we update the status just to be sure
            await client.query(`
                UPDATE mitras 
                SET work_status = 'OFFLINE'
                WHERE id = $1
            `, [mitraId]);

            await client.query('COMMIT');
            return {
                message: 'KYC Documents uploaded successfully. Pending manual admin verification.',
                documentLinks: { ktpUrl, selfieUrl }
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new KycService();
```

### File: `src/domains/mitras/mitra.controller.js`

```javascript
const mitraService = require('./mitra.service');

class MitraController {

    // ==========================================
    // CARI MITRA TERDEKAT & AKTIF BERDASARKAN SERVICE
    // ==========================================
    async searchMitras(req, res, next) {
        try {
            const { serviceId, userLon, userLat } = req.query;

            if (!serviceId) {
                return res.status(400).json({ success: false, message: 'serviceId is required' });
            }

            const mitras = await mitraService.findAvailableMitras(
                serviceId,
                parseFloat(userLon),
                parseFloat(userLat)
            );

            res.status(200).json({
                success: true,
                count: mitras.length,
                data: mitras
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MitraController();
```

### File: `src/domains/mitras/mitra.routes.js`

```javascript
const express = require('express');
const kycController = require('./kyc.controller');
const mitraController = require('./mitra.controller');
const registrationController = require('./registration.controller');
const { authMiddleware, roleMiddleware } = require('../../core/middlewares/auth');

const router = express.Router();

// User Route: Search for Mitras (Geofencing & Priority Ads)
router.get('/search', authMiddleware, roleMiddleware(['USER']), mitraController.searchMitras);

// Mitra Route: Upload KYC
router.post('/kyc', authMiddleware, roleMiddleware(['MITRA']), kycController.uploadKyc);

// Mitra Route: Pay Base Fee (Rp 50k) Merch
router.post('/registration-payment', authMiddleware, roleMiddleware(['MITRA']), registrationController.payRegistrationFee);

// Mitra Route: Buy Premium Pro (Max 3 / City)
router.post('/premium-ads', authMiddleware, roleMiddleware(['MITRA']), registrationController.buyPremiumProAd);

module.exports = router;
```

### File: `src/domains/mitras/mitra.service.js`

```javascript
const db = require('../../config/db');

class MitraService {
    /**
     * Cari mitra relevan untuk order terbaru (Geofencing Dinamis 5-10-15KM & Priority Ads V4)
     */
    async findAvailableMitras(serviceId, userLon, userLat) {
        const serviceRes = await db.query('SELECT category FROM services WHERE id = $1', [serviceId]);
        if (serviceRes.rowCount === 0) throw new Error('Service not found');
        const category = serviceRes.rows[0].category;

        let searchRadius = 5000; // Mulai dari 5KM
        let finalResult = [];

        // Jika kategori DIGITAL, bypass radius loop.
        const maxRadiusLoops = category === 'PHYSICAL' ? 3 : 1;

        for (let i = 0; i < maxRadiusLoops; i++) {
            let queryText = `
          SELECT m.id, m.name, m.rating_avg, m.badge_tier, ms.base_price, 
                 pa.ad_rank, COALESCE(pa.visibility_score, 0) as ad_score,
                 pa.id as priority_ad_id,
                 ST_Distance(m.current_location, ST_SetSRID(ST_MakePoint($2, $3), 4326)) as distance_meters
          FROM mitras m
          JOIN mitra_services ms ON m.id = ms.mitra_id
          -- JOIN Priority Ads untuk mencari yang aktif
          LEFT JOIN mitra_priority_ads pa ON m.id = pa.mitra_id AND pa.is_active = TRUE
          WHERE ms.service_id = $1 AND m.status = 'ACTIVE' AND m.registration_paid = TRUE
        `;
            const params = [serviceId];

            // LOGIKA KATEGORI SLOT & LOKASI
            if (category === 'PHYSICAL') {
                if (!userLon || !userLat) throw new Error('Location (userLon, userLat) is required for Physical Services');
                queryText += ` AND m.work_status = 'AVAILABLE'`; // 1 Slot Only
                queryText += ` AND ST_DWithin(m.current_location, ST_SetSRID(ST_MakePoint($2, $3), 4326), ${searchRadius})`;
                params.push(userLon, userLat);
            } else {
                // DIGITAL: Multitasking N-slots, Bypass Location
                queryText += ` AND m.active_working_slots < m.max_concurrent_slots`;
                queryText = queryText.replace('ST_Distance(m.current_location, ST_SetSRID(ST_MakePoint($2, $3), 4326)) as distance_meters', '0 as distance_meters');
                queryText = queryText.replace('ST_SetSRID(ST_MakePoint($2, $3), 4326)', 'NULL');
            }

            // V4: SORTING SUPER BERLAPIS
            queryText += ` 
            ORDER BY 
              CASE WHEN pa.ad_rank = 'RANK_1_NEWBIE' THEN 1
                   WHEN pa.ad_rank = 'RANK_2_RECOVERY' THEN 2
                   ELSE 3 END ASC,
              ad_score DESC, 
              m.rating_avg DESC 
            LIMIT 20
        `;

            const result = await db.query(queryText, params);

            if (result.rowCount > 0 || category === 'DIGITAL') {
                finalResult = result.rows.map(row => ({
                    ...row,
                    is_out_of_range: category === 'PHYSICAL' && searchRadius > 5000,
                    out_of_range_fee: category === 'PHYSICAL' && searchRadius > 5000 ? 15000 : 0,
                    search_radius_km: searchRadius / 1000
                }));
                break; // Hentikan fallback loop jika sudah ketemu
            }

            // Jika kosong di 5KM, loop akan berlanjut ke 10KM (Radius + 5000)
            searchRadius += 5000;
            if (searchRadius > 15000) break; // Berhenti total setelah 15KM pencarian (Loop 3x)
        }

        return finalResult;
    }
}

module.exports = new MitraService();
```

### File: `src/domains/mitras/registration.controller.js`

```javascript
const registrationService = require('./registration.service');

class RegistrationController {

    // ==========================================
    // BAYAR BIAYA PENDAFTARAN (Rp 50.000)
    // ==========================================
    async payRegistrationFee(req, res, next) {
        try {
            const mitraId = req.user.id; // User identity from auth header

            // Kita asumsikan pembayaran (gateway) berhasil dilakukan di sini
            const data = await registrationService.processRegistrationPayment(mitraId);
            res.status(200).json(data);
        } catch (error) {
            // Tangkap pesan Error Lemparan Service
            res.status(400).json({ success: false, message: error.message });
            next(error);
        }
    }
}

module.exports = new RegistrationController();
```

### File: `src/domains/mitras/registration.service.js`

```javascript
const db = require('../../config/db');

class RegistrationService {
    /**
     * Proses pembayaran registrasi awal Mitra sebesar Rp 50.000 (V4 Logic)
     * Memotong HPP Merch (Rp 35.000), mencatat 10% Komisi Sales, & 90% Kas Perusahaan
     */
    async processRegistrationPayment(mitraId) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // 1. Validasi Mitra
            const mitraRes = await client.query(`
              SELECT registration_paid, referred_by_sales_id 
              FROM mitras WHERE id = $1
          `, [mitraId]);

            if (mitraRes.rowCount === 0) throw new Error('Mitra not found');
            if (mitraRes.rows[0].registration_paid) throw new Error('Mitra has already paid the registration fee');

            const referredBySalesId = mitraRes.rows[0].referred_by_sales_id;

            // 2. Logic Pembagian Uang
            const totalPaid = 50000;
            const hppMerchandise = 35000;
            const netRevenue = totalPaid - hppMerchandise; // Rp 15.000

            let salesCommission = 0;
            let companyRevenue = netRevenue;

            // Jika mendaftar menggunakan kode referral sales
            if (referredBySalesId) {
                salesCommission = netRevenue * 0.10; // 10% = Rp 1.500
                companyRevenue = netRevenue - salesCommission; // 90% = Rp 13.500

                // Insert ke tabel komisi sales
                await client.query(`
                  INSERT INTO sales_commissions (
                      sales_id, mitra_id, base_fee_net, commission_amount, company_revenue, status
                  ) VALUES ($1, $2, $3, $4, $5, 'PENDING')
              `, [referredBySalesId, mitraId, netRevenue, salesCommission, companyRevenue]);

                // Update Total Earnings Sales Agent
                await client.query(`
                  UPDATE sales_agents 
                  SET total_earnings = total_earnings + $1 
                  WHERE id = $2
              `, [salesCommission, referredBySalesId]);
            }

            // 3. Update Status Mitra (Sudah bayar, dan set merch_status menjadi PENDING)
            // Asumsi tabel mitras sudah di-ALTER ADD COLUMN merch_status VARCHAR(50) DEFAULT 'NONE'.
            await client.query(`
              UPDATE mitras 
              SET registration_paid = TRUE, merch_status = 'PENDING'
              WHERE id = $1
          `, [mitraId]);

            await client.query('COMMIT');

            return {
                success: true,
                message: 'Registration fee processed successfully. Merchandise preparation is PENDING.',
                details: {
                    total_paid: totalPaid,
                    hpp_merchandise: hppMerchandise,
                    sales_commission_allocated: salesCommission,
                    company_net_revenue: companyRevenue
                }
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new RegistrationService();
```

### File: `src/domains/penalties/penalty.service.js`

```javascript
const db = require('../../config/db');

class PenaltyService {

    /**
     * Mengeksekusi sanksi Strike 1, 2, atau 3 kepada Pelanggar
     * Dipanggil otomatis oleh Bot AI Regex WebSocket
     */
    async executeStrikePenalty(offenderRole, offenderId, violationKeyword, chatId) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            let tableName = offenderRole === 'USER' ? 'users' : 'mitras';

            // 1. Dapatkan Strike Count saat ini
            const userRes = await client.query(`SELECT strike_count, nik FROM ${tableName} WHERE id = $1`, [offenderId]);
            if (userRes.rowCount === 0) throw new Error('Offender not found');

            let { strike_count, nik } = userRes.rows[0];
            let newStrikeCount = strike_count + 1;

            // 2. Tentukan Jenis Hukuman
            let actionTaken = '';
            let suspendedUntil = null;
            let newStatus = 'ACTIVE';

            if (newStrikeCount === 1) {
                actionTaken = 'DISABLED_2_DAYS';
                newStatus = 'DISABLED';
                // Suspended selama 48 jam
                suspendedUntil = new Date(Date.now() + 48 * 60 * 60 * 1000);
            } else if (newStrikeCount === 2) {
                actionTaken = 'FROZEN_1_WEEK';
                newStatus = 'FROZEN';
                // Suspended selama 7 Hari
                suspendedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            } else if (newStrikeCount >= 3) {
                actionTaken = 'BANNED_PERMANENT';
                newStatus = 'BANNED_PERM';
                suspendedUntil = null; // Permanen

                // HUKUMAN MATI: Masukkan NIK ke Blacklist (Jika Mitra)
                if (offenderRole === 'MITRA' && nik) {
                    await client.query(`
                        INSERT INTO blacklisted_niks (nik, reason) 
                        VALUES ($1, $2)
                        ON CONFLICT (nik) DO NOTHING
                    `, [nik, `Auto-Banned: 3-Strikes Violation Regex (Chat ID: ${chatId})`]);
                }
            }

            // 3. Update Akun Entitas
            let suspendedQuery = suspendedUntil ? `$3` : 'NULL';
            let queryParams = [newStatus, newStrikeCount, offenderId];
            if (suspendedUntil) queryParams.splice(2, 0, suspendedUntil); // Insert suspendedUntil sebelum id if not null

            await client.query(`
                UPDATE ${tableName} 
                SET status = $1, strike_count = $2, suspended_until = ${suspendedQuery}
                WHERE id = $${suspendedUntil ? '4' : '3'}
            `, queryParams);

            // 4. Log Jejak Audit Penalti
            await client.query(`
                INSERT INTO penalty_logs (offender_role, offender_id, strike_number, action_taken, reason, expires_at)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [
                offenderRole, offenderId, newStrikeCount, actionTaken,
                `Automated Regex Catcher Triggered by word: "${violationKeyword}"`,
                suspendedUntil
            ]);

            await client.query('COMMIT');

            return {
                strike_count: newStrikeCount,
                action_taken: actionTaken,
                status: newStatus
            };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new PenaltyService();
```

### File: `src/domains/reviews/review.controller.js`

```javascript
const reviewService = require('./review.service');

exports.submitReview = async (req, res, next) => {
    try {
        const { bookingId, rating, comment } = req.body;
        const reviewerRole = req.user.role; // Extract from JWT
        const reviewerId = req.user.id;

        if (!bookingId || !rating) {
            return res.status(400).json({ success: false, message: 'Booking ID and Rating are required' });
        }

        const data = await reviewService.submitReview({
            bookingId, reviewerRole, reviewerId, rating: parseFloat(rating), comment
        });

        res.status(201).json({ success: true, ...data });
    } catch (error) {
        next(error);
    }
};
```

### File: `src/domains/reviews/review.routes.js`

```javascript
const express = require('express');
const reviewController = require('./review.controller');
const { authMiddleware, roleMiddleware } = require('../../core/middlewares/auth');

const router = express.Router();

// Both User and Mitra can use this route
router.post('/submit', authMiddleware, roleMiddleware(['USER', 'MITRA']), reviewController.submitReview);

module.exports = router;
```

### File: `src/domains/reviews/review.service.js`

```javascript
const db = require('../../infrastructure/database/db');

class ReviewService {
    async submitReview({ bookingId, reviewerRole, reviewerId, rating, comment }) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // 1. Validate Booking
            const bookingRes = await client.query('SELECT user_id, mitra_id, status FROM bookings WHERE id = $1', [bookingId]);
            if (bookingRes.rowCount === 0) throw new Error('Booking not found');
            const booking = bookingRes.rows[0];

            if (booking.status !== 'COMPLETED') throw new Error('Can only review completed bookings');

            // 2. Determine Targets and Validate Ownership
            let targetUserId = null;
            let targetMitraId = null;
            let reviewerUserId = null;
            let reviewerMitraId = null;

            if (reviewerRole === 'USER') {
                if (booking.user_id !== reviewerId) throw new Error('You are not the user of this booking');
                reviewerUserId = reviewerId;
                targetMitraId = booking.mitra_id;
            } else if (reviewerRole === 'MITRA') {
                if (booking.mitra_id !== reviewerId) throw new Error('You are not the mitra of this booking');
                reviewerMitraId = reviewerId;
                targetUserId = booking.user_id;
            } else {
                throw new Error('Invalid role');
            }

            // 3. Insert Review (UNIQUE constraint will prevent double reviews)
            await client.query(`
                INSERT INTO reviews (
                    booking_id, reviewer_role, reviewer_user_id, reviewer_mitra_id, 
                    target_user_id, target_mitra_id, rating, comment
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [bookingId, reviewerRole, reviewerUserId, reviewerMitraId, targetUserId, targetMitraId, rating, comment]);

            // 4. Recalculate Average Rating & Update Tier (If reviewing Mitra)
            if (reviewerRole === 'USER') {
                await this.updateMitraRatingAndTier(client, targetMitraId);
            } else if (reviewerRole === 'MITRA') {
                await this.updateUserRating(client, targetUserId);
            }

            await client.query('COMMIT');
            return { success: true, message: 'Review submitted successfully' };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async updateMitraRatingAndTier(client, mitraId) {
        // Calculate averge rating from all reviews received by this mitra
        const ratingRes = await client.query(`
            SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
            FROM reviews 
            WHERE target_mitra_id = $1
        `, [mitraId]);

        let avgRating = parseFloat(ratingRes.rows[0].avg_rating) || 0;
        let totalServed = parseInt(ratingRes.rows[0].total_reviews) || 0;
        avgRating = Math.round(avgRating * 100) / 100; // Round to 2 decimals

        // Dynamic Tier Promotion Logic based on Total Served & Rating
        let badgeTier = 'GREEN'; // Default 0-99
        if (totalServed >= 500 && avgRating > 4.5) {
            badgeTier = 'RED'; // >500 Users & >4.5 Rating
        } else if (totalServed >= 100 && avgRating > 4.0) {
            badgeTier = 'BLUE'; // 100-499 Users & >4.0 Rating
        }

        await client.query(`
            UPDATE mitras 
            SET rating_avg = $1, total_users_served = $2, badge_tier = $3 
            WHERE id = $4
        `, [avgRating, totalServed, badgeTier, mitraId]);
    }

    async updateUserRating(client, userId) {
        const ratingRes = await client.query(`
            SELECT AVG(rating) as avg_rating
            FROM reviews 
            WHERE target_user_id = $1
        `, [userId]);

        let avgRating = parseFloat(ratingRes.rows[0].avg_rating) || 0;
        avgRating = Math.round(avgRating * 100) / 100;

        await client.query(`
            UPDATE users 
            SET rating_avg = $1 
            WHERE id = $2
        `, [avgRating, userId]);
    }
}

module.exports = new ReviewService();
```

### File: `src/infrastructure/database/db.js`

```javascript
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    getClient: () => pool.connect(),
};
```

### File: `src/infrastructure/websocket/chatModerator.js`

```javascript
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const { checkViolation } = require('../../core/utils/regexModerator');
const penaltyService = require('../../domains/penalties/penalty.service');

const initializeChatModerator = (io) => {

    // Auth Middleware Khusus Socket
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error('Authentication error'));

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; // { id, role }
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {

        // 1. Join Room (Berdasarkan Booking ID)
        socket.on('join_booking_chat', (bookingId) => {
            socket.join(`booking_${bookingId}`);
            console.log(`User ${socket.user.id} joined room booking_${bookingId}`);
        });

        // 2. Event Mengirim Pesan
        socket.on('send_message', async (data) => {
            const { bookingId, message } = data;
            const senderId = socket.user.id;
            const senderRole = socket.user.role; // USER or MITRA

            try {
                // A. Pengecekan AI Regex Moderator
                const violationCheck = checkViolation(message);

                let finalMessage = message;
                let isCensored = false;

                // B. Simpan Pesan ke Database (Censored or Not)
                if (violationCheck.isViolating) {
                    finalMessage = '[Pesan disensor oleh Sistem karena melanggar Aturan Komunikasi Jaskuy]';
                    isCensored = true;
                }

                const chatRes = await db.query(`
                    INSERT INTO chat_messages (booking_id, sender_role, sender_id, message_content, is_censored)
                    VALUES ($1, $2, $3, $4, $5) RETURNING id
                `, [bookingId, senderRole, senderId, finalMessage, isCensored]);

                const chatId = chatRes.rows[0].id;

                // C. EKSEKUSI PENALTI JIKA MELANGGAR
                if (isCensored) {
                    // 1. Simpan Catatan Pelanggaran
                    await db.query(`
                        INSERT INTO regex_violations (chat_id, violator_role, violator_id, violation_keyword)
                        VALUES ($1, $2, $3, $4)
                    `, [chatId, senderRole, senderId, violationCheck.keywordMatched]);

                    // 2. Eksekusi Hukuman Strike 1 / 2 / 3 via Penalty Service
                    const penaltyResult = await penaltyService.executeStrikePenalty(
                        senderRole,
                        senderId,
                        violationCheck.keywordMatched,
                        chatId
                    );

                    // Beri notifikasi Push ke pelanggar via Socket
                    socket.emit('system_alert', {
                        message: `PERINGATAN! Anda telah melanggar aturan Chat. Strike anda sekarang: ${penaltyResult.strike_count}. Status: ${penaltyResult.action_taken}`,
                        disconnect: penaltyResult.strike_count >= 3 // Tell client to GTFO if banned
                    });

                    // Jika akun dibanned/didisable, force disconnect websocketnya
                    if (penaltyResult.strike_count >= 1) {
                        socket.disconnect();
                        return; // Stop transmitting message
                    }
                }

                // D. Broadcast Final Message ke Lawan Bicara di Room
                io.to(`booking_${bookingId}`).emit('receive_message', {
                    chatId,
                    senderId,
                    senderRole,
                    message: finalMessage,
                    isSystemWarning: isCensored,
                    createdAt: new Date()
                });

            } catch (error) {
                console.error('[Socket.IO] Error handling chat message:', error);
                socket.emit('error', 'Gagal memproses pesan');
            }
        });
    });
};

module.exports = initializeChatModerator;
```

### File: `src/routes/index.routes.js`

```javascript
const express = require('express');

// Controllers
const authController = require('../domains/auth/auth.controller');
const registrationController = require('../domains/mitras/registration.controller');
const adminController = require('../domains/admin/admin.controller');

// Middlewares
const { authMiddleware, roleMiddleware } = require('../core/middlewares/auth.middleware');
const strikeMiddleware = require('../core/middlewares/strike.middleware');
const db = require('../infrastructure/database/db');

const router = express.Router();

// ==========================================
// 1. AUTHENTICATION ROUTES (User & Mitra)
// ==========================================
router.post('/auth/user/register', authController.registerUser);
router.post('/auth/user/login', authController.loginUser);

router.post('/auth/mitra/register', authController.registerMitra);
router.post('/auth/mitra/login', authController.loginMitra);

router.post('/auth/sales/register', authController.registerSales);
router.post('/auth/sales/login', authController.loginSales);


// ==========================================
// 2. MITRA ONBOARDING & PAYMENT
// ==========================================
// Mitra membayar biaya registrasi Rp 50.000
router.post(
    '/mitra/registration-payment',
    authMiddleware,
    roleMiddleware(['MITRA']),
    strikeMiddleware,
    registrationController.payRegistrationFee
);

// Nanti akan diisi route Search, Booking, Review di Fase selanjutnya

// ==========================================
// 3. ADMIN PANEL
// ==========================================
router.get('/admin/dashboard-stats', adminController.getDashboardStats);
router.get('/admin/kyc-approvals', adminController.getKycApprovals);
router.get('/admin/sales-performance', adminController.getSalesPerformance);
router.get('/admin/merch-logistics', adminController.getMerchLogistics);
router.get('/admin/disputes-penalties', adminController.getDisputesPenalties);

// ACTIONS
router.put('/admin/action/approve-kyc/:id', adminController.approveKyc);
router.put('/admin/action/ship-merch/:id', adminController.shipMerch);

// SALES APP STATS
router.get('/sales/stats', adminController.getSalesStats);


// ==========================================
// 4. CORE (SEARCH & BOOKING)
// ==========================================
const mitraController = require('../domains/mitras/mitra.controller');
const bookingController = require('../domains/bookings/booking.controller');

// USER: Cari Tukang Jarak Dekat / Iklan
router.get('/mitra/search', authMiddleware, roleMiddleware(['USER']), strikeMiddleware, mitraController.searchMitras);

// USER: Buat Pesanan
router.post('/booking/create', authMiddleware, roleMiddleware(['USER']), strikeMiddleware, bookingController.createBooking);

// MITRA: Selesaikan Pesanan (Dana masuk Escrow pending konfirmasi)
router.post('/booking/complete', authMiddleware, roleMiddleware(['MITRA']), strikeMiddleware, bookingController.completeBooking);

module.exports = router;
```

### File: `src/server.js`

```javascript
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

// Load env before using any other modules
dotenv.config();

const indexRoutes = require('./routes/index.routes');
const errorHandler = require('./core/middlewares/errorHandler');

const app = express();
const server = http.createServer(app);

// Setup Socket.IO Dasar
const io = new Server(server, {
  cors: {
    origin: '*', // Sesuaikan dengan domain frontend di production
    methods: ['GET', 'POST']
  }
});

// Middleware Global
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: '*'
}));
app.use(express.json());

// API Routes (Entry Point)
app.use('/api', indexRoutes);

// Global Error Handler
app.use(errorHandler);

const initializeChatModerator = require('./infrastructure/websocket/chatModerator');

// Socket.io Connection Event handled by specialized AI Moderator
initializeChatModerator(io);

const initiateCronJobs = require('./cron');

// Init Script Background Worker V3
initiateCronJobs();

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 [Jaskuy Backend] Server is running on port ${PORT}`);
});
```

### File: `src/workers/chatGarbageCollector.js`

```javascript
const db = require('../config/db');

class ChatGarbageCollector {
    /**
     * Berjalan secara berkala (misal: setiap jam)
     * Menghapus semua riwayat pesan di tabel chat_messages yang terkait dengan 
     * booking yang sudah COMPLETED lebih dari 24 jam yang lalu.
     */
    async cleanUpOldChats() {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // 1. Cari booking_id yang sudah COMPLETED > 24 jam
            // Kita kumpulkan ID booking-nya saja terlebih dahulu atau gabung dalam operasi DELETE langsung
            // Operasi hapus akan men-cascade/menghapus pesan chat terkait (Asumsi: foreign key setup mendukung, 
            // atau kita hapus eksplisit)

            // HAPUS SECARA EKSPLISIT berdasarkan join tabel
            const deleteRes = await client.query(`
                DELETE FROM chat_messages 
                WHERE booking_id IN (
                    SELECT id FROM bookings 
                    WHERE status = 'COMPLETED' 
                    AND completed_at <= NOW() - INTERVAL '24 HOURS'
                )
                RETURNING id
            `);

            await client.query('COMMIT');

            if (deleteRes.rowCount > 0) {
                console.log(`[Chat Garbage Collector] Successfully deleted ${deleteRes.rowCount} old chat messages from expired bookings.`);
            }

            return { deletedCount: deleteRes.rowCount };
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('[Chat Garbage Collector] Error during chat cleanup:', error);
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new ChatGarbageCollector();
```

### File: `start-ngrok.js`

```javascript
const { spawn } = require('child_process');
const path = require('path');

const ngrokPath = path.join(__dirname, 'ngrok.exe');
const ngrok = spawn(ngrokPath, ['http', '3000', '--log=stdout']);

ngrok.stdout.on('data', (data) => console.log(`ngrok out: ${data}`));
ngrok.stderr.on('data', (data) => console.error(`ngrok err: ${data}`));
ngrok.on('close', (code) => {
    console.log(`ngrok exited with code ${code}`);
    process.exit(code);
});

// To keep the process alive slightly longer before exit if crash happens
setInterval(() => { }, 1000 * 60 * 60);
```

### File: `start-tunnel.js`

```javascript
const localtunnel = require('localtunnel');

(async () => {
    try {
        const tunnel = await localtunnel({ port: 3000, subdomain: 'jaskuyb2026' });
        console.log(`🚀 Tunnel running at: ${tunnel.url}`);

        tunnel.on('close', () => {
            console.log('Tunnel closed naturally. PM2 will revive it.');
            process.exit(1);
        });

        tunnel.on('error', (err) => {
            console.error('Tunnel error:', err);
            process.exit(1);
        });
    } catch (err) {
        console.error('Failed to start tunnel:', err);
        process.exit(1);
    }
})();
```

### File: `test_supa.js`

```javascript
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

console.log("Database URL:", process.env.DATABASE_URL);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log("Successfully connected to Supabase!");
        const res = await client.query('SELECT * FROM sales_agents LIMIT 1');
        console.log("Sales Agents Table Exists! Rows:", res.rows.length);
        client.release();
    } catch (err) {
        console.error("Connection error explicitly:", err);
    } finally {
        pool.end();
    }
}

testConnection();
```

### File: `update_sistem_ngrok.md`

```md
# Laporan Perbaikan Sistem Tunnel (Ngrok) & Backend

## Ringkasan Insiden
Sistem manajemen *tunnel* sebelumnya (menggunakan Localtunnel) kembali diubah menggunakan layanan **Ngrok** karena terjadinya *crash* (tidak stabil/timeout) pada aplikasi Sales (APK). Namun, setelah pengembalian ke URL Ngrok (`https://nonmoderately-catechetical-iker.ngrok-free.dev`), timbul *error* akses **`ERR_NGROK_3200`** (Endpoint Offline) saat aplikasi diuji coba.

## Tindakan yang Telah Dilakukan

Berikut adalah rekam jejak langkah-langkah yang baru saja dilakukan untuk menstabilkan dan menghubungkan kembali aplikasi dengan server lokal:

### 1. Build Ulang Aplikasi Sales (APK)
- **Aksi**: Mengeksekusi proses kompilasi rilis APK Flutter (`flutter build apk --release`).
- **Hasil**: APK versi terbaru (48.0MB) yang membawa *endpoint* API Ngrok telah berhasil di-*build* ulang di direktori `C:\Jaskuy\sales-app\build\app\outputs\flutter-apk\app-release.apk`.

### 2. Diagnosis Error `ERR_NGROK_3200`
- Terjadi indikasi bahwa *tunnel* Ngrok tidak mendapat respon dari *localhost* atau proses Ngrok di laptop terhenti.
- **Investigasi Sistem (PM2)**: Dicek melalui perintah `pm2 list`, ditemukan bahwa daftar proses yang berjalan **kosong**. Hal ini mengindikasikan bahwa _daemon_ Node.js (backend) dan tunnel tidak berjalan di *background*, kemungkinan besar akibat proses PM2 terhenti pasca-*restart* komputer atau konflik sebelumnya.

### 3. Pemulihan Backend Server
- **Aksi**: Mengaktifkan ulang server utama aplikasi (`src/server.js`) menggunakan PM2.
- **Hasil**: Server `jaskuy-backend` saat ini telah aktif dan "listening" kembali secara normal di `localhost:3000`.

### 4. Reaktivasi Ngrok Tunnel Statis
- **Aksi**: Menghentikan semua proses Ngrok liar yang *nyangkut* dan memulai ulang aplikasi `ngrok.exe` yang terhubung langsung dengan domain statis (`nonmoderately-catechetical-iker.ngrok-free.dev`) mengarah ke port lokal 3000.
- **Hasil**: Lalu lintas API dari luar jaringan (termasuk internet seluler) sekarang sudah berhasil diteruskan kembali (forwarding) masuk ke aplikasi Node.js lokal di port 3000.
**Catatan Tambahan**: Sempat muncul error `ERR_NGROK_8012` yang disebabkan karena ada proses *background* Ngrok yang secara bawaan (*default*) mencoba meneruskan trafik ke `localhost:80` alih-alih port `3000`. Saya telah berhasil mematikannya paksa dan menjalankan konfigurasi yang benar secara *background*.

### 5. Persistensi Konfigurasi
- **Aksi**: Menjalankan perintah penyimpanan _state_ (`pm2 save`).
- **Hasil**: Proses backend dan konfigurasi saat ini dikunci oleh PM2, sehingga apabila PM2 diaktifkan (atau disetel untuk hidup otomatis), server jaskuy akan langsung siap tanpa perlu di-*start* ulang manual.

---

## Status Sistem Saat Ini:  ✅ **ONLINE & SIAP UJI COBA**
Seluruh jembatan koneksi (*Ngrok Tunnel*) dan jantung aplikasi (*Node.js Backend*) telah hidup. Aplikasi **Sales App (Flutter)** seharusnya sudah bisa melakukan *Login* / *Register* secara nirkabel dari internet luar.

## Rekomendasi Selanjutnya
Apabila halaman **Admin Panel (Vite/React)** ikut tidak bisa diakses di browser, pastikan untuk kembali menyalakan React *development server* (di port 5173), baik secara manual atau mendaftarkannya kembali di PM2 (`pm2 start npm --name "jaskuy-admin" -- run dev`).
```

### File: `update_sistem_online.md`

```md
# Update Sistem Online & Program Management Jaskuy

## Ringkasan
Aplikasi Jaskuy (Backend & Admin Panel) sekarang telah dapat diakses secara **online** dari luar jaringan lokal (seperti jaringan seluler). Laptop ini sekarang bertindak sebagai server uji coba (testing server) yang stabil, di mana seluruh program pendukung berjalan otomatis di background menggunakan sistem manajemen proses **PM2**.

---

## 1. Aktivasi Program Management (PM2)
Berdasarkan pembaruan terbaru, backend dan admin panel tidak perlu repot dinyalakan manual lagi, melainkan sudah diatur berjalan nonstop di background laptop.

- **Backend API**: Berjalan di port `3000` (Nama proses di PM2: `jaskuy-backend`)
- **Admin Panel**: Berjalan di port `5173` (Nama proses di PM2: `jaskuy-admin`)

**Perintah (Command) Penting PM2 untuk Monitor Server:**
- `pm2 list` : Melihat status program (Online/Offline) dan memastikan semuanya berjalan.
- `pm2 logs` : Melihat laporan (*log*) aktivitas terkini dari server untuk *debugging*.
- `pm2 monit` : Memantau penggunaan CPU dan RAM dari masing-masing program.

---

## 2. Akses Jaringan Publik (Localtunnel)
Untuk memungkinkan aplikasi Flutter (HP Android/Sales) bisa mengakses server laptop **tanpa** harus berada pada WiFi/jaringan yang sama, kita telah membuka *tunnel* menggunakan fitur Localtunnel yang juga dikelola oleh PM2.

- **URL Publik Backend API**: `https://jaskuyb2026.loca.lt/api`
- **URL Publik Admin Panel**: `https://jaskuya2026.loca.lt`

Karena ditangani PM2, *tunnel* ini akan direstart otomatis apabila sempat terputus koneksinya.

---

## 3. Pembaruan Aplikasi Flutter (Sales App)
Aplikasi di sisi *Sales* telah disesuaikan dengan infrastruktur online yang baru:

### Perubahan File Utama
**File**: `lib/services/api_service.dart`
1. **Perubahan URL IP**: Mengganti `http://10.75.221.93:3000/api` menjadi alamat online `https://jaskuyb2026.loca.lt/api`.
2. **Penanganan Bypass Peringatan Localtunnel**: Menambahkan *header* wajib `Bypass-Tunnel-Reminder: true` pada setiap perintah pemanggilan API standar (GET/POST) maupun API Multipart (Upload Gambar/KTP/Selfie). Tujuannya agar respon yang diterima aplikasi adalah format `JSON` yang sah, bukan terhenti di halaman peringatan Localtunnel.

---
### Status Saat Ini: Siap Uji Coba (Ready to Test)
Sistem sekarang bersifat layaknya *production-ready test server*. File **APK Versi 1.0.2 (Anti Blokir)** telah selesai di-*build* otomatis dan kini berada di laptop Anda pada direktori:
**`C:\Jaskuy\sales-app\build\app\outputs\flutter-apk\app-release.apk`**

Silakan salin/pindahkan file APK tersebut ke perangkat Android Anda yang mempunyai koneksi internet seluler, lalu _install_ dan jalankan aplikasinya. Aplikasi Sales App akan langsung tembus ke database lokal laptop Anda.

---

## 4. Akses Admin Dashboard (Lokal Area Jaringan)
Sempat ada isu di mana Admin Panel gagal dibuka via *localhost*. Ini dikarenakan proses manajemen PM2 di Windows gagal mengeksekusi `npm`. 

Ini sudah diselesaikan dengan menjalankan `kite.js` secara langsung di background dan membuka akses *Host* dari `vite.config.js`.
Sekarang Admin Panel dapat diakses langsung oleh *browser* di laptop ini (atau ponsel di WiFi yang sama) melalui:
`http://localhost:5173`

## 5. Upgrade Fitur Pendaftaran Sales App
Aplikasi Flutter telah ditingkatkan berdasarkan modul Pendaftaran Sales Baru (`register_screen.dart`). 
- Proteksi Localtunnel (Bypass-Tunnel-Reminder & Try-Catch) juga **telah diaplikasikan** pada halaman Pendaftaran Sales.
- Alur ini memungkinkan Sales Senior untuk mendaftarkan akun Sales Junior langsung dari HP tanpa diadang halaman HTML Localtunnel.

---

## 6. Pembaruan Kritis (Bulletproof Localtunnel Fixes)
Pembaruan terkini yang menjamin koneksi Sales App benar-benar lolos dari blokir Localtunnel:

- **Express CORS Dibuka Total**: Menggunakan konfigurasi `allowedHeaders: '*'` agar server Node.js mengizinkan semua custom header tanpa keraguan, memungkinkan Localtunnel pass-through dengan mulus.
- **Header Khusus Localtunnel**: Penambahan *header* `localtunnel-skip-warning: true` pada seluruh _endpoint_ di App Flutter (termasuk unggah file multipart) untuk mem-bypass filter Localtunnel.
- **Sistem Deteksi Error Interaktif**: 
  - Penambahan `try-catch` saat dekode JSON di semua fungsi vital (`login_screen.dart`, `dashboard_screen.dart`, `register_screen.dart`, `mitra_registration_screen.dart`). 
  - Jika aplikasi dicegat HTML peringatan Localtunnel, App tidak akan stuck (loading nge-hang), melainkan akan langsung memunculkan **SnackBar merah** spesifik di bawah layar HP beserta isi respon error-nya. Print console terminal juga sudah aktif sepenuhnya.

---

## 7. Bug Fix: Localtunnel Timeout (PM2 Conflict)
Terdapat *bug* sebelumnya di mana proses Localtunnel (`jaskuy-backend-tunnel`) terus menerus *crash* dan mengalami _timeout_ karena program PM2 di Windows salah mengeksekusi *interpreter* bawaannya (menggunakan `npm.cmd` alih-alih `node`). 

- **Solusi Permanen**: Modul Localtunnel sekarang tidak lagi dijalankan via *command line interface (CLI)*, melainkan dienkapsulasi menggunakan *script Node.js* kustom bernama `api-tunnel.js`. 
- PM2 kini mengeksekusi *script* ini dengan mulus dan merestart koneksi secara halus bila tunnel sempat terputus dari server publik loca.lt.


```

