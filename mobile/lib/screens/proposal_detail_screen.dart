import 'package:flutter/material.dart';

class ProposalDetailScreen extends StatelessWidget {
  final String title;
  final String description;
  final double progress;
  final bool isActive;

  const ProposalDetailScreen({
    super.key,
    required this.title,
    required this.description,
    required this.progress,
    required this.isActive,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF020617),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Détails de la Proposition', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: isActive ? const Color(0xFF10B981).withOpacity(0.1) : Colors.white.withOpacity(0.05),
                borderRadius: BorderRadius.circular(100),
              ),
              child: Text(
                isActive ? 'VOTE EN COURS' : 'ARCHIVÉ',
                style: TextStyle(
                  color: isActive ? const Color(0xFF34D399) : Colors.white54,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              title,
              style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 16),
            Text(
              description,
              style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 18, height: 1.6),
            ),
            const SizedBox(height: 40),
            _buildResultCard(context),
            const SizedBox(height: 40),
            const Text(
              'Audit Trail (Blockchain)',
              style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            _buildAuditTrail(),
            const SizedBox(height: 40),
            if (isActive)
              ElevatedButton(
                onPressed: () {},
                child: const Text('Voter maintenant'),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildResultCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Résultats actuels', style: TextStyle(color: Colors.white70, fontWeight: FontWeight.bold)),
              Text('${(progress * 100).toInt()}% Pour', style: const TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.w900)),
            ],
          ),
          const SizedBox(height: 20),
          LinearProgressIndicator(
            value: progress,
            backgroundColor: Colors.white.withOpacity(0.05),
            color: const Color(0xFF10B981),
            minHeight: 12,
            borderRadius: BorderRadius.circular(10),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildStat('Pour', '124'),
              _buildStat('Contre', '42'),
              _buildStat('Abstention', '12'),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildStat(String label, String value) {
    return Column(
      children: [
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900)),
        Text(label, style: const TextStyle(color: Colors.white30, fontSize: 12)),
      ],
    );
  }

  Widget _buildAuditTrail() {
    return Column(
      children: [
        _buildAuditItem('0x7d8...12a9', 'Voté POUR', 'Il y a 5 min'),
        _buildAuditItem('0x9f1...88c2', 'Voté CONTRE', 'Il y a 12 min'),
        _buildAuditItem('0x2e3...f3a2', 'Voté POUR', 'Il y a 1h'),
      ],
    );
  }

  Widget _buildAuditItem(String hash, String action, String time) {
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
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(hash, style: const TextStyle(color: Color(0xFF10B981), fontFamily: 'monospace', fontSize: 12)),
              Text(action, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ],
          ),
          Text(time, style: TextStyle(color: Colors.white.withOpacity(0.3), fontSize: 10)),
        ],
      ),
    );
  }
}
