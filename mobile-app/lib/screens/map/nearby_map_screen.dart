import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/tool_provider.dart';
import '../tools/tool_details_screen.dart';

class NearbyMapScreen extends StatefulWidget {
  const NearbyMapScreen({Key? key}) : super(key: key);

  @override
  State<NearbyMapScreen> createState() => _NearbyMapScreenState();
}

class _NearbyMapScreenState extends State<NearbyMapScreen> {
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
                  Provider.of<ToolProvider>(context, listen: false).fetchTools();
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
    final toolProvider = Provider.of<ToolProvider>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final loc = auth.user?.location ?? {};
    final addressText = loc['address'] ??
        '${loc['area'] ?? 'Manhattan'}, ${loc['city'] ?? 'New York'}, ${loc['state'] ?? 'NY'} ${loc['pincode'] ?? ''}'.trim();

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Location & Local Tools', style: TextStyle(fontWeight: FontWeight.w900)),
        elevation: 0,
        backgroundColor: Colors.transparent,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Manual Location Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF4F46E5), Color(0xFF7C3AED), Color(0xFF2563EB)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF4F46E5).withOpacity(0.35),
                    blurRadius: 15,
                    offset: const Offset(0, 6),
                  )
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.location_on, color: Colors.white, size: 14),
                            SizedBox(width: 4),
                            Text('Manual Profile Location', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.edit_location_alt_rounded, color: Colors.white),
                        onPressed: _showEditLocationDialog,
                        tooltip: 'Edit Location',
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    addressText.isNotEmpty ? addressText : 'Manhattan, New York, NY 10001',
                    style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 4),
                  const Text('All tools below are listed around your manually specified area.', style: TextStyle(color: Colors.white70, fontSize: 12)),
                ],
              ),
            ),
            const SizedBox(height: 24),

            const Text('Local Neighborhood Tools', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
            const SizedBox(height: 14),

            if (toolProvider.isLoading)
              const Center(child: CircularProgressIndicator())
            else if (toolProvider.tools.isEmpty)
              const Padding(
                padding: EdgeInsets.all(40.0),
                child: Center(child: Text('No tools available in your area yet.')),
              )
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: toolProvider.tools.length,
                itemBuilder: (context, index) {
                  final tool = toolProvider.tools[index];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 14),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.indigo.withOpacity(isDark ? 0.2 : 0.05),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        )
                      ],
                      border: Border.all(color: Colors.indigo.withOpacity(0.1)),
                    ),
                    child: ListTile(
                      contentPadding: const EdgeInsets.all(12),
                      leading: ClipRRect(
                        borderRadius: BorderRadius.circular(14),
                        child: Image.network(
                          tool.images.isNotEmpty ? tool.images[0] : 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600',
                          width: 60,
                          height: 60,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(width: 60, height: 60, color: Colors.grey[300]),
                        ),
                      ),
                      title: Text(tool.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 4),
                          Text('\$${tool.pricePerDay.toStringAsFixed(0)}/day • ${tool.categoryName}', style: const TextStyle(fontWeight: FontWeight.w600, color: Color(0xFF4F46E5))),
                        ],
                      ),
                      trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
                      onTap: () {
                        Navigator.push(context, MaterialPageRoute(builder: (_) => ToolDetailsScreen(tool: tool)));
                      },
                    ),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }
}
