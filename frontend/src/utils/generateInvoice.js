import jsPDF from "jspdf";

export const generateInvoice = (booking) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("SwiftLogix Invoice", 20, 20);

  doc.setFontSize(12);

  doc.text(`Tracking ID: ${booking.trackingId}`, 20, 40);
  doc.text(`From: ${booking.pickupAddress}`, 20, 50);
  doc.text(`To: ${booking.dropAddress}`, 20, 60);

  doc.text(`Customer: ${booking.name}`, 20, 70);
  doc.text(`Phone: ${booking.phone}`, 20, 80);

  doc.text(`Item: ${booking.item}`, 20, 90);
  doc.text(`Weight: ${booking.weight} kg`, 20, 100);

  doc.text(`Price: ₹${booking.price}`, 20, 110);

  doc.text(`Status: ${booking.status}`, 20, 120);

  doc.save(`Invoice_${booking.trackingId}.pdf`);
};