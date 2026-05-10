import 'package:flutter/material.dart';
import 'dart:convert';
import '../services/api_service.dart';

class ExplorerScreen extends StatefulWidget {
  const ExplorerScreen({super.key});

  @override
  State<ExplorerScreen> createState() => _ExplorerScreenState();
}

class _ExplorerScreenState extends State<ExplorerScreen> with SingleTickerProviderStateMixin {
  final ApiService _apiService = ApiService();
  late TabController _tabController;
  late Future<List<dynamic>> _transactionsFuture;
  late Future<List<dynamic>> _blocksFuture;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _refreshData();
  }

  void _refreshData() {
    setState(() {
      _transactionsFuture = _apiService.getTransactions();
      _blocksFuture = _apiService.getBlocks();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF020617),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('CoopLedger Explorer', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.white),
            onPressed: _refreshData,
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: const Color(0xFF10B981),
          labelColor: const Color(0xFF10B981),
          unselectedLabelColor: Colors.white54,
          tabs: const [
            Tab(text: 'TRANSACTIONS'),
            Tab(text: 'LEDGER (BLOCS)'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildTransactionList(),
          _buildBlockList(),
        ],
      ),
    );
  }

  Widget _buildTransactionList() {
    return FutureBuilder<List<dynamic>>(
      future: _transactionsFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)));
        }
        final txs = snapshot.data ?? [];
        return ListView.builder(
          padding: const EdgeInsets.all(24),
          itemCount: txs.length,
          itemBuilder: (context, index) {
            final tx = txs[index];
            final isCredit = tx['type'] == 'credit';
            return Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.white.withOpacity(0.05)),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    backgroundColor: isCredit ? const Color(0xFF10B981).withOpacity(0.1) : Colors.white10,
                    child: Icon(isCredit ? Icons.add : Icons.remove, color: isCredit ? const Color(0xFF10B981) : Colors.white70),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(tx['description'] ?? 'Transaction', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 4),
                        Text(tx['date'] ?? '', style: TextStyle(color: Colors.white30, fontSize: 11)),
                      ],
                    ),
                  ),
                  Text(
                    '${isCredit ? '+' : '-'}${tx['amount']} F',
                    style: TextStyle(color: isCredit ? const Color(0xFF10B981) : Colors.redAccent, fontWeight: FontWeight.w900),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildBlockList() {
    return FutureBuilder<List<dynamic>>(
      future: _blocksFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)));
        }
        final blocks = snapshot.data ?? [];
        final reversedBlocks = blocks.reversed.toList();

        return ListView.builder(
          padding: const EdgeInsets.all(24),
          itemCount: reversedBlocks.length,
          itemBuilder: (context, index) {
            final block = reversedBlocks[index];
            return Container(
              margin: const EdgeInsets.only(bottom: 24),
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A),
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: Colors.white.withOpacity(0.05)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text('BLOC #${block['index']}', style: const TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.w900, fontSize: 12)),
                      ),
                      Text(
                        DateTime.fromMillisecondsSinceEpoch(block['timestamp']).toString().split('.')[0],
                        style: TextStyle(color: Colors.white24, fontSize: 10),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Text('HASH DU BLOC', style: TextStyle(color: Colors.white38, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
                  const SizedBox(height: 8),
                  Text(block['hash'] ?? '', style: const TextStyle(color: Color(0xFF34D399), fontSize: 10, fontFamily: 'monospace')),
                  const SizedBox(height: 16),
                  const Text('HASH PRÉCÉDENT', style: TextStyle(color: Colors.white38, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
                  const SizedBox(height: 8),
                  Text(block['previousHash'] ?? '', style: const TextStyle(color: Colors.white54, fontSize: 10, fontFamily: 'monospace')),
                  const SizedBox(height: 20),
                  const Divider(color: Colors.white10),
                  const SizedBox(height: 12),
                  const Text('PAYLOAD (DONNÉES)', style: TextStyle(color: Colors.white38, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
                  const SizedBox(height: 8),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.black26,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      const JsonEncoder.withIndent('  ').convert(block['data']),
                      style: const TextStyle(color: Colors.blueAccent, fontSize: 9, fontFamily: 'monospace'),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Align(
                    alignment: Alignment.centerRight,
                    child: Text('Nonce: ${block['nonce']}', style: const TextStyle(color: Colors.white12, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}
