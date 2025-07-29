import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { generatePDFReport, generateExcelReport } from '../utils/helpers';

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  area: string;
  endDate: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  description: string;
  budgetId?: string;
}

interface FinanceContextType {
  budgets: Budget[];
  transactions: Transaction[];
  categories: string[];
  alerts: string[];
  addBudget: (budget: Budget) => void;
  updateBudget: (id: string, updatedBudget: Budget) => void;
  deleteBudget: (id: string) => void;
  addTransaction: (transaction: Transaction) => void;
  editTransaction: (id: string, updatedTransaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  generateAlerts: () => void;
  clearAlerts: () => void;
  generatePDFReport: (transactions: Transaction[]) => void;
  generateExcelReport: (transactions: Transaction[]) => void;
  getBudgetInsights: () => { totalBudgets: number, totalAllocated: number, totalSpent: number };
  getCashFlowData: (months: number) => { month: string, income: number, expenses: number }[];
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const savedBudgets = localStorage.getItem('budgets');
    return savedBudgets ? JSON.parse(savedBudgets) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : [
      'Nómina', 'Ventas', 'Suministros', 'Impuestos', 
      'Servicios', 'Marketing', 'Desarrollo', 'Otros'
    ];
  });

  const [alerts, setAlerts] = useState<string[]>([]);

  // Persistencia en localStorage
  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('categories', JSON.stringify(categories));
    generateAlerts();
  }, [budgets, transactions, categories]);

  // Funciones para presupuestos
  const addBudget = (budget: Budget) => {
    setBudgets([...budgets, { ...budget, createdAt: new Date().toISOString() }]);
  };

  const updateBudget = (id: string, updatedBudget: Budget) => {
    setBudgets(budgets.map(budget => budget.id === id ? updatedBudget : budget));
  };

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
  };

  // Funciones para Operaciones (Transacciones)
  const addTransaction = (transaction: Transaction) => {
    const transactionToAdd = { ...transaction };

    if (transaction.type === 'expense') {
      const matchingBudget = budgets.find(
        b => b.area.trim().toLowerCase() === transaction.category.trim().toLowerCase() &&
             new Date() <= new Date(b.endDate)
      );

      if (matchingBudget) {
        const updatedBudget = {
          ...matchingBudget,
          spent: matchingBudget.spent + transaction.amount
        };
        updateBudget(matchingBudget.id, updatedBudget);
        transactionToAdd.budgetId = matchingBudget.id;
      }
    }

    setTransactions([...transactions, transactionToAdd]);
  };

  const editTransaction = (id: string, updatedTransaction: Transaction) => {
    const oldTransaction = transactions.find(t => t.id === id);
    if (!oldTransaction) return;

    // Revertir efecto en presupuesto anterior si era gasto
    if (oldTransaction.type === 'expense' && oldTransaction.budgetId) {
      const oldBudget = budgets.find(b => b.id === oldTransaction.budgetId);
      if (oldBudget) {
        const revertedBudget = {
          ...oldBudget,
          spent: oldBudget.spent - oldTransaction.amount
        };
        updateBudget(oldBudget.id, revertedBudget);
      }
    }

    let updatedTransactionToSet = { ...updatedTransaction };

    // Aplicar nuevo efecto en presupuesto si es gasto
    if (updatedTransaction.type === 'expense') {
      const matchingBudget = budgets.find(
        b => b.area.trim().toLowerCase() === updatedTransaction.category.trim().toLowerCase() &&
             new Date() <= new Date(b.endDate)
      );

      if (matchingBudget) {
        const updatedBudget = {
          ...matchingBudget,
          spent: matchingBudget.spent + updatedTransaction.amount
        };
        updateBudget(matchingBudget.id, updatedBudget);
        updatedTransactionToSet.budgetId = matchingBudget.id;
      } else {
        updatedTransactionToSet.budgetId = undefined;
      }
    } else {
      // Si cambió a ingreso, elimina asociación de presupuesto
      updatedTransactionToSet.budgetId = undefined;
    }

    setTransactions(transactions.map(t => t.id === id ? updatedTransactionToSet : t));
  };

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    // Revertir efecto en presupuesto si es gasto
    if (transaction.type === 'expense' && transaction.budgetId) {
      const budget = budgets.find(b => b.id === transaction.budgetId);
      if (budget) {
        const updatedBudget = {
          ...budget,
          spent: budget.spent - transaction.amount
        };
        updateBudget(budget.id, updatedBudget);
      }
    }

    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Funciones para categorías
  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  const removeCategory = (category: string) => {
    setCategories(categories.filter(cat => cat !== category));
  };

  // Generar alertas
  const generateAlerts = () => {
    const newAlerts: string[] = [];
    const today = new Date();

    // Alertas por presupuestos excedidos
    budgets.forEach(budget => {
      const spent = transactions
        .filter(t => t.budgetId === budget.id && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const percentage = (spent / budget.amount) * 100;

      if (spent > budget.amount) {
        newAlerts.push(`❌ Presupuesto "${budget.name}" excedido en $${(spent - budget.amount).toFixed(2)}`);
      } else if (percentage > 90) {
        newAlerts.push(`⚠️ Presupuesto "${budget.name}" al ${percentage.toFixed(0)}% ($${spent} de $${budget.amount})`);
      }
    });

    // Alertas por presupuestos próximos a vencer
    budgets.forEach(budget => {
      const endDate = new Date(budget.endDate);
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 7 && diffDays >= 0) {
        newAlerts.push(`⏳ "${budget.name}" vence en ${diffDays} días`);
      }

      if (diffDays < 0) {
        newAlerts.push(`⌛ Presupuesto "${budget.name}" vencido hace ${Math.abs(diffDays)} días`);
      }
    });

    setAlerts(newAlerts);
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  // Funciones de reportes
  const handleGeneratePDFReport = (transactionsToReport: Transaction[]) => {
    generatePDFReport(transactionsToReport);
  };

  const handleGenerateExcelReport = (transactionsToReport: Transaction[]) => {
    generateExcelReport(transactionsToReport);
  };

  // Métricas financieras
  const getBudgetInsights = () => {
    const totalBudgets = budgets.length;
    const totalAllocated = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);

    return { totalBudgets, totalAllocated, totalSpent };
  };

  const getCashFlowData = (months: number = 6) => {
    const today = new Date();
    const result: { month: string; income: number; expenses: number }[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(today.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

      const monthTransactions = transactions.filter(t =>
        t.date.startsWith(monthKey)
      );

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      result.push({
        month: monthKey,
        income,
        expenses
      });
    }

    return result;
  };

  const value = {
    budgets,
    transactions,
    categories,
    alerts,
    addBudget,
    updateBudget,
    deleteBudget,
    addTransaction,
    editTransaction,
    deleteTransaction,
    addCategory,
    removeCategory,
    generateAlerts,
    clearAlerts,
    generatePDFReport: handleGeneratePDFReport,
    generateExcelReport: handleGenerateExcelReport,
    getBudgetInsights,
    getCashFlowData,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('Debe de estar dentro de un Proveedor Financiero');
  }
  return context;
};