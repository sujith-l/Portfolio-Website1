# Sujith — Full-Stack & AI Developer | Product Builder Portfolio

A cinematic, high-performance personal portfolio featuring a full-screen, 238-frame smooth video scroll scrubbing animation, glassmorphism design system, and showcase of Sujith's real-world software and AI products.

## Overview

- **Branding**: SUJITH — Full-Stack Developer | AI Developer | Product Builder
- **Cinematic Experience**: 238 Full HD 1080p frames rendered via HTML5 Canvas with sub-pixel LERP inertia (60–120 FPS).
- **Design System**: Dark obsidian background with dual red/magenta studio neon rim lighting, matching the video portrait.
- **Sections**:
  - **Hero**: Oversized kinetic typography, student & entrepreneur identity tag, manifesto quote, and core capability pillars.
  - **About Me**: Narrative bio, quick profile cards, and complete technical mastery breakdown (Frontend, Backend, Database, AI & Data Science, Tools).
  - **Things I've Built (Projects)**:
    - **GENVIB – Event Management Platform**: Full-featured event discovery & ticketing system (`https://www.genvib.in/`).
    - **Menaga Beauty Studio – Business Website**: Modern service showcase and client booking experience (`https://www.menagabeautystudio.in/`).
    - **AI-Powered Document Intelligence**: Intelligent RAG QA application built with FastAPI, React, ChromaDB, Gemini, Llama, and Qwen.
  - **Contact**: Direct communication hub with 1-click email action (`sujithlogu22@gmail.com`), GitHub, and LinkedIn links.
  - **Floating HUD Scrubber**: Live frame counter (`001 / 238`) and interactive scrub bar.

## Project Structure

```
Portfolio/
├── assets/
│   ├── genvib.jpg               # Uploaded GENVIB platform screenshot
│   ├── menaga.png               # Uploaded Menaga Beauty Studio screenshot
│   └── rag-intelligence.svg     # Document Intelligence RAG architecture preview
├── frames/                      # 238 Full HD 1080p video frames (ezgif-frame-001.jpg .. 238.jpg)
├── index.html                   # Semantic HTML5 layout & glassmorphic structure
├── styles.css                   # Cyber-studio glassmorphism & responsive styles
├── script.js                    # Fullscreen Canvas LERP scroll scrubber engine
├── server.py                    # Local preview HTTP server
├── preview.bat                  # 1-click Windows launcher
└── README.md                    # Documentation
```

## How to Run

- **Option A (Live Server)**: Open [http://localhost:3000](http://localhost:3000) (active in background).
- **Option B (Direct File)**: Double-click `index.html` to open directly in any web browser.
- **Option C (Launcher)**: Double-click `preview.bat` inside the folder.
