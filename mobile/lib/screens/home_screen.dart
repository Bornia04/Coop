import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import 'voting_screen.dart';
import 'explorer_screen.dart';
import 'profile_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthService>();
    final apiService = ApiService();
    
    return Scaffold(
      backgroundColor: const Color(0xFF020617),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('CoopLedger', style: TextStyle(fontWeight: FontWeight.w900, color: Colors.white)),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: GestureDetector(
              onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ProfileScreen())),
              child: const CircleAvatar(
                radius: 18,
                backgroundColor: Color(0xFF10B981),
                child: Icon(Icons.person, size: 20, color: Colors.white),
              ),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white70),
            onPressed: () => auth.logout(),
          )
        ],
      ),
      body: FutureBuilder<List<dynamic>>(
        future: apiService.getTransactions(),
        builder: (context, snapshot) {
          final txs = snapshot.data ?? [];
          double totalBalance = 0;
          for (var t in txs) {
            if (t['type'] == 'credit') {
              totalBalance += (t['amount'] as num).toDouble();
            } else {
              totalBalance -= (t['amount'] as num).toDouble();
            }
          }

          final formatter = NumberFormat.currency(locale: 'fr_FR', symbol: 'FCFA', decimalDigits: 0);
          final balanceStr = formatter.format(totalBalance);

          return SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 16),
                Text(
                  'Bonjour, ${auth.userName}',
                  style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: Colors.white),
                ),
                const Text(
                  'Votre activité blockchain aujourd\'hui',
                  style: TextStyle(color: Colors.white54, fontSize: 16),
                ),
                const SizedBox(height: 32),
                _buildBalanceCard(balanceStr),
                const SizedBox(height: 40),
                _buildSectionTitle('Actions Rapides'),
                const SizedBox(height: 16),
                Row(
                  children: [
                    _buildQuickAction(context, Icons.how_to_vote, 'Voter', const Color(0xFF3B82F6), () {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => const VotingScreen()));
                    }),
                    const SizedBox(width: 16),
                    _buildQuickAction(context, Icons.history, 'Explorer', const Color(0xFF10B981), () {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => const ExplorerScreen()));
                    }),
                  ],
                ),
                const SizedBox(height: 40),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _buildSectionTitle('Dernières Transactions'),
                    TextButton(
                      onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ExplorerScreen())),
                      child: const Text('Voir tout', style: TextStyle(color: Color(0xFF10B981))),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                _buildTransactionList(txs, snapshot.connectionState == ConnectionState.waiting),
                const SizedBox(height: 32),
                _buildSectionTitle('Top Contributeurs'),
                const SizedBox(height: 16),
                _buildReputationRanking(apiService),
                const SizedBox(height: 32),
              ],
            ),
          );
        }
      ),
    );
  }

  Widget _buildReputationRanking(ApiService api) {
    return FutureBuilder<List<dynamic>>(
      future: api.getProposals(),
      builder: (context, snapshot) {
        if (!snapshot.hasData) return const Center(child: CircularProgressIndicator());
        
        final proposals = snapshot.data!;
        final Map<String, int> memberVotes = {};
        for (var p in proposals) {
          final votes = p['votes'] as List<dynamic>? ?? [];
          for (var v in votes) {
            final name = v['memberId'] ?? 'Anonyme';
            memberVotes[name] = (memberVotes[name] ?? 0) + 1;
          }
        }
        
        final sorted = memberVotes.entries.toList()..sort((a, b) => b.value.compareTo(a.value));
        final top = sorted.take(3).toList();

        if (top.isEmpty) return const Text('Aucune activité enregistrée', style: TextStyle(color: Colors.white24));

        return Column(
          children: top.asMap().entries.map((entry) {
            final i = entry.key;
            final name = entry.value.key;
            final count = entry.value.value;
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.02),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 14,
                        backgroundColor: i == 0 ? const Color(0xFFFEF3C7) : Colors.white.withOpacity(0.1),
                        child: Text('${i + 1}', style: TextStyle(color: i == 0 ? Colors.black : Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                      const SizedBox(width: 12),
                      Text(name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  Text('$count votes', style: const TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.w900, fontSize: 12)),
                ],
              ),
            );
          }).toList(),
        );
      }
    );
  }

  Widget _buildBalanceCard(String balance) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF064E3B), Color(0xFF065F46)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(30),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF10B981).withOpacity(0.2),
            blurRadius: 25,
            offset: const Offset(0, 10),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('SOLDE COOPÉRATIVE', style: TextStyle(color: Colors.white70, fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1.2)),
              Icon(Icons.wifi_tethering, color: Colors.white.withOpacity(0.3), size: 24),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            balance,
            style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900, letterSpacing: -1),
          ),
          const SizedBox(height: 32),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.1),
              borderRadius: BorderRadius.circular(100),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.shield_outlined, color: Color(0xFF34D399), size: 14),
                SizedBox(width: 6),
                Text('VÉRIFIÉ SUR LE LEDGER', style: TextStyle(color: Color(0xFF34D399), fontWeight: FontWeight.bold, fontSize: 10)),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white),
    );
  }

  Widget _buildQuickAction(BuildContext context, IconData icon, String label, Color color, VoidCallback onTap) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: const Color(0xFF0F172A),
            borderRadius: BorderRadius.circular(28),
            border: Border.all(color: Colors.white.withOpacity(0.05)),
          ),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: color, size: 28),
              ),
              const SizedBox(height: 16),
              Text(label, style: const TextStyle(fontWeight: FontWeight.w800, color: Colors.white)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTransactionList(List<dynamic> txs, bool isLoading) {
    if (isLoading) {
      return const Center(child: Padding(
        padding: EdgeInsets.all(32.0),
        child: CircularProgressIndicator(color: Color(0xFF10B981)),
      ));
    }
    if (txs.isEmpty) {
      return const Center(child: Text('Aucune transaction trouvée', style: TextStyle(color: Colors.white54)));
    }
    return Column(
      children: txs.take(5).map((t) => Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: const Color(0xFF0F172A),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white.withOpacity(0.03)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: t['type'] == 'credit' ? const Color(0xFF10B981).withOpacity(0.1) : Colors.white.withOpacity(0.05),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(
                t['type'] == 'credit' ? Icons.south_west : Icons.shopping_cart_outlined, 
                color: t['type'] == 'credit' ? const Color(0xFF10B981) : Colors.white70,
                size: 20,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(t['description'], style: const TextStyle(fontWeight: FontWeight.w700, color: Colors.white, fontSize: 16)),
                  const SizedBox(height: 4),
                  Text('${t['date']} • Blockchain Certifié', style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.4))),
                ],
              ),
            ),
            Text(
              '${t['type'] == 'credit' ? '+' : '-'}${t['amount']} F',
              style: TextStyle(
                color: t['type'] == 'credit' ? const Color(0xFF10B981) : const Color(0xFFF87171), 
                fontWeight: FontWeight.w900,
                fontSize: 16,
              ),
            )
          ],
        ),
      )).toList(),
    );
  }
}
