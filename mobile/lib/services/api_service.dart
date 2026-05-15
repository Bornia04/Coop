import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static String _serverIp = '10.0.2.2';
  static String? _customUrl;

  static Future<String> getBaseUrl() async {
    if (_customUrl != null) return _customUrl!;
    
    final prefs = await SharedPreferences.getInstance();
    _customUrl = prefs.getString('api_url');
    
    if (_customUrl != null) return _customUrl!;

    // URL de production par défaut
    const String prodUrl = 'https://coopledger3.netlify.app/api';

    if (kIsWeb) {
      return (const bool.fromEnvironment('dart.vm.product') ? prodUrl : 'http://localhost:3000/api');
    }

    return Platform.isAndroid 
        ? (const bool.fromEnvironment('dart.vm.product') ? prodUrl : 'http://$_serverIp:3000/api') 
        : (const bool.fromEnvironment('dart.vm.product') ? prodUrl : 'http://localhost:3000/api');
  }

  static Future<void> setBaseUrl(String url) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('api_url', url);
    _customUrl = url;
  }

  Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<List<dynamic>> getTransactions() async {
    try {
      final url = await getBaseUrl();
      final response = await http.get(
        Uri.parse('$url/transactions'),
        headers: await _getHeaders(),
      );
      if (response.statusCode == 200) {
        return json.decode(response.body);
      }
      return [];
    } catch (e) {
      print('Erreur API Transactions: $e');
      return [];
    }
  }

  Future<List<dynamic>> getProposals() async {
    try {
      final url = await getBaseUrl();
      final response = await http.get(
        Uri.parse('$url/proposals'),
        headers: await _getHeaders(),
      );
      if (response.statusCode == 200) {
        return json.decode(response.body);
      }
      return [];
    } catch (e) {
      print('Erreur API Proposals: $e');
      return [];
    }
  }

  Future<List<dynamic>> getBlocks() async {
    try {
      final url = await getBaseUrl();
      final response = await http.get(
        Uri.parse('$url/blocks'),
        headers: await _getHeaders(),
      );
      if (response.statusCode == 200) {
        return json.decode(response.body);
      }
      return [];
    } catch (e) {
      print('Erreur API Blocks: $e');
      return [];
    }
  }

  Future<bool> castVote(String proposalId, String voteType, String memberId) async {
    try {
      final url = await getBaseUrl();
      final response = await http.post(
        Uri.parse('$url/vote'),
        body: json.encode({
          'proposalId': proposalId,
          'vote': voteType == 'POUR' ? 'for' : 'against',
          'memberId': memberId,
          'txHash': '0x' + DateTime.now().millisecondsSinceEpoch.toRadixString(16),
        }),
        headers: await _getHeaders(),
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Erreur API Vote: $e');
      return false;
    }
  }

  Future<Map<String, dynamic>?> login(String email, String password) async {
    try {
      final url = await getBaseUrl();
      final response = await http.post(
        Uri.parse('$url/auth/login'),
        body: json.encode({
          'email': email,
          'password': password,
        }),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      }
      return null;
    } catch (e) {
      print('Erreur Login API: $e');
      return null;
    }
  }

  Future<Map<String, dynamic>?> register(String name, String email, String password, String role) async {
    try {
      final url = await getBaseUrl();
      final response = await http.post(
        Uri.parse('$url/auth/register'),
        body: json.encode({
          'name': name,
          'email': email,
          'password': password,
          'role': role,
        }),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      }
      return null;
    } catch (e) {
      print('Erreur Register API: $e');
      return null;
    }
  }

  Future<Map<String, dynamic>> getProfile(String userId) async {
    try {
      final url = await getBaseUrl();
      final response = await http.get(
        Uri.parse('$url/profile/$userId'),
        headers: await _getHeaders(),
      );
      if (response.statusCode == 200) {
        return json.decode(response.body);
      }
    } catch (e) {
      print('Erreur API Profile: $e');
    }
    return {};
  }
}
