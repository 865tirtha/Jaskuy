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
