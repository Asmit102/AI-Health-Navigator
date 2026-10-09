# 🩺 AI Health Navigator

### Your Personal AI-Powered Healthcare Companion

AI Health Navigator is an AI-powered healthcare platform designed to help patients understand their medical reports, explore health-related questions, prepare for doctor consultations, and manage essential medical information through a unified interface.

Built using the **MERN Stack and Google Gemini AI**, the platform provides dedicated experiences for patients and doctors, with an emphasis on accessibility, medication awareness, and patient-centered healthcare.

---

## 📌 Table of Contents

* [Overview](#-overview)
* [Key Features](#-key-features)
* [Technology Stack](#-technology-stack)
* [Application Modules](#-application-modules)
* [Project Structure](#-project-structure)
* [Getting Started](#-getting-started)
* [Environment Variables](#-environment-variables)
* [Deployment](#-deployment)
* [Security and Medical Disclaimer](#-security-and-medical-disclaimer)
* [Future Improvements](#-future-improvements)

---

## 🌟 Overview

Understanding medical information and preparing for healthcare consultations can be challenging. AI Health Navigator aims to make these tasks easier by combining AI-powered assistance with patient health information management.

The platform brings together conversational health assistance, medical report explanations, consultation preparation, and role-based access for patients and doctors.

### 🎯 Project Objectives

* Make medical information easier to understand.
* Help patients prepare meaningful questions for doctor consultations.
* Provide AI-assisted insights into uploaded medical reports.
* Improve awareness of medication interactions and potential health risks.
* Organize important patient health information in one place.
* Support a structured experience for both patients and doctors.

---

## ✨ Key Features

### 1. 💊 AI Drug Interaction and Medication Safety

* Analyze medication combinations for potential interactions.
* Consider available patient information, including reported allergies and chronic conditions.
* Present potential medication risks and relevant food precautions.
* Provide an interactive clinical risk score where supported by the implementation.

### 2. 🪪 Emergency Health Passport

* Organize essential medical information in a digital health passport.
* Make important health details easier to access during emergencies.
* Provide QR-based access and printable or exportable information where implemented.

### 3. 🤖 AI Health Assistant

* Conversational health assistance powered by Google Gemini AI.
* Support for English and Hindi interactions.
* Help users understand general health-related information.
* Identify potential emergency warning signs and direct users toward appropriate medical assistance.

### 4. 📄 Medical Report Explainer

* Upload supported laboratory reports in PDF format.
* Generate AI-assisted explanations of medical findings.
* Highlight relevant clinical values when available.
* Explain medical terminology in simpler language.
* Suggest questions that patients may discuss with their doctors.

### 5. 🩺 Consultation Preparation

* Generate specialty-specific questions before a medical appointment.
* Help patients organize their symptoms, concerns, and medical history.
* Encourage more structured conversations with healthcare professionals.

### 6. 📝 Visit Memory and Consultation Notes

* Organize consultation notes and important medical instructions.
* Summarize appointment information and follow-up recommendations.
* Help patients keep track of relevant healthcare information.

### 7. 👥 Role-Based Patient and Doctor Portals

* Dedicated interfaces for patients and doctors.
* Role-based access to supported application features.
* A centralized interface for healthcare-related interactions and information management.

---

## 🛠️ Technology Stack

| Technology       | Purpose                                |
| ---------------- | -------------------------------------- |
| React.js         | Frontend user interface                |
| Vite             | Frontend development and build tooling |
| Node.js          | Backend JavaScript runtime             |
| Express.js       | REST API and server-side routing       |
| MongoDB          | Database                               |
| Mongoose         | MongoDB object modeling                |
| Google Gemini AI | AI-powered healthcare assistance       |
| JWT              | Authentication, if configured          |
| Vercel           | Frontend deployment                    |
| Render           | Backend deployment                     |

*The table should reflect the technologies actually used in your implementation. Remove any technology that is not part of the project.*

---

## 🧩 Application Modules

| Module                    | Description                                   |
| ------------------------- | --------------------------------------------- |
| AI Health Assistant       | Conversational health-related assistance      |
| Medication Safety         | Medication interaction and risk awareness     |
| Medical Report Explainer  | AI-assisted medical report interpretation     |
| Consultation Preparation  | Doctor-visit question generation              |
| Visit Memory              | Consultation notes and follow-up information  |
| Emergency Health Passport | Essential medical information for emergencies |
| Patient Portal            | Patient-facing application features           |
| Doctor Portal             | Doctor-facing application features            |

---

## 📂 Project Structure

The repository is organized into separate frontend and backend applications.

```text
AI-Health-Navigator/
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── vercel.json
│
├── Backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── package.json
│   └── ...
│
└── README.md
```

*This is an illustrative structure. Update the folders and filenames to match your actual repository.*

---

## 🚀 Getting Started

Follow these steps to run AI Health Navigator locally.

### Prerequisites

Install the following tools before starting:

* Node.js and npm
* MongoDB local installation or a MongoDB Atlas database
* Google Gemini API key
* Git

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd AI-Health-Navigator
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with your repository's actual URL.

### 2. Set Up the Backend

Navigate to the backend directory:

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` directory and configure the required environment variables.

Start the development server:

```bash
npm run dev
```

If your backend does not define a `dev` script, use the appropriate script from `Backend/package.json`.

### 3. Set Up the Frontend

Open another terminal and navigate to the project directory:

```bash
cd Frontend
npm install
```

Create a `.env` file inside the `Frontend` directory:

```env
VITE_API_URL=http://localhost:4001/api
```

Start the frontend development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

**Note:** The backend URL and port must match your actual server configuration.

---

## 🔐 Environment Variables

### Backend Configuration

Create `Backend/.env`:

```env
PORT=4001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_supported_gemini_model
CLIENT_URL=http://localhost:5173
```

| Variable         | Description                                                        |
| ---------------- | ------------------------------------------------------------------ |
| `PORT`           | Port used by the backend server                                    |
| `MONGO_URI`      | MongoDB connection string                                          |
| `JWT_SECRET`     | Secret used for signing JWTs, if JWT authentication is implemented |
| `GEMINI_API_KEY` | API key for Google Gemini                                          |
| `GEMINI_MODEL`   | Gemini model identifier supported by your API configuration        |
| `CLIENT_URL`     | Frontend origin used for CORS configuration                        |

Use the exact environment variable names expected by your backend code.

### Frontend Configuration

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:4001/api
```

For production, replace the local API URL with your deployed backend API URL.

### ⚠️ Environment Variable Security

* Never commit `.env` files to GitHub.
* Add `.env` to `.gitignore`.
* Never expose database credentials or backend API secrets in frontend code.
* Only frontend variables intentionally exposed through Vite's `VITE_` prefix should be considered public.

---

## ☁️ Deployment

### 1. Deploy the Frontend to Vercel

1. Push your project to GitHub.

2. Open the [Vercel Dashboard](https://vercel.com/dashboard).

3. Import your GitHub repository.

4. Set the frontend root directory to `Frontend`.

5. Configure the following environment variable:

   ```env
   VITE_API_URL=https://your-backend-service.onrender.com/api
   ```

6. Verify the build command and output directory match your Vite configuration.

7. Deploy the application.

If your frontend uses client-side routing, ensure your Vercel configuration supports SPA route fallback.

### 2. Deploy the Backend to Render

1. Open the [Render Dashboard](https://render.com).

2. Create a new Web Service.

3. Connect your GitHub repository.

4. Set the root directory to `Backend`.

5. Configure the build command:

   ```bash
   npm install
   ```

6. Configure the start command:

   ```bash
   npm start
   ```

7. Add the required backend environment variables:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_MODEL=your_supported_gemini_model
   CLIENT_URL=https://your-frontend-project.vercel.app
   ```

8. Configure `PORT` according to your server implementation and hosting environment.

9. Deploy the backend and verify that the API is reachable.

10. Update the frontend's `VITE_API_URL` with the deployed backend API URL and redeploy the frontend if necessary.

### 3. Verify the Deployment

After deployment, verify the following:

* The frontend loads successfully.
* The backend starts without errors.
* MongoDB connects successfully.
* Frontend API requests reach the deployed backend.
* CORS allows requests from the deployed frontend.
* Gemini-powered features work with a valid API key and supported model.
* Authentication and role-based access behave as expected.

---

## 🔒 Security and Medical Disclaimer

AI Health Navigator is intended to support health information access and patient education. It is not a replacement for a qualified healthcare professional, clinical diagnosis, or emergency medical services.

* AI-generated medical explanations may be incomplete or incorrect.
* Medication interaction results should not replace professional medication review.
* Patients should consult a qualified healthcare professional before changing medications or treatment.
* Anyone experiencing a medical emergency should contact local emergency services immediately.
* Medical reports and patient information should be handled with appropriate privacy and security safeguards.

Clinical risk scores and medication recommendations should only be presented as validated clinical assessments if the underlying methodology has been appropriately validated.

---

## 🔮 Future Improvements

Potential areas for further development include:

* Integration with verified medication interaction databases.
* Improved medical report extraction and visualization.
* Secure medical record sharing with patient consent.
* Appointment scheduling and reminders.
* Multilingual accessibility improvements.
* Stronger audit logging and privacy controls.
* Clinician-reviewed medical information and safety validation.

---

## 👨‍💻 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement and test your changes.
4. Submit a pull request describing your improvements.

---

## 📄 License

Add a `LICENSE` file and specify the project's license before distributing the project for reuse.

---

**AI Health Navigator — Making healthcare information easier to understand through AI.** 🩺
