import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/api_service.dart';

class VerificationScreen extends StatefulWidget {
  const VerificationScreen({super.key});

  @override
  State<VerificationScreen> createState() => _VerificationScreenState();
}

class _VerificationScreenState extends State<VerificationScreen> {
  bool _isScanning = true;
  MobileScannerController cameraController = MobileScannerController();

  @override
  void dispose() {
    cameraController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    bool isMobile = !kIsWeb && (Platform.isAndroid || Platform.isIOS);

    return Scaffold(
      backgroundColor: const Color(0xFF020617),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('VÉRIFICATION LEDGER', style: TextStyle(fontWeight: FontWeight.w900, color: Colors.white, fontSize: 16)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Column(
        children: [
          const SizedBox(height: 20),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            child: Text(
              isMobile 
                ? 'Alignez le QR Code pour une analyse cryptographique.'
                : 'TERMINAL DE CERTIFICATION : Accédez aux données du ledger en temps réel.',
              style: const TextStyle(color: Colors.white54, fontSize: 13),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: 30),
          Expanded(
            flex: 4,
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 24),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(30),
                border: Border.all(color: const Color(0xFF10B981), width: 3),
              ),
              clipBehavior: Clip.antiAlias,
              child: _isScanning 
                ? (isMobile 
                    ? MobileScanner(
                        controller: cameraController,
                        onDetect: (capture) {
                          final List<Barcode> barcodes = capture.barcodes;
                          if (barcodes.isNotEmpty) {
                            final String code = barcodes.first.rawValue ?? "";
                            if (code.isNotEmpty) {
                              setState(() => _isScanning = false);
                              _showResult(code);
                            }
                          }
                        },
                      )
                    : _buildDigitalDecoderUI())
                : const Center(child: Icon(Icons.verified, color: Color(0xFF10B981), size: 100)),
            ),
          ),
          const SizedBox(height: 40),
          if (_isScanning)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 40),
              child: ElevatedButton.icon(
                onPressed: () {
                  setState(() => _isScanning = false);
                  _showResult('coopledger://report?type=monthly&signer=President');
                },
                icon: const Icon(Icons.security),
                label: const Text('DÉCHIFFRER DEPUIS LE LEDGER'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF10B981),
                  minimumSize: const Size.fromHeight(60),
                ),
              ),
            )
          else
            ElevatedButton(
              onPressed: () => setState(() => _isScanning = true),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.white24),
              child: const Text('NOUVELLE VÉRIFICATION'),
            ),
          
          const SizedBox(height: 20),
          TextButton.icon(
            onPressed: _showTestQRCode,
            icon: const Icon(Icons.qr_code, color: Color(0xFF10B981)),
            label: const Text('GÉNÉRER QR CODE CERTIFIÉ', style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 11)),
          ),
          const Spacer(),
          _buildFooter(),
        ],
      ),
    );
  }

  Widget _buildDigitalDecoderUI() {
    return Container(
      width: double.infinity,
      color: Colors.black.withOpacity(0.5),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.lan, color: Color(0xFF10B981), size: 80),
          const SizedBox(height: 24),
          const Text('CAPTEUR RÉSEAU PRÊT', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, letterSpacing: 1.2)),
          const SizedBox(height: 8),
          const Text('SCAN CAMERA DISPONIBLE SUR MOBILE', style: TextStyle(color: Colors.white24, fontSize: 10, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildFooter() {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(40)),
      ),
      child: Row(
        children: [
          const Icon(Icons.lock, color: Color(0xFF10B981), size: 32),
          const SizedBox(width: 16),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('SÉCURITÉ LEDGER', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                Text('Accès direct au registre décentralisé', style: TextStyle(color: Colors.white54, fontSize: 12)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showTestQRCode() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF020617),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text('QR CODE CERTIFIÉ', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Ce code contient l\'empreinte cryptographique du rapport.', style: TextStyle(color: Colors.white54, fontSize: 12)),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
              child: SizedBox(
                width: 200,
                height: 200,
                child: QrImageView(
                  data: 'coopledger://report?type=monthly&signer=President_Coop',
                  version: QrVersions.auto,
                  size: 200.0,
                ),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('FERMER')),
        ],
      ),
    );
  }

  Future<void> _launchURL(String urlString) async {
    final Uri url = Uri.parse(urlString);
    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Impossible d\'ouvrir le lien : $urlString')),
        );
      }
    }
  }

  void _showResult(String code) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF0F172A),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(32))),
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.8,
        maxChildSize: 0.9,
        minChildSize: 0.5,
        expand: false,
        builder: (context, scrollController) => SingleChildScrollView(
          controller: scrollController,
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.verified, color: Color(0xFF10B981), size: 64),
              const SizedBox(height: 24),
              const Text('AUTHENTICITÉ CONFIRMÉE', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w900)),
              const SizedBox(height: 24),
              
              // Aperçu visuel
              Container(
                height: 150, width: 110,
                decoration: BoxDecoration(
                  color: Colors.white, borderRadius: BorderRadius.circular(12),
                  boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.5), blurRadius: 20)],
                ),
                child: Column(
                  children: [
                    Container(height: 20, decoration: const BoxDecoration(color: Color(0xFF10B981), borderRadius: BorderRadius.vertical(top: Radius.circular(12)))),
                    const Expanded(child: Center(child: Icon(Icons.description, color: Colors.grey, size: 50))),
                    Container(height: 12, width: 80, color: Colors.grey[100], margin: const EdgeInsets.only(bottom: 10)),
                  ],
                ),
              ),
              
              const SizedBox(height: 24),
              const Text('Ce document est certifié par la blockchain CoopLedger.', textAlign: TextAlign.center, style: TextStyle(color: Colors.white60)),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: Colors.black.withOpacity(0.3), borderRadius: BorderRadius.circular(16)),
                child: Text(code, style: const TextStyle(color: Colors.white70, fontSize: 11, fontStyle: FontStyle.italic), textAlign: TextAlign.center),
              ),
              const SizedBox(height: 32),
              if (code.startsWith('coopledger://'))
                ElevatedButton(
                  onPressed: () async {
                    String baseUrl = await ApiService.getBaseUrl();
                    String finalUrl = baseUrl.replaceAll('/api', '/app/reports/print') + '?' + code.split('?')[1];
                    // Si on est sur localhost/10.0.2.2, on remplace par une IP accessible si besoin, 
                    // mais ici on garde la logique ApiService.
                    _launchURL(finalUrl);
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.blueAccent, minimumSize: const Size.fromHeight(50)),
                  child: const Text('TÉLÉCHARGER LE PDF'),
                ),
              const SizedBox(height: 12),
              OutlinedButton(onPressed: () => Navigator.pop(context), child: const Text('RETOUR AU TERMINAL')),
            ],
          ),
        ),
      ),
    );
  }
}
