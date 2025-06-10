import 'package:json_annotation/json_annotation.dart';

part 'transaction.g.dart';

enum TransactionType {
  @JsonValue('income')
  income,
  @JsonValue('expense')
  expense
}

enum ExpenseCategory {
  @JsonValue('food')
  food,
  @JsonValue('transportation')
  transportation,
  @JsonValue('housing')
  housing,
  @JsonValue('utilities')
  utilities,
  @JsonValue('entertainment')
  entertainment,
  @JsonValue('healthcare')
  healthcare,
  @JsonValue('other')
  other
}

@JsonSerializable()
class Transaction {
  final String id;
  final String userId;
  final double amount;
  final String description;
  final DateTime date;
  final TransactionType type;
  final ExpenseCategory? category;

  Transaction({
    required this.id,
    required this.userId,
    required this.amount,
    required this.description,
    required this.date,
    required this.type,
    this.category,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) => _$TransactionFromJson(json);
  Map<String, dynamic> toJson() => _$TransactionToJson(this);
} 