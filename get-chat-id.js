const https = require('https');

const BOT_TOKEN = "8215904112:AAH06c70RFrcJtI0QfIa0dygrzCIF3_3rFM";

console.log('🔍 Checking for chat ID...');

const options = {
    hostname: "api.telegram.org",
    path: `/bot${BOT_TOKEN}/getUpdates`,
    method: "GET"
};

const req = https.request(options, (res) => {
    let data = "";
    res.on("data", (d) => {
        data += d;
    });
    res.on("end", () => {
        try {
            const response = JSON.parse(data);
            console.log('📊 Response:', JSON.stringify(response, null, 2));
            
            if (response.result && response.result.length > 0) {
                const latestMessage = response.result[response.result.length - 1];
                const chatId = latestMessage.message.chat.id;
                const username = latestMessage.message.from.username;
                const firstName = latestMessage.message.from.first_name;
                
                console.log('\n✅ Chat ID Found!');
                console.log(`👤 User: ${firstName} (@${username})`);
                console.log(`🆔 Chat ID: ${chatId}`);
                console.log(`\n📝 Add this to your environment variables:`);
                console.log(`CHAT_ID=${chatId}`);
            } else {
                console.log('\n❌ No messages found.');
                console.log('💡 Please send a message to @PokemonGOlogin_bot first!');
                console.log('📱 Send any message like "hello" to the bot');
            }
        } catch (error) {
            console.error('❌ Error parsing response:', error.message);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Request error:', error.message);
});

req.end();
