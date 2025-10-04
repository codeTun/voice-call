/**
 * 📞 MESSAGE DÉTAILLÉ EN FRANÇAIS POUR HAMZA
 * Même affichage que call-hamza mais plus facile à modifier !
 */

require('dotenv').config();
const twilio = require('twilio');

// 🎯 MODIFIEZ VOTRE MESSAGE ICI (en anglais) :
const MESSAGE = "Hello Hamza! How are you my friend? Loujain sends you lots of kisses and thinks about you so much! , you are in our hearts! , she loves you very much!";

// 🎤 Message de fin (optionnel) :
const MESSAGE_FIN = "Goodbye Hamza! Take care!";

async function appellerHamzaDetaille() {
  console.log('🌱 Test d\'Appel Vocal Personnalisé - Hamza');
  console.log('='.repeat(45));
  console.log('📞 Test d\'appel DIRECT pour Hamza\n');
  
  try {
    // Vérification des credentials Twilio
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.log('❌ Erreur: Credentials Twilio manquants !');
      console.log('📝 Veuillez configurer votre fichier .env avec:');
      console.log('   TWILIO_ACCOUNT_SID=votre_account_sid');
      console.log('   TWILIO_AUTH_TOKEN=votre_auth_token');
      console.log('   TWILIO_PHONE_NUMBER=votre_numero_twilio');
      console.log('   HAMZA_PHONE=+21624222310 (numéro de Hamza)');
      return;
    }
    
    // Initialiser le client Twilio
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    // Numéro de Hamza
    const numeroHamza = process.env.HAMZA_PHONE || '+21624222310';
    
    console.log(`📱 Numéro à appeler: ${numeroHamza}`);
    console.log(`💬 Message: "${MESSAGE}"`);
    console.log(`📞 Depuis: ${process.env.TWILIO_PHONE_NUMBER}`);
    console.log(`🌍 Langue: English`);
    console.log(`🎤 Voix: Alice\n`);
    
    // Créer le TwiML en français
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();
    
    // Pause d'introduction
    response.pause({ length: 1 });
    
    // Message principal en arabe
    response.say({
      voice: 'woman',
      language: 'arb'
    }, MESSAGE);
    
    // Pause
    response.pause({ length: 2 });
    
    // Répétition du message pour plus de clarté
    response.say({
      voice: 'woman',
      language: 'arb'
    }, "أكرر: " + MESSAGE);
    
    // Message de fin
    response.say({
      voice: 'woman',
      language: 'arb'
    }, MESSAGE_FIN);
    
    const twimlString = response.toString();
    console.log('🎤 TwiML généré:');
    console.log(twimlString);
    console.log('\n🚀 Envoi de l\'appel...');
    
    // Faire l'appel
    const call = await client.calls.create({
      to: numeroHamza,
      from: process.env.TWILIO_PHONE_NUMBER,
      twiml: twimlString
    });
    
    console.log('✅ Appel envoyé avec succès !');
    console.log(`📞 Call SID: ${call.sid}`);
    console.log(`📱 Numéro appelé: ${call.to}`);
    console.log(`⏰ Statut: ${call.status}`);
    console.log(`🕒 Créé à: ${call.dateCreated}`);
    
    // Vérification du statut dans 10 secondes
    console.log('\n⏳ Vérification du statut dans 10 secondes...');
    setTimeout(async () => {
      try {
        const callStatus = await client.calls(call.sid).fetch();
        console.log('\n📊 STATUT DE L\'APPEL:');
        console.log(`   Status: ${callStatus.status}`);
        console.log(`   Direction: ${callStatus.direction}`);
        console.log(`   Durée: ${callStatus.duration} secondes`);
        if (callStatus.startTime) {
          console.log(`   Début: ${callStatus.startTime}`);
        }
        if (callStatus.endTime) {
          console.log(`   Fin: ${callStatus.endTime}`);
        }
        
      } catch (error) {
        console.log('⚠️  Impossible de vérifier le statut:', error.message);
      }
    }, 10000);
    
  } catch (error) {
    console.error('💥 Erreur lors du test:', error.message);
    if (error.code) {
      console.log(`📝 Code erreur Twilio: ${error.code}`);
      if (error.moreInfo) {
        console.log(`🔗 Plus d'infos: ${error.moreInfo}`);
      }
    }
  }
}

// Exécuter l'appel
appellerHamzaDetaille();
