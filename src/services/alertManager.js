/**
 * Alert Management System
 * Handles different types of alerts (health, agriculture, weather)
 * and manages message templates
 */

class AlertManager {
  constructor() {
    this.alertTypes = {
      HEALTH: 'health',
      AGRICULTURE: 'agriculture',
      WEATHER: 'weather',
      EMERGENCY: 'emergency'
    };

    // Predefined message templates for different alert types
    this.messageTemplates = {
      health: {
        en: {
          fever: "Health Alert: High fever detected. Please check your temperature and consult a healthcare provider if it exceeds 38°C (100.4°F). Stay hydrated and rest.",
          bloodPressure: "Health Alert: Abnormal blood pressure detected. Please measure your blood pressure again and seek medical attention if readings remain high.",
          medication: "Medication Reminder: It's time to take your prescribed medication. Please follow your doctor's instructions.",
          checkup: "Health Reminder: You have a scheduled health checkup. Please visit your healthcare provider as planned."
        },
        fr: {
          fever: "Alerte Santé: Fièvre élevée détectée. Vérifiez votre température et consultez un professionnel de santé si elle dépasse 38°C. Restez hydratée et reposez-vous.",
          bloodPressure: "Alerte Santé: Tension artérielle anormale détectée. Mesurez votre tension à nouveau et consultez un médecin si les valeurs restent élevées.",
          medication: "Rappel Médicament: Il est temps de prendre vos médicaments prescrits. Suivez les instructions de votre médecin.",
          checkup: "Rappel Santé: Vous avez un contrôle médical programmé. Rendez-vous chez votre professionnel de santé comme prévu."
        },
        ar: {
          fever: "تنبيه صحي: تم اكتشاف حمى عالية. يرجى فحص درجة حرارتك واستشارة مقدم الرعاية الصحية إذا تجاوزت 38 درجة مئوية. حافظي على الترطيب والراحة.",
          bloodPressure: "تنبيه صحي: تم اكتشاف ضغط دم غير طبيعي. يرجى قياس ضغط الدم مرة أخرى وطلب المساعدة الطبية إذا ظلت القراءات مرتفعة.",
          medication: "تذكير بالدواء: حان وقت تناول الأدوية الموصوفة لك. يرجى اتباع تعليمات طبيبك.",
          checkup: "تذكير صحي: لديك فحص صحي مجدول. يرجى زيارة مقدم الرعاية الصحية كما هو مخطط."
        }
      },
      agriculture: {
        en: {
          irrigation: "Agricultural Alert: Your crops need watering. Soil moisture levels are low. Please check your irrigation system and water your plants.",
          pesticide: "Pest Alert: Pest activity detected in your area. Consider applying organic pesticide or consulting an agricultural extension officer.",
          harvest: "Harvest Alert: Your crops are ready for harvest. Check your fields and begin harvesting to prevent crop loss.",
          weather: "Weather Alert: Adverse weather conditions expected. Protect your crops and livestock. Take necessary precautions.",
          fertilizer: "Fertilizer Reminder: It's time to apply fertilizer to your crops for optimal growth."
        },
        fr: {
          irrigation: "Alerte Agricole: Vos cultures ont besoin d'eau. Les niveaux d'humidité du sol sont bas. Vérifiez votre système d'irrigation et arrosez vos plantes.",
          pesticide: "Alerte Parasitaire: Activité de parasites détectée dans votre région. Envisagez d'appliquer un pesticide organique ou consultez un agent de vulgarisation agricole.",
          harvest: "Alerte Récolte: Vos cultures sont prêtes pour la récolte. Vérifiez vos champs et commencez la récolte pour éviter les pertes.",
          weather: "Alerte Météo: Conditions météorologiques défavorables attendues. Protégez vos cultures et votre bétail. Prenez les précautions nécessaires.",
          fertilizer: "Rappel Engrais: Il est temps d'appliquer de l'engrais à vos cultures pour une croissance optimale."
        },
        ar: {
          irrigation: "تنبيه زراعي: تحتاج محاصيلك إلى الري. مستويات رطوبة التربة منخفضة. يرجى فحص نظام الري وسقي النباتات.",
          pesticide: "تنبيه آفات: تم اكتشاف نشاط آفات في منطقتك. فكري في تطبيق مبيد حشري عضوي أو استشارة مرشد زراعي.",
          harvest: "تنبيه حصاد: محاصيلك جاهزة للحصاد. افحصي حقولك وابدئي الحصاد لمنع خسارة المحصول.",
          weather: "تنبيه طقس: ظروف جوية سيئة متوقعة. احمي محاصيلك وماشيتك. اتخذي الاحتياطات اللازمة.",
          fertilizer: "تذكير سماد: حان وقت تطبيق السماد على محاصيلك للنمو الأمثل."
        }
      },
      weather: {
        en: {
          storm: "Weather Emergency: Severe storm approaching your area. Secure your property, bring animals to shelter, and stay indoors.",
          drought: "Drought Alert: Extended dry period expected. Conserve water, adjust irrigation schedules, and protect your crops.",
          flood: "Flood Warning: Heavy rainfall may cause flooding. Move to higher ground and protect your livestock and equipment.",
          frost: "Frost Warning: Freezing temperatures expected tonight. Cover sensitive plants and protect your crops from frost damage."
        },
        fr: {
          storm: "Urgence Météo: Tempête sévère approchant votre région. Sécurisez vos biens, mettez les animaux à l'abri et restez à l'intérieur.",
          drought: "Alerte Sécheresse: Période sèche prolongée attendue. Économisez l'eau, ajustez les horaires d'irrigation et protégez vos cultures.",
          flood: "Alerte Inondation: De fortes pluies peuvent causer des inondations. Dirigez-vous vers un terrain plus élevé et protégez votre bétail et équipement.",
          frost: "Alerte Gel: Températures de gel attendues ce soir. Couvrez les plantes sensibles et protégez vos cultures du gel."
        },
        ar: {
          storm: "طوارئ جوية: عاصفة شديدة تقترب من منطقتك. أمني ممتلكاتك، أدخلي الحيوانات إلى المأوى، وابقي في المنزل.",
          drought: "تنبيه جفاف: فترة جفاف ممتدة متوقعة. وفري في الماء، اعدلي جداول الري، واحمي محاصيلك.",
          flood: "تحذير فيضان: أمطار غزيرة قد تسبب فيضانات. انتقلي إلى أرض مرتفعة واحمي ماشيتك ومعداتك.",
          frost: "تحذير صقيع: درجات حرارة متجمدة متوقعة الليلة. غطي النباتات الحساسة واحمي محاصيلك من أضرار الصقيع."
        }
      }
    };
  }

  /**
   * Get alert message based on type, subtype, and language
   * @param {string} alertType - Type of alert (health, agriculture, weather)
   * @param {string} subType - Specific alert subtype
   * @param {string} language - Language code
   * @param {Object} customData - Optional custom data to personalize message
   */
  getAlertMessage(alertType, subType, language = 'en', customData = {}) {
    try {
      const template = this.messageTemplates[alertType]?.[language]?.[subType];
      
      if (!template) {
        // Fallback to English if language not available
        const fallbackTemplate = this.messageTemplates[alertType]?.['en']?.[subType];
        if (!fallbackTemplate) {
          throw new Error(`Alert template not found for ${alertType}/${subType}`);
        }
        console.warn(`Using English fallback for ${alertType}/${subType} in ${language}`);
        return this.personalizeMessage(fallbackTemplate, customData);
      }
      
      return this.personalizeMessage(template, customData);
    } catch (error) {
      console.error('Error getting alert message:', error);
      return `Alert: Please check your ${alertType} status and take appropriate action.`;
    }
  }

  /**
   * Personalize message with custom data
   * @param {string} template - Message template
   * @param {Object} customData - Custom data to insert
   */
  personalizeMessage(template, customData) {
    let message = template;
    
    // Replace placeholders with custom data
    if (customData.farmerName) {
      message = `Hello ${customData.farmerName}, ` + message;
    }
    
    if (customData.location) {
      message = message.replace(/your area/g, customData.location);
    }
    
    if (customData.cropType) {
      message = message.replace(/your crops/g, `your ${customData.cropType}`);
    }
    
    if (customData.urgencyLevel === 'high') {
      message = 'URGENT: ' + message;
    }
    
    return message;
  }

  /**
   * Create a custom alert
   * @param {string} alertType - Type of alert
   * @param {string} phoneNumber - Recipient phone number
   * @param {string} message - Custom message
   * @param {string} language - Language code
   * @param {Object} options - Additional options
   */
  createCustomAlert(alertType, phoneNumber, message, language = 'en', options = {}) {
    return {
      id: this.generateAlertId(),
      type: alertType,
      phoneNumber: phoneNumber,
      message: message,
      language: language,
      urgencyLevel: options.urgencyLevel || 'medium',
      createdAt: new Date().toISOString(),
      status: 'pending',
      retryCount: 0,
      maxRetries: options.maxRetries || 3
    };
  }

  /**
   * Generate a unique alert ID
   */
  generateAlertId() {
    return 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get available alert types and subtypes
   */
  getAvailableAlerts() {
    const alerts = {};
    for (const [alertType, templates] of Object.entries(this.messageTemplates)) {
      alerts[alertType] = Object.keys(templates.en || {});
    }
    return alerts;
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages() {
    const languages = new Set();
    for (const alertType of Object.values(this.messageTemplates)) {
      Object.keys(alertType).forEach(lang => languages.add(lang));
    }
    return Array.from(languages);
  }
}

module.exports = AlertManager;
