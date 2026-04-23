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
