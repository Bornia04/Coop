import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';

class AuthService extends ChangeNotifier {
  bool _isAuthenticated = false;
  String _userName = 'Utilisateur';
  String? _role;
  final ApiService _apiService = ApiService();

  bool get isAuthenticated => _isAuthenticated;
  String get userName => _userName;
  String? get role => _role;

  AuthService() {
    _loadSession();
  }

  Future<void> _loadSession() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    if (token != null) {
      _isAuthenticated = true;
      _userName = prefs.getString('user_name') ?? 'Utilisateur';
      _role = prefs.getString('user_role');
      notifyListeners();
    }
  }

  Future<bool> login(String email, String password, String role) async {
    final result = await _apiService.login(email, password, role);
    
    if (result != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_token', result['token']);
      await prefs.setString('user_name', result['user']['name']);
      await prefs.setString('user_role', role);

      _isAuthenticated = true;
      _userName = result['user']['name'];
      _role = role;
      notifyListeners();
      return true;
    }
    return false;
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    _isAuthenticated = false;
    _role = null;
    notifyListeners();
  }
}
