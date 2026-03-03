<div align="center">
  <h1>🍿 Vidgram</h1>
  <p>The modern, minimalist, and deeply SEO-optimized video sharing platform.</p>
</div>

---

## 🚀 Overview

Vidgram is a high-performance video sharing web application built to feel premium, minimalist, and blazingly fast. What sets Vidgram apart is its aggressive focus on **Search Engine Optimization (SEO)** and **Video Indexing**. It is built with Next.js 14 App Router to deliver Server-Side Rendered (SSR) content that Google and other search engines love.

### 🌟 Key Features
- **Batch Video Uploads:** Select multiple videos at once and upload them sequentially to Cloudinary.
- **AI-Powered Autofill:** Connects to Groq's Vision AI (`llama-3.2-90b-vision-preview`), allowing the system to "watch" the thumbnail of your video and instantly write long, creative, and SEO-friendly titles and descriptions in 5 different languages.
- **Threaded Comments:** A deeply nested comment system mimicking professional platforms.
- **Creator Dashboard:** An analytics hub to monitor video views, subscriber counts, and manage uploads.
- **Firebase Auth:** One-click Google Sign-In perfectly integrated with Next.js Context.

---

## ⚙️ The SEO & Indexing Infrastructure (Phase 8)

Vidgram is engineered from the ground up to rank on Google. It implements standard-industry techniques used by platforms like YouTube:

1. **JSON-LD VideoObject Schema:** Every video page (`/video/[slug]`) injects hidden Schema.org scripts. This feeds Google exact data (Upload Date, Duration, Thumbnail, Title, Views) guaranteeing **Rich Snippet** placement in search results.
2. **Dynamic Sitemap (`/sitemap.xml`):** Powered by Next.js, the sitemap automatically queries Firebase for the latest 1,000 videos whenever Google visits, making manual indexing obsolete.
3. **Canonical URLs:** Prevents duplicate-content penalties from URL tracking parameters.
4. **OpenGraph & Twitter Cards:** Ensures links shared on WhatsApp, Facebook, or X (Twitter) display a massive, beautiful video thumbnail preview instead of broken gray boxes.
5. **App Manifest (PWA):** Configured so users can install Vidgram to their mobile device Home Screens for a native-app feel.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router, Server Actions)
- **Database / Auth:** Google Firebase (Firestore & Firebase Auth)
- **Video Storage & CDN:** Cloudinary (REST API via Frontend)
- **AI Generator:** Groq API (Vision Model)
- **Styling:** Vanilla CSS Custom Properties (Tokens) & Tailwind utilities
- **Icons:** Lucide React

---

## 💻 Running Locally

### 1. Requirements
Ensure you have Node.js (v18+) installed.

### 2. Environment Variables
Create a `.env.local` file in the root directory and fill in the following keys:

```ini
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudinary Setup
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset

# Groq AI
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key

# Global SEO Url
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Installation
Install the project dependencies:
```bash
npm install
```

### 4. Start the server
Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---
*Built with speed, minimalism, and search engines in mind.*
"# vidgram" 
