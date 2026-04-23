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
