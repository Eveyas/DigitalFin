import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import CashFlowChart from './CashFlowChart';
import BudgetSummary from './BudgetSummary';
import BudgetInsights from '../Dashboard/BudgetInsights';
import Alerts from '../Alerts/Alerts';
import { useFinance } from '../../context/FinanceContext';

const Dashboard: React.FC = () => {
  const { transactions, alerts, getBudgetInsights, getCashFlowData } = useFinance();
  const [timeRange, setTimeRange] = useState<'3M' | '6M' | '1A'>('6M');
  
  // Calcular totales
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpenses;
  const { totalBudgets, totalAllocated, totalSpent } = getBudgetInsights();
  const cashFlowData = getCashFlowData(timeRange === '3M' ? 3 : timeRange === '6M' ? 6 : 12);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>

        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          Panel de Control
        </Typography>
        
        <Box sx={{
          display: 'flex',
          gap: 1,
          bgcolor: '#f8f9fa',
          p: '4px',
          borderRadius: '8px'
        }}>
          {['3M', '6M', '1A'].map((item) => (
            <Box 
              key={item}
              onClick={() => setTimeRange(item as any)}
              sx={{
                px: 2,
                py: '6px',
                borderRadius: '6px',
                cursor: 'pointer',
                bgcolor: item === timeRange ? '#e9ecef' : 'transparent',
                fontWeight: item === timeRange ? '600' : '500',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: '#e9ecef'
                }
              }}
            >
              {item}
            </Box>
          ))}
        </Box>
      </Box>

      {alerts.length > 0 && <Alerts />}

      {/* Tarjetas de resumen */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4
      }}>
        <Box sx={{
          p: 3,
          background: 'linear-gradient(135deg, #2ecc71, #1abc9c)',
          color: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Ingresos</Typography>
          <Typography variant="h4" sx={{ fontWeight: '700', mb: 1, fontSize: '2rem' }}>
            ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
          <Typography variant="body2">Total acumulado</Typography>
        </Box>
        
        <Box sx={{
          p: 3,
          background: 'linear-gradient(135deg, #e74c3c, #e67e22)',
          color: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Egresos</Typography>
          <Typography variant="h4" sx={{ fontWeight: '700', mb: 1, fontSize: '2rem' }}>
            ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
          <Typography variant="body2">Total acumulado</Typography>
        </Box>
        
        <Box sx={{
          p: 3,
          background: 'linear-gradient(135deg, #3498db, #2980b9)',
          color: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Balance</Typography>
          <Typography variant="h4" sx={{ 
            fontWeight: '700', 
            mb: 1, 
            fontSize: '2rem',
            color: balance >= 0 ? '#fff' : '#ffdddd'
          }}>
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
          <Typography variant="body2">Estado actual</Typography>
        </Box>
        
        <Box sx={{
          p: 3,
          background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
          color: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Presupuestos</Typography>
          <Typography variant="h4" sx={{ fontWeight: '700', mb: 1, fontSize: '2rem' }}>
            {totalBudgets}
          </Typography>
          <Typography variant="body2">Activos</Typography>
        </Box>
      </Box>

      {/* Sección de gráficos y resumen */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        gap: 3,
        mb: 4
      }}>
        <Box sx={{
          p: 3,
          bgcolor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <Typography variant="h5" sx={{ fontWeight: '600', mb: 3 }}>
            Flujo de Caja ({timeRange})
          </Typography>
          <CashFlowChart data={cashFlowData} />
        </Box>
        
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}>
          <Box sx={{
            p: 3,
            bgcolor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            height: '100%'
          }}>
            <Typography variant="h5" sx={{ fontWeight: '600', mb: 3 }}>
              Resumen de Presupuestos
            </Typography>
            <BudgetSummary />
          </Box>
          
          <Box sx={{
            p: 3,
            bgcolor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <BudgetInsights 
              totalBudgets={totalBudgets} 
              totalAllocated={totalAllocated} 
              totalSpent={totalSpent} 
            />
          </Box>
        </Box>
      </Box>

      {/* Últimas transacciones */}
      <Box sx={{
        p: 3,
        bgcolor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <Typography variant="h5" sx={{ fontWeight: '600', mb: 3 }}>
          Últimas Operaciones
        </Typography>
        {transactions.length === 0 ? (
          <Typography sx={{ textAlign: 'center', py: 4, color: '#7f8c8d' }}>
            No existen Operaciones registradas
          </Typography>
        ) : (
          <Box sx={{
            display: 'grid',
            gap: 2
          }}>
            {[...transactions].slice(-5).reverse().map(transaction => (
              <Box 
                key={transaction.id}
                sx={{ 
                  p: 2.5,
                  borderRadius: '10px',
                  backgroundColor: transaction.type === 'income' ? '#e8f5e9' : '#ffebee',
                  borderLeft: `4px solid ${transaction.type === 'income' ? '#2ecc71' : '#e74c3c'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: '600' }}>
                    {transaction.category}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                    {transaction.date}
                  </Typography>
                  {transaction.description && (
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                      {transaction.description}
                    </Typography>
                  )}
                </Box>
                <Typography sx={{ 
                  fontWeight: '700',
                  fontSize: '1.2rem',
                  color: transaction.type === 'income' ? '#27ae60' : '#c0392b'
                }}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;