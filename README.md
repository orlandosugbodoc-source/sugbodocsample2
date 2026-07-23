# SugboDoc Sample 2 — Outpatient Electronic Medical Record (EMR)

Welcome to **SugboDoc Sample 2**, a modern, web-based Electronic Medical Record (EMR) and Outpatient Clinic Management System built specifically for Philippine clinic workflows.

Hi! I'm **Orlando Fornolles Jr.**, a 3rd-Year BSIT Student at Southwestern University PHINMA and a Software Developer Intern at **SugboDoc Technologies Inc.**. I built this system using **React, TypeScript, Tailwind CSS**, and paired with **Google Antigravity AI** to craft a smooth, responsive, and reliable clinical workbench for healthcare professionals.

---

## 🌟 About The Project

In busy Philippine outpatient clinics, doctors, nurses, and administrative staff need a fast, intuitive tool to manage patient records, track daily queues, conduct consultations, and issue official documents without clutter or unnecessary delays. 

SugboDoc Sample 2 was designed to streamline these daily clinic operations into a clean, unified single-page application.

---

## 🚀 Key Features & Clinical Modules

- **📊 Dashboard Overview**: Real-time snapshot of daily outpatient traffic, appointment schedules, queue status, and active clinical staff.
- **📁 Patient Registry (MPI)**: Centralized master patient index with MRN search, allergy alerts, demographic profiles, and initial-fallback profile avatars.
- **⏳ Live OPD Queue & Caller**: Sequential ticket caller for walk-ins and appointments, categorized by triage priority (Regular, Senior/PWD, Urgent).
- **🩺 Doctor Consultation Workbench**:
  - Patient context bar with vital signs recording and automatic BMI calculation.
  - 4-quadrant **SOAP Notes** (Subjective, Objective, Assessment, Plan).
  - Searchable **ICD-10** diagnostic coding list.
  - Electronic prescription (Rx) writer.
- **📄 Medical Certificates & Document Generator**:
  - Built to international healthcare standards with clinic letterhead, diagnostic details, and official physician signature block.
  - Features a **live interactive editor** with a date picker for custom certificate issue dates and automated fit-to-work clearance date calculations.
- **🧪 Laboratory Orders**: Diagnostic test requests and result publishing workflow.
- **💳 Billing & Cashier**: Itemized invoicing, HMO/PhilHealth deductions, multiple payment methods (Cash, Card, e-Wallet), and BIR-compliant receipt view with custom Philippine Peso (`₱`) formatting.
- **🔒 Dynamic Role-Based Access (RBAC)**: Tailored navigation and feature access for 6 distinct personas: Doctor, Receptionist, Nurse, Lab Staff, Cashier, and Admin.

---

## 📅 Latest Updates & Improvements

### July 23, 2026

- **Brand & Title Realignment**: Set official application title to **SugboDoc Sample** in the browser tab and header navigation.
- **Company Entity Update**: Standardized company ownership references to **SugboDoc Technologies Inc.** across the project.
- **Reliable Patient State Sync**: Fixed active patient state handling to guarantee that consultation notes, SOAP records, and prescriptions always map to the correct patient chart.
- **Smooth View Transitions & Navigation**: Added subtle ease-out page transitions and automatic top scroll restoration whenever switching between modules.
- **Official Stethoscope "S" Logo Mark**: Configured the collapsed sidebar to display a clean, tightly cropped 17px emblem of the official SugboDoc stethoscope "S" logo.
- **Clean Flat Design Refinements**:
  - Removed heavy background tint fills from patient badges, allergy tags, and queue pills in favor of flat white containers (`bg-white`) with crisp 1px borders.
  - Replaced raw browser date picker icons with custom right-aligned Lucide calendar icons.
- **Interactive Medical Certificate Builder**:
  - Redesigned the medical certificate layout to follow clean international standards.
  - Added an interactive real-time editor allowing physicians to adjust the certificate issue date, rest days, diagnosis text, and signature details before printing.
- **Mobile Responsiveness**: Ensured data tables support smooth touch horizontal scrolling and modal dialogs fit within mobile screen bounds.

### July 22, 2026

- Integrated official SugboDoc Indigo (`#4454c3`) color palette.
- Added eye-comfort light theme with warm off-white canvas (`#f4f6f9`) to reduce glare during long clinic hours.
- Built profile photo avatars with initials fallback.
- Added custom Philippine Peso (`₱`) currency formatting.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript 5, Vite 6
- **Styling**: Tailwind CSS v4, Vanilla CSS Design System Tokens
- **Icons**: Lucide React Icons & Custom Philippine Peso SVG
- **AI Pair Programmer**: Google Antigravity AI
- **Utilities**: clsx, tailwind-merge, date-fns

---

## 💻 Local Setup & Running Locally

Setting up the project on your computer takes just a few steps:

```bash
# 1. Clone the repository
git clone https://github.com/orlandosugbodoc-source/sugbodocsample2.git

# 2. Navigate to project directory
cd sugbodocsample2

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Open your browser and navigate to `http://localhost:5174/` to test the application.

### Building for Production

To test or generate a production build:

```bash
npm run build
npm run preview
```

---

## ⌨️ Useful Keyboard Shortcuts

- `Ctrl + K` (or `Cmd + K`): Open the Global Command Palette to search patients or navigate to any module instantly.
- `ESC`: Close active modal dialogs, drawers, or search popups.

---

## 📄 License & Ownership

Copyright © 2026 **SugboDoc Technologies Inc.**. All Rights Reserved.
