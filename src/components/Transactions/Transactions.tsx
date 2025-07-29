import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import TransactionForm from './TransactionForm';
import CategoryManager from './CategoryManager';
import { useFinance } from '../../context/FinanceContext';
import WarningIcon from '@mui/icons-material/Warning';
import Button from '@mui/material/Button';

const Transactions: React.FC = () => {
  const { transactions, categories, removeCategory } = useFinance();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleDeleteClick = (category: string) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      removeCategory(categoryToDelete);
    }
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
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
          Movimientos Financieros
        </Typography>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        gap: 3,
        mb: 4 
      }}>
        <Paper sx={{ 
          p: 3, 
          flex: 1,
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
            Registrar movimiento
          </Typography>
          <TransactionForm />
        </Paper>
        
        <Paper sx={{ 
          p: 3, 
          flex: 1,
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
            Gestionar Categorías
          </Typography>
          <CategoryManager onDeleteClick={handleDeleteClick} />
        </Paper>
      </Box>
      
      <Box mt={4}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
          Últimos Movimientos
        </Typography>
        {transactions.length === 0 ? (
          <Typography sx={{ 
            textAlign: 'center', 
            py: 4,
            color: '#7f8c8d'
          }}>
            No hay movimientos registrados
          </Typography>
        ) : (
          <Box sx={{
            display: 'grid',
            gap: 2
          }}>
            {[...transactions].reverse().slice(0, 5).map(transaction => (
              <Box 
                key={transaction.id}
                sx={{ 
                  p: 2.5,
                  borderRadius: '10px',
                  backgroundColor: transaction.type === 'income' ? '#e8f5e9' : '#ffebee',
                  borderLeft: `4px solid ${transaction.type === 'income' ? '#2ecc71' : '#e74c3c'}`,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1
                }}>
                  <Typography sx={{ 
                    fontWeight: '600',
                    fontSize: '1.1rem'
                  }}>
                    {transaction.category}
                  </Typography>
                  <Typography sx={{ 
                    fontWeight: '700',
                    fontSize: '1.2rem',
                    color: transaction.type === 'income' ? '#27ae60' : '#c0392b'
                  }}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </Typography>
                </Box>
                
                <Typography variant="body2" sx={{ 
                  color: '#7f8c8d',
                  mb: 1
                }}>
                  {transaction.date}
                </Typography>
                
                {transaction.description && (
                  <Typography variant="body2" sx={{ 
                    fontStyle: 'italic',
                    mt: 1.5
                  }}>
                    {transaction.description}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Diálogo de confirmación para eliminar categoría */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon color="error" sx={{ mr: 1, fontSize: '2rem' }} />
          {"Confirmar eliminación"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que deseas eliminar la categoría <strong>"{categoryToDelete}"</strong>?
            <br /><br />
            <Typography variant="body2" color="error">
              Advertencia: Se eliminarán todos los movimientos asociados a esta categoría
              {/* {categories.includes('Sin categoría') ? "" : " Se creará la categoría 'Sin categoría'"} */}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transactions;
