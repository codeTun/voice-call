const twilio = require('twilio');
require('dotenv').config();

class TwilioVoiceService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
    
    if (!this.accountSid || !this.authToken || !this.fromNumber) {
      throw new Error('Missing required Twilio credentials in environment variables');
    }
    
    this.client = twilio(this.accountSid, this.authToken);
  }

  /**
   * Make a voice call with a spoken message
   * @param {string} toNumber - Phone number to call (E.164 format)
   * @param {string} message - Text message to speak
   * @param {string} language - Language code (e.g., 'en', 'fr', 'ar')
   * @param {string} voice - Voice type ('alice', 'man', 'woman')
   * @returns {Promise} - Twilio call object
   */
  async makeVoiceCall(toNumber, message, language = 'en', voice = 'alice') {
    try {
      const twimlUrl = await this.generateTwimlUrl(message, language, voice);
      
      const call = await this.client.calls.create({
        to: toNumber,
        from: this.fromNumber,
        url: twimlUrl,
        method: 'GET'
      });

      console.log(`Voice call initiated to ${toNumber}, Call SID: ${call.sid}`);
      return {
        success: true,
        callSid: call.sid,
        status: call.status,
        to: toNumber,
        message: message
      };
    } catch (error) {
      console.error('Error making voice call:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate TwiML URL for the voice message
   * This is a simplified version - in production, you'd host this endpoint
   */
  generateTwimlUrl(message, language, voice) {
    // For now, we'll use Twilio's hosted TwiML bins or create a local endpoint
    // This method will be implemented with the web server
    const encodedMessage = encodeURIComponent(message);
    return `http://localhost:${process.env.PORT || 3000}/twiml?message=${encodedMessage}&language=${language}&voice=${voice}`;
  }

  /**
   * Get call status
   * @param {string} callSid - Call SID from Twilio
   */
  async getCallStatus(callSid) {
    try {
      const call = await this.client.calls(callSid).fetch();
      return {
        sid: call.sid,
        status: call.status,
        duration: call.duration,
        startTime: call.startTime,
        endTime: call.endTime
      };
    } catch (error) {
      console.error('Error fetching call status:', error);
      return { error: error.message };
    }
  }

  /**
   * Generate TwiML response for voice messages
   * @param {string} message - Text to speak
   * @param {string} language - Language code
   * @param {string} voice - Voice type
   */
  generateTwiML(message, language = 'en', voice = 'alice') {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();
    
    // Add a brief pause before speaking
    response.pause({ length: 1 });
    
    // Speak the message
    response.say({
      voice: voice,
      language: language
    }, message);
    
    // Add a brief pause after the message
    response.pause({ length: 2 });
    
    // Optionally repeat the message once for clarity
    response.say({
      voice: voice,
      language: language
    }, "I repeat: " + message);
    
    return response.toString();
  }
}

module.exports = TwilioVoiceService;
