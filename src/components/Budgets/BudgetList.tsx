import React from 'react';
import { Budget, useFinance } from '../../context/FinanceContext';
import { Box, List, ListItem, Typography, IconButton, Paper, LinearProgress, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';

interface BudgetListProps {
  onEdit: (budget: Budget) => void;
}

const BudgetList: React.FC<BudgetListProps> = ({ onEdit }) => {
  const { budgets, deleteBudget, transactions } = useFinance();

  // Función para obtener transacciones relacionadas con un presupuesto
  const getRelatedTransactions = (budgetId: string) => {
    return transactions.filter(t => t.budgetId === budgetId);
  };

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
          {budgets.map(budget => {
            const isActive = new Date(budget.endDate) >= new Date();
            const utilization = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
            const isOverBudget = utilization > 100;
            const isNearLimit = utilization > 90 && !isOverBudget;
            const relatedTransactions = getRelatedTransactions(budget.id);
            
            return (
              <ListItem 
                key={budget.id} 
                divider
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 2,
                  backgroundColor: !isActive ? '#f9f9f9' : 'transparent',
                  opacity: !isActive ? 0.7 : 1
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography fontWeight="bold">{budget.name}</Typography>
                    {!isActive && (
                      <Typography variant="caption" color="textSecondary" sx={{ ml: 1, bgcolor: '#eee', px: 1, borderRadius: 1 }}>
                        Vencido
                      </Typography>
                    )}
                    {(isOverBudget || isNearLimit) && (
                      <Tooltip title={isOverBudget ? "Presupuesto excedido" : "Presupuesto cerca del límite"}>
                        <WarningIcon 
                          color={isOverBudget ? "error" : "warning"} 
                          sx={{ ml: 1 }} 
                        />
                      </Tooltip>
                    )}
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary">
                    {budget.area} | Vence: {new Date(budget.endDate).toLocaleDateString()}
                  </Typography>
                  
                  <Typography variant="body2">
                    Gastado: ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(utilization, 100)} 
                      sx={{ 
                        flexGrow: 1,
                        height: 8,
                        borderRadius: 4,
                        mr: 1,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: isOverBudget ? '#e74c3c' : isNearLimit ? '#f39c12' : '#2ecc71',
                          borderRadius: 4
                        }
                      }} 
                    />
                    <Typography variant="body2">
                      {Math.min(utilization, 100).toFixed(1)}%
                    </Typography>
                  </Box>
                  
                  {relatedTransactions.length > 0 && (
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                      {relatedTransactions.length} movimiento(s) asociado(s)
                    </Typography>
                  )}
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
            );
          })}
        </List>
      )}
    </Paper>
  );
};

export default BudgetList;
