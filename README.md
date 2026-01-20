# Kode Club - Frontend 🚀

Kode Club is a premium, high-performance coding community platform designed for students at RGIPT. It provides a seamless experience for practicing coding, participating in quizzes, and competing on leaderboards with a modern, cinematic developer-centric UI.

## ✨ Key Features

- **Daily Practice Problems (DPP)**: Curated coding challenges to build daily consistency.
- **Unified Compiler**: A robust online IDE supporting C++, Java, Python, and JavaScript, powered by Judge0.
- **Interactive Quizzes**: Real-time quiz system with instant feedback and score tracking.
- **Dynamic Leaderboards**: Global and quiz-specific rankings to foster healthy competition.
- **Glassmorphism UI**: A stunning, high-end design using Tailwind CSS and Framer Motion for a "Stranger Things" inspired cinematic experience.
- **Admin Dashboard**: Comprehensive control panel for managing users, quizzes, DPPs, and site-wide announcements.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Tabler Icons](https://tabler-icons.io/)
- **State Management**: React Context API
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/vjain5375/Kode-Klub.git
   cd Kode-Klub
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   NEXT_PUBLIC_JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
   NEXT_PUBLIC_JUDGE0_API_KEY=your_key_here
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📁 Project Structure

- `/src/app`: Next.js App Router pages and routes.
- `/src/components`: Reusable UI components (Layout, UI, Features).
- `/src/context`: Authentication and global state providers.
- `/src/lib`: API services and utility functions.
- `/public`: Static assets and logos.

## 🤝 Contribution

Built with ❤️ by students of RGIPT. If you have any suggestions or find any bugs, feel free to open an issue or pull request!

---
*Maintained by the Kode Club Development Team.*
