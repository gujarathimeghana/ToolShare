import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/tool_provider.dart';

class SearchScreen extends StatelessWidget {
  const SearchScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Explore Marketplace')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              onChanged: (val) {
                Provider.of<ToolProvider>(context, listen: false).fetchTools(search: val);
              },
              decoration: InputDecoration(
                hintText: 'Search tools, ladders, drills...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
              ),
            ),
            const SizedBox(height: 16),
            const Expanded(
              child: Center(child: Text('Type above to filter neighborhood tools.')),
            ),
          ],
        ),
      ),
    );
  }
}
