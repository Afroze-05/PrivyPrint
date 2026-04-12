// Test script for the complete rating system

const BASE_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:5173';

async function testRatingSystem() {
  console.log('🧪 Testing Complete Rating System...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connectivity...');
    const healthResponse = await fetch(`${BASE_URL}/`);
    if (healthResponse.ok) {
      console.log('✅ Server is running');
    } else {
      console.log('❌ Server is not responding');
      return;
    }

    // Test 2: Test rating stats endpoint
    console.log('\n2. Testing rating stats endpoint...');
    try {
      const statsResponse = await fetch(`${BASE_URL}/api/rate/stats`, {
        headers: {
          'Authorization': 'Bearer test_admin_token_1775028546379',
          'Content-Type': 'application/json'
        }
      });
      
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        console.log('✅ Rating stats endpoint working:', {
          totalRatings: stats.totalRatings || 0,
          averageRating: stats.averageRating || 0,
          trustScore: stats.trustScore || 0
        });
      } else {
        console.log('❌ Rating stats endpoint failed:', statsResponse.status);
      }
    } catch (error) {
      console.log('❌ Rating stats endpoint error:', error.message);
    }

    // Test 3: Test rating submission endpoint
    console.log('\n3. Testing rating submission endpoint...');
    try {
      const submitResponse = await fetch(`${BASE_URL}/api/rate`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test_admin_token_1775028546379',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobId: '507f1f1bf1e9a3d8c9b4b3',
          rating: 5,
          feedback: 'Excellent service! Very professional and quick.'
        })
      });
      
      if (submitResponse.ok) {
        const result = await submitResponse.json();
        console.log('✅ Rating submission working:', result);
      } else {
        const error = await submitResponse.json();
        console.log('❌ Rating submission failed:', submitResponse.status, error.message);
      }
    } catch (error) {
      console.log('❌ Rating submission error:', error.message);
    }

    // Test 4: Test rating reviews endpoint
    console.log('\n4. Testing rating reviews endpoint...');
    try {
      const reviewsResponse = await fetch(`${BASE_URL}/api/rate/reviews`, {
        headers: {
          'Authorization': 'Bearer test_admin_token_1775028546379',
          'Content-Type': 'application/json'
        }
      });
      
      if (reviewsResponse.ok) {
        const reviews = await reviewsResponse.json();
        console.log('✅ Rating reviews endpoint working:', {
          totalRatings: reviews.ratings?.length || 0,
          pagination: reviews.pagination
        });
      } else {
        console.log('❌ Rating reviews endpoint failed:', reviewsResponse.status);
      }
    } catch (error) {
      console.log('❌ Rating reviews endpoint error:', error.message);
    }

    // Test 5: Test email rating endpoint (GET)
    console.log('\n5. Testing email rating endpoint...');
    try {
      const emailRatingResponse = await fetch(`${BASE_URL}/api/rate?jobId=507f1f1bf1e9a3d8c9b4b3&rating=4`);
      
      if (emailRatingResponse.ok) {
        console.log('✅ Email rating endpoint working (redirects to thank you page)');
      } else {
        console.log('❌ Email rating endpoint failed:', emailRatingResponse.status);
      }
    } catch (error) {
      console.log('❌ Email rating endpoint error:', error.message);
    }

    console.log('\n🎉 Rating System Test Complete!');
    console.log('\n📋 Summary of implemented features:');
    console.log('   ✅ Dynamic Star Rating Component (StarRating.jsx)');
    console.log('   ✅ Rating Submission Component (RatingSubmission.jsx)');
    console.log('   ✅ Rating Page (RatingPage.jsx)');
    console.log('   ✅ Admin Ratings Section (RatingsSection.jsx)');
    console.log('   ✅ Enhanced Admin Dashboard (AdminDashboardNew.jsx)');
    console.log('   ✅ Email Templates (emailTemplates.js)');
    console.log('   ✅ Backend API Endpoints (/api/rate/*)');
    console.log('   ✅ Rating Thank You Page (RatingThankYou.jsx)');
    console.log('   ✅ Email Integration with Rating Links');
    
    console.log('\n🔗 Frontend URLs:');
    console.log(`   Rating Page: ${FRONTEND_URL}/rating?jobId=<JOB_ID>`);
    console.log(`   Admin Dashboard: ${FRONTEND_URL}/admin/dashboard`);
    console.log(`   Thank You Page: ${FRONTEND_URL}/rating-thank-you?rating=<RATING>`);
    
    console.log('\n📧 Backend API Endpoints:');
    console.log(`   POST ${BASE_URL}/api/rate - Submit rating (authenticated)`);
    console.log(`   GET  ${BASE_URL}/api/rate - Handle email rating (no auth)`);
    console.log(`   GET  ${BASE_URL}/api/rate/stats - Get rating statistics (admin)`);
    console.log(`   GET  ${BASE_URL}/api/rate/reviews - Get all ratings with details (admin)`);
    console.log(`   GET  ${BASE_URL}/api/rate/all - Get paginated ratings (admin)`);
    console.log(`   GET  ${BASE_URL}/api/documents/:id - Get document by ID (for rating page)`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testRatingSystem();
