import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/theme_provider.dart';
import '../auth/login_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _cityController = TextEditingController();
  final _areaController = TextEditingController();
  final _stateController = TextEditingController();
  final _pincodeController = TextEditingController();

  void _showEditLocationDialog() {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final loc = auth.user?.location ?? {};

    _cityController.text = loc['city'] ?? 'New York';
    _areaController.text = loc['area'] ?? 'Manhattan';
    _stateController.text = loc['state'] ?? 'NY';
    _pincodeController.text = loc['pincode'] ?? '';

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          title: const Text('Update Manual Location', style: TextStyle(fontWeight: FontWeight.w900)),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: _cityController,
                  decoration: const InputDecoration(labelText: 'City *', prefixIcon: Icon(Icons.location_city)),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: _areaController,
                  decoration: const InputDecoration(labelText: 'Area / Locality *', prefixIcon: Icon(Icons.map)),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: _stateController,
                  decoration: const InputDecoration(labelText: 'State *', prefixIcon: Icon(Icons.flag)),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: _pincodeController,
                  decoration: const InputDecoration(labelText: 'PIN Code (Optional)', prefixIcon: Icon(Icons.pin_drop)),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () async {
                final city = _cityController.text.trim();
                final area = _areaController.text.trim();
                final state = _stateController.text.trim();
                final pincode = _pincodeController.text.trim();

                if (city.isEmpty || area.isEmpty || state.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Please fill City, Area, and State'), backgroundColor: Colors.red),
                  );
                  return;
                }

                await auth.updateProfile({
                  'city': city,
                  'area': area,
                  'state': state,
                  'pincode': pincode,
                });

                if (mounted) {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Location updated successfully!'), backgroundColor: Colors.green),
                  );
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF4F46E5),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: const Text('Save Location', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final themeProvider = Provider.of<ThemeProvider>(context);

    final name = auth.user?.name ?? 'Neighbor';
    final initial = name.isNotEmpty ? name[0].toUpperCase() : 'N';
    final loc = auth.user?.location ?? {};
    final addressText = loc['address'] ??
        '${loc['area'] ?? 'Manhattan'}, ${loc['city'] ?? 'New York'}, ${loc['state'] ?? 'NY'} ${loc['pincode'] ?? ''}'.trim();

    return Scaffold(
      appBar: AppBar(title: const Text('My Profile & Settings', style: TextStyle(fontWeight: FontWeight.w900))),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Center(
            child: Container(
              width: 90,
              height: 90,
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF4F46E5), Color(0xFF9333EA)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                shape: BoxShape.circle,
                boxShadow: [BoxShadow(color: Colors.black26, blurRadius: 10, offset: Offset(0, 4))],
              ),
              child: Center(
                child: Text(
                  initial,
                  style: const TextStyle(fontSize: 40, fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(name, textAlign: TextAlign.center, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          Text(auth.user?.email ?? '', textAlign: TextAlign.center, style: const TextStyle(color: Colors.grey, fontSize: 13)),
          const SizedBox(height: 10),

          // Location Display Pill
          Center(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              decoration: BoxDecoration(
                color: const Color(0xFF4F46E5).withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.location_on, size: 16, color: Color(0xFF4F46E5)),
                  const SizedBox(width: 4),
                  Text(
                    addressText.isNotEmpty ? addressText : 'Manhattan, New York, NY',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF4F46E5)),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          ListTile(
            leading: const Icon(Icons.edit_location_alt_outlined, color: Color(0xFF4F46E5)),
            title: const Text('Edit Manual Location', style: TextStyle(fontWeight: FontWeight.bold)),
            subtitle: const Text('Set your City, Area/Locality, State & PIN Code'),
            trailing: const Icon(Icons.arrow_forward_ios, size: 14),
            onTap: _showEditLocationDialog,
          ),
          const Divider(),

          SwitchListTile(
            title: const Text('Dark Mode Theme', style: TextStyle(fontWeight: FontWeight.bold)),
            value: themeProvider.isDarkMode,
            onChanged: (_) => themeProvider.toggleTheme(),
            secondary: const Icon(Icons.dark_mode_outlined),
          ),
          const Divider(),

          ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text('Logout Account', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
            onTap: () async {
              await auth.logout();
              if (context.mounted) {
                Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => const LoginScreen()));
              }
            },
          ),
        ],
      ),
    );
  }
}
