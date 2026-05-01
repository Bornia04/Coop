import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import 'proposal_detail_screen.dart';

class VotingScreen extends StatefulWidget {
  const VotingScreen({super.key});

  @override
  State<VotingScreen> createState() => _VotingScreenState();
}

class _VotingScreenState extends State<VotingScreen> {
  final ApiService _apiService = ApiService();
  late Future<List<dynamic>> _proposalsFuture;

  @override
  void initState() {
    super.initState();
    _proposalsFuture = _apiService.getProposals();
  }

  void _refreshProposals() {
    setState(() {
      _proposalsFuture = _apiService.getProposals();
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthService>();

    return Scaffold(
      backgroundColor: const Color(0xFF020617),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Gouvernance', style: TextStyle(fontWeight: FontWeight.w900, color: Colors.white)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.white),
            onPressed: _refreshProposals,
          ),
        ],
      ),
      body: FutureBuilder<List<dynamic>>(
        future: _proposalsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)));
          }
          
          if (snapshot.hasError || !snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(
              child: Text('Aucune proposition active trouvée.', style: TextStyle(color: Colors.white54)),
            );
          }

          final proposals = snapshot.data!;

          return ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            itemCount: proposals.length + 1,
            itemBuilder: (context, index) {
              if (index == 0) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      'Votes Actifs',
                      style: TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: Colors.white),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Participez aux décisions de votre coopérative',
                      style: TextStyle(color: Colors.white54, fontSize: 16),
                    ),
                    SizedBox(height: 40),
                  ],
                );
              }

              final p = proposals[index - 1];
              final totalVotes = (p['votesFor'] ?? 0) + (p['votesAgainst'] ?? 0);
              final progress = totalVotes == 0 ? 0.0 : (p['votesFor'] ?? 0) / totalVotes;

              return Padding(
                padding: const EdgeInsets.only(bottom: 24.0),
                child: _buildVoteCard(
                  context,
                  p['id'].toString(),
                  p['title'] ?? 'Sans titre',
                  p['description'] ?? '',
                  progress,
                  p['status'] == 'active',
                  totalVotes,
                  auth.userId ?? 'anonymous',
                ),
              );
            },
          );
        },
      ),
    );
  }

  void _handleVote(BuildContext context, String proposalId, String title, String vote, String memberId) async {
    final success = await _apiService.castVote(proposalId, vote, memberId);
    
    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Vote "$vote" enregistré pour : $title'),
          backgroundColor: const Color(0xFF10B981),
        ),
      );
      _refreshProposals();
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Erreur : Vous avez déjà voté ou le vote est clos.'),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  Widget _buildVoteCard(BuildContext context, String id, String title, String desc, double progress, bool isActive, int totalVotes, String memberId) {
    return GestureDetector(
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => ProposalDetailScreen(
            title: title,
            description: desc,
            progress: progress,
            isActive: isActive,
          ),
        ),
      ),
      child: Container(
        padding: const EdgeInsets.all(28),
        decoration: BoxDecoration(
          color: const Color(0xFF0F172A),
          borderRadius: BorderRadius.circular(32),
          border: Border.all(
            color: isActive ? const Color(0xFF10B981).withOpacity(0.3) : Colors.white.withOpacity(0.05),
            width: 1.5,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(
                    color: isActive ? const Color(0xFF10B981).withOpacity(0.1) : Colors.white.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(100),
                  ),
                  child: Text(
                    isActive ? 'ACTIF' : 'TERMINÉ',
                    style: TextStyle(
                      color: isActive ? const Color(0xFF34D399) : Colors.white54,
                      fontWeight: FontWeight.w900,
                      fontSize: 10,
                      letterSpacing: 1,
                    ),
                  ),
                ),
                const Icon(Icons.verified_user_outlined, color: Color(0xFF10B981), size: 20),
              ],
            ),
            const SizedBox(height: 24),
            Text(title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white)),
            const SizedBox(height: 8),
            Text(desc, maxLines: 2, overflow: TextOverflow.ellipsis, style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 14, height: 1.5)),
            const SizedBox(height: 32),
            Stack(
              children: [
                Container(
                  height: 10,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                FractionallySizedBox(
                  widthFactor: progress.clamp(0.0, 1.0),
                  child: Container(
                    height: 10,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(colors: [Color(0xFF10B981), Color(0xFF34D399)]),
                      borderRadius: BorderRadius.circular(10),
                      boxShadow: [
                        BoxShadow(color: const Color(0xFF10B981).withOpacity(0.3), blurRadius: 8, offset: const Offset(0, 2)),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('${(progress * 100).toInt()}% POUR', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 12, color: Colors.white70)),
                Text('$totalVotes VOTES', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12, color: Colors.white.withOpacity(0.3))),
              ],
            ),
            const SizedBox(height: 32),
            if (isActive)
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _handleVote(context, id, title, 'POUR', memberId),
                      child: const Text('POUR', style: TextStyle(fontWeight: FontWeight.w900)),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => _handleVote(context, id, title, 'CONTRE', memberId),
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(color: Colors.red.withOpacity(0.3)),
                        padding: const EdgeInsets.symmetric(vertical: 18),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: const Text('CONTRE', style: TextStyle(fontWeight: FontWeight.w900, color: Color(0xFFF87171))),
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }
}
