import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LabelList, Cell
} from 'recharts';

interface CashFlowChartProps {
  data: {
    month: string;
    income: number;
    expenses: number;
  }[];
}

const CashFlowChart: React.FC<CashFlowChartProps> = ({ data }) => {
  const colors = ['#ff6b6b', '#ff4757', '#e74c3c', '#c0392b']; // tonos llamativos

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 30, right: 30, left: 20, bottom: 20 }}
        barCategoryGap={25}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
        <XAxis dataKey="month" stroke="#34495e" tick={{ fontSize: 12 }} />
        <YAxis stroke="#34495e" tickFormatter={(val) => `$${val}`} />
        
        <Tooltip
          formatter={(value) => [`$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, '']}
          labelFormatter={(value) => `Mes: ${value}`}
          contentStyle={{
            backgroundColor: '#fff',
            borderRadius: 10,
            boxShadow: '0 6px 20px rgba(49, 154, 66, 0.15)',
            border: 'none',
            fontSize: '14px'
          }}
        />

        <Legend
          verticalAlign="top"
          height={36}
          iconType="circle"
          payload={[
            {
              value: 'Egresos',
              type: 'circle',
              id: 'ID01',
              color: '#68bb86ff'
            }
          ]}
        />

        <Bar
          dataKey="expenses"
          name="Egresos"
          radius={[10, 10, 0, 0]}
          isAnimationActive={true}
        >
          {
            data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))
          }
          <LabelList
            dataKey="expenses"
            position="top"
            formatter={(val: number) => `$${val.toLocaleString()}`}
            style={{ fill: '#68bb86ff', fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CashFlowChart;