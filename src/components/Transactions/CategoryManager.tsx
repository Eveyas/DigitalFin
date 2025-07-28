import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Box, TextField, Button, List, ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CategoryManager: React.FC = () => {
  const { categories, addCategory, removeCategory } = useFinance();
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      addCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Gestionar Categorías</Typography>
      
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          label="Nueva Categoría"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleAddCategory}>
          Agregar
        </Button>
      </Box>
      
      {categories.length === 0 ? (
        <Typography variant="body2">No hay categorías registradas</Typography>
      ) : (
        <List dense>
          {categories.map(category => (
            <ListItem 
              key={category} 
              secondaryAction={
                <IconButton 
                  edge="end" 
                  onClick={() => removeCategory(category)}
                  disabled={['Salario', 'Ventas', 'Compras', 'Servicios'].includes(category)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={category} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default CategoryManager;
