/**
 * 💌 MESSAGE RAPIDE POUR HAMZA
 * Modifiez simplement la ligne ci-dessous et lancez le script !
 */

// 🎯 MODIFIEZ VOTRE MESSAGE ICI :
const MON_MESSAGE = "Coucou Hamza ! Comment ça va mon ami ? Loujain t'envoie plein de bisous et pense très fort à toi ! J'espère que tu vas super bien !";

// 🎤 CHOISISSEZ VOTRE VOIX :
const MA_VOIX = "alice"; // Options: alice, man, woman

// 🌍 LANGUE :
const MA_LANGUE = "fr-FR"; // fr-FR pour français

//========================================
// Ne modifiez pas le code ci-dessous
//========================================

require('dotenv').config();
const twilio = require('twilio');

async function envoyerMonMessage() {
  console.log('💌 Envoi de votre message personnalisé à Hamza');
  console.log('='.repeat(50));
  
  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const numeroHamza = process.env.HAMZA_PHONE;
    
    console.log(`📱 Numéro: ${numeroHamza}`);
    console.log(`💬 Message: "${MON_MESSAGE}"`);
    console.log(`🎤 Voix: ${MA_VOIX}`);
    console.log(`🌍 Langue: ${MA_LANGUE}\n`);
    
    // Créer le message vocal
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();
    
    response.pause({ length: 1 });
    
    response.say({
      voice: MA_VOIX,
      language: MA_LANGUE
    }, MON_MESSAGE);
    
    response.pause({ length: 1 });
    
    response.say({
      voice: MA_VOIX,
      language: MA_LANGUE
    }, "Gros bisous de la part de tout le monde ! Au revoir Hamza !");
    
    console.log('🚀 Envoi en cours...');
    
    const call = await client.calls.create({
      to: numeroHamza,
      from: process.env.TWILIO_PHONE_NUMBER,
      twiml: response.toString()
    });
    
    console.log('✅ MESSAGE ENVOYÉ !');
    console.log(`📞 Call SID: ${call.sid}`);
    console.log(`⏰ Statut: ${call.status}`);
    console.log('\n🎉 Hamza va recevoir votre message !');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

envoyerMonMessage();
