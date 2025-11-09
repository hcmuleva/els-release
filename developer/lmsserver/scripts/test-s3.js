#!/usr/bin/env node

/**
 * S3 Configuration Test Script
 * Tests AWS S3 connectivity and permissions
 */

require('dotenv').config();
const { S3Client, ListBucketsCommand, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testS3Configuration() {
  log('\n🔍 Testing AWS S3 Configuration...\n', 'blue');

  // Check environment variables
  const requiredVars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'AWS_S3_BUCKET'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    log('❌ Missing required environment variables:', 'red');
    missingVars.forEach(varName => log(`   - ${varName}`, 'red'));
    log('\nPlease update your .env file with AWS credentials.', 'yellow');
    process.exit(1);
  }

  log('✅ Environment variables loaded', 'green');
  log(`   - Region: ${process.env.AWS_REGION}`, 'blue');
  log(`   - Bucket: ${process.env.AWS_S3_BUCKET}`, 'blue');

  // Initialize S3 client
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    ...(process.env.AWS_S3_ENDPOINT && { endpoint: process.env.AWS_S3_ENDPOINT }),
  });

  try {
    // Test 1: List buckets
    log('\n📋 Test 1: Listing buckets...', 'yellow');
    const listBucketsCommand = new ListBucketsCommand({});
    const listResponse = await s3Client.send(listBucketsCommand);
    const bucketExists = listResponse.Buckets.some(b => b.Name === process.env.AWS_S3_BUCKET);
    
    if (bucketExists) {
      log('✅ Bucket found and accessible', 'green');
    } else {
      log('⚠️  Bucket not found in account. Available buckets:', 'yellow');
      listResponse.Buckets.forEach(bucket => log(`   - ${bucket.Name}`, 'blue'));
    }

  // Test 2: Upload a test file
  console.log('\n📤 Test 2: Uploading test file...');
  const testKey = `test-upload-${Date.now()}.txt`;
  const testContent = 'This is a test file uploaded from Strapi.';
  
  try {
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain',
    });
    
    await s3Client.send(uploadCommand);
    console.log('✅ Test 2 passed: File uploaded successfully');
    console.log(`   File key: ${testKey}`);
    
    uploadedKey = testKey;
  } catch (error) {
    log('❌ Test 2 failed: Upload failed', 'red');
    log(`   Error: ${error.message}`, 'red');
    if (error.message.includes('ACL')) {
      log('   💡 Tip: Your bucket may have ACLs disabled. This is now fixed in the config.', 'yellow');
    }
    log('\n📚 See S3_UPLOAD_GUIDE.md for troubleshooting.\n', 'yellow');
    process.exit(1);
  }

  // Test 3: Read the uploaded file
  log('\n📥 Test 3: Reading uploaded file...', 'yellow');
  const getCommand = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: uploadedKey,
  });

  const getResponse = await s3Client.send(getCommand);
  const downloadedContent = await getResponse.Body.transformToString();
  
  if (downloadedContent === testContent) {
    log('✅ File downloaded and content verified', 'green');
  } else {
    log('⚠️  File content mismatch', 'yellow');
  }

  // Test 4: Delete the test file
  log('\n🗑️  Test 4: Deleting test file...', 'yellow');
  const deleteCommand = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: uploadedKey,
  });

    await s3Client.send(deleteCommand);
    log('✅ Test file deleted successfully', 'green');

    // Summary
    log('\n' + '='.repeat(50), 'green');
    log('🎉 All tests passed! S3 configuration is working correctly.', 'green');
    log('='.repeat(50) + '\n', 'green');
    log('Next steps:', 'blue');
    log('1. Set UPLOAD_PROVIDER=s3 in your .env file', 'blue');
    log('2. Restart Strapi: npm run develop', 'blue');
    log('3. Upload files through Strapi admin panel', 'blue');
    log('4. Verify files appear in your S3 bucket\n', 'blue');

  } catch (error) {
    log('\n❌ Test failed:', 'red');
    log(`   Error: ${error.message}`, 'red');
    
    if (error.name === 'NoSuchBucket') {
      log('\n💡 Suggestion: The bucket does not exist. Create it in AWS Console.', 'yellow');
    } else if (error.name === 'AccessDenied' || error.name === 'InvalidAccessKeyId') {
      log('\n💡 Suggestion: Check your AWS credentials and IAM permissions.', 'yellow');
    } else if (error.name === 'NetworkingError') {
      log('\n💡 Suggestion: Check your internet connection and AWS endpoint.', 'yellow');
    }

    log('\n📚 See S3_UPLOAD_GUIDE.md for detailed setup instructions.\n', 'yellow');
    process.exit(1);
  }
}

// Check if AWS SDK is installed
try {
  require.resolve('@aws-sdk/client-s3');
} catch (e) {
  log('\n❌ AWS SDK not installed!', 'red');
  log('Installing required package...', 'yellow');
  const { execSync } = require('child_process');
  try {
    execSync('npm install @aws-sdk/client-s3', { stdio: 'inherit' });
    log('✅ AWS SDK installed successfully', 'green');
    log('Please run this script again.\n', 'blue');
  } catch (installError) {
    log('❌ Failed to install AWS SDK', 'red');
    log('Please run: npm install @aws-sdk/client-s3\n', 'yellow');
  }
  process.exit(1);
}

// Run tests
testS3Configuration();
