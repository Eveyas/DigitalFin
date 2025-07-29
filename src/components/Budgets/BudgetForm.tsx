import React, { useState, useEffect } from 'react';
import { Budget } from '../../context/FinanceContext';
import { 
  Box, 
  TextField, 
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

interface BudgetFormProps {
  initialData?: Budget;
  onSubmit: (budget: Budget) => void;
  onCancel?: () => void;
  categories: string[];
  addCategory: (category: string) => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  categories,
  addCategory
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [amount, setAmount] = useState(initialData?.amount.toString() || '');
  const [category, setCategory] = useState(initialData?.area || '');
  const [customCategory, setCustomCategory] = useState('');
  const [endDate, setEndDate] = useState(initialData?.endDate || new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Actualizar categoría si las categorías disponibles cambian
  useEffect(() => {
    if (category && !categories.includes(category)) {
      setCategory(categories[0] || '');
    }
  }, [categories, category]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Nombre requerido';
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = 'Monto inválido';
    if (!category.trim()) newErrors.category = 'Categoría requerida';
    if (category === 'custom' && !customCategory.trim()) newErrors.customCategory = 'Nueva categoría requerida';
    if (!endDate) newErrors.endDate = 'Fecha requerida';
    if (endDate && new Date(endDate) < new Date()) newErrors.endDate = 'Fecha debe ser futura';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Si se está creando una nueva categoría
    if (category === 'custom') {
      const newCategory = customCategory.trim();
      if (!categories.includes(newCategory)) {
        addCategory(newCategory);
      }
    }
    
    const finalCategory = category === 'custom' ? customCategory : category;
    
    onSubmit({
      id: initialData?.id || Date.now().toString(),
      name,
      amount: parseFloat(amount),
      spent: initialData?.spent || 0,
      area: finalCategory,
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
      
      <FormControl fullWidth required error={!!errors.category}>
        <InputLabel id="category-label">Categoría</InputLabel>
        <Select
          labelId="category-label"
          value={category}
          label="Categoría"
          onChange={(e) => setCategory(e.target.value as string)}
        >
          {categories.map(cat => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
          {/* <MenuItem value="custom">Otra categoría...</MenuItem> */}
        </Select>
      </FormControl>
      
      {category === 'custom' && (
        <TextField
          label="Nombre de nueva categoría"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
          required
          fullWidth
          error={!!errors.customCategory}
          helperText={errors.customCategory}
        />
      )}
      
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