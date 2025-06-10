import 'package:json_annotation/json_annotation.dart';

part 'user.g.dart';

@JsonSerializable()
class User {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String address;
  final double totalIncome;
  final double totalExpense;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.phone = '',
    this.address = '',
    this.totalIncome = 0.0,
    this.totalExpense = 0.0,
  });

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);
} 