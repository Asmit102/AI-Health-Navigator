# AI Health Navigator 🩺✨
> Next-Generation Clinical AI Patient Portal & Multi-Role EHR Platform built with the MERN Stack and Google Gemini AI.

---

## 🌟 Key Features

1. **AI Drug Interaction & Medication Safety Engine** *(New & Standout)*
   - Evaluates multi-drug prescriptions against personal allergies and chronic conditions.
   - Computes an interactive **Clinical Risk Score (0-100)** with major/moderate interaction alerts and food precautions.
   - **Emergency Health Passport & QR Badge**: Digital wallet medical pass with one-click print/export for emergency responders.
2. **AI Health Assistant (Clinical Triage & Inquiry)**
   - Conversational AI powered by Google Gemini with multi-language toggle (English / Hindi).
   - Built-in emergency red-flag triage shield.
3. **Medical Report Explainer**
   - Upload laboratory PDF reports and receive plain-language summaries with highlighted clinical values and doctor questions.
4. **Consultation Preparation & Question Generator**
   - Auto-generates 4 high-yield specialty-specific consultation questions before appointments.
5. **Visit Memory & Consultation Transcription Notes**
   - Summarizes doctor appointments, medication instructions, and follow-ups.
6. **Dual Portal Experience**: Dedicated role-based portals for **Patients** and **Doctors**.

---

## 🚀 Deployment Guide (Vercel + Cloud Hosting)

### 1. Deploy Frontend to Vercel
1. Push this repository to your GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
3. Select your GitHub repository.
4. Set **Root Directory** to `Frontend`.
5. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://your-backend-service.onrender.com/api` (or your deployed backend API URL).
6. Click **Deploy**. Vercel will automatically build the React Vite app with SPA routing configured via `Frontend/vercel.json`.

---

### 2. Deploy Backend to Render (Free & Instant)
1. Go to [Render Dashboard](https://render.com) and click **"New Web Service"**.
2. Connect your GitHub repository.
3. Set **Root Directory** to `Backend`.
4. Configure:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add **Environment Variables**:
   - `PORT` = `4001`
   - `MONGO_URI` = `mongodb+srv://...`
   - `JWT_SECRET` = `your_jwt_secret`
   - `GEMINI_API_KEY` = `your_gemini_api_key`
   - `GEMINI_MODEL` = `gemini-3.7-flash`
   - `CLIENT_URL` = `https://your-frontend-project.vercel.app`
6. Click **Create Web Service**.

---

## 💻 Local Development Setup

### Backend
```bash
cd Backend
npm install
npm run dev
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```
