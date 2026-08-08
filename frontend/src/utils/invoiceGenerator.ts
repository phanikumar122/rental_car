import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface InvoiceData {
  bookingId:   string;
  customer: {
    name:      string;
    phone:     string;
    email:     string;
    address:   string;
  };
  car: {
    name:      string;
    pricePerDay: number;
  };
  startDate:   string;
  endDate:     string;
  totalAmount: number;
  discount?:   number;
}

export const generateInvoice = (data: InvoiceData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Header Bar (Dark Gray)
  doc.setFillColor(52, 63, 75); // Dark gray
  doc.rect(0, 0, pageWidth, 40, 'F');

  // 2. "INVOICE" Text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(40);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 20, 27);

  // 3. Sub-header (Year & Company)
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const currentYear = new Date().getFullYear();
  doc.text(`INVOICE ${currentYear}-${currentYear + 1}`, 20, 55);
  doc.setFontSize(12);
  doc.text('SUNSHINE CAR TRAVELS', 20, 62);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN');
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  doc.text(`Date: ${dateStr}  Time: ${timeStr}`, 20, 67);

  // 4. Billed To / Payable To Boxes
  const boxY = 70;
  const boxWidth = (pageWidth - 50) / 2;
  const boxHeight = 45;

  // Headers
  doc.setFillColor(52, 63, 75);
  doc.rect(20, boxY, boxWidth, 10, 'F');
  doc.rect(20 + boxWidth + 10, boxY, boxWidth, 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('Billed to:', 25, boxY + 6.5);
  doc.text('Payable to:', 20 + boxWidth + 15, boxY + 6.5);

  // Box Outlines
  doc.setDrawColor(52, 63, 75);
  doc.rect(20, boxY + 10, boxWidth, boxHeight - 10);
  doc.rect(20 + boxWidth + 10, boxY + 10, boxWidth, boxHeight - 10);

  // Customer Details (Billed To)
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  let billY = boxY + 16;
  doc.text(`Name: ${data.customer.name}`, 25, billY);
  doc.text(`Mobile no: ${data.customer.phone}`, 25, billY + 5);
  doc.text(`Email: ${data.customer.email}`, 25, billY + 10);
  const splitAddress = doc.splitTextToSize(`Address: ${data.customer.address || 'N/A'}`, boxWidth - 10);
  doc.text(splitAddress, 25, billY + 15);

  // Admin Details (Payable To)
  let payY = boxY + 16;
  doc.text(`Name: T.Ravi kishore`, 20 + boxWidth + 15, payY);
  doc.text(`Mobile no: 9346669729`, 20 + boxWidth + 15, payY + 5);
  doc.text(`Email: sunshinetravels@gmail.com`, 20 + boxWidth + 15, payY + 10);
  doc.text(`Address: Vijayawada, AP`, 20 + boxWidth + 15, payY + 15);

  // 5. Particulars Table
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  autoTable(doc, {
    startY: boxY + boxHeight + 10,
    head: [['PARTICULARS', 'COST PER DAY', 'NO. OF DAYS', 'AMOUNT']],
    body: [
      [
        data.car.name,
        `Rs.${data.car.pricePerDay.toLocaleString()}`,
        `${diffDays}`,
        `Rs.${data.totalAmount.toLocaleString()}`
      ]
    ],
    theme: 'plain',
    headStyles: {
      fillColor: [52, 63, 75],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 9,
      halign: 'center',
      textColor: [50, 50, 50]
    },
    columnStyles: {
      0: { halign: 'left' },
      3: { halign: 'right' }
    }
  });

  // 6. Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const subTotal = diffDays * data.car.pricePerDay;
  const discVal = data.discount || (subTotal - data.totalAmount);

  doc.setFont('helvetica', 'bold');
  doc.text('Subtotal', pageWidth - 70, finalY);
  doc.text(`Rs.${subTotal.toLocaleString()}`, pageWidth - 25, finalY, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.text('Discount', pageWidth - 70, finalY + 7);
  doc.text(`- Rs.${discVal.toLocaleString()}`, pageWidth - 25, finalY + 7, { align: 'right' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL', pageWidth - 70, finalY + 17);
  doc.text(`Rs. ${data.totalAmount.toLocaleString()}`, pageWidth - 25, finalY + 17, { align: 'right' });

  // 7. Remarks
  doc.setFontSize(10);
  doc.text('REMARKS:', 20, finalY + 30);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Please make your payment and contact us for any doubts.', 20, finalY + 37);
  doc.text('Thank you for choosing Sunshine Car Travels!', 20, finalY + 42);

  // 8. Signature
  const sigY = finalY + 70;
  doc.line(20, sigY, 70, sigY);
  doc.setFont('helvetica', 'bold');
  doc.text('T.Ravi kishore', 20, sigY + 7);
  doc.setFont('helvetica', 'normal');
  doc.text('Owner - Sunshine Car travels', 20, sigY + 12);
  doc.text('9346669729', 20, sigY + 17);

  // 9. Footer Bar
  doc.setFillColor(52, 63, 75);
  doc.rect(0, doc.internal.pageSize.getHeight() - 20, pageWidth, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('ROYAL CAR TRAVELS - PREMIUM RENTAL SERVICES', pageWidth / 2, doc.internal.pageSize.getHeight() - 9, { align: 'center' });

  // Save
  doc.save(`Invoice_${data.bookingId.slice(0, 8)}.pdf`);
};
