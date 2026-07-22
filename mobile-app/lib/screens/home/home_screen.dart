import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/tool_provider.dart';
import '../tools/tool_details_screen.dart';
import '../tools/add_tool_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _selectedCategory = 'All';

  final List<Map<String, dynamic>> _categories = [
    {'name': 'All', 'icon': Icons.grid_view_rounded, 'color': Color(0xFF4F46E5)},
    {'name': 'Power Tools', 'icon': Icons.flash_on_rounded, 'color': Color(0xFF7C3AED)},
    {'name': 'Hand Tools', 'icon': Icons.handyman_rounded, 'color': Color(0xFF2563EB)},
    {'name': 'Gardening', 'icon': Icons.park_rounded, 'color': Color(0xFF10B981)},
    {'name': 'Cleaning', 'icon': Icons.cleaning_services_rounded, 'color': Color(0xFFF59E0B)},
    {'name': 'Painting', 'icon': Icons.brush_rounded, 'color': Color(0xFFEC4899)},
  ];

  @override
  void initState() {
    super.initState();
    Future.microtask(() => Provider.of<ToolProvider>(context, listen: false).fetchTools());
  }

  @override
  Widget build(BuildContext context) {
    final toolProvider = Provider.of<ToolProvider>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final filteredTools = _selectedCategory == 'All'
        ? toolProvider.tools
        : toolProvider.tools.where((t) => t.categoryName.toLowerCase() == _selectedCategory.toLowerCase()).toList();

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF4F46E5), Color(0xFF9333EA)],
                ),
                borderRadius: BorderRadius.circular(12),
                boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 6)],
              ),
              child: const Text('N', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 18)),
            ),
            const SizedBox(width: 10),
            ShaderMask(
              shaderCallback: (bounds) => const LinearGradient(
                colors: [Color(0xFF4F46E5), Color(0xFF7C3AED)],
              ).createShader(bounds),
              child: const Text('Neighborly', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 22, color: Colors.white)),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const AddToolScreen()));
        },
        backgroundColor: const Color(0xFF4F46E5),
        icon: const Icon(Icons.add_rounded, color: Colors.white),
        label: const Text('List a Tool', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: toolProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () => toolProvider.fetchTools(),
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Hero Card Banner
                  Container(
                    padding: const EdgeInsets.all(22),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF4F46E5), Color(0xFF7C3AED), Color(0xFF2563EB)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(28),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF4F46E5).withOpacity(0.4),
                          blurRadius: 20,
                          offset: const Offset(0, 8),
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
                              child: const Text('⚡ Hyper-Local Sharing', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                            ),
                            const Icon(Icons.handyman_rounded, color: Colors.white70, size: 28),
                          ],
                        ),
                        const SizedBox(height: 12),
                        const Text('Borrow Tools Nearby', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900, letterSpacing: -0.5)),
                        const SizedBox(height: 6),
                        const Text('Save money, borrow from verified neighbors around you.', style: TextStyle(color: Colors.white70, fontSize: 13, height: 1.4)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Categories Slider
                  const Text('Categories', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
                  const SizedBox(height: 12),

                  SizedBox(
                    height: 44,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: _categories.length,
                      itemBuilder: (context, index) {
                        final cat = _categories[index];
                        final isSelected = _selectedCategory == cat['name'];
                        return GestureDetector(
                          onTap: () => setState(() => _selectedCategory = cat['name']),
                          child: Container(
                            margin: const EdgeInsets.only(right: 10),
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                            decoration: BoxDecoration(
                              color: isSelected ? cat['color'] as Color : (isDark ? const Color(0xFF1E293B) : Colors.white),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: isSelected ? Colors.transparent : Colors.grey.withOpacity(0.2)),
                              boxShadow: isSelected
                                  ? [BoxShadow(color: (cat['color'] as Color).withOpacity(0.4), blurRadius: 10, offset: const Offset(0, 4))]
                                  : null,
                            ),
                            child: Row(
                              children: [
                                Icon(cat['icon'] as IconData, size: 18, color: isSelected ? Colors.white : cat['color'] as Color),
                                const SizedBox(width: 6),
                                Text(
                                  cat['name'] as String,
                                  style: TextStyle(
                                    color: isSelected ? Colors.white : (isDark ? Colors.white : const Color(0xFF0F172A)),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 13,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Tool Feed
                  const Text('Featured Nearby Tools', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
                  const SizedBox(height: 14),

                  if (filteredTools.isEmpty)
                    const Padding(
                      padding: EdgeInsets.all(40.0),
                      child: Center(child: Text('No tools listed in this category yet.')),
                    )
                  else
                    ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: filteredTools.length,
                      itemBuilder: (context, index) {
                        final tool = filteredTools[index];
                        return Container(
                          margin: const EdgeInsets.only(bottom: 16),
                          decoration: BoxDecoration(
                            color: isDark ? const Color(0xFF1E293B) : Colors.white,
                            borderRadius: BorderRadius.circular(24),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.indigo.withOpacity(isDark ? 0.2 : 0.06),
                                blurRadius: 15,
                                offset: const Offset(0, 6),
                              )
                            ],
                            border: Border.all(color: Colors.indigo.withOpacity(0.1)),
                          ),
                          child: InkWell(
                            borderRadius: BorderRadius.circular(24),
                            onTap: () {
                              Navigator.push(context, MaterialPageRoute(builder: (_) => ToolDetailsScreen(tool: tool)));
                            },
                            child: Padding(
                              padding: const EdgeInsets.all(14),
                              child: Row(
                                children: [
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(16),
                                    child: Image.network(
                                      tool.images.isNotEmpty ? tool.images[0] : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500',
                                      width: 90,
                                      height: 90,
                                      fit: BoxFit.cover,
                                      errorBuilder: (_, __, ___) => Container(width: 90, height: 90, color: Colors.grey[300]),
                                    ),
                                  ),
                                  const SizedBox(width: 16),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(tool.title, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
                                        const SizedBox(height: 4),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                          decoration: BoxDecoration(
                                            color: const Color(0xFF4F46E5).withOpacity(0.1),
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                          child: Text(tool.categoryName, style: const TextStyle(color: Color(0xFF4F46E5), fontSize: 11, fontWeight: FontWeight.bold)),
                                        ),
                                        const SizedBox(height: 8),
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            Text('\$${tool.pricePerDay.toStringAsFixed(0)} / day', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: Color(0xFF10B981))),
                                            const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: Colors.grey),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
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
