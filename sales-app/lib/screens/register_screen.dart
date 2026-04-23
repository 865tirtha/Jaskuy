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
