import React, { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';
import { useFinance } from '../../context/FinanceContext';
import { Budget } from '../../context/FinanceContext';

const Budgets: React.FC = () => {
  const { budgets, addBudget, updateBudget, categories, addCategory } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  
  const handleSubmit = (budget: Budget) => {
    if (editingBudget) {
      updateBudget(editingBudget.id, budget);
    } else {
      addBudget(budget);
    }
    setShowForm(false);
    setEditingBudget(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4
      }}>

         <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
           Gestión de Presupuestos
          </Typography>
        
        {!showForm && !editingBudget && (
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => {
              setEditingBudget(null);
              setShowForm(true);
            }}
            sx={{ py: 1.4, px: 3 }}
          >
            Nuevo
          </Button>
        )}
      </Box>
      
      {(showForm || editingBudget) ? (
        <Paper sx={{ p: 3, mb: 4, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: '600' }}>
            {editingBudget ? 'Editar Presupuesto' : 'Crear Nuevo Presupuesto'}
          </Typography>
          <BudgetForm 
            initialData={editingBudget || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingBudget(null);
            }}
            categories={categories}
            addCategory={addCategory}
          />
        </Paper>
      ) : null}
      
      <BudgetList 
        onEdit={(budget) => {
          setEditingBudget(budget);
          setShowForm(true);
        }}
      />
    </Box>
  );
};

export default Budgets;