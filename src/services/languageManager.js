/**
 * Language and Voice Configuration for Twilio TTS
 * Supports multiple languages with appropriate voice settings
 */

class LanguageManager {
  constructor() {
    // Language configurations with Twilio-supported voices and settings
    this.languageConfigs = {
      'en': {
        name: 'English',
        twilioLanguage: 'en-US',
        voices: ['alice', 'man', 'woman'],
        defaultVoice: 'alice',
        rtl: false
      },
      'en-gb': {
        name: 'English (British)',
        twilioLanguage: 'en-GB',
        voices: ['alice', 'man', 'woman'],
        defaultVoice: 'alice',
        rtl: false
      },
      'fr': {
        name: 'French',
        twilioLanguage: 'fr-FR',
        voices: ['alice', 'man', 'woman'],
        defaultVoice: 'alice',
        rtl: false
      },
      'es': {
        name: 'Spanish',
        twilioLanguage: 'es-ES',
        voices: ['alice', 'man', 'woman'],
        defaultVoice: 'alice',
        rtl: false
      },
      'ar': {
        name: 'Arabic',
        twilioLanguage: 'arb',
        voices: ['man', 'woman'],
        defaultVoice: 'woman',
        rtl: true
      },
      'de': {
        name: 'German',
        twilioLanguage: 'de-DE',
        voices: ['alice', 'man', 'woman'],
        defaultVoice: 'alice',
        rtl: false
      },
      'it': {
        name: 'Italian',
        twilioLanguage: 'it-IT',
        voices: ['alice', 'man', 'woman'],
        defaultVoice: 'alice',
        rtl: false
      },
      'pt': {
        name: 'Portuguese',
        twilioLanguage: 'pt-BR',
        voices: ['alice', 'man', 'woman'],
        defaultVoice: 'alice',
        rtl: false
      },
      'hi': {
        name: 'Hindi',
        twilioLanguage: 'hi-IN',
        voices: ['man', 'woman'],
        defaultVoice: 'woman',
        rtl: false
      },
      'sw': {
        name: 'Swahili',
        twilioLanguage: 'sw-KE',
        voices: ['man', 'woman'],
        defaultVoice: 'woman',
        rtl: false
      }
    };

    // Common phrases in different languages for system messages
    this.systemPhrases = {
      'en': {
        greeting: 'Hello, this is an important message from Agri-Hope.',
        closing: 'Thank you for your attention. Stay safe.',
        repeat: 'I will repeat this message:',
        emergency: 'This is an emergency alert.',
        urgent: 'This is an urgent notification.'
      },
      'fr': {
        greeting: 'Bonjour, ceci est un message important d\'Agri-Hope.',
        closing: 'Merci de votre attention. Restez en sécurité.',
        repeat: 'Je vais répéter ce message:',
        emergency: 'Ceci est une alerte d\'urgence.',
        urgent: 'Ceci est une notification urgente.'
      },
      'ar': {
        greeting: 'السلام عليكم، هذه رسالة مهمة من أجري-هوب.',
        closing: 'شكرا لانتباهكم. ابقوا بأمان.',
        repeat: 'سأكرر هذه الرسالة:',
        emergency: 'هذا تنبيه طوارئ.',
        urgent: 'هذا إشعار عاجل.'
      },
      'es': {
        greeting: 'Hola, este es un mensaje importante de Agri-Hope.',
        closing: 'Gracias por su atención. Manténganse seguros.',
        repeat: 'Repetiré este mensaje:',
        emergency: 'Esta es una alerta de emergencia.',
        urgent: 'Esta es una notificación urgente.'
      },
      'hi': {
        greeting: 'नमस्ते, यह एग्री-होप का एक महत्वपूर्ण संदेश है।',
        closing: 'आपके ध्यान के लिए धन्यवाद। सुरक्षित रहें।',
        repeat: 'मैं इस संदेश को दोहराऊंगा:',
        emergency: 'यह एक आपातकालीन अलर्ट है।',
        urgent: 'यह एक तत्काल अधिसूचना है।'
      },
      'sw': {
        greeting: 'Hujambo, hii ni ujumbe muhimu kutoka Agri-Hope.',
        closing: 'Asante kwa makini yenu. Muwe salama.',
        repeat: 'Nitarudia ujumbe huu:',
        emergency: 'Hii ni tahadhari ya dharura.',
        urgent: 'Hii ni arifa ya haraka.'
      }
    };
  }

  /**
   * Get language configuration
   * @param {string} languageCode - ISO language code
   */
  getLanguageConfig(languageCode) {
    const config = this.languageConfigs[languageCode];
    if (!config) {
      console.warn(`Language ${languageCode} not supported, falling back to English`);
      return this.languageConfigs['en'];
    }
    return config;
  }

  /**
   * Get appropriate voice for a language
   * @param {string} languageCode - ISO language code
   * @param {string} preferredVoice - Preferred voice type
   */
  getVoiceForLanguage(languageCode, preferredVoice = null) {
    const config = this.getLanguageConfig(languageCode);
    
    if (preferredVoice && config.voices.includes(preferredVoice)) {
      return preferredVoice;
    }
    
    return config.defaultVoice;
  }

  /**
   * Get Twilio-compatible language code
   * @param {string} languageCode - ISO language code
   */
  getTwilioLanguageCode(languageCode) {
    const config = this.getLanguageConfig(languageCode);
    return config.twilioLanguage;
  }

  /**
   * Format message with system phrases
   * @param {string} message - Main message content
   * @param {string} languageCode - ISO language code
   * @param {string} urgencyLevel - Urgency level (normal, urgent, emergency)
   */
  formatMessage(message, languageCode, urgencyLevel = 'normal') {
    const phrases = this.systemPhrases[languageCode] || this.systemPhrases['en'];
    let formattedMessage = '';

    // Add greeting
    formattedMessage += phrases.greeting + ' ';

    // Add urgency prefix if needed
    if (urgencyLevel === 'emergency') {
      formattedMessage += phrases.emergency + ' ';
    } else if (urgencyLevel === 'urgent') {
      formattedMessage += phrases.urgent + ' ';
    }

    // Add main message
    formattedMessage += message + ' ';

    // Add repeat section
    formattedMessage += phrases.repeat + ' ' + message + ' ';

    // Add closing
    formattedMessage += phrases.closing;

    return formattedMessage;
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages() {
    return Object.keys(this.languageConfigs).map(code => ({
      code: code,
      name: this.languageConfigs[code].name,
      rtl: this.languageConfigs[code].rtl
    }));
  }

  /**
   * Detect language from phone number country code (basic implementation)
   * @param {string} phoneNumber - E.164 formatted phone number
   */
  detectLanguageFromPhoneNumber(phoneNumber) {
    // Basic country code to language mapping
    const countryLanguageMap = {
      '+1': 'en',     // US/Canada
      '+44': 'en-gb', // UK
      '+33': 'fr',    // France
      '+34': 'es',    // Spain
      '+49': 'de',    // Germany
      '+39': 'it',    // Italy
      '+55': 'pt',    // Brazil
      '+91': 'hi',    // India
      '+254': 'sw',   // Kenya
      '+255': 'sw',   // Tanzania
      '+256': 'en',   // Uganda
      '+212': 'ar',   // Morocco
      '+213': 'ar',   // Algeria
      '+216': 'ar',   // Tunisia
      '+20': 'ar',    // Egypt
      '+966': 'ar',   // Saudi Arabia
    };

    for (const [countryCode, language] of Object.entries(countryLanguageMap)) {
      if (phoneNumber.startsWith(countryCode)) {
        return language;
      }
    }

    // Default to English if country not found
    return 'en';
  }

  /**
   * Validate if a language is supported
   * @param {string} languageCode - ISO language code
   */
  isLanguageSupported(languageCode) {
    return languageCode in this.languageConfigs;
  }

  /**
   * Get voice options for a specific language
   * @param {string} languageCode - ISO language code
   */
  getVoiceOptions(languageCode) {
    const config = this.getLanguageConfig(languageCode);
    return config.voices;
  }
}

module.exports = LanguageManager;
