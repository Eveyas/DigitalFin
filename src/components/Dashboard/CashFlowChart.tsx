import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CashFlowChartProps {
  data: {
    month: string;
    income: number;
    expenses: number;
  }[];
}

const CashFlowChart: React.FC<CashFlowChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" stroke="#7f8c8d" />
        <YAxis stroke="#7f8c8d" />
        <Tooltip 
          formatter={(value) => [`$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, '']}
          labelFormatter={(value) => `Mes: ${value}`}
          contentStyle={{ 
            backgroundColor: '#fff', 
            borderRadius: '8px', 
            border: 'none', 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)'
          }}
        />
        <Legend />
        <Bar dataKey="income" name="Ingresos" fill="#2ecc71" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" name="Egresos" fill="#e74c3c" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CashFlowChart;
