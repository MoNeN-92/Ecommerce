// backend/services/emailService.js
const nodemailer = require('nodemailer');

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // App-specific password
    }
  });
};

// Email templates
const emailTemplates = {
  // Order Confirmation Email
  orderConfirmation: (order) => {
    const itemsList = order.items?.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product_name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₾${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₾${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('') || '';

    return {
      subject: `Order Confirmation #${order.order_number}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 გილოცავთ შეკვეთას!</h1>
              <p>თქვენი შეკვეთა წარმატებით მიღებულია</p>
            </div>
            <div class="content">
              <h2>გამარჯობა, ${order.user_name || 'მომხმარებელო'}!</h2>
              <p>გმადლობთ შეკვეთისთვის. თქვენი შეკვეთის ნომერია: <strong>#${order.order_number}</strong></p>
              
              <h3>📦 შეკვეთის დეტალები:</h3>
              <table>
                <thead>
                  <tr style="background: #f8f9fa;">
                    <th style="padding: 10px; text-align: left;">პროდუქტი</th>
                    <th style="padding: 10px; text-align: center;">რაოდენობა</th>
                    <th style="padding: 10px; text-align: right;">ფასი</th>
                    <th style="padding: 10px; text-align: right;">ჯამი</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" style="padding: 10px; text-align: right;"><strong>ქვეჯამი:</strong></td>
                    <td style="padding: 10px; text-align: right;"><strong>₾${(order.total_amount - order.shipping_amount - order.tax_amount).toFixed(2)}</strong></td>
                  </tr>
                  <tr>
                    <td colspan="3" style="padding: 10px; text-align: right;">მიწოდება:</td>
                    <td style="padding: 10px; text-align: right;">₾${order.shipping_amount}</td>
                  </tr>
                  <tr>
                    <td colspan="3" style="padding: 10px; text-align: right;">დღგ (18%):</td>
                    <td style="padding: 10px; text-align: right;">₾${order.tax_amount}</td>
                  </tr>
                  <tr style="background: #f8f9fa;">
                    <td colspan="3" style="padding: 15px; text-align: right; font-size: 18px;"><strong>სულ:</strong></td>
                    <td style="padding: 15px; text-align: right; font-size: 18px; color: #667eea;"><strong>₾${order.total_amount}</strong></td>
                  </tr>
                </tfoot>
              </table>
              
              <h3>🚚 მიწოდების მისამართი:</h3>
              <p style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
                ${order.shipping_address}
              </p>
              
              <h3>💳 გადახდის მეთოდი:</h3>
              <p>${order.payment_method === 'cash_on_delivery' ? 'ნაღდი ანგარიშსწორება მიწოდებისას' : 'ბარათით'}</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/orders/${order.id}" class="button">შეკვეთის ნახვა</a>
              </div>
              
              <p><strong>შეკვეთის სტატუსი:</strong> ${order.status === 'pending' ? '⏳ მოლოდინში' : order.status}</p>
              
              <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <p style="margin: 0;"><strong>💡 რჩევა:</strong> შეგიძლიათ ნებისმიერ დროს შეამოწმოთ თქვენი შეკვეთის სტატუსი თქვენს პროფილში.</p>
              </div>
            </div>
            <div class="footer">
              <p>კითხვების შემთხვევაში დაგვიკავშირდით: support@eshop.ge</p>
              <p>© 2025 E-Shop. ყველა უფლება დაცულია.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  },

  // Password Reset Email
  passwordReset: (user, resetToken) => {
    return {
      subject: 'პაროლის აღდგენა - E-Shop',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>პაროლის აღდგენა</h2>
          <p>გამარჯობა ${user.name},</p>
          <p>მივიღეთ თქვენი მოთხოვნა პაროლის აღდგენაზე.</p>
          <p>პაროლის შესაცვლელად გთხოვთ დააჭიროთ ქვემოთ მოცემულ ღილაკს:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
              პაროლის შეცვლა
            </a>
          </div>
          <p>ლინკი აქტიურია მხოლოდ 1 საათის განმავლობაში.</p>
          <p>თუ თქვენ არ მოითხოვეთ პაროლის შეცვლა, უგულებელყავით ეს შეტყობინება.</p>
        </div>
      `
    };
  },

  // Welcome Email
  welcome: (user) => {
    return {
      subject: 'კეთილი იყოს თქვენი მობრძანება E-Shop-ში! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #667eea;">კეთილი იყოს თქვენი მობრძანება!</h1>
          <p>გამარჯობა ${user.name},</p>
          <p>გიხარიათ E-Shop-ის დიდ ოჯახში გაწევრიანება!</p>
          <h3>რა შეგიძლიათ E-Shop-ზე:</h3>
          <ul>
            <li>✨ ათასობით პროდუქტის დათვალიერება</li>
            <li>🚚 უფასო მიწოდება 100₾-ზე მეტ შეკვეთაზე</li>
            <li>💳 უსაფრთხო გადახდა</li>
            <li>📱 შეკვეთების თვალყურის დევნება</li>
          </ul>
          <p>დაიწყეთ შოპინგი ახლავე:</p>
          <a href="${process.env.FRONTEND_URL}/products" 
             style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
            პროდუქტების ნახვა
          </a>
        </div>
      `
    };
  }
};

// Email sending functions
const emailService = {
  // Send email function
  async sendEmail(to, template) {
    const transporter = createTransporter();
    
    try {
      const mailOptions = {
        from: `"E-Shop" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: template.subject,
        html: template.html
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  },

  // Send order confirmation
  async sendOrderConfirmation(order, userEmail) {
    const template = emailTemplates.orderConfirmation(order);
    return await this.sendEmail(userEmail, template);
  },

  // Send password reset
  async sendPasswordReset(user, resetToken) {
    const template = emailTemplates.passwordReset(user, resetToken);
    return await this.sendEmail(user.email, template);
  },

  // Send welcome email
  async sendWelcomeEmail(user) {
    const template = emailTemplates.welcome(user);
    return await this.sendEmail(user.email, template);
  }
};

module.exports = emailService;