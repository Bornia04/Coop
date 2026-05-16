import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import 'home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  String _selectedRole = 'MEMBRE';
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background Gradient
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF020617), Color(0xFF0F172A), Color(0xFF064E3B)],
              ),
            ),
          ),
          // Decorative Orbs
          Positioned(
            top: -100,
            right: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFF10B981).withOpacity(0.15),
              ),
            ),
          ),
          // Server Settings Button
          Positioned(
            top: 40,
            right: 20,
            child: IconButton(
              icon: const Icon(Icons.settings_outlined, color: Colors.white70),
              onPressed: _showServerSettings,
            ),
          ),
          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.account_balance_wallet_outlined,
                    size: 80,
                    color: Color(0xFF10B981),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'CoopLedger',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 42,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -1.5,
                    ),
                  ),
                  const Text(
                    'Gouvernance Blockchain Agricole',
                    style: TextStyle(
                      color: Color(0xFF34D399),
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 60),
                  // Glassmorphic Card
                  ClipRRect(
                    borderRadius: BorderRadius.circular(32),
                    child: Container(
                      padding: const EdgeInsets.all(32),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(32),
                        border: Border.all(
                          color: Colors.white.withOpacity(0.1),
                          width: 1,
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          const Text(
                            'Connexion',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 28,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                          const SizedBox(height: 32),
                          TextField(
                            controller: _emailController,
                            style: const TextStyle(color: Colors.white),
                            decoration: const InputDecoration(
                              hintText: 'Email ou ID Blockchain',
                              prefixIcon: Icon(Icons.email_outlined, color: Colors.white54),
                            ),
                          ),
                          const SizedBox(height: 20),
                          TextField(
                            controller: _passwordController,
                            obscureText: true,
                            style: const TextStyle(color: Colors.white),
                            decoration: const InputDecoration(
                              hintText: 'Mot de passe',
                              prefixIcon: Icon(Icons.lock_outline, color: Colors.white54),
                            ),
                          ),
                          const SizedBox(height: 20),
                          DropdownButtonFormField<String>(
                            value: _selectedRole,
                            dropdownColor: const Color(0xFF1E293B),
                            style: const TextStyle(color: Colors.white),
                            decoration: const InputDecoration(
                              prefixIcon: Icon(Icons.badge_outlined, color: Colors.white54),
                            ),
                            items: const [
                              DropdownMenuItem(value: 'MEMBRE', child: Text('Membre')),
                              DropdownMenuItem(value: 'TRESORIER', child: Text('Trésorier')),
                              DropdownMenuItem(value: 'PRESIDENT', child: Text('Président')),
                            ],
                            onChanged: (val) => setState(() => _selectedRole = val!),
                          ),
                          const SizedBox(height: 40),
                          ElevatedButton(
                            onPressed: _isLoading ? null : _handleLogin,
                            child: _isLoading
                                ? const SizedBox(
                                    height: 24,
                                    width: 24,
                                    child: CircularProgressIndicator(
                                      color: Colors.white,
                                      strokeWidth: 2,
                                    ),
                                  )
                                : const Text(
                                    'Accéder au Registre',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showServerSettings() async {
    final currentUrl = await ApiService.getBaseUrl();
    final controller = TextEditingController(text: currentUrl);

    if (!mounted) return;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF0F172A),
        title: const Text('Configuration Serveur', style: TextStyle(color: Colors.white)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Entrez l\'URL de votre serveur déployé (ex: https://votre-app.netlify.app/api)',
              style: TextStyle(color: Colors.white70, fontSize: 13),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: controller,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                hintText: 'https://...',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () async {
              await ApiService.setBaseUrl(controller.text);
              if (mounted) {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Configuration mise à jour !')),
                );
              }
            },
            style: ElevatedButton.styleFrom(minimumSize: const Size(100, 40)),
            child: const Text('Sauvegarder'),
          ),
        ],
      ),
    );
  }

  void _handleLogin() async {
    setState(() => _isLoading = true);
    
    // Connexion via l'API réelle
    final authService = context.read<AuthService>();
    
    try {
      final success = await authService.login(
        _emailController.text,
        _passwordController.text,
      );
      
      setState(() => _isLoading = false);
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        String message = e.toString().replaceAll('Exception: ', '');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(message), backgroundColor: Colors.redAccent),
        );
      }
    }
  }
}
