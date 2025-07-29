// import React, { useState } from 'react';
// import { Box, Typography } from '@mui/material';
// import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
// import CashFlowChart from './CashFlowChart';
// // import BudgetSummary from './BudgetSummary';
// import BudgetInsights from '../Dashboard/BudgetInsights';
// import Alerts from '../Alerts/Alerts';
// import { useFinance } from '../../context/FinanceContext';

// const Dashboard: React.FC = () => {
//   const { transactions, categories, alerts, getBudgetInsights, getCashFlowData } = useFinance();
//   const [timeRange, setTimeRange] = useState<'3M' | '6M' | '1A'>('6M');
  
//   const totalIncome = transactions
//     .filter(t => t.type === 'income')
//     .reduce((sum, t) => sum + t.amount, 0);
  
//   const totalExpenses = transactions
//     .filter(t => t.type === 'expense')
//     .reduce((sum, t) => sum + t.amount, 0);
  
//   const balance = totalIncome - totalExpenses;
//   const { totalBudgets, totalAllocated, totalSpent } = getBudgetInsights();
//   const cashFlowData = getCashFlowData(timeRange === '3M' ? 3 : timeRange === '6M' ? 6 : 12);

//   // Monto total por categoría
//   const amountByCategory = categories.map(cat => {
//     const total = transactions
//       .filter(t => t.category === cat)
//       .reduce((sum, t) => sum + t.amount, 0);
//     return { name: cat, value: total };
//   });

//   // Solo categorías con movimientos (value > 0)
//   const activeCategories = amountByCategory.filter(cat => cat.value > 0);

//   const COLORS = [
//     '#8884d8', '#8e44ad', '#3498db', '#e74c3c', '#e67e22',
//     '#2ecc71', '#f1c40f', '#34495e', '#16a085', '#d35400'
//   ];

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* Título y filtros */}
//       <Box sx={{ 
//         display: 'flex', 
//         justifyContent: 'space-between', 
//         alignItems: 'center',
//         mb: 3,
//         flexWrap: 'wrap',
//         gap: 2
//       }}>
//         <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
//           Panel de Control
//         </Typography>
        
//         <Box sx={{
//           display: 'flex',
//           gap: 1,
//           bgcolor: '#f8f9fa',
//           p: '4px',
//           borderRadius: '8px'
//         }}>
//           {['3M', '6M', '1A'].map(item => (
//             <Box 
//               key={item}
//               onClick={() => setTimeRange(item as any)}
//               sx={{
//                 px: 2,
//                 py: '6px',
//                 borderRadius: '6px',
//                 cursor: 'pointer',
//                 bgcolor: item === timeRange ? '#e9ecef' : 'transparent',
//                 fontWeight: item === timeRange ? '600' : '500',
//                 transition: 'all 0.2s',
//                 '&:hover': { bgcolor: '#e9ecef' }
//               }}
//             >
//               {item}
//             </Box>
//           ))}
//         </Box>
//       </Box>

//       {/* Tarjetas resumen, agregando total de categorías */}
//       <Box sx={{
//         display: 'grid',
//         gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' },
//         gap: 3,
//         mb: 4
//       }}>
//         {/* Egresos */}
//         <Box sx={{
//           p: 3,
//           background: 'linear-gradient(135deg, #e74c3c, #e67e22)',
//           color: 'white',
//           borderRadius: '12px',
//           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
//         }}>
//           <Typography variant="h6" sx={{ mb: 1 }}>Egresos</Typography>
//           <Typography variant="h4" sx={{ fontWeight: '700', mb: 1, fontSize: '2rem' }}>
//             ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//           </Typography>
//           <Typography variant="body2">Total acumulado</Typography>
//         </Box>

//         {/* Presupuestos */}
//         <Box sx={{
//           p: 3,
//           background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
//           color: 'white',
//           borderRadius: '12px',
//           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
//         }}>
//           <Typography variant="h6" sx={{ mb: 1 }}>Presupuestos</Typography>
//           <Typography variant="h4" sx={{ fontWeight: '700', mb: 1, fontSize: '2rem' }}>
//             {totalBudgets}
//           </Typography>
//           <Typography variant="body2">Activos</Typography>
//         </Box>

//         {/* Total Categorías */}
//         <Box sx={{
//           p: 3,
//           background: 'linear-gradient(135deg, #2980b9, #3498db)',
//           color: 'white',
//           borderRadius: '12px',
//           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center',
//           alignItems: 'center'
//         }}>
//           <Typography variant="h6" sx={{ mb: 1 }}>Categorías</Typography>
//           <Typography variant="h3" sx={{ fontWeight: '700' }}>
//             {categories.length}
//           </Typography>
//           <Typography variant="body2">Registradas</Typography>
//         </Box>
//       </Box>

//       {/* Gráficas */}
//       <Box sx={{
//         display: 'grid',
//         gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
//         gap: 3,
//         mb: 4
//       }}>
//         {/* Flujo de Caja */}
//         <Box sx={{
//           p: 3,
//           bgcolor: 'white',
//           borderRadius: '12px',
//           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
//           minHeight: 350,
//         }}>
//           <Typography variant="h6" sx={{ fontWeight: '600', mb: 3 }}>
//             Flujo de Caja ({timeRange})
//           </Typography>
//           <CashFlowChart data={cashFlowData} />
//         </Box>

//         {/* Distribución solo categorías con movimientos */}
//         <Box sx={{
//           p: 3,
//           bgcolor: 'white',
//           borderRadius: '12px',
//           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
//           minHeight: 350,
//         }}>
//           <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
//             Distribución por Categoría
//           </Typography>
//           {activeCategories.length > 0 ? (
//             <ResponsiveContainer width="100%" height={280}>
//               <PieChart>
//                 <Pie
//                   data={activeCategories}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {activeCategories.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Legend verticalAlign="bottom" height={36} />
//               </PieChart>
//             </ResponsiveContainer>
//           ) : (
//             <Typography sx={{ textAlign: 'center', color: '#7f8c8d' }}>
//               No hay categorías con movimientos
//             </Typography>
//           )}
//         </Box>
//       </Box>

//       {/* Análisis presupuestal debajo */}
//       <Box sx={{
//         p: 3,
//         bgcolor: 'white',
//         borderRadius: '12px',
//         boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
//       }}>
//         <BudgetInsights 
//           totalBudgets={totalBudgets} 
//           totalAllocated={totalAllocated} 
//           totalSpent={totalSpent} 
//         />
//       </Box>
//     </Box>
//   );
// };

// export default Dashboard;


import React, { useState } from 'react';
import {
  Box, Typography, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import CashFlowChart from './CashFlowChart';
import BudgetInsights from '../Dashboard/BudgetInsights';
import { useFinance } from '../../context/FinanceContext';

const Dashboard: React.FC = () => {
  const { transactions, categories, alerts, getBudgetInsights, getCashFlowData } = useFinance();
  const [timeRange, setTimeRange] = useState<'3M' | '6M' | '1A'>('6M');

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const { totalBudgets, totalAllocated, totalSpent } = getBudgetInsights();
  const cashFlowData = getCashFlowData(timeRange === '3M' ? 3 : timeRange === '6M' ? 6 : 12);

  const amountByCategory = categories.map(cat => {
    const total = transactions
      .filter(t => t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: cat, value: total };
  });

  const activeCategories = amountByCategory.filter(cat => cat.value > 0);

  const COLORS = [
    '#8884d8', '#8e44ad', '#3498db', '#e74c3c', '#e67e22',
    '#2ecc71', '#f1c40f', '#34495e', '#16a085', '#d35400'
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Título */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          Panel de Control
        </Typography>
      </Box>

      {/* Tarjetas + Selector */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr auto' },
        gap: 3,
        mb: 4,
        alignItems: 'stretch'
      }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 3,
          width: '90%' //ancho de las tarjetas
        }}>
          {/* Egresos */}
          <Box sx={{
            p: 3,
            background: 'linear-gradient(135deg, #e74c3c, #e67e22)',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Egresos</Typography>
            <Typography variant="h4" sx={{ fontWeight: '700', mb: 1, fontSize: '2rem' }}>
              ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
            <Typography variant="body2">Total acumulado</Typography>
          </Box>

          {/* Presupuestos */}
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

          {/* Categorías */}
          <Box sx={{
            p: 3,
            background: 'linear-gradient(135deg, #2980b9, #3498db)',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Categorías</Typography>
            <Typography variant="h3" sx={{ fontWeight: '700' }}>
              {categories.length}
            </Typography>
            <Typography variant="body2">Registradas</Typography>
          </Box>
        </Box>

        {/* Selector visual de rango */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: { xs: '100%', lg: '200px' },
          height: '100%',
        }}>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={(e, newRange) => {
              if (newRange !== null) setTimeRange(newRange);
            }}
            sx={{
              background: '#f8f9fa',
              borderRadius: '12px',
              p: '6px',
              height: 'fit-content',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            }}
          >
            {['3M', '6M', '1A'].map(item => (
              <ToggleButton
                key={item}
                value={item}
                sx={{
                  textTransform: 'none',
                  px: 3,
                  fontWeight: 600,
                  border: 0,
                  borderRadius: '8px !important',
                  color: item === timeRange ? '#2c3e50' : '#7f8c8d',
                  '&.Mui-selected': {
                    backgroundColor: '#e9ecef',
                    color: '#2c3e50',
                  },
                  '&:hover': {
                    backgroundColor: '#e0e0e0',
                  }
                }}
              >
                {item}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Gráficas */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3,
        mb: 4
      }}>
        {/* Flujo de Caja */}
        <Box sx={{
          p: 3,
          bgcolor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          minHeight: 350,
        }}>
          <Typography variant="h6" sx={{ fontWeight: '600', mb: 3 }}>
            Flujo de Caja ({timeRange})
          </Typography>
          <CashFlowChart data={cashFlowData} />
        </Box>

        {/* Distribución por Categoría */}
        <Box sx={{
          p: 3,
          bgcolor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          minHeight: 350,
        }}>
          <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
            Distribución por Categoría
          </Typography>
          {activeCategories.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={activeCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {activeCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Typography sx={{ textAlign: 'center', color: '#7f8c8d' }}>
              No hay categorías con movimientos
            </Typography>
          )}
        </Box>
      </Box>

      {/* Análisis presupuestal */}
      <Box sx={{
        p: 3,
        bgcolor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      }}>
        <BudgetInsights 
          totalBudgets={totalBudgets} 
          totalAllocated={totalAllocated} 
          totalSpent={totalSpent} 
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
