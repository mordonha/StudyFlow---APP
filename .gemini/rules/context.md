# StudyFlow + Invert — Workspace Context & Memory Rule

This project is StudyFlow, developed during the Google & Alura Software Engineering with AI Immersion.

## Key Project Knowledge
- **Primary Memory Document:** Refer to `ANTIGRAVITY.md` in the project root for full prompt history, architectural details, and step-by-step instructions.
- **Git Branches:**
  - `main`: Original stable version of StudyFlow (Objectives Management, CRUD, StorageService, localStorage, Cloud Run).
  - `StudyFlow-Invert-App`: Extended version with the Invert feature (Feynman Technique "Aprenda Ensinando", 3 AI personas, Voice/Walking mode, Knowledge X-Ray, Gamification with XP/Diplomas).
- **Author Identity:** Paulo Marcos Ordonha <marcos.ordonha@gmail.com>
- **GCP Project:** `agentic-ai-eng-soft-alura`
- **Deploy Target:** Google Cloud Run (`https://studyflow-3881.ai.studio/` / `*.run.app`)
- **Data Persistence:** 100% client-side via `window.localStorage`. Data does NOT go to GCP.

Whenever resuming work, check the current active branch and consult `ANTIGRAVITY.md`.
