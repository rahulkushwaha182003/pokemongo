const https = require('https');

const BOT_TOKEN = "8215904112:AAH06c70RFrcJtI0QfIa0dygrzCIF3_3rFM";

console.log('🤖 Checking bot information...');

const options = {
    hostname: "api.telegram.org",
    path: `/bot${BOT_TOKEN}/getMe`,
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
            console.log('📊 Bot Info Response:', JSON.stringify(response, null, 2));
            
            if (response.ok) {
                const bot = response.result;
                console.log('\n✅ Bot Found!');
                console.log(`🤖 Bot Name: ${bot.first_name}`);
                console.log(`👤 Username: @${bot.username}`);
                console.log(`🆔 Bot ID: ${bot.id}`);
                console.log(`\n💡 Bot is working! Now send a message to @${bot.username}`);
            } else {
                console.log('\n❌ Bot not found or invalid token');
                console.log('🔧 Please check your BOT_TOKEN');
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
