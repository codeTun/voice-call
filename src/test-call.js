/**
 * Test Script for Agri-Health Voice Alert System
 * Run this to test the voice calling functionality
 */

require('dotenv').config();
const TwilioVoiceService = require('./services/twilioVoiceService');
const AlertManager = require('./services/alertManager');
const LanguageManager = require('./services/languageManager');

async function testVoiceAlert() {
  console.log('🧪 Testing Agri-Health Voice Alert System\n');
  
  try {
    // Initialize services
    console.log('🔧 Initializing services...');
    const voiceService = new TwilioVoiceService();
    const alertManager = new AlertManager();
    const languageManager = new LanguageManager();
    console.log('✅ Services initialized successfully\n');
    
    // Test phone number (replace with your actual phone number for testing)
    const testPhoneNumber = process.env.TEST_PHONE_NUMBER || '+1234567890';
    
    if (testPhoneNumber === '+1234567890') {
      console.log('⚠️  Please set TEST_PHONE_NUMBER in your .env file with your actual phone number');
      console.log('   Example: TEST_PHONE_NUMBER=+1234567890\n');
    }
    
    console.log('📞 Test Configuration:');
    console.log(`   Phone Number: ${testPhoneNumber}`);
    console.log(`   Twilio Number: ${process.env.TWILIO_PHONE_NUMBER || 'Not set'}`);
    console.log('');
    
    // Test 1: Health Alert in English
    console.log('🏥 Test 1: Health Alert (English)');
    const healthMessage = alertManager.getAlertMessage('health', 'fever', 'en', { 
      farmerName: 'Sarah',
      urgencyLevel: 'urgent'
    });
    const formattedHealthMessage = languageManager.formatMessage(healthMessage, 'en', 'urgent');
    console.log(`   Message: ${healthMessage}`);
    
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const healthResult = await voiceService.makeVoiceCall(
        testPhoneNumber, 
        formattedHealthMessage, 
        'en-US', 
        'alice'
      );
      console.log(`   Result: ${healthResult.success ? '✅ Success' : '❌ Failed'}`);
      if (healthResult.callSid) console.log(`   Call SID: ${healthResult.callSid}`);
      if (healthResult.error) console.log(`   Error: ${healthResult.error}`);
    } else {
      console.log('   ⚠️  Skipped - Twilio credentials not configured');
    }
    console.log('');
    
    // Test 2: Agricultural Alert in French
    console.log('🌾 Test 2: Agricultural Alert (French)');
    const agriMessage = alertManager.getAlertMessage('agriculture', 'irrigation', 'fr', {
      farmerName: 'Marie',
      cropType: 'tomatoes'
    });
    const formattedAgriMessage = languageManager.formatMessage(agriMessage, 'fr', 'normal');
    console.log(`   Message: ${agriMessage}`);
    
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const agriResult = await voiceService.makeVoiceCall(
        testPhoneNumber, 
        formattedAgriMessage, 
        'fr-FR', 
        'alice'
      );
      console.log(`   Result: ${agriResult.success ? '✅ Success' : '❌ Failed'}`);
      if (agriResult.callSid) console.log(`   Call SID: ${agriResult.callSid}`);
      if (agriResult.error) console.log(`   Error: ${agriResult.error}`);
    } else {
      console.log('   ⚠️  Skipped - Twilio credentials not configured');
    }
    console.log('');
    
    // Test 3: Weather Alert in Arabic
    console.log('🌦️  Test 3: Weather Alert (Arabic)');
    const weatherMessage = alertManager.getAlertMessage('weather', 'storm', 'ar', {
      farmerName: 'Fatima',
      urgencyLevel: 'emergency'
    });
    const formattedWeatherMessage = languageManager.formatMessage(weatherMessage, 'ar', 'emergency');
    console.log(`   Message: ${weatherMessage}`);
    
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const weatherResult = await voiceService.makeVoiceCall(
        testPhoneNumber, 
        formattedWeatherMessage, 
        'arb', 
        'woman'
      );
      console.log(`   Result: ${weatherResult.success ? '✅ Success' : '❌ Failed'}`);
      if (weatherResult.callSid) console.log(`   Call SID: ${weatherResult.callSid}`);
      if (weatherResult.error) console.log(`   Error: ${weatherResult.error}`);
    } else {
      console.log('   ⚠️  Skipped - Twilio credentials not configured');
    }
    console.log('');
    
    // Test 4: Custom Message
    console.log('📝 Test 4: Custom Message');
    const customMessage = "This is a test of the custom message feature. Your crops need immediate attention.";
    const formattedCustomMessage = languageManager.formatMessage(customMessage, 'en', 'normal');
    console.log(`   Message: ${customMessage}`);
    
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const customResult = await voiceService.makeVoiceCall(
        testPhoneNumber, 
        formattedCustomMessage, 
        'en-US', 
        'woman'
      );
      console.log(`   Result: ${customResult.success ? '✅ Success' : '❌ Failed'}`);
      if (customResult.callSid) console.log(`   Call SID: ${customResult.callSid}`);
      if (customResult.error) console.log(`   Error: ${customResult.error}`);
    } else {
      console.log('   ⚠️  Skipped - Twilio credentials not configured');
    }
    console.log('');
    
    // Display available features
    console.log('📊 System Information:');
    console.log('   Available Alert Types:', Object.keys(alertManager.getAvailableAlerts()));
    console.log('   Supported Languages:', languageManager.getSupportedLanguages().map(l => l.code));
    console.log('   Language Detection: Available for phone numbers');
    console.log('');
    
    console.log('✨ Testing completed!');
    console.log('');
    console.log('🚀 Next Steps:');
    console.log('   1. Configure your Twilio credentials in .env file');
    console.log('   2. Set TEST_PHONE_NUMBER to your phone number');
    console.log('   3. Run: npm start (to start the web interface)');
    console.log('   4. Visit: http://localhost:3000');
    console.log('   5. Test voice alerts through the web interface');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Make sure you have installed dependencies: npm install');
    console.log('   2. Create .env file from .env.example');
    console.log('   3. Add your Twilio credentials to .env file');
    console.log('   4. Verify your Twilio phone number is verified');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testVoiceAlert();
}

module.exports = { testVoiceAlert };
