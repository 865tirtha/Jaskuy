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
