import React from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFinance } from '../../context/FinanceContext';

interface CategoryManagerProps {
  onDeleteClick: (category: string) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ onDeleteClick }) => {
  const { categories, addCategory } = useFinance();
  const [newCategory, setNewCategory] = React.useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      addCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  return (
    <Box>      
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
        <Typography variant="body2" sx={{ textAlign: 'center', py: 2 }}>
          No hay categorías registradas
        </Typography>
      ) : (
        <List dense sx={{ 
          maxHeight: '300px', 
          overflow: 'auto',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          p: 1
        }}>
          {categories.map(category => (
            <ListItem 
              key={category} 
              secondaryAction={
                <IconButton 
                  edge="end" 
                  onClick={() => onDeleteClick(category)}
                  sx={{ color: '#f44336' }}
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