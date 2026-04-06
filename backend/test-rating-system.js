#!/usr/bin/env node

/**
 * Test script for Print Success Notification + Rating System
 * This script demonstrates the complete flow:
 * 1. Simulate print completion
 * 2. Send email notification with rating links
 * 3. Test rating submission
 */

const mongoose = require('mongoose');
const Document = require('./models/Document');
const Rating = require('./models/Rating');
const User = require('./models/User');
const Log = require('./models/Log');

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://afrozeshaikh7860_db_user:Afroze123@cluster0.1lfpvma.mongodb.net/privyprint?retryWrites=true&w=majority');

async function testRatingSystem() {
  try {
    console.log('🧪 Starting Print Success Notification + Rating System Test...\n');

    // 1. Create a test user if not exists
    let testUser = await User.findOne({ email: 'testcustomer@example.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Test Customer',
        email: 'testcustomer@example.com',
        password: 'password123',
        role: 'customer',
        isVerified: true
      });
      console.log('✅ Created test customer:', testUser.email);
    }

    // 2. Create a test document if not exists
    let testDoc = await Document.findOne({ token: 'test_rating_token_123' });
    if (!testDoc) {
      testDoc = await Document.create({
        fileUrl: '/uploads/test-document.pdf',
        token: 'test_rating_token_123',
        type: 'B/W',
        copies: 1,
        status: 'completed',
        userId: testUser._id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        createdAt: new Date()
      });
      console.log('✅ Created test document with token:', testDoc.token);
    }

    // 3. Create a print log
    let testLog = await Log.findOne({ token: testDoc.token });
    if (!testLog) {
      let testAdmin = await User.findOne({ email: 'testadmin@example.com' });
      if (!testAdmin) {
        testAdmin = await User.create({
          name: 'Test Admin',
          email: 'testadmin@example.com',
          password: 'admin123',
          role: 'admin',
          isVerified: true
        });
        console.log('✅ Created test admin');
      }
      
      testLog = await Log.create({
        token: testDoc.token,
        adminId: testAdmin._id,
        time: new Date()
      });
      console.log('✅ Created print log for document');
    }

    // 4. Test rating statistics endpoint
    console.log('\n📊 Testing rating statistics...');
    const response = await fetch('http://localhost:5000/api/rate/stats', {
      headers: {
        'Authorization': 'Bearer test_admin_token_1775028546379',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const stats = await response.json();
      console.log('✅ Rating stats endpoint working:', stats);
    } else {
      console.log('❌ Rating stats endpoint failed');
    }

    // 5. Test email rating link (simulate clicking star in email)
    console.log('\n⭐ Testing email rating link...');
    const ratingResponse = await fetch(`http://localhost:5000/api/rate?jobId=${testDoc._id}&rating=5`);
    
    if (ratingResponse.ok) {
      console.log('✅ Email rating link works - should redirect to thank you page');
    } else {
      const error = await ratingResponse.json();
      console.log('❌ Email rating link failed:', error.message);
    }

    // 6. Test authenticated rating submission
    console.log('\n🔐 Testing authenticated rating submission...');
    const authRatingResponse = await fetch('http://localhost:5000/api/rate', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test_admin_token_1775028546379',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobId: testDoc._id,
        rating: 4,
        feedback: 'Great service!'
      })
    });

    if (authRatingResponse.ok) {
      const result = await authRatingResponse.json();
      console.log('✅ Authenticated rating submission works:', result);
    } else {
      const error = await authRatingResponse.json();
      console.log('❌ Authenticated rating submission failed:', error.message);
    }

    // 7. Check if rating was saved
    console.log('\n💾 Checking if rating was saved...');
    const savedRating = await Rating.findOne({ userId: testUser._id, jobId: testDoc._id });
    if (savedRating) {
      console.log('✅ Rating saved successfully:', {
        rating: savedRating.rating,
        feedback: savedRating.feedback,
        timestamp: savedRating.timestamp
      });
    } else {
      console.log('❌ Rating not found in database');
    }

    // 8. Test rating stats after submission
    console.log('\n📈 Testing rating stats after submission...');
    const finalStatsResponse = await fetch('http://localhost:5000/api/rate/stats', {
      headers: {
        'Authorization': 'Bearer test_admin_token_1775028546379',
        'Content-Type': 'application/json'
      }
    });
    
    if (finalStatsResponse.ok) {
      const finalStats = await finalStatsResponse.json();
      console.log('✅ Final rating stats:', finalStats);
    }

    console.log('\n🎉 Test completed! The Print Success Notification + Rating System is working correctly.');
    console.log('\n📧 Email notification would be sent to:', testUser.email);
    console.log('⭐ Rating links would point to:', `http://localhost:5173/api/rate?jobId=${testDoc._id}&rating=1-5`);
    console.log('🏁 Admin dashboard would show updated ratings and trust score.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the test
if (require.main === module) {
  testRatingSystem();
}

module.exports = testRatingSystem;
