/**
 * 📞 MESSAGE SIMPLE EN FRANÇAIS POUR HAMZA
 * Modifiez juste la ligne MESSAGE ci-dessous !
 */

require('dotenv').config();
const twilio = require('twilio');

// 🎯 MODIFIEZ VOTRE MESSAGE ICI (en français) :
const MESSAGE = "Salut Hamza ! Comment ça va mon ami !";

// 🎤 Message de fin (optionnel) :
const MESSAGE_FIN = "À très bientôt mon cœur !";

async function appellerHamzaSimple() {
  console.log('💌 Appel Simple en Français pour Hamza');
  console.log('='.repeat(40));
  
  try {
    // Initialiser le client Twilio
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    // Numéro de Hamza
    const numeroHamza = process.env.HAMZA_PHONE || '+21624222310';
    
    console.log(`📱 Numéro: ${numeroHamza}`);
    console.log(` Message: "${MESSAGE}"`);
    console.log(`🌍 Langue: Français`);
    console.log(`� Voix: Alice\n`);
    
    // Vérification credentials
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.log('❌ Erreur: Credentials Twilio manquants dans .env');
      return;
    }
    
    // Créer le TwiML en français
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();
    
    // Pause d'introduction
    response.pause({ length: 1 });
    
    // Message principal en français
    response.say({
      voice: 'alice',
      language: 'fr-FR'
    }, MESSAGE);
    
    // Pause
    response.pause({ length: 2 });
    
    // Message de fin
    response.say({
      voice: 'alice',
      language: 'fr-FR'
    }, MESSAGE_FIN);
    
    console.log('🚀 Envoi de l\'appel en français...');
    
    // Faire l'appel
    const call = await client.calls.create({
      to: numeroHamza,
      from: process.env.TWILIO_PHONE_NUMBER,
      twiml: response.toString()
    });
    
    console.log('✅ Appel en français envoyé !');
    console.log(`📞 Call SID: ${call.sid}`);
    console.log(` Numéro appelé: ${call.to}`);
    console.log(`⏰ Statut: ${call.status}`);
    console.log('\n🎉 Hamza va recevoir votre message en français !');
    
  } catch (error) {
    console.error('💥 Erreur:', error.message);
    if (error.code) {
      console.log(`📝 Code erreur Twilio: ${error.code}`);
    }
  }
}

// Exécuter l'appel
appellerHamzaSimple();
