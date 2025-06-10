import 'package:flutter/foundation.dart';
import 'package:expense_management/models/user.dart';
import 'package:expense_management/models/transaction.dart';

class ExpenseProvider with ChangeNotifier {
  List<User> _users = [];
  List<Transaction> _transactions = [];
  bool _isLoading = false;
  String? _error;

  List<User> get users => _users;
  List<Transaction> get transactions => _transactions;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchUsers() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // TODO: Implement API call to fetch users
      _users = [
        User(
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          totalIncome: 5000,
          totalExpense: 3000,
        ),
        User(
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          totalIncome: 6000,
          totalExpense: 4000,
        ),
      ];
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchTransactions(String userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // TODO: Implement API call to fetch transactions
      _transactions = [
        Transaction(
          id: '1',
          userId: userId,
          amount: 1000,
          description: 'Salary',
          date: DateTime.now(),
          type: TransactionType.income,
        ),
        Transaction(
          id: '2',
          userId: userId,
          amount: 500,
          description: 'Rent',
          date: DateTime.now(),
          type: TransactionType.expense,
          category: ExpenseCategory.housing,
        ),
      ];
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addTransaction(Transaction transaction) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // TODO: Implement API call to add transaction
      _transactions.add(transaction);
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateTransaction(Transaction transaction) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // TODO: Implement API call to update transaction
      final index = _transactions.indexWhere((t) => t.id == transaction.id);
      if (index != -1) {
        _transactions[index] = transaction;
      }
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteTransaction(String transactionId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // TODO: Implement API call to delete transaction
      _transactions.removeWhere((t) => t.id == transactionId);
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
} 