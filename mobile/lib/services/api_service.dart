import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  // En développement, 10.0.2.2 pointe vers localhost de la machine hôte sur Android
  // Utiliser l'IP de votre machine si vous testez sur un appareil physique
  static const String baseUrl = 'http://localhost:3000/api';

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
      final response = await http.get(
        Uri.parse('$baseUrl/transactions'),
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
      final response = await http.get(
        Uri.parse('$baseUrl/proposals'),
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

  Future<bool> castVote(String proposalId, String voteType, String memberId) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/vote'),
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

  Future<Map<String, dynamic>?> login(String email, String password, String role) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        body: json.encode({
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
      print('Erreur Login API: $e');
      return null;
    }
  }
}
