import React, { useState } from 'react';
import { Box, TextField, Button, MenuItem, FormControl, InputLabel, Select, Grid, Typography } from '@mui/material';
import { User, UserRole } from '../../context/AuthContext';

interface UserFormProps {
  user: User;
  onSave: (user: User) => void;
  onCancel: () => void;
  currentUserRole: UserRole;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel, currentUserRole }) => {
  const [formData, setFormData] = useState<User>(user);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const roleOptions: { value: UserRole, label: string }[] = [
    { value: 'admin', label: 'Administrador' },
    { value: 'gerente', label: 'Gerente' },
    { value: 'contabilidad', label: 'Contabilidad' },
    { value: 'ventas', label: 'Ventas' },
    { value: 'consulta', label: 'Consulta' }
  ];

  const availableRoles = roleOptions.filter(role => {
    if (currentUserRole === 'admin') return true;
    if (currentUserRole === 'gerente') return role.value !== 'admin';
    return ['ventas', 'contabilidad', 'consulta'].includes(role.value);
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) newErrors.username = 'Usuario requerido';
    if (!formData.name.trim()) newErrors.name = 'Nombre requerido';
    if (!formData.role) newErrors.role = 'Rol requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Box>
          <TextField
            fullWidth
            label="Usuario"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            error={!!errors.username}
            helperText={errors.username}
            disabled={!!user.id}
          />
        </Box>
        
        <Box>
          <TextField
            fullWidth
            label="Nombre Completo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            error={!!errors.name}
            helperText={errors.name}
          />
        </Box>
        
        <Box>
          <FormControl fullWidth required error={!!errors.role}>
            <InputLabel>Rol</InputLabel>
            <Select
              value={formData.role}
              label="Rol"
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              disabled={currentUserRole !== 'admin' && formData.role === 'admin'}
            >
              {availableRoles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
            {errors.role && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {errors.role}
              </Typography>
            )}
          </FormControl>
        </Box>
        
        <Box>
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            value={formData.password || ''}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            helperText={user.id ? 'Dejar en blanco para mantener la contraseña actual' : ''}
          />
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained">
          Guardar Usuario
        </Button>
      </Box>
    </form>
  );
};

export default UserForm;
