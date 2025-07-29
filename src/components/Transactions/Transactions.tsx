import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip
} from '@mui/material';
import TransactionForm from './TransactionForm';
import CategoryManager from './CategoryManager';
import { useFinance } from '../../context/FinanceContext';
import WarningIcon from '@mui/icons-material/Warning';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

const Transactions: React.FC = () => {
  const { transactions, categories, removeCategory, deleteTransaction } = useFinance();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [transactionDeleteDialogOpen, setTransactionDeleteDialogOpen] = useState(false);

  const handleDeleteCategoryClick = (category: string) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmCategoryDelete = () => {
    if (categoryToDelete) {
      removeCategory(categoryToDelete);
    }
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const cancelCategoryDelete = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleDeleteTransactionClick = (transactionId: string) => {
    setTransactionToDelete(transactionId);
    setTransactionDeleteDialogOpen(true);
  };

  const confirmTransactionDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete);
    }
    setTransactionDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  const cancelTransactionDelete = () => {
    setTransactionDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  // Obtener la transacción que se está intentando eliminar para mostrar sus detalles
  const getTransactionToDelete = () => {
    if (!transactionToDelete) return null;
    return transactions.find(t => t.id === transactionToDelete);
  };
  
  const transactionToDeleteData = getTransactionToDelete();

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
            Registrar Egreso
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
          <CategoryManager onDeleteClick={handleDeleteCategoryClick} />
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
                  position: 'relative',
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
                    fontSize: '1.1rem',
                  }}>
                    {transaction.category}
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

                 {transaction.budgetId && (
                    <Typography variant="caption" sx={{
                      display: 'inline-block',
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      mt: 1,
                      fontWeight: 500
                    }}>
                      Afecta presupuesto
                    </Typography>
                  )}
                
                {/* Sección inferior con precio y botón de eliminar */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  mt: 2
                }}>
                  <div></div> {/* Espaciador vacío para alinear el botón a la derecha */}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ 
                      fontWeight: '700',
                      fontSize: '1.2rem',
                      color: transaction.type === 'income' ? '#27ae60' : '#c0392b',
                      mr: 1
                    }}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </Typography>
                    
                    <Tooltip title="Eliminar movimiento">
                      <IconButton
                        sx={{
                          color: '#e74c3c',
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            backgroundColor: 'rgba(231, 76, 60, 0.1)'
                          }
                        }}
                        onClick={() => handleDeleteTransactionClick(transaction.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Diálogo de confirmación para eliminar categoría */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelCategoryDelete}
        aria-labelledby="category-delete-dialog-title"
      >
        <DialogTitle id="category-delete-dialog-title" sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon color="error" sx={{ mr: 1, fontSize: '2rem' }} />
          {"Confirmar eliminación de categoría"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar la categoría <strong>"{categoryToDelete}"</strong>?
            <br /><br />
            <Typography variant="body2" color="error">
              Advertencia: Se eliminarán todos los movimientos asociados a esta categoría
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelCategoryDelete} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={confirmCategoryDelete} variant="contained" color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para eliminar transacción */}
      <Dialog
        open={transactionDeleteDialogOpen}
        onClose={cancelTransactionDelete}
        aria-labelledby="transaction-delete-dialog-title"
      >
        <DialogTitle id="transaction-delete-dialog-title" sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon color="error" sx={{ mr: 1, fontSize: '2rem' }} />
          {"Confirmar eliminación"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este movimiento?
          </DialogContentText>
          
          {transactionToDeleteData && (
            <Box sx={{ 
              mt: 2, 
              p: 2,
              borderRadius: '8px',
              backgroundColor: transactionToDeleteData.type === 'income' ? '#e8f5e9' : '#ffebee',
              borderLeft: `4px solid ${transactionToDeleteData.type === 'income' ? '#2ecc71' : '#e74c3c'}`
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 600 }}>
                  {transactionToDeleteData.category}
                </Typography>
                <Typography sx={{ 
                  fontWeight: 700,
                  color: transactionToDeleteData.type === 'income' ? '#27ae60' : '#c0392b'
                }}>
                  {transactionToDeleteData.type === 'income' ? '+' : '-'}${transactionToDeleteData.amount.toFixed(2)}
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ color: '#7f8c8d', mt: 1 }}>
                {transactionToDeleteData.date}
              </Typography>
              
              {transactionToDeleteData.description && (
                <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
                  {transactionToDeleteData.description}
                </Typography>
              )}
            </Box>
          )}
          
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Esta acción no se puede deshacer
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelTransactionDelete} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={confirmTransactionDelete} variant="contained" color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transactions;

