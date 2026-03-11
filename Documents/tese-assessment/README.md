# 📅 Climatiq-Inspired Meeting Scheduler

A high-fidelity, multi-step meeting scheduling application built for the **Tese.io SWE Intern Assessment**. This project replicates a professional SaaS booking experience with a focus on clean UI, robust state management, and interactive user feedback.

## 🚀 Live Demo

**Vercel URL:** [Insert your Vercel Link Here]

## 🛠️ Tech Stack

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Date Logic:** `date-fns`
* **Feedback:** `canvas-confetti`
* **Deployment:** Vercel

## ✨ Key Features

* **Interactive Multi-step Flow:** Seamless navigation through Date Selection, 15-minute Time Slots, and User Information steps.
* **Dynamic Meeting Generation:** Automatically generates unique Google Meet links and randomized meeting codes.
* **Calendar Integration:** Deep-link integration with Google Calendar, pre-populating the event title, date, time, and location.
* **Responsive Sidebar:** A persistent sidebar providing real-time summaries of the user's progress.
* **Clipboard Utility:** A "Copy Link" fallback with visual success feedback to ensure accessibility.
* **Reschedule Logic:** Built-in ability to reset the application state and restart the booking process without a page refresh.

## 🧠 Technical Challenges & AI Collaboration

This project was developed in collaboration with **GitHub Copilot/Windsurf**. A full audit of all AI prompts and architectural decisions can be found in the `PROMPT_LOG.md` file.

### **The "Self-Healing" UI**

During development, a persistent CSS stacking context issue made the final meeting link unclickable (due to invisible overlays from the layout and confetti layers).
**The Solution:** I implemented a programmatic DOM check using `document.elementFromPoint` to identify blocking elements in real-time and force `pointer-events: none` on them, ensuring a 100% interactive experience.

## 📥 Local Setup

1. Clone the repository:
```bash
git clone [your-repo-link]

```


2. Install dependencies:
```bash
npm install

```


3. Run the development server:
```bash
npm run dev

```


4. Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to view the app.


