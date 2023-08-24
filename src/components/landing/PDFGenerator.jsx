import React from 'react';
import jsPDF from 'jspdf';

const PDFGenerator = ({ tableItems }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Generated PDF from React', 10, 10);

    // Loop through tableItems and add content to PDF
    tableItems.forEach((item, index) => {
      const y = 20 + index * 10;
      doc.text(`${item.numberid} - ${item.salesdate}`, 10, y);
    });

    doc.save('generated-pdf.pdf'); // Save the PDF with a filename
  };

  return (
    <div>
      <button onClick={generatePDF}>Generate PDF</button>
    </div>
  );
};

export default PDFGenerator;
