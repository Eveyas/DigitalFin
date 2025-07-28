import React from 'react';
import { Budget, useFinance } from '../../context/FinanceContext';
import { Box, List, ListItem, Typography, IconButton, Paper, LinearProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface BudgetListProps {
  onEdit: (budget: Budget) => void;
}

const BudgetList: React.FC<BudgetListProps> = ({ onEdit }) => {
  const { budgets, deleteBudget } = useFinance();

  return (
    <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
      <Typography variant="h5" sx={{ fontWeight: '600', mb: 3 }}>
        Presupuestos Activos
      </Typography>
      {budgets.length === 0 ? (
        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
          No hay presupuestos registrados
        </Typography>
      ) : (
        <List>
          {budgets.map(budget => (
            <ListItem 
              key={budget.id} 
              divider
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 2
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight="bold">{budget.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {budget.area} | {new Date(budget.endDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((budget.spent / budget.amount) * 100, 100)} 
                    sx={{ 
                      flexGrow: 1,
                      height: 8,
                      borderRadius: 4,
                      mr: 1,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: (budget.spent / budget.amount) > 0.9 ? '#e74c3c' : (budget.spent / budget.amount) > 0.7 ? '#f39c12' : '#2ecc71',
                        borderRadius: 4
                      }
                    }} 
                  />
                  <Typography variant="body2">
                    {Math.min((budget.spent / budget.amount) * 100, 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
              <Box>
                <IconButton onClick={() => onEdit(budget)} sx={{ mr: 1 }}>
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton onClick={() => deleteBudget(budget.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default BudgetList;