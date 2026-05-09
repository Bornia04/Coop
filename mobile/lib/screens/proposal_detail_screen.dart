import 'package:flutter/material.dart';
import 'dart:async';
import '../services/api_service.dart';

class ProposalDetailScreen extends StatefulWidget {
  final String id;
  final String title;
  final String description;
  final double progress;
  final bool isActive;
  final String expiresAt;
  final int votesFor;
  final int votesAgainst;
  final List<dynamic> votes;

  const ProposalDetailScreen({
    super.key,
    required this.id,
    required this.title,
    required this.description,
    required this.progress,
    required this.isActive,
    required this.expiresAt,
    required this.votesFor,
    required this.votesAgainst,
    required this.votes,
  });

  @override
  State<ProposalDetailScreen> createState() => _ProposalDetailScreenState();
}

class _ProposalDetailScreenState extends State<ProposalDetailScreen> {
  late Timer _timer;
  String _timeLeft = '';
  bool _isClosed = false;

  @override
  void initState() {
    super.initState();
    _isClosed = !widget.isActive;
    _startTimer();
  }

  void _startTimer() {
    if (_isClosed || widget.expiresAt.isEmpty) return;

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      final now = DateTime.now();
      final end = DateTime.parse(widget.expiresAt);
      final diff = end.difference(now);

      if (diff.isNegative) {
        setState(() {
          _timeLeft = 'EXPIRÉ';
          _isClosed = true;
        });
        timer.cancel();
      } else {
        setState(() {
          _timeLeft = '${diff.inMinutes}:${(diff.inSeconds % 60).toString().padLeft(2, '0')}';
        });
      }
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

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
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: !_isClosed ? const Color(0xFF10B981).withOpacity(0.1) : Colors.white.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(100),
                  ),
                  child: Text(
                    !_isClosed ? 'VOTE EN COURS' : 'ARCHIVÉ / TERMINÉ',
                    style: TextStyle(
                      color: !_isClosed ? const Color(0xFF34D399) : Colors.white54,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
                if (!_isClosed && _timeLeft.isNotEmpty)
                  Row(
                    children: [
                      const Icon(Icons.timer_outlined, color: Colors.redAccent, size: 16),
                      const SizedBox(width: 8),
                      Text(
                        _timeLeft,
                        style: const TextStyle(color: Colors.redAccent, fontWeight: FontWeight.w900, fontSize: 16),
                      ),
                    ],
                  ),
              ],
            ),
            const SizedBox(height: 24),
            Text(
              widget.title,
              style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 16),
            Text(
              widget.description,
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
              Text(
                (widget.votesFor + widget.votesAgainst) == 0 
                  ? 'Aucun vote' 
                  : '${(widget.progress * 100).toInt()}% Pour', 
                style: TextStyle(
                  color: (widget.votesFor + widget.votesAgainst) == 0 ? Colors.white38 : const Color(0xFF10B981), 
                  fontWeight: FontWeight.w900
                )
              ),
            ],
          ),
          const SizedBox(height: 20),
          LinearProgressIndicator(
            value: widget.progress,
            backgroundColor: Colors.white.withOpacity(0.05),
            color: const Color(0xFF10B981),
            minHeight: 12,
            borderRadius: BorderRadius.circular(10),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildStat('Pour', widget.votesFor.toString()),
              _buildStat('Contre', widget.votesAgainst.toString()),
              _buildStat('Total', (widget.votesFor + widget.votesAgainst).toString()),
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
    if (widget.votes.isEmpty) {
      return const Center(child: Text('Aucun vote enregistré', style: TextStyle(color: Colors.white24)));
    }
    return Column(
      children: widget.votes.reversed.map((v) => _buildAuditItem(
        v['txHash'] ?? '0x...',
        'Voté ${v['vote'] == 'for' ? 'POUR' : 'CONTRE'}',
        v['memberId'] ?? 'Inconnu'
      )).toList(),
    );
  }

  Widget _buildAuditItem(String hash, String action, String user) {
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
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(hash, style: const TextStyle(color: Color(0xFF10B981), fontFamily: 'monospace', fontSize: 10), overflow: TextOverflow.ellipsis),
                Text(action, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          Text(user, style: TextStyle(color: Colors.white.withOpacity(0.3), fontSize: 12, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
