// backend/services/invoiceService.js
const nodemailer = require('nodemailer');

// Email transporter configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail', // ან სხვა service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // App specific password
  }
});

// Generate Invoice HTML
const generateInvoiceHTML = (order, invoiceNumber) => {
  const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const tax = order.tax_amount || subtotal * 0.18;
  const shipping = order.shipping_amount || 10;
  const total = order.total_amount || (subtotal + tax + shipping);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .invoice-container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
        .invoice-title { font-size: 32px; font-weight: bold; }
        .company-info { text-align: right; }
        .invoice-details { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f4f4f4; font-weight: bold; }
        .text-right { text-align: right; }
        .total-section { text-align: right; margin-top: 20px; }
        .total-row { margin: 5px 0; }
        .grand-total { font-size: 18px; font-weight: bold; color: #2563eb; border-top: 2px solid #333; padding-top: 10px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div>
            <div class="invoice-title">INVOICE</div>
            <div>Invoice #${invoiceNumber}</div>
            <div>Date: ${new Date().toLocaleDateString()}</div>
          </div>
          <div class="company-info">
            <h2>E-Shop</h2>
            <p>Tbilisi, Georgia</p>
            <p>Tel: +995 555 123 456</p>
            <p>info@eshop.ge</p>
          </div>
        </div>
        
        <div class="invoice-details">
          <h3>Bill To:</h3>
          <p><strong>${order.user?.name || 'Guest'}</strong></p>
          <p>${order.user?.email || ''}</p>
          <p>${order.user?.phone || ''}</p>
          <p>${order.shipping_address || ''}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th class="text-right">Quantity</th>
              <th class="text-right">Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items?.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.product_name}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">₾${item.price.toFixed(2)}</td>
                <td class="text-right">₾${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-row">Subtotal: ₾${subtotal.toFixed(2)}</div>
          <div class="total-row">Shipping: ₾${shipping.toFixed(2)}</div>
          <div class="total-row">Tax (18%): ₾${tax.toFixed(2)}</div>
          <div class="grand-total">Total: ₾${total.toFixed(2)}</div>
        </div>
        
        <div class="footer">
          <p>Thank you for your business!</p>
          <p>This invoice was generated automatically.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send Invoice Email
const sendInvoiceEmail = async (order, invoiceNumber, recipientEmail) => {
  try {
    const invoiceHTML = generateInvoiceHTML(order, invoiceNumber);
    
    const mailOptions = {
      from: `"E-Shop" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `Invoice ${invoiceNumber} - Your E-Shop Order`,
      html: invoiceHTML,
      attachments: [
        {
          filename: `invoice-${invoiceNumber}.html`,
          content: invoiceHTML
        }
      ]
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Invoice email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateInvoiceHTML,
  sendInvoiceEmail
};

// backend/controllers/orderController.js - დაამატე ეს მეთოდი
const { sendInvoiceEmail } = require('../services/invoiceService');

exports.sendOrderInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { invoiceNumber, email } = req.body;
    
    // Get order details with items
    const order = await Order.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price']
          }]
        }
      ]
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Prepare order data for invoice
    const orderData = {
      ...order.toJSON(),
      items: order.items.map(item => ({
        product_name: item.product_name || item.product?.name,
        quantity: item.quantity,
        price: item.price
      }))
    };
    
    // Send invoice email
    const result = await sendInvoiceEmail(
      orderData, 
      invoiceNumber, 
      email || order.user?.email
    );
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Invoice sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send invoice',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Send invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending invoice',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// backend/routes/orders.js - დაამატე route
router.post('/:id/send-invoice', authenticateToken, isAdmin, sendOrderInvoice);

// .env ფაილში დაამატე
// EMAIL_USER=your-email@gmail.com
// EMAIL_PASS=your-app-specific-password