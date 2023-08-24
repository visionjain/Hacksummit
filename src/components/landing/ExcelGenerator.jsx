import React from 'react';

const ExcelGenerator = ({ tableItems }) => {
  const generateExcel = () => {
    const rows = [Object.keys(tableItems[0])]; // Create header row
    tableItems.forEach(item => {
      rows.push(Object.values(item)); // Add data rows
    });

    const csvContent = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const fileName = 'table-data.csv';
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <button onClick={generateExcel}>Generate Excel</button>
    </div>
  );
};

export default ExcelGenerator;
