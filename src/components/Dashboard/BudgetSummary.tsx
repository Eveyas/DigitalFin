import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Box, Typography, LinearProgress } from '@mui/material';

const BudgetSummary: React.FC = () => {
  const { budgets, transactions } = useFinance();

  const budgetsWithSpent = budgets.map(budget => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === budget.name)
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...budget, spent, percentage: (spent / budget.amount) * 100 };
  });

  return (
    <Box className="budget-summary">
      <Typography variant="h6" gutterBottom>Resumen de Presupuestos</Typography>
      {budgetsWithSpent.length === 0 ? (
        <Typography>No hay presupuestos registrados</Typography>
      ) : (
        budgetsWithSpent.map(budget => (
          <Box key={budget.id} mb={2}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography fontWeight="bold">{budget.name}</Typography>
              <Typography>
                ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(budget.percentage, 100)} 
              color={budget.percentage > 90 ? 'error' : budget.percentage > 75 ? 'warning' : 'primary'}
            />
            <Box display="flex" justifyContent="flex-end" mt={0.5}>
              <Typography variant="caption">
                {Math.min(budget.percentage, 100).toFixed(1)}%
              </Typography>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

export default BudgetSummary;