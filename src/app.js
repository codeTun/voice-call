const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const TwilioVoiceService = require('./services/twilioVoiceService');
const AlertManager = require('./services/alertManager');
const LanguageManager = require('./services/languageManager');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Initialize services
const voiceService = new TwilioVoiceService();
const alertManager = new AlertManager();
const languageManager = new LanguageManager();

// Store for tracking calls (in production, use a database)
const callHistory = [];

// Routes

// Home page
app.get('/', (req, res) => {
  res.send(`
    <html>
    <head>
      <title>Agri-Health Voice Alert System</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, select, textarea { width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; }
        button { background-color: #4CAF50; color: white; padding: 12px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
        button:hover { background-color: #45a049; }
        .alert { padding: 15px; margin-bottom: 20px; border-radius: 4px; }
        .alert-success { background-color: #dff0d8; border-color: #d6e9c6; color: #3c763d; }
        .alert-error { background-color: #f2dede; border-color: #ebccd1; color: #a94442; }
        .section { margin-bottom: 30px; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
        h1 { color: #2c5530; }
        h2 { color: #4CAF50; }
      </style>
    </head>
    <body>
      <h1>🌱 Agri-Health Voice Alert System</h1>
      <p>A proactive voice alert system for women farmers using Twilio API</p>
      
      <div class="section">
        <h2>📞 Send Voice Alert</h2>
        <form id="alertForm">
          <div class="form-group">
            <label for="phoneNumber">Phone Number (E.164 format, e.g., +1234567890):</label>
            <input type="tel" id="phoneNumber" name="phoneNumber" required placeholder="+1234567890">
          </div>
          
          <div class="form-group">
            <label for="alertType">Alert Type:</label>
            <select id="alertType" name="alertType" required>
              <option value="">Select Alert Type</option>
              <option value="health">Health Alert</option>
              <option value="agriculture">Agricultural Alert</option>
              <option value="weather">Weather Alert</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="alertSubtype">Alert Subtype:</label>
            <select id="alertSubtype" name="alertSubtype" required>
              <option value="">First select alert type</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="language">Language:</label>
            <select id="language" name="language" required>
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="ar">Arabic</option>
              <option value="es">Spanish</option>
              <option value="hi">Hindi</option>
              <option value="sw">Swahili</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="voice">Voice:</label>
            <select id="voice" name="voice">
              <option value="alice">Alice (English default)</option>
              <option value="man">Man</option>
              <option value="woman">Woman</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="farmerName">Farmer Name (optional):</label>
            <input type="text" id="farmerName" name="farmerName" placeholder="Enter farmer name">
          </div>
          
          <div class="form-group">
            <label for="urgencyLevel">Urgency Level:</label>
            <select id="urgencyLevel" name="urgencyLevel">
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          
          <button type="submit">📞 Send Voice Alert</button>
        </form>
      </div>
      
      <div class="section">
        <h2>📝 Send Custom Message</h2>
        <form id="customForm">
          <div class="form-group">
            <label for="customPhone">Phone Number:</label>
            <input type="tel" id="customPhone" name="phoneNumber" required placeholder="+1234567890">
          </div>
          
          <div class="form-group">
            <label for="customMessage">Custom Message:</label>
            <textarea id="customMessage" name="message" rows="4" required placeholder="Enter your custom message here..."></textarea>
          </div>
          
          <div class="form-group">
            <label for="customLanguage">Language:</label>
            <select id="customLanguage" name="language">
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="ar">Arabic</option>
              <option value="es">Spanish</option>
            </select>
          </div>
          
          <button type="submit">📞 Send Custom Alert</button>
        </form>
      </div>
      
      <div class="section">
        <h2>📊 Call History</h2>
        <button onclick="loadCallHistory()">🔄 Refresh History</button>
        <div id="callHistory"></div>
      </div>
      
      <script>
        const alertSubtypes = {
          health: ['fever', 'bloodPressure', 'medication', 'checkup'],
          agriculture: ['irrigation', 'pesticide', 'harvest', 'weather', 'fertilizer'],
          weather: ['storm', 'drought', 'flood', 'frost']
        };
        
        document.getElementById('alertType').addEventListener('change', function() {
          const alertType = this.value;
          const subtypeSelect = document.getElementById('alertSubtype');
          subtypeSelect.innerHTML = '<option value="">Select Subtype</option>';
          
          if (alertType && alertSubtypes[alertType]) {
            alertSubtypes[alertType].forEach(subtype => {
              const option = document.createElement('option');
              option.value = subtype;
              option.textContent = subtype.charAt(0).toUpperCase() + subtype.slice(1);
              subtypeSelect.appendChild(option);
            });
          }
        });
        
        document.getElementById('alertForm').addEventListener('submit', async function(e) {
          e.preventDefault();
          
          const formData = new FormData(e.target);
          const data = Object.fromEntries(formData);
          
          try {
            const response = await fetch('/api/send-alert', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
              showAlert('Voice alert sent successfully! Call SID: ' + result.callSid, 'success');
            } else {
              showAlert('Error: ' + result.error, 'error');
            }
          } catch (error) {
            showAlert('Error: ' + error.message, 'error');
          }
        });
        
        document.getElementById('customForm').addEventListener('submit', async function(e) {
          e.preventDefault();
          
          const formData = new FormData(e.target);
          const data = Object.fromEntries(formData);
          
          try {
            const response = await fetch('/api/send-custom-alert', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
              showAlert('Custom voice alert sent successfully! Call SID: ' + result.callSid, 'success');
            } else {
              showAlert('Error: ' + result.error, 'error');
            }
          } catch (error) {
            showAlert('Error: ' + error.message, 'error');
          }
        });
        
        function showAlert(message, type) {
          const alertDiv = document.createElement('div');
          alertDiv.className = 'alert alert-' + type;
          alertDiv.textContent = message;
          
          const firstSection = document.querySelector('.section');
          firstSection.parentNode.insertBefore(alertDiv, firstSection);
          
          setTimeout(() => {
            alertDiv.remove();
          }, 5000);
        }
        
        async function loadCallHistory() {
          try {
            const response = await fetch('/api/call-history');
            const history = await response.json();
            
            const historyDiv = document.getElementById('callHistory');
            if (history.length === 0) {
              historyDiv.innerHTML = '<p>No calls made yet.</p>';
              return;
            }
            
            let html = '<table border="1" style="width:100%; border-collapse: collapse; margin-top: 10px;">';
            html += '<tr><th>Time</th><th>Phone</th><th>Status</th><th>Message</th><th>Language</th></tr>';
            
            history.forEach(call => {
              html += '<tr>';
              html += '<td>' + new Date(call.timestamp).toLocaleString() + '</td>';
              html += '<td>' + call.phoneNumber + '</td>';
              html += '<td>' + call.status + '</td>';
              html += '<td>' + (call.message.substring(0, 50) + '...') + '</td>';
              html += '<td>' + call.language + '</td>';
              html += '</tr>';
            });
            
            html += '</table>';
            historyDiv.innerHTML = html;
          } catch (error) {
            document.getElementById('callHistory').innerHTML = '<p>Error loading history: ' + error.message + '</p>';
          }
        }
        
        // Load call history on page load
        loadCallHistory();
      </script>
    </body>
    </html>
  `);
});

// API endpoint to send predefined alerts
app.post('/api/send-alert', async (req, res) => {
  try {
    const { phoneNumber, alertType, alertSubtype, language, voice, farmerName, urgencyLevel } = req.body;
    
    // Validate required fields
    if (!phoneNumber || !alertType || !alertSubtype || !language) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: phoneNumber, alertType, alertSubtype, language'
      });
    }
    
    // Get alert message
    const customData = {
      farmerName: farmerName,
      urgencyLevel: urgencyLevel || 'normal'
    };
    
    const alertMessage = alertManager.getAlertMessage(alertType, alertSubtype, language, customData);
    const formattedMessage = languageManager.formatMessage(alertMessage, language, urgencyLevel);
    
    // Get appropriate voice and language settings
    const twilioLanguage = languageManager.getTwilioLanguageCode(language);
    const selectedVoice = languageManager.getVoiceForLanguage(language, voice);
    
    // Make the call
    const result = await voiceService.makeVoiceCall(phoneNumber, formattedMessage, twilioLanguage, selectedVoice);
    
    // Store call history
    callHistory.push({
      timestamp: new Date().toISOString(),
      phoneNumber: phoneNumber,
      alertType: alertType,
      alertSubtype: alertSubtype,
      language: language,
      voice: selectedVoice,
      message: formattedMessage,
      status: result.success ? 'sent' : 'failed',
      callSid: result.callSid || null,
      error: result.error || null
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error sending alert:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API endpoint to send custom alerts
app.post('/api/send-custom-alert', async (req, res) => {
  try {
    const { phoneNumber, message, language, voice } = req.body;
    
    if (!phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: phoneNumber, message'
      });
    }
    
    const selectedLanguage = language || 'en';
    const formattedMessage = languageManager.formatMessage(message, selectedLanguage);
    const twilioLanguage = languageManager.getTwilioLanguageCode(selectedLanguage);
    const selectedVoice = languageManager.getVoiceForLanguage(selectedLanguage, voice);
    
    const result = await voiceService.makeVoiceCall(phoneNumber, formattedMessage, twilioLanguage, selectedVoice);
    
    // Store call history
    callHistory.push({
      timestamp: new Date().toISOString(),
      phoneNumber: phoneNumber,
      alertType: 'custom',
      language: selectedLanguage,
      voice: selectedVoice,
      message: formattedMessage,
      status: result.success ? 'sent' : 'failed',
      callSid: result.callSid || null,
      error: result.error || null
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error sending custom alert:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// TwiML endpoint for voice responses
app.get('/twiml', (req, res) => {
  const { message, language, voice } = req.query;
  
  if (!message) {
    return res.status(400).send('Missing message parameter');
  }
  
  const decodedMessage = decodeURIComponent(message);
  const twiml = voiceService.generateTwiML(decodedMessage, language || 'en', voice || 'alice');
  
  res.type('text/xml');
  res.send(twiml);
});

// Get call history
app.get('/api/call-history', (req, res) => {
  res.json(callHistory.slice(-20)); // Return last 20 calls
});

// Get call status
app.get('/api/call-status/:callSid', async (req, res) => {
  try {
    const { callSid } = req.params;
    const status = await voiceService.getCallStatus(callSid);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available alert types
app.get('/api/alert-types', (req, res) => {
  const alertTypes = alertManager.getAvailableAlerts();
  res.json(alertTypes);
});

// Get supported languages
app.get('/api/languages', (req, res) => {
  const languages = languageManager.getSupportedLanguages();
  res.json(languages);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(port, () => {
  console.log('🌱 Agri-Health Voice Alert System started');
  console.log(`📡 Server running on http://localhost:${port}`);
  console.log('📞 Twilio integration ready');
  console.log('🌍 Multi-language support enabled');
  console.log('📋 Web interface available at http://localhost:' + port);
  
  // Validate Twilio configuration
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn('⚠️  Warning: Twilio credentials not configured. Please set up .env file.');
  }
});

module.exports = app;
