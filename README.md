# SugboDoc EMR - Electronic Medical Record System

A modern, production-grade frontend system for the **SugboDoc Electronic Medical Record (EMR)** and Outpatient Clinic Management platform, engineered for Philippine healthcare workflows.

Developed by **Orlando Fornolles Jr.** — Software Developer Intern at **SugboDoc Healthcare Systems** & 3rd-Year BS Information Technology Student at **Southwestern University PHINMA**, built with **Google Antigravity AI**.

---

## Task Update & Changelog

### July 22, 2026 — Design System, UI Polish, and Accessibility Enhancements

- **Official SugboDoc Branding**: Integrated official SugboDoc logo and updated color system to **SugboDoc Royal Indigo (`#4454c3`)** and periwinkle subtles (`#eef2ff`).
- **Eye-Comfort Light Theme**: Implemented an eye-protection light mode using a warm off-white canvas (`#f4f6f9`), soft charcoal text (`#1e293b`), and pastel alert badges to reduce monitor glare.
- **60-30-10 Color Architecture**: Enforced 60% canvas background, 30% structural slate typography/borders, and 10% focal indigo accents.
- **Pill-Shaped Design System**: Standardized all buttons, search triggers, role selectors, and tab controls to uniform pill-shaped boundaries (`rounded-full`).
- **Profile Photo Avatars**: Built `<Avatar />` component with automatic uppercase name initials fallback (`JD`, `SA`, `MS`) for missing image URLs.
- **Philippine Peso Localization**: Designed custom Philippine Peso (`₱`) SVG icon and Peso Receipt icon (`<PesoReceiptIcon />`) replacing generic dollar signs.
- **Critical Layout & Component Fixes**:
  - **Queue Ticket Badges**: Converted fixed 48px circles into auto-expanding pill containers (`px-4 py-2 rounded-full font-mono`) to prevent number clipping.
  - **Command Palette Focus Ring**: Eliminated blue box outlines around search inputs in modal headers.
  - **Patient Context Bar**: Restructured Consultation Hub patient header into a clean 2-row layout with inline demographic badges and a dedicated Chief Complaint block.
  - **Toast Notifications**: Applied solid 100% opaque dark slate background (`bg-slate-900 text-white shadow-2xl z-50`) to eliminate text bleed-through.
- **Responsive Mobile Drawer**: Verified mobile drawer navigation (`-translate-x-full md:translate-x-0`) with slide-in hamburger menu toggle and backdrop blur overlay.

---

## Key Clinical Workflows & Modules

- **Dashboard Overview**: Summary clinical metrics, real-time outpatient queue status, scheduled appointments, quick actions, and on-duty staff roster.
- **Patient Registry & Master Index**: Master patient index (MPI) search by MRN, name, or phone number, featuring demographic profiles, HMO insurance details, severe allergy alerts, and profile avatars with name initials fallback.
- **OPD Waiting Queue & Caller**: Real-time sequential queue caller ticket system supporting walk-in check-in, triage categories (Regular, Senior/PWD Priority, Urgent), and status tracking.
- **Doctor Consultation Workbench**: 3-pane clinical interface providing:
  - Patient context, vitals recording, and BMI calculation.
  - 4-quadrant SOAP clinical documentation (Subjective, Objective, Assessment, Plan).
  - ICD-10 diagnostic coding search and list management.
  - Electronic prescriber (Rx) workbench.
  - Official medical certificate generator.
- **Laboratory Orders**: Diagnostic request tracking and lab result publishing workflow.
- **Billing & Cashier**: Itemized invoicing, discount/HMO deduction breakdown, payment collection modal (Cash, Card, PhilHealth/HMO, e-Wallet), and BIR-compliant printable receipt viewer.
- **Reports & Clinical Census**: Daily outpatient census stats, top diagnostic codes, and clinic revenue tracking.
- **System Admin & Settings**: Clinic master data configuration, staff role assignment, and facility details.

---

## Technology Stack & Development Tools

- **Core Framework**: React 19, TypeScript 5, Vite 6
- **Styling**: Tailwind CSS v4, Vanilla CSS Design System Tokens
- **Icons**: Lucide React, Custom Philippine Peso SVG Icons
- **AI Pair Programmer & Coding Assistant**: Google Antigravity AI
- **Utilities**: Class Variance Authority / clsx / tailwind-merge, date-fns

---

## Design System & 60-30-10 Color Architecture

- **60% Dominant Canvas**: Soft off-white slate background (`#f4f6f9`) and crisp white card containers (`#ffffff`) designed for eye protection and monitor glare reduction.
- **30% Secondary Structure**: Deep charcoal typography (`#1e293b`), muted text (`#64748b`), and crisp 1px borders (`#e2e8f0`).
- **10% Focal Accent**: Official SugboDoc Royal Indigo (`#4454c3`) reserved for primary action buttons, active navigation pills, and focal highlights.
- **Alert Badges**: Pastel fills for clinical safety (`bg-rose-50` for allergies/unpaid, `bg-emerald-50` for completed/paid, `bg-sky-50` for info, `bg-amber-50` for warnings).

---

## Local Development & Setup

### Prerequisites

- Node.js (v18+ recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository and navigate to project directory
cd sugbodocsample2

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be available at `http://localhost:5174/`.

### Production Build

```bash
# Type check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Keyboard Shortcuts

- `Ctrl + K` or `Cmd + K`: Open Global Command Palette to search patients or switch modules.
- `ESC`: Close active modal dialog or command palette.

---

## License & Ownership

Copyright © 2026 **SugboDoc Healthcare Systems**. All Rights Reserved.
