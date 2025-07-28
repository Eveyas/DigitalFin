import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Box, Button, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Reports: React.FC = () => {
  const { generatePDFReport, generateExcelReport, transactions } = useFinance();
  const [reportType, setReportType] = useState<'all' | 'income' | 'expense'>('all');
  
  const filteredTransactions = transactions.filter(transaction => {
    if (reportType === 'all') return true;
    return transaction.type === reportType;
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Reportes</Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Generar Reporte</Typography>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="report-type-label">Tipo de Reporte</InputLabel>
          <Select
            labelId="report-type-label"
            value={reportType}
            label="Tipo de Reporte"
            onChange={(e) => setReportType(e.target.value as any)}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="income">Solo Ingresos</MenuItem>
            <MenuItem value="expense">Solo Egresos</MenuItem>
          </Select>
        </FormControl>
        
        <Box display="flex" gap={2}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => generatePDFReport(filteredTransactions)}
            disabled={transactions.length === 0}
            fullWidth
          >
            Exportar a PDF
          </Button>
          
          <Button 
            variant="contained" 
            color="success" 
            onClick={() => generateExcelReport(filteredTransactions)}
            disabled={transactions.length === 0}
            fullWidth
          >
            Exportar a Excel
          </Button>
        </Box>
      </Paper>
      
      {transactions.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Vista Previa del Reporte</Typography>
          <Box maxHeight="400px" overflow="auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Fecha</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Tipo</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Categoría</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Monto</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{transaction.date}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd', color: transaction.type === 'income' ? 'green' : 'red' }}>
                      {transaction.type === 'income' ? 'Ingreso' : 'Egreso'}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{transaction.category}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>
                      {transaction.amount.toFixed(2)}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{transaction.description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Reports;
