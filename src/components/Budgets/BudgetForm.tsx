import React, { useState } from 'react';
import { Budget } from '../../context/FinanceContext';
import { Box, TextField, Button, MenuItem } from '@mui/material';

interface BudgetFormProps {
  initialData?: Budget;
  onSubmit: (budget: Budget) => void;
  onCancel?: () => void;
  areas: string[];
}

const BudgetForm: React.FC<BudgetFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  areas 
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [amount, setAmount] = useState(initialData?.amount.toString() || '');
  const [area, setArea] = useState(initialData?.area || areas[0] || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Nombre requerido';
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = 'Monto inválido';
    if (!area.trim()) newErrors.area = 'Área requerida';
    if (!endDate) newErrors.endDate = 'Fecha requerida';
    if (endDate && new Date(endDate) < new Date()) newErrors.endDate = 'Fecha debe ser futura';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    onSubmit({
      id: initialData?.id || Date.now().toString(),
      name,
      amount: parseFloat(amount),
      spent: initialData?.spent || 0,
      area,
      endDate,
      createdAt: initialData?.createdAt || new Date().toISOString()
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Nombre del Presupuesto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        error={!!errors.name}
        helperText={errors.name}
      />
      
      <TextField
        label="Monto ($)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        fullWidth
        inputProps={{ min: 0, step: 0.01 }}
        error={!!errors.amount}
        helperText={errors.amount}
      />
      
      <TextField
        select
        label="Categoría"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        required
        fullWidth
        error={!!errors.area}
        helperText={errors.area}
      >
        {areas.map(areaOption => (
          <MenuItem key={areaOption} value={areaOption}>
            {areaOption}
          </MenuItem>
        ))}
      </TextField>
      
      <TextField
        label="Fecha de Vencimiento"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        required
        fullWidth
        error={!!errors.endDate}
        helperText={errors.endDate}
      />
      
      <Box display="flex" gap={1} mt={2}>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth
          sx={{ py: 1.5 }}
        >
          {initialData ? 'Actualizar' : 'Crear'} Presupuesto
        </Button>
        {onCancel && (
          <Button 
            variant="outlined" 
            onClick={onCancel} 
            fullWidth
            sx={{ py: 1.5 }}
          >
            Cancelar
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default BudgetForm;