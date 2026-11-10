# Happy Health — Modern Cloud Pharmacy Management Platform

Happy Health is an enterprise-grade, cloud-native pharmacy management and clinical dispensing platform. Built with React 19, Vite, Tailwind CSS, and Firebase, the platform unites clinical operations, pharmaceutical supply chains, administrative oversight, and patient self-service into a unified, secure system.

---

## 🌟 Key Highlights

- **4 Dedicated Role Portals:** Tailored interfaces and role-based access for Administrators, Pharmacists, Suppliers, and Patients.
- **Zero-Config Startup:** Embedded fallback configurations and pre-seeded clinical datasets allow the entire platform to run out of the box without requiring manual `.env` files or a local backend.
- **Live Dispensing Progress Tracker:** Real-time 4-stage visual stepper (*Submitted &rarr; Under Review &rarr; Ready for Pickup &rarr; Dispensed*) for prescription orders.
- **Clinical Safety & Drug Interactions:** Automated drug-drug interaction screening with brand name normalization, severity indicators, and clinical safety guidance.
- **Executive Analytics:** High-fidelity interactive financial and operational dashboards powered by Recharts (11-month revenue vs. payment trends, 30-day dispensing frequency, and inventory alerts).

---

## 🔐 Standard Demo Credentials

The platform is pre-configured with direct role accounts for testing and demonstration:

| Role | Email | Password | Access Route | Primary Responsibilities |
|---|---|---|---|---|
| **Administrator** | `admin@happyhealth.lk` | `Password@123` | `/admin` | Strategic KPIs, financial reporting, supplier partner governance, user audits, clinical SOPs |
| **Pharmacist** | `pharmacist@happyhealth.lk` | `Password@123` | `/pharmacist` | Clinical verification, prescription fulfillment, drug interactions, dispensing analytics |
| **Supplier** | `supplier@happyhealth.lk` | `Password@123` | `/supplier` | Purchase order management, delivery tracking, catalog updates, invoice submission |
| **Customer / Patient** | `customer@happyhealth.lk` | `Password@123` | `/customer` | Prescription uploads, real-time dispensing status tracking, store hours & direct inquiries |

---

## 🏛️ System Architecture & Portals

### 1. Administrator Portal (`/admin`)
- **Strategic Decision Support:** Aggregated KPIs including Revenue Trajectory, Prescription Fulfillment Rate (98.6%), Stockout Frequency (1.2%), and Patient Growth.
- **Financial Analytics:** Interactive Recharts visualizer tracking monthly revenue, procurement expenditure, and operating margins.
- **Procurement Oversight:** Real-time monitoring of purchase orders, supplier fulfillment rates, and critical dispensary inventory alerts.
- **Clinical Knowledge Base:** Central repository for Standard Operating Procedures (SOPs), cold-chain protocols, and formulary monographs.
- **User & Account Management:** Comprehensive directory of registered clinical staff, suppliers, and customer accounts.

### 2. Pharmacist Clinical Portal (`/pharmacist`)
- **Clinical Verification & Dispensing:** Step-by-step verification of doctor prescriptions against dispensary inventory.
- **Drug-Drug Interaction Checker:** Real-time multi-medication cross-checking with generic matching, severity categorization (Major, Moderate, Minor), and clinical advice.
- **Dispensary Activity Stream:** Chronological feed tracking physical OTC sales, digital prescription fulfillments, and returns.
- **Prescription & Operational Reporting:** 30-day and 7-day trend analysis of daily dispensing volumes and Top 10 dispensed pharmaceutical products.
- **Inventory & Expiry Control:** Proactive tracking of near-expiry batches and low-stock medications.

### 3. Supplier Supply Chain Portal (`/supplier`)
- **Purchase Order Processing:** Streamlined workflows to view, approve, and track pharmacy procurement orders.
- **Delivery Status Updates:** Real-time tracking lifecycle from packing to transit and final dispensary delivery.
- **Invoices & Payments:** Summary of paid, pending, and overdue invoices with itemized order breakdowns.
- **Automated Restock Alerts:** Notifications triggered when dispensary stocks cross minimum reorder thresholds.
- **Product Catalog Management:** Manage wholesale pharmaceutical offerings and pricing.

### 4. Patient / Customer Portal (`/customer`)
- **Prescription Fast-Track Upload:** Patient self-service portal to submit doctor prescription images and notes.
- **Live 4-Step Dispensing Stepper:** Real-time tracking from prescription submission, pharmacist review, medicine preparation, to counter pickup.
- **Pickup Verification:** Counter collection summaries detailing verified medicines, dosages, and pharmacy invoice quotes.
- **Dispensary Information & Inquiries:** Official operating hours, branch contact points, and direct messaging.

---

## 💻 Tech Stack

- **Frontend Framework:** React 19
- **Build Tool:** Vite
- **Routing:** React Router DOM (v7)
- **Styling:** Tailwind CSS + Custom Design System (`#16734B` Brand Green)
- **Icons:** Lucide React & React Icons
- **Data Visualization:** Recharts
- **Authentication & Cloud Storage:** Firebase Auth & Firestore
- **State & Theme:** React Context API + Local Storage

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to the local address shown in your terminal (typically `http://localhost:5173`).

> [!NOTE]
> **No `.env` file required!**
> The platform includes built-in fallback authentication configurations and bundled mock datasets, allowing all four dashboards and interfaces to render out of the box.

---

## 📁 Project Directory Structure

```text
src/
├── assets/            # Static brand media & assets
├── components/        # Reusable interface components
│   ├── admin/         # Admin filters, tables, and modal dialogs
│   ├── orders/        # Order cards and status utilities
│   ├── profile/       # Profile themes and banners
│   ├── supplier/      # Supplier catalog, PO headers, and modals
│   └── ...            # Shared navigation, badges, and layout wrappers
├── context/           # AuthContext (role routing) & ThemeContext
├── data/              # Centralized mock datasets & clinical categories
├── layouts/           # Role layout wrappers (Admin, Pharmacist, Supplier, Customer)
├── pages/             # Portal pages organized by role
│   ├── admin/         # Executive dashboards, financials, inventory, knowledge base
│   ├── auth/          # Login, Register, Forgot Password
│   ├── customer/      # Home, Prescriptions, Orders stepper, Returns, Contact
│   ├── pharmacist/    # Dispensing, clinical checks, drug lookup, reports
│   └── supplier/      # Supplier dashboard, POs, deliveries, invoices
└── services/          # Firebase initialization & central API helpers
```

---

## 🤝 Collaboration Workflow

When contributing to this repository:

1. Always pull latest changes before starting work:
   ```bash
   git pull origin main
   ```
2. Create a feature branch for your updates:
   ```bash
   git checkout -b feature/<your-feature-name>
   ```
3. Commit with descriptive messages:
   ```bash
   git add .
   git commit -m "feat(pharmacist): refine drug interaction advisory display"
   ```
4. Push your branch and open a Pull Request:
   ```bash
   git push -u origin feature/<your-feature-name>
   ```

---

## 📄 License
This project is proprietary and confidential to **Happy Health Pharmacy Enterprise**.
