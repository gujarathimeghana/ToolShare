import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import 'auth/login_screen.dart';
import 'main_nav_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _initApp();
  }

  Future<void> _initApp() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    await auth.checkAuth();
    await Future.delayed(const Duration(seconds: 2));

    if (mounted) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (_) => auth.isAuthenticated ? const MainNavScreen() : const LoginScreen(),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF4F46E5), Color(0xFF22C55E)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 90,
                height: 90,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 15)],
                ),
                child: const Center(
                  child: Text('N', style: TextStyle(fontSize: 48, fontWeight: FontWeight.bold, color: Color(0xFF4F46E5))),
                ),
              ),
              const SizedBox(height: 24),
              const Text('Neighborly', style: TextStyle(fontSize: 32, fontWeight: FontWeight.w800, color: Colors.white)),
              const SizedBox(height: 8),
              const Text('Hyper-local Tool Sharing & Help', style: TextStyle(fontSize: 14, color: Colors.white70)),
              const SizedBox(height: 48),
              const CircularProgressIndicator(color: Colors.white),
            ],
          ),
        ),
      ),
    );
  }
}
