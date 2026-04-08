const getRatingEmailTemplate = (userName, jobDetails, ratingUrl) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rate Your PrivyPrint Experience</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #050505 0%, #0a0a0a 50%, #111111 100%);
          color: #EAEAEA;
          margin: 0;
          padding: 20px;
          min-height: 100vh;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08);
        }
        
        .header {
          background: linear-gradient(135deg, #FF6B35 0%, #FF8A50 100%);
          padding: 30px;
          text-align: center;
        }
        
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          color: #FFFFFF;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .job-details {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
        }
        
        .job-details h3 {
          margin: 0 0 15px 0;
          color: #FF6B35;
          font-size: 18px;
        }
        
        .job-details p {
          margin: 5px 0;
          color: #999999;
          font-size: 14px;
        }
        
        .rating-section {
          text-align: center;
          margin: 30px 0;
        }
        
        .rating-stars {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin: 20px 0;
        }
        
        .star {
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.1);
          border: 2px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #FF6B35 0%, #FF8A50 100%);
          color: #FFFFFF;
          text-decoration: none;
          padding: 15px 30px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
          transition: all 0.3s ease;
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255,107,53,0.3);
        }
        
        .quick-rating {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin: 20px 0;
          flex-wrap: wrap;
        }
        
        .quick-rating a {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #999999;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        
        .quick-rating a:hover {
          background: rgba(255,107,53,0.1);
          border-color: rgba(255,107,53,0.3);
          color: #FF6B35;
        }
        
        .footer {
          background: rgba(255,255,255,0.02);
          padding: 20px;
          text-align: center;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        
        .footer p {
          margin: 5px 0;
          color: #666666;
          font-size: 12px;
        }
        
        .highlight {
          color: #FF6B35;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🖨️ How was your printing experience?</h1>
        </div>
        
        <div class="content">
          <p>Hi ${userName || 'there'},</p>
          
          <p>Your print job has been <span class="highlight">completed successfully</span>! We'd love to hear about your experience with PrivyPrint.</p>
          
          <div class="job-details">
            <h3>📄 Job Details</h3>
            <p><strong>File:</strong> ${jobDetails.filename || 'Unknown'}</p>
            <p><strong>Type:</strong> ${jobDetails.type || 'Unknown'}</p>
            <p><strong>Copies:</strong> ${jobDetails.copies || 1}</p>
            <p><strong>Job ID:</strong> ${jobDetails.token || 'Unknown'}</p>
            <p><strong>Completed:</strong> ${new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          
          <div class="rating-section">
            <h3>⭐ Rate Your Experience</h3>
            <p>Your feedback helps us improve our service for everyone.</p>
            
            <div class="quick-rating">
              <a href="${ratingUrl}&rating=5">😊 Excellent</a>
              <a href="${ratingUrl}&rating=4">🙂 Good</a>
              <a href="${ratingUrl}&rating=3">😐 Average</a>
              <a href="${ratingUrl}&rating=2">😕 Fair</a>
              <a href="${ratingUrl}&rating=1">😞 Poor</a>
            </div>
            
            <p style="margin: 20px 0; color: #666666; font-size: 14px;">
              Or click the button below for detailed rating:
            </p>
            
            <a href="${ratingUrl}" class="cta-button">
              ⭐ Rate Your Experience
            </a>
          </div>
          
          <p style="text-align: center; margin: 30px 0; color: #666666; font-size: 14px;">
            Thank you for choosing PrivyPrint! 🙏
          </p>
        </div>
        
        <div class="footer">
          <p>© 2024 PrivyPrint. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getCompletionEmailTemplate = (userName, jobDetails) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Print Job is Complete</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #050505 0%, #0a0a0a 50%, #111111 100%);
          color: #EAEAEA;
          margin: 0;
          padding: 20px;
          min-height: 100vh;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08);
        }
        
        .header {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          padding: 30px;
          text-align: center;
        }
        
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          color: #FFFFFF;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .success-icon {
          width: 80px;
          height: 80px;
          background: rgba(34, 197, 94, 0.15);
          border: 2px solid rgba(34, 197, 94, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 30px;
          font-size: 40px;
        }
        
        .job-details {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
        }
        
        .job-details h3 {
          margin: 0 0 15px 0;
          color: #22c55e;
          font-size: 18px;
        }
        
        .job-details p {
          margin: 5px 0;
          color: #999999;
          font-size: 14px;
        }
        
        .footer {
          background: rgba(255,255,255,0.02);
          padding: 20px;
          text-align: center;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        
        .footer p {
          margin: 5px 0;
          color: #666666;
          font-size: 12px;
        }
        
        .highlight {
          color: #22c55e;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Your Print Job is Complete!</h1>
        </div>
        
        <div class="content">
          <div class="success-icon">
            ✅
          </div>
          
          <p>Hi ${userName || 'there'},</p>
          
          <p>Great news! Your print job has been <span class="highlight">completed successfully</span> and is ready for pickup.</p>
          
          <div class="job-details">
            <h3>📄 Job Details</h3>
            <p><strong>File:</strong> ${jobDetails.filename || 'Unknown'}</p>
            <p><strong>Type:</strong> ${jobDetails.type || 'Unknown'}</p>
            <p><strong>Copies:</strong> ${jobDetails.copies || 1}</p>
            <p><strong>Job ID:</strong> ${jobDetails.token || 'Unknown'}</p>
            <p><strong>Completed:</strong> ${new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          
          <p style="text-align: center; margin: 30px 0; color: #666666; font-size: 14px;">
            Thank you for choosing PrivyPrint! 🙏
          </p>
        </div>
        
        <div class="footer">
          <p>© 2024 PrivyPrint. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  getRatingEmailTemplate,
  getCompletionEmailTemplate
};
