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
