import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Budgets from './components/Budgets/Budgets';
import Transactions from './components/Transactions/Transactions';
import Reports from './components/Reports/Reports';
import UserManagement from './components/Users/UserManagement';
import ProtectedRoute from './components/Auth/ProtectedRoute';

const AppRoutes = () => {
  const auth = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={auth.isAuthenticated ? <Navigate to="/" /> : <Login />} />
      
      <Route path="/" element={
        <ProtectedRoute requiredRole="consulta">
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/budgets" element={
        <ProtectedRoute requiredRole="contabilidad">
          <Layout>
            <Budgets />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/transactions" element={
        <ProtectedRoute requiredRole="contabilidad">
          <Layout>
            <Transactions />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/reports" element={
        <ProtectedRoute requiredRole="gerente">
          <Layout>
            <Reports />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/users" element={
        <ProtectedRoute requiredRole="admin">
          <Layout>
            <UserManagement />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <FinanceProvider>
          <AppRoutes />
        </FinanceProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;