import 'package:flutter/material.dart';
import '../../models/tool_model.dart';

class ToolDetailsScreen extends StatelessWidget {
  final ToolModel tool;

  const ToolDetailsScreen({Key? key, required this.tool}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(tool.title)),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Image.network(
              tool.images.isNotEmpty ? tool.images[0] : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500',
              width: double.infinity,
              height: 250,
              fit: BoxFit.cover,
            ),
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(tool.categoryName, style: const TextStyle(color: Color(0xFF4F46E5), fontWeight: FontWeight.bold)),
                      Text('\$${tool.pricePerDay.toStringAsFixed(0)} / day', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(tool.title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 12),
                  Text(tool.description, style: TextStyle(color: Colors.grey[700], fontSize: 14, height: 1.5)),
                  const SizedBox(height: 30),
                  ElevatedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Booking request submitted!')),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4F46E5),
                      minimumSize: const Size.fromHeight(50),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    child: const Text('Request to Borrow', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
