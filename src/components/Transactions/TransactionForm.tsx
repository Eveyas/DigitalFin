import React, { useState } from 'react';
import { Transaction, useFinance } from '../../context/FinanceContext';
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const TransactionForm: React.FC = () => {
  const { addTransaction, categories } = useFinance();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalCategory = category === 'custom' && customCategory ? customCategory : category;
    
    addTransaction({
      id: Date.now().toString(),
      type,
      amount: parseFloat(amount),
      category: finalCategory,
      date,
      description
    });
    
    // Resetear formulario
    setAmount('');
    setCategory('');
    setDescription('');
    setCustomCategory('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <RadioGroup row value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')}>
        <FormControlLabel value="income" control={<Radio />} label="Ingreso" />
        <FormControlLabel value="expense" control={<Radio />} label="Egreso" />
      </RadioGroup>
      
      <TextField
        label="Monto ($)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        fullWidth
        inputProps={{ min: 0, step: 0.01 }}
      />
      
      <FormControl fullWidth required>
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
        />
      )}
      
      <TextField
        label="Fecha"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        fullWidth
      />
      
      <TextField
        label="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={2}
        fullWidth
      />
      
      <Button type="submit" variant="contained" color="primary">
        Registrar Transacción
      </Button>
    </Box>
  );
};

export default TransactionForm;
