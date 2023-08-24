import React from 'react';
import * as XLSX from 'xlsx'; // Import all exports from xlsx module

const ExcelGenerator = ({ tableItems }) => {
  const generateExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tableItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Data');
    XLSX.writeFile(workbook, 'table-data.xlsx');
  };

  return (
    <div>
      <button className='p-[10px] text-sm font-bold text-color-black rounded mb-4 bg-green-300' onClick={generateExcel}>Generate Excel</button>
    </div>
  );
};

export default ExcelGenerator;