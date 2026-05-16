import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  // CONFIGURATION PRÉSENTATION : Remplacez par votre IP locale si besoin
  // (10.0.2.2 est l'adresse pour l'émulateur Android vers l'ordinateur)
  static const String LOCAL_URL = 'http://10.0.2.2:3000/api'; 
  static const String PROD_URL = 'https://coopledger3.netlify.app/api';
  
  static String? _customUrl;

  static Future<String> getBaseUrl() async {
    // FORCE LOCAL POUR LA PRÉSENTATION
    return LOCAL_URL; 
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
      final errorData = json.decode(response.body);
      throw Exception(errorData['error'] ?? 'Identifiants incorrects');
    } catch (e) {
      print('Erreur Login API: $e');
      rethrow;
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
      final errorData = json.decode(response.body);
      throw Exception(errorData['error'] ?? 'Erreur lors de l\'inscription');
    } catch (e) {
      print('Erreur Register API: $e');
      rethrow;
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
