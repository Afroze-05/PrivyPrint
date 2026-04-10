console.log('Testing API endpoints...');

// Test the getPrintHistory function directly
const getPrintHistory = async () => {
  try {
    console.log('Testing getPrintHistory function...');
    // This would need database connection, but let's see if the function exports correctly
    const statsController = require('./controllers/statsController');
    console.log('statsController loaded:', typeof statsController);
    console.log('getPrintHistory function:', typeof statsController.getPrintHistory);
  } catch (err) {
    console.error('Error loading controller:', err.message);
  }
};

getPrintHistory();
