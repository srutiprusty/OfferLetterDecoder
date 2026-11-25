# OfferLens – AI-Powered Offer Letter Decoder 📄

**Understand your job offer before you accept it.**

OfferLens is an AI-powered full-stack web application that helps candidates understand their offer letters by extracting salary breakdowns, estimating monthly in-hand salary, and identifying potentially risky employment clauses.

Instead of manually going through lengthy offer letters, users can upload a PDF and get a simplified, structured analysis of their compensation and employment terms.

## 🚀 Key Features

- **PDF Upload:** Upload offer letters in PDF format for automated analysis.
- **AI-Powered Extraction:** Uses Google's Gemini API to extract important information from offer letters.
- **Salary Breakdown:** Identifies CTC, fixed pay, variable pay, basic salary, HRA, allowances, employer PF, gratuity, and other components.
- **In-Hand Salary Estimation:** Calculates estimated monthly take-home salary based on extracted compensation details and applicable tax assumptions.
- **Risky Clause Detection:** Identifies important employment clauses, including:
  - Employment bond
  - Notice period
  - Variable pay conditions
  - Joining bonus clawback
- **Simplified Explanations:** Converts complex employment terms into understandable information.
- **Structured Results:** Presents extracted information in an organized format for easier decision-making.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| AI Integration | Google Gemini API |
| PDF Processing | pdf-parse |
| File Upload | Multer |
| API Communication | REST APIs |


## ⚙️ Getting Started

Follow these instructions to run OfferLens locally.

### 1. Clone the Repository

```bash
git clone https://github.com/srutiprusty/OfferLetterDecoder.git
cd OfferLetterDecoder
```

### 2. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

### 3. Backend Setup

Open another terminal:

```bash
cd server
npm install
```

Create a `.env` file inside the server directory:

```env
PORT=8000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
```

Start the backend:

```bash
npm run dev
```

Make sure to configure the environment variables with your own credentials.

## 📊 Example Analysis

An uploaded offer letter can produce structured information such as:

**Salary Analysis**
- Annual CTC
- Fixed and variable compensation
- Basic salary and HRA
- Employer PF and gratuity
- Estimated monthly in-hand salary

**Employment Clause Analysis**
- Employment bond amount and duration
- Notice period requirements
- Variable pay conditions
- Joining bonus recovery conditions

**Tax Analysis**
- Applicable tax regime assumptions
- Estimated taxable income
- Estimated annual income tax
- Monthly TDS estimate

*Note: Salary calculations are estimates based on extracted information and configured tax assumptions. Actual take-home salary may differ depending on individual circumstances and employer-specific deductions.*


## 🎯 Project Objective

OfferLens aims to make employment decisions more transparent by helping candidates understand what an offer letter actually contains.

The goal is simple: **Know your salary. Understand your clauses. Make informed career decisions.**

