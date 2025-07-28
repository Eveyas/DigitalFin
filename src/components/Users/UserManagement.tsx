import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, 
DialogContent, DialogActions } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { User, UserRole } from '../../context/AuthContext';
import UserForm from './UserForm';

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'adminventas',
      name: 'Administrador de Ventas',
      role: 'ventas',
      createdAt: '2023-01-15',
    },
    {
      id: '2',
      username: 'admincontabilidad',
      name: 'Administrador Contable',
      role: 'contabilidad',
      createdAt: '2023-01-16',
    },
    {
      id: '3',
      username: 'gerente',
      name: 'Gerente General',
      role: 'gerente',
      createdAt: '2023-01-10',
    },
    {
      id: '4',
      username: 'admin',
      name: 'Administrador del Sistema',
      role: 'admin',
      createdAt: '2023-01-01',
    }
  ]);
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleSaveUser = (userData: User) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === userData.id ? userData : u));
    } else {
      setUsers([...users, { ...userData, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
    }
    setEditingUser(null);
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setUserToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
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
          Gestión de Usuarios
        </Typography>
        
        {/* {currentUser?.role === 'admin' && (
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => setEditingUser({
              id: '',
              username: '',
              name: '',
              role: 'consulta',
              createdAt: ''
            })}
            sx={{ py: 1.5, px: 3 }}
          >
            Nuevo
          </Button>
        )} */}
      </Box>
      
      {editingUser && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: '600' }}>
            {editingUser.id ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </Typography>
          <UserForm 
            user={editingUser}
            onSave={handleSaveUser}
            onCancel={() => setEditingUser(null)}
            currentUserRole={currentUser?.role || 'consulta'}
          />
        </Paper>
      )}
      
      <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: '600' }}>Usuario</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Rol</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Fecha de Creación</TableCell>
                {currentUser?.role === 'admin' && <TableCell sx={{ fontWeight: '600' }}>Acciones</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    <Box sx={{ 
                      display: 'inline-block',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '4px',
                      backgroundColor: 
                        user.role === 'admin' ? '#e3f2fd' :
                        user.role === 'gerente' ? '#e8f5e9' :
                        user.role === 'contabilidad' ? '#fff8e1' :
                        user.role === 'ventas' ? '#f3e5f5' : '#f5f5f5',
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      {user.role}
                    </Box>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  {currentUser?.role === 'admin' && (
                    <TableCell>
                      <IconButton onClick={() => setEditingUser(user)}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton 
                        onClick={() => openDeleteDialog(user)} 
                        disabled={user.username === currentUser?.username}
                      >
                        <Delete color="error" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete?.name}</strong>? 
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;