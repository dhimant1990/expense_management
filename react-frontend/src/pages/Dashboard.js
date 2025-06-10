import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
} from '@mui/material';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [expenseData, setExpenseData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users');
      setUsers(response.data);
      updateExpenseChart(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const updateExpenseChart = (userData) => {
    const categories = ['Food', 'Housing', 'Transport', 'Other'];
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
    
    const totalExpenses = userData.reduce((sum, user) => sum + user.totalExpense, 0);
    const categoryTotals = categories.map((_, index) => totalExpenses * [0.3, 0.2, 0.15, 0.35][index]);

    setExpenseData({
      labels: categories,
      datasets: [{
        data: categoryTotals,
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.8', '1')),
        borderWidth: 1,
      }],
    });
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:8080/api/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Expense Management Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/register')}
        >
          Add New User
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Expense Distribution by Category
        </Typography>
        <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
          <Pie data={expenseData} options={{ maintainAspectRatio: false }} />
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Total Income</TableCell>
              <TableCell align="right">Total Expense</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/transactions/${user.id}`)}
                >
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell align="right" sx={{ color: 'success.main' }}>
                  ${user.totalIncome.toFixed(2)}
                </TableCell>
                <TableCell align="right" sx={{ color: 'error.main' }}>
                  ${user.totalExpense.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/register/${user.id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(user.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Dashboard; 