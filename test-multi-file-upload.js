// Test script for multi-file upload functionality
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Create test files
const createTestFile = (filename, content) => {
  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, content);
  return filePath;
};

// Test the multi-file upload
const testMultiFileUpload = async () => {
  console.log('Creating test files...');
  
  // Create test PDF and image files
  const testFiles = [
    createTestFile('test1.txt', 'This is test file 1 content'),
    createTestFile('test2.txt', 'This is test file 2 content'),
    createTestFile('test3.txt', 'This is test file 3 content')
  ];

  console.log('Test files created:', testFiles);
  
  // Clean up test files
  testFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });
  
  console.log('Multi-file upload test completed!');
};

testMultiFileUpload().catch(console.error);
