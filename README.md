# SugboDoc Sample - Electronic Medical Record System

A modern, production-grade frontend application for the **SugboDoc Electronic Medical Record (EMR)** and Outpatient Clinic Management platform, designed specifically for Philippine healthcare workflows.

Created by **Orlando Fornolles Jr.** — Software Developer Intern at **SugboDoc Technologies Inc.** and 3rd-Year BSIT Student at Southwestern University PHINMA, paired with **Google Antigravity AI**.

---

## Task Update & Changelog

### July 23, 2026 — Enterprise Refinements, Real-Time Editing & Design System Overhaul

- **Website Title Realignment**: Set official site title to `SugboDoc Sample` in `index.html` and header breadcrumb navigation.
- **State Synchronization & Deep Bug Audit**: Fixed `setActivePatientId(id)` in `EMRContext.tsx` to maintain 100% active patient & encounter synchronization across all modules, preventing clinical notes from mapping to incorrect patient records.
- **Smooth View Transitions & Scroll Restoration**: Integrated dynamic key transitions (`animate-in fade-in slide-in-from-bottom-1 duration-150 ease-out`) in `App.tsx` and automated top scroll restoration (`scrollTo({ top: 0 })`) upon module switches.
- **Official Stethoscope "S" Logo Mark**: Rendered the official SugboDoc stethoscope "S" emblem in collapsed sidebar mode with exact 17px cropping to isolate the mark cleanly.
- **Dynamic Role-Based Access Control (RBAC)**: Exported `roleAllowedModules` in `EMRContext.tsx` to dynamically filter sidebar navigation links for 6 user personas (`doctor`, `receptionist`, `nurse`, `lab_staff`, `cashier`, `admin`).
- **Minimalist Login & Sign Out Modal**: Implemented a centered Demo Login Screen with top SugboDoc logo placement, alongside a clean Sign Out confirmation modal.
- **Hand-Crafted Enterprise Design System Overhaul**:
  - Stripped background tint fills (`bg-blue-50`, `bg-rose-50`, `bg-slate-100`) from pills, tags, badges, and patient headers in favor of crisp flat white containers (`bg-white`) with 1px outline borders.
  - Replaced raw browser webkit date picker icons (`📅`) with custom right-aligned Lucide `<Calendar />` icons across date inputs.
  - Standardized component geometry to clean, modern `rounded-lg` borders and 2px focus rings (`#4454c3`).
- **International Medical Certificate & Live Editor**:
  - Redesigned `CertificatesModule.tsx` to follow international healthcare document standards (clean letterhead, clinical ICD-10 diagnosis section, and signature block).
  - Added an **interactive real-time editor** with an adjustable **Certificate Issue Date** picker and automated fit-to-work clearance date recalculation.
  - Updated the physician signature area placeholder (`Signature over Printed Name`).
- **Mobile Responsiveness Enforcement**: Enforced touch-scrollable data tables (`min-w-[600px] overflow-x-auto`) and viewport-constrained modal cards (`max-w-[calc(100vw-1.5rem)]`).

### July 22, 2026 — Design System, UI Polish, and Accessibility Enhancements

- **Official SugboDoc Branding**: Integrated official SugboDoc logo and updated color system to **SugboDoc Royal Indigo (`#4454c3`)** and periwinkle subtles (`#eef2ff`).
- **Eye-Comfort Light Theme**: Implemented an eye-protection light mode using a warm off-white canvas (`#f4f6f9`), soft charcoal text (`#1e293b`), and pastel alert badges to reduce monitor glare.
- **60-30-10 Color Architecture**: Enforced 60% canvas background, 30% structural slate typography/borders, and 10% focal indigo accents.
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
- **Clean Flat Badges**: Flat white background containers (`bg-white`) with thin 1px outline borders (`border-slate-200`) replacing soft background tint fills.

---

## Local Development & Setup

### Prerequisites

- Node.js (v18+ recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository and navigate to project directory
git clone https://github.com/orlandosugbodoc-source/sugbodocsample2.git
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

Copyright © 2026 **SugboDoc Technologies Inc.**. All Rights Reserved.
