# 🌱 Agri-Health Voice Alert System

A proactive voice alert system that automatically calls women farmers when a health risk or agricultural issue is detected. Built with Twilio API for reliable voice communication.

## 📋 Features

- **🔊 Automated Voice Calls**: Send voice alerts without requiring internet or smartphone
- **🌍 Multi-Language Support**: English, French, Arabic, Spanish, Hindi, Swahili
- **📱 Multiple Alert Types**: Health, Agricultural, Weather, and Emergency alerts
- **🎯 Smart Targeting**: Personalized messages with farmer names and locations
- **⚡ Urgency Levels**: Normal, Urgent, and Emergency message formatting
- **📊 Call Tracking**: Monitor call status and history
- **🌐 Web Interface**: Easy-to-use web dashboard for testing and management
- **🔧 API Integration**: RESTful API for integration with other systems

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v14 or higher)
2. **Twilio Account** with:
   - Account SID
   - Auth Token
   - Twilio Phone Number

### Installation

1. **Clone or download** this project to your computer

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   # Copy the example file
   copy .env.example .env
   
   # Edit .env file with your actual Twilio credentials
   ```

4. **Configure your .env file**:
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
   PORT=3000
   ```

5. **Start the application**:
   ```bash
   npm start
   ```

6. **Open your browser** and go to: `http://localhost:3000`

## 🧪 Testing

### Test with the Web Interface

1. Start the server: `npm start`
2. Open `http://localhost:3000` in your browser
3. Fill in the form with:
   - Your phone number (in E.164 format: +1234567890)
   - Select alert type and subtype
   - Choose language and voice
   - Click "Send Voice Alert"

### Test with the Command Line

```bash
# Set your test phone number in .env
TEST_PHONE_NUMBER=+1234567890

# Run the test script
npm test
```

## 📞 How to Get Twilio Credentials

1. **Sign up** for a free Twilio account at [twilio.com](https://www.twilio.com)

2. **Get your credentials** from the Twilio Console:
   - Account SID
   - Auth Token

3. **Get a phone number**:
   - Go to Phone Numbers → Manage → Buy a number
   - Choose a number from your country
   - Configure it for Voice calls

4. **Verify your personal phone** (required for free accounts):
   - Go to Phone Numbers → Manage → Verified Caller IDs
   - Add and verify your phone number

## 📱 Alert Types & Messages

### Health Alerts
- **Fever**: High temperature detection
- **Blood Pressure**: Abnormal readings
- **Medication**: Reminder notifications
- **Checkup**: Scheduled appointment reminders

### Agricultural Alerts
- **Irrigation**: Soil moisture warnings
- **Pesticide**: Pest activity detection
- **Harvest**: Crop readiness notifications
- **Weather**: Farming weather advisories
- **Fertilizer**: Application reminders

### Weather Alerts
- **Storm**: Severe weather warnings
- **Drought**: Water conservation alerts
- **Flood**: Heavy rainfall warnings
- **Frost**: Freezing temperature alerts

## 🌍 Supported Languages

| Language | Code | Voice Options |
|----------|------|---------------|
| English | `en` | alice, man, woman |
| French | `fr` | alice, man, woman |
| Arabic | `ar` | man, woman |
| Spanish | `es` | alice, man, woman |
| Hindi | `hi` | man, woman |
| Swahili | `sw` | man, woman |
| German | `de` | alice, man, woman |
| Italian | `it` | alice, man, woman |
| Portuguese | `pt` | alice, man, woman |

## 🔌 API Endpoints

### Send Predefined Alert
```bash
POST /api/send-alert
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "alertType": "health",
  "alertSubtype": "fever",
  "language": "en",
  "voice": "alice",
  "farmerName": "Sarah",
  "urgencyLevel": "urgent"
}
```

### Send Custom Alert
```bash
POST /api/send-custom-alert
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "message": "Your crops need immediate attention due to pest detection.",
  "language": "en",
  "voice": "woman"
}
```

### Get Call History
```bash
GET /api/call-history
```

### Check Call Status
```bash
GET /api/call-status/{callSid}
```

### Get Available Alert Types
```bash
GET /api/alert-types
```

### Get Supported Languages
```bash
GET /api/languages
```

## 🔧 Configuration Options

### Environment Variables
- `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
- `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token  
- `TWILIO_PHONE_NUMBER`: Your Twilio phone number
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `DEFAULT_LANGUAGE`: Default language code (default: en)
- `DEFAULT_VOICE`: Default voice type (default: alice)
- `TEST_PHONE_NUMBER`: Phone number for testing

### Voice Options
- **alice**: Clear, friendly voice (English default)
- **man**: Male voice (available in most languages)
- **woman**: Female voice (available in most languages)

### Urgency Levels
- **normal**: Standard message formatting
- **urgent**: Prefixed with urgency indicator
- **emergency**: Strong emergency language and repetition

## 🚀 Production Deployment

### Heroku Deployment
```bash
# Install Heroku CLI and login
heroku create your-app-name

# Set environment variables
heroku config:set TWILIO_ACCOUNT_SID=your_sid
heroku config:set TWILIO_AUTH_TOKEN=your_token
heroku config:set TWILIO_PHONE_NUMBER=your_number

# Deploy
git push heroku main
```

### Docker Deployment
```dockerfile
# Use the included Dockerfile (create if needed)
docker build -t agri-health-alerts .
docker run -p 3000:3000 --env-file .env agri-health-alerts
```

## 🛠️ Development

### Project Structure
```
agri-hope/
├── src/
│   ├── services/
│   │   ├── twilioVoiceService.js    # Twilio integration
│   │   ├── alertManager.js          # Alert templates & logic
│   │   └── languageManager.js       # Multi-language support
│   ├── app.js                       # Main application server
│   └── test-call.js                 # Testing utilities
├── package.json                     # Dependencies & scripts
├── .env.example                     # Environment template
└── README.md                        # This file
```

### Adding New Languages
1. Update `languageManager.js` with new language config
2. Add message templates in `alertManager.js`
3. Test with Twilio's supported voices

### Adding New Alert Types
1. Define new templates in `alertManager.js`
2. Update the web interface forms
3. Add API documentation

## 📊 Monitoring & Analytics

### Call Tracking
- All calls are logged with timestamps
- Call status monitoring (pending, ringing, in-progress, completed, failed)
- Error tracking and debugging information

### Performance Monitoring
- Response time tracking
- Success/failure rates
- Language usage statistics

## 🔒 Security Considerations

### Production Security
- Use HTTPS in production
- Secure your Twilio credentials
- Implement rate limiting
- Add authentication for admin functions
- Validate phone numbers
- Sanitize user inputs

### Privacy
- Don't log sensitive health information
- Implement data retention policies
- Follow GDPR/privacy regulations
- Encrypt stored data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

### Common Issues

**"Missing Twilio credentials"**
- Make sure your `.env` file has all required variables
- Check that your Twilio credentials are correct

**"Call failed"**
- Verify the phone number is in E.164 format (+1234567890)
- Ensure the number is verified in Twilio (for free accounts)
- Check your Twilio account balance

**"Language not supported"**
- Check the supported languages list
- Use fallback to English if needed

### Getting Help
- Check Twilio's documentation: [twilio.com/docs](https://www.twilio.com/docs)
- Review the test script output for debugging information
- Check the browser console for web interface issues

## 📈 Future Enhancements

- **Database Integration**: Store farmer profiles and call history
- **Scheduling**: Automated calls based on time/conditions
- **Voice Recognition**: Interactive voice responses
- **SMS Fallback**: Text messages when calls fail
- **Mobile App**: Companion app for farmers
- **Analytics Dashboard**: Comprehensive reporting
- **Integration APIs**: Connect with IoT sensors and health devices
- **Voice Recording**: Custom pre-recorded messages
- **Batch Calling**: Multiple farmers at once

## 📄 License

MIT License - feel free to use this project for your agricultural and health initiatives.

---

**Built with ❤️ for women farmers and rural health initiatives**
