import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';

class AuthService extends ChangeNotifier {
  bool _isAuthenticated = false;
  String _userName = 'Utilisateur';
  String? _role;
  String? _userId;
  final ApiService _apiService = ApiService();

  bool get isAuthenticated => _isAuthenticated;
  String get userName => _userName;
  String? get role => _role;
  String? get userId => _userId;

  AuthService() {
    _loadSession(); // Chargement de la session au démarrage
  }

  Future<void> _loadSession() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    if (token != null) {
      _isAuthenticated = true;
      _userName = prefs.getString('user_name') ?? 'Utilisateur';
      _role = prefs.getString('user_role');
      _userId = prefs.getString('user_id');
      notifyListeners();
    }
  }

  Future<bool> login(String email, String password) async {
    final result = await _apiService.login(email, password);
    
    if (result != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_token', result['token']);
      await prefs.setString('user_name', result['user']['name']);
      await prefs.setString('user_role', result['user']['role']);
      await prefs.setString('user_id', result['user']['id']);

      _isAuthenticated = true;
      _userName = result['user']['name'];
      _role = result['user']['role'];
      _userId = result['user']['id'];
      notifyListeners();
      return true;
    }
    return false;
  }

  Future<bool> register(String name, String email, String password, String role) async {
    final result = await _apiService.register(name, email, password, role);
    
    if (result != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_token', result['token']);
      await prefs.setString('user_name', result['user']['name']);
      await prefs.setString('user_role', result['user']['role']);
      await prefs.setString('user_id', result['user']['id']);

      _isAuthenticated = true;
      _userName = result['user']['name'];
      _role = result['user']['role'];
      _userId = result['user']['id'];
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
    _userId = null;
    notifyListeners();
  }
}
