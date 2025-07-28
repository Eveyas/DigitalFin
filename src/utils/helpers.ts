import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

  // Generar reporte en PDF
export const generatePDFReport = (transactions: any[]) => {
  if (transactions.length === 0) {
    alert('No hay transacciones para generar el reporte');
    return;
  }
  
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('Reporte Financiero - DigitalFin', 105, 15, { align: 'center' });
  
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  doc.setFontSize(12);
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 15, 25);
  doc.text(`Total de transacciones: ${transactions.length}`, 15, 35);
  doc.text(`Ingresos: $${income.toFixed(2)}`, 15, 45);
  doc.text(`Egresos: $${expenses.toFixed(2)}`, 15, 55);
  doc.text(`Balance: $${(income - expenses).toFixed(2)}`, 15, 65);
  
  // Tabla de transacciones
  autoTable(doc, {
    startY: 75,
    head: [['Fecha', 'Tipo', 'Categoría', 'Monto ($)', 'Descripción', 'Presupuesto']],
    body: transactions.map(t => [
      t.date,
      t.type === 'income' ? 'Ingreso' : 'Egreso',
      t.category,
      t.amount.toFixed(2),
      t.description || '',
      t.budgetId || 'N/A'
    ]),
    theme: 'grid',
    headStyles: { 
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: { 
      fontSize: 10,
      cellPadding: 3
    }
  });

  doc.save(`reporte-financiero-${new Date().toISOString().slice(0, 10)}.pdf`);
};

  // Generar reporte en Excel
export const generateExcelReport = (transactions: any[]) => {
  if (transactions.length === 0) {
    alert('No hay transacciones para generar el reporte');
    return;
  }
  
  const data = transactions.map(t => ({
    Fecha: t.date,
    Tipo: t.type === 'income' ? 'Ingreso' : 'Egreso',
    Categoría: t.category,
    Monto: t.amount,
    Descripción: t.description || '',
    Presupuesto: t.budgetId || 'N/A'
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
  
  // Formato de moneda
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  for (let i = range.s.r + 1; i <= range.e.r; i++) {
    const cellAddress = XLSX.utils.encode_cell({ r: i, c: 3 });
    if (!worksheet[cellAddress]) continue;
    worksheet[cellAddress].z = '"$"#,##0.00_);[Red]("$"#,##0.00)';
  }
  
  XLSX.writeFile(workbook, `reporte-financiero-${new Date().toISOString().slice(0, 10)}.xlsx`);
};