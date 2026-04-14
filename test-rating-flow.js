// Test script for complete rating flow
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'test123',
  name: 'Test User'
};

const testAdmin = {
  email: 'admin@example.com', 
  password: 'admin123',
  name: 'Admin User'
};

async function testRatingFlow() {
  console.log('🧪 Starting Complete Rating Flow Test...\n');

  try {
    // 1. Test Backend API Endpoints
    console.log('1️⃣ Testing Backend API Endpoints...');
    
    // Test rating stats endpoint
    try {
      const statsResponse = await axios.get(`${API_BASE}/rate/stats`);
      console.log('✅ Rating Stats API:', statsResponse.data);
    } catch (error) {
      console.log('❌ Rating Stats API Error:', error.response?.data || error.message);
    }

    // Test ratings list endpoint
    try {
      const ratingsResponse = await axios.get(`${API_BASE}/rate/reviews`);
      console.log('✅ Ratings List API:', ratingsResponse.data);
    } catch (error) {
      console.log('❌ Ratings List API Error:', error.response?.data || error.message);
    }

    // 2. Test Email Rating Link (GET)
    console.log('\n2️⃣ Testing Email Rating Link...');
    const testJobId = '507f1f77bcf86cd799439011'; // Sample ObjectId
    const testRating = 5;
    
    try {
      const emailRatingResponse = await axios.get(`${API_BASE}/rate?jobId=${testJobId}&rating=${testRating}`);
      console.log('✅ Email Rating Redirect:', emailRatingResponse.request.res.responseUrl);
    } catch (error) {
      console.log('❌ Email Rating Error:', error.response?.data || error.message);
    }

    // 3. Test Authentication
    console.log('\n3️⃣ Testing Authentication...');
    
    // Test admin login
    try {
      const adminLoginResponse = await axios.post(`${API_BASE}/auth/login`, testAdmin);
      console.log('✅ Admin Login Successful:', adminLoginResponse.data.user?.name);
      const adminToken = adminLoginResponse.data.token;
      
      // Test protected rating endpoint with admin token
      try {
        const protectedResponse = await axios.get(`${API_BASE}/rate/stats`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ Protected Rating API with Admin Token:', protectedResponse.data);
      } catch (error) {
        console.log('❌ Protected Rating API Error:', error.response?.data || error.message);
      }
      
    } catch (error) {
      console.log('❌ Admin Login Error:', error.response?.data || error.message);
    }

    // 4. Test Frontend Routes
    console.log('\n4️⃣ Testing Frontend Routes...');
    const frontendUrl = 'http://localhost:5173';
    
    console.log(`📱 Rating Page: ${frontendUrl}/rating?jobId=${testJobId}`);
    console.log(`📱 Rating Thank You: ${frontendUrl}/rating-thank-you?rating=5`);
    console.log(`📱 Admin Dashboard: ${frontendUrl}/admin/dashboard`);

    // 5. Test Email Template Generation
    console.log('\n5️⃣ Testing Email Template...');
    const { getRatingEmailTemplate } = require('./backend/utils/emailTemplates');
    
    const jobDetails = {
      filename: 'test-document.pdf',
      type: 'B/W',
      copies: 2,
      token: 'SPX-1234'
    };
    
    const ratingUrl = `${frontendUrl}/rating?jobId=${testJobId}`;
    const emailTemplate = getRatingEmailTemplate('Test User', jobDetails, ratingUrl);
    
    console.log('✅ Email Template Generated (length):', emailTemplate.length);
    console.log('📧 Rating URL in template:', ratingUrl);

    // 6. Test Database Connection
    console.log('\n6️⃣ Testing Database Connection...');
    const mongoose = require('mongoose');
    const Document = require('./backend/models/Document');
    const Rating = require('./backend/models/Rating');
    
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/privyprint');
      console.log('✅ Database Connected');
      
      // Check if we have any documents
      const docCount = await Document.countDocuments();
      console.log(`📄 Documents in DB: ${docCount}`);
      
      // Check if we have any ratings
      const ratingCount = await Rating.countDocuments();
      console.log(`⭐ Ratings in DB: ${ratingCount}`);
      
      // Get recent completed documents for testing
      const completedDocs = await Document.find({ status: 'completed' }).limit(3);
      console.log('📋 Recent Completed Documents:', completedDocs.map(d => ({ 
        id: d._id, 
        token: d.token, 
        type: d.type 
      })));
      
      await mongoose.disconnect();
      console.log('✅ Database Disconnected');
      
    } catch (error) {
      console.log('❌ Database Error:', error.message);
    }

  } catch (error) {
    console.error('❌ Test Flow Error:', error.message);
  }

  console.log('\n🎉 Rating Flow Test Complete!');
  console.log('\n📋 Manual Testing Checklist:');
  console.log('□ Start backend server: npm run dev');
  console.log('□ Start frontend server: npm run dev (in frontend folder)');
  console.log('□ Complete a print job as admin');
  console.log('□ Check email for rating link');
  console.log('□ Click rating link and submit rating');
  console.log('□ Check admin dashboard for new rating');
  console.log('□ Verify rating thank you page');
}

// Run the test
testRatingFlow().catch(console.error);
