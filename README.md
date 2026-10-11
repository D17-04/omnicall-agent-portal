# OmniCall — Call Centre Agent Portal

An enterprise-grade, front-end application built for contact centre agents, support specialists, and supervisors. Designed and developed as a senior front-end take-home assignment demonstrating modern React architecture, responsive design systems, accessibility, and real-time ACD (Automatic Call Distribution) telephony workflows.

---

## 🚀 Live Features

### 1. Agent Authentication & Shift Initialization
* **Mock Agent Sign-In**: Realistic login flow supporting custom credentials or a one-click demo login (`alex.rivera@omnicall.io`).
* **Session Persistence**: Authentication state and station preferences persist in `localStorage`.

### 2. Real-Time Agent Dashboard & Telephony Presence
* **Status Switcher**: Toggle real-time presence between `Available`, `On Call`, `On Break`, and `Offline` with live timestamps and colored visual indicators.
* **Daily Performance Metrics (KPIs)**:
  * **Calls Handled Today**: Dynamically calculated from completed call logs.
  * **Average Handle Time (AHT)**: Formatted in `mm:ss` or `hh:mm:ss`, benchmarked against shift targets.
  * **Missed / Abandoned Calls**: Tracked in real time.
  * **Customer Satisfaction (CSAT)**: Percentage of positive post-call ratings (4–5 stars).
  * **First Call Resolution (FCR)**: Automated resolution tracking.
* **ACD Queue Snapshot**: Embedded preview of waiting callers with immediate "Accept" actions directly from the dashboard.
* **Inbound Call Simulator**: One-click test button to inject realistic randomized callers into the ACD queue with live wait-time clocks.

### 3. Incoming Call Queue Management
* **Dynamic Wait Clocks**: Real-time ticker counting up wait seconds for every customer in queue.
* **Priority Escalation**: Visual badges distinguishing `Critical`, `High`, `Normal`, and `Low` priority callers with SLA breach warnings (`SLA Risk` when wait time exceeds threshold).
* **Sorting & Filtering**: Sort callers by longest wait time or priority score; filter by ACD department queue (`Enterprise VIP Support`, `Billing & Accounts`, `Technical Support`, `General Inquiries`).
* **Pre-Call Customer Inspection**: Inspect customer profiles and tickets before answering.

### 4. Active Call Console & Wrap-Up Workflow
* **Synchronized Call Clock**: Live duration timer tracking active talk time; pauses during Hold states.
* **Audio Waveform Visualizer**: Simulated real-time speech activity monitor.
* **Softphone Controls**:
  * **Mute**: Toggles agent microphone state with prominent visual indicators.
  * **Hold**: Places customer on hold with music status and timer pause.
  * **Transfer**: Transfer modal mock for forwarding calls.
  * **End Call**: Concludes the audio session and transitions into the post-call wrap-up state.
* **Customer Dossier**: Displays customer company, tier plan, sentiment badge, contact details, account notes, and recent support tickets.
* **Call Logging & Disposition**:
  * Real-time note taking field with character count.
  * Mandatory call disposition dropdown (`Issue Resolved`, `Escalated to Tier 2`, `Follow-Up Needed`, `Callback Scheduled`, `Billing / Invoice Adjusted`, `Wrong Number`, `Spam / Robocall`).
  * **Save and Close**: Validates disposition, logs call record into history, updates the customer's interaction timeline, and resets agent status to `Available`.
* **Persistent Active Call Banner**: When an active call is ongoing, navigating to other tabs displays a persistent top banner with duration, hold/mute indicators, and a one-click "Return to Active Call" action.

### 5. Call History & Audit Logs
* **Search & Filters**: Real-time keyword search across customer names, phone numbers, queue names, dispositions, and notes.
* **Status & Priority Filters**: Filter by `Completed` vs. `Missed` calls and priority tiers.
* **Sortable Columns**: Sort by Date & Time, Customer Name, Duration, Priority, or CSAT Rating.
* **CSV Export**: One-click export downloading formatted `.csv` reports of call logs.

### 6. Customer Detail Drawer (Slide-Over Dossier)
* **Full Context Anywhere**: Click any customer name in the queue, active call screen, or history table to open a slide-over dossier.
* **Three Dossier Tabs**:
  * **Past Interactions**: Historical timeline of calls, chats, and emails with timestamps, handling agents, and outcomes.
  * **Support Tickets**: Open, pending, and resolved support tickets with priority and category tags.
  * **Account Notes**: Internal agent advisory notes, lifetime value (LTV), customer join date, and contract tier.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + Vite 6 |
| **Language** | TypeScript (Strict mode enabled) |
| **Styling** | Tailwind CSS v3 (Enterprise slate/teal design system) |
| **Iconography** | `lucide-react` (Accessible, crisp SVG icons) |
| **State Management** | React Context API (`CallCenterContext`) with custom hooks |
| **Persistence** | Browser `localStorage` (Preserves test state across refreshes) |
| **Data Models** | Full TypeScript definitions (`Agent`, `CallRecord`, `Customer`, `CustomerTicket`) |

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── active-call/
│   │   ├── ActiveCallBanner.tsx   # Persistent alert banner during active calls
│   │   ├── CallControls.tsx       # Mute, Hold, Transfer, End Call buttons
│   │   ├── CallTimer.tsx          # Duration timer & simulated audio waveform
│   │   └── DispositionForm.tsx    # Notes input, disposition selector & Save and Close
│   ├── common/
│   │   ├── Badge.tsx              # Priority, status & sentiment pills
│   │   ├── Button.tsx             # Accessible button variants (primary, success, danger)
│   │   ├── Card.tsx               # Standard UI card container
│   │   ├── EmptyState.tsx         # Zero-data feedback with call-to-action
│   │   └── LoadingState.tsx       # Animated skeleton loaders
│   ├── customer/
│   │   ├── CustomerDrawer.tsx     # Slide-over panel for customer context
│   │   └── TicketList.tsx         # Open & resolved support tickets
│   ├── dashboard/
│   │   ├── QuickQueuePreview.tsx  # Live waiting callers snapshot
│   │   └── StatCard.tsx           # KPI metric card (Calls, AHT, CSAT, Missed)
│   ├── history/
│   │   ├── CallFilters.tsx        # Search input, status & priority dropdowns
│   │   └── CallHistoryTable.tsx   # Sortable call log table with CSV export
│   ├── layout/
│   │   ├── Header.tsx             # App bar with agent status toggle & simulator
│   │   ├── Layout.tsx             # App shell with banner, nav, and drawer
│   │   └── Navigation.tsx         # Responsive tab bar with live queue badges
│   └── queue/
│       ├── QueueItem.tsx          # Caller card with SLA risk & Accept Call
│       └── QueueList.tsx          # Full ACD queue list with filters & sorting
├── context/
│   └── CallCenterContext.tsx      # Global state provider (agent, queue, active call, history)
├── data/
│   ├── calls.json                 # 16+ realistic call logs with notes and CSAT
│   ├── customers.json             # 12+ customer dossiers with tickets and timelines
│   └── initialQueue.json          # 5 initial queued callers with wait times
├── hooks/
│   ├── useCallCenter.ts           # Context consumer hook
│   └── useTimer.ts                # Interval-driven seconds timer hook
├── pages/
│   ├── ActiveCallPage.tsx         # Softphone console, customer card & disposition
│   ├── DashboardPage.tsx          # Shift metrics, presence switcher & queue snapshot
│   ├── HistoryPage.tsx            # Auditable call history with search and export
│   └── LoginPage.tsx              # Mock agent login screen
├── types/
│   └── index.ts                   # TypeScript interfaces and union types
├── utils/
│   ├── formatters.ts              # Duration, date, phone, and badge style formatters
│   └── storage.ts                 # Safe localStorage serialization utilities
├── App.tsx                        # Tab view router and auth gate
├── main.tsx                       # React DOM root entrypoint
└── index.css                      # Tailwind base & custom scrollbar styles
```

---

## 💻 Setup & Running Locally

### Prerequisites
* **Node.js**: v18.0.0 or later (Tested on Node v24.18.0)
* **npm**: v9.0.0 or later (Tested on npm 11.16.0)

### Quick Start

1. Clone or open the repository directory:
   ```bash
   cd omnicall-agent-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser at [http://localhost:3000](http://localhost:3000) (or the port specified in terminal).

5. To verify production build and type checking:
   ```bash
   npm run build
   ```

---

## 💡 Assumptions & Design Decisions

1. **No External Backend**: All state changes (accepting calls, modifying notes, logging dispositions, status switching) mutate local state and automatically serialize to browser `localStorage`.
2. **Realistic Contact Center Workflow**:
   * An agent cannot take multiple concurrent calls (enforces single active call constraint).
   * In-call notes can be jotted down while the call is live.
   * Clicking **End Call** transitions the session into "Wrap-Up Mode" so the agent can finalize notes and select a disposition.
   * **Save and Close** enforces selecting a disposition (e.g. `Issue Resolved`, `Escalated`, etc.) before clearing the active call and returning the agent to `Available`.
3. **Responsive & Accessible**:
   * Desktop-first contact center workstation view with full support for mobile tablets.
   * Keyboard accessible with standard `focus:ring-2` highlights and screen-reader accessible attributes (`role="status"`, `aria-pressed`, `aria-label`).
   * High-contrast typography (slate-800 text against slate-50/white backgrounds).
4. **Interactive Testing Tools**:
   * An explicit **"Simulate Inbound Call"** action is available in both the header and queue to easily test the incoming call workflow without waiting.

---

## 🤖 AI Tools Used

In accordance with the assignment brief, this section lists the AI tooling utilized:

1. **Google DeepMind Antigravity Coding Assistant (Gemini 3.8)**:
   * Architecture planning, folder structure design, and schema modeling.
   * Implementation of React components, TypeScript interfaces, and Tailwind CSS design system.
   * Generation of realistic contact center mock data (12+ customer profiles with tickets and interaction histories, 16+ call records, and 5 queued callers).
   * Verification of Vite and TypeScript compilation (`npm run build`).

