import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'admin' | 'contabilidad' | 'ventas' | 'gerente' | 'consulta';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  createdAt: string;
  password?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const predefinedUsers: User[] = [
  {
    id: '1',
    username: 'adminventas',
    name: 'Administrador de Ventas',
    role: 'ventas',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'admincontabilidad',
    name: 'Administrador Contable',
    role: 'contabilidad',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    username: 'gerente',
    name: 'Gerente General',
    role: 'gerente',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    username: 'admin',
    name: 'Administrador del Sistema',
    role: 'admin',
    createdAt: new Date().toISOString(),
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const isAuthenticated = !!user;

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (username: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = predefinedUsers.find(
          user => user.username === username && password === username
        );
        
        if (foundUser) {
          setUser(foundUser);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (requiredRole: UserRole) => {
    if (!user) return false;
    
    // Permisos
    const roleHierarchy: Record<UserRole, number> = {
      'consulta': 1,
      'ventas': 2,
      'contabilidad': 3,
      'gerente': 4,
      'admin': 5
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('Debe de estar dentro de un Usuario Autenticado');
  }
  return context;
};