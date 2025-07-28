import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import TransactionForm from './TransactionForm';
import CategoryManager from './CategoryManager';
import { useFinance } from '../../context/FinanceContext';

const Transactions: React.FC = () => {
  const { transactions } = useFinance();

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 3 }}>
        Transacciones
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        gap: 3,
        mb: 4 
      }}>
        <Paper sx={{ 
          p: 3, 
          flex: 1,
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
            Registrar Transacción
          </Typography>
          <TransactionForm />
        </Paper>
        
        <Paper sx={{ 
          p: 3, 
          flex: 1,
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
            Gestionar Categorías
          </Typography>
          <CategoryManager />
        </Paper>
      </Box>
      
      <Box mt={4}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
          Últimas Transacciones
        </Typography>
        {transactions.length === 0 ? (
          <Typography sx={{ 
            textAlign: 'center', 
            py: 4,
            color: '#7f8c8d'
          }}>
            No hay transacciones registradas
          </Typography>
        ) : (
          <Box sx={{
            display: 'grid',
            gap: 2
          }}>
            {[...transactions].reverse().slice(0, 5).map(transaction => (
              <Box 
                key={transaction.id}
                sx={{ 
                  p: 2.5,
                  borderRadius: '10px',
                  backgroundColor: transaction.type === 'income' ? '#e8f5e9' : '#ffebee',
                  borderLeft: `4px solid ${transaction.type === 'income' ? '#2ecc71' : '#e74c3c'}`,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1
                }}>
                  <Typography sx={{ 
                    fontWeight: '600',
                    fontSize: '1.1rem'
                  }}>
                    {transaction.category}
                  </Typography>
                  <Typography sx={{ 
                    fontWeight: '700',
                    fontSize: '1.2rem',
                    color: transaction.type === 'income' ? '#27ae60' : '#c0392b'
                  }}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </Typography>
                </Box>
                
                <Typography variant="body2" sx={{ 
                  color: '#7f8c8d',
                  mb: 1
                }}>
                  {transaction.date}
                </Typography>
                
                {transaction.description && (
                  <Typography variant="body2" sx={{ 
                    fontStyle: 'italic',
                    mt: 1.5
                  }}>
                    {transaction.description}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Transactions;