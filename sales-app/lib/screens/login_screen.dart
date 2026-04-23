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
