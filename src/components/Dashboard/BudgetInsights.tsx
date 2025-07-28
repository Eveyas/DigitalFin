import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface BudgetInsightsProps {
  totalBudgets: number;
  totalAllocated: number;
  totalSpent: number;
}

const BudgetInsights: React.FC<BudgetInsightsProps> = ({ 
  totalBudgets, 
  totalAllocated, 
  totalSpent 
}) => {
  const utilizationRate = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Análisis Presupuestal
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Presupuestos activos:</Typography>
          <Typography fontWeight="600">{totalBudgets}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Total asignado:</Typography>
          <Typography fontWeight="600">${totalAllocated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography>Total gastado:</Typography>
          <Typography fontWeight="600">${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
        </Box>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Tasa de utilización
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={utilizationRate} 
          sx={{ 
            height: 10,
            borderRadius: 5,
            mb: 1,
            backgroundColor: '#ecf0f1',
            '& .MuiLinearProgress-bar': {
              backgroundColor: utilizationRate > 90 ? '#e74c3c' : utilizationRate > 75 ? '#f39c12' : '#2ecc71',
              borderRadius: 5
            }
          }} 
        />
        <Typography variant="body2" textAlign="right">
          {utilizationRate.toFixed(1)}%
        </Typography>
      </Box>
      
      <Box sx={{ 
        mt: 3, 
        p: 2, 
        bgcolor: '#f8f9fa', 
        borderRadius: '8px',
        borderLeft: '4px solid #3498db'
      }}>
        <Typography variant="body2">
          {utilizationRate > 90 
            ? 'Alto nivel de gasto presupuestal. Considerar revisar asignaciones.'
            : utilizationRate > 75
            ? 'Nivel moderado de gasto. Mantener monitoreo continuo.'
            : 'Bajo nivel de gasto. Posible capacidad de inversión adicional.'}
        </Typography>
      </Box>
    </Box>
  );
};

export default BudgetInsights;