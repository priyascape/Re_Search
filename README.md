# 🧠 Re_Search

**Perplexity ReSearcher** — an open reasoning graph that connects live research problems with the people actively learning to solve them.

Built with **Next.js** and powered by the **Perplexity API**, ReSearcher transforms the idea of hiring into a process of reasoning:  
organisations describe problems, researchers contribute conjectures, and the system grounds every match in verifiable evidence.

---

## 🌍 What It Does

ReSearcher creates a dynamic **Reasoning Graph** between researchers, papers, and real-world questions.

- **Researcher Portal** – Claim your verified research profile (from Google Scholar, arXiv, NeurIPS, etc.) and publish ongoing reasoning, not static résumés.  
- **Problem Portal** – Organisations post open problems or project briefs; the system interprets them as hypotheses to be tested, not “job openings.”  
- **Perplexity-Powered Reasoning** – Each match is generated through grounded search and transparent citation chains, showing *why* a researcher’s work addresses a specific problem.  
- **Funding & Collaboration Loop** – Sponsors can directly fund attendance, prototypes, or experiments, turning reasoning into opportunity.  

---

## 🧩 Key Concepts

| Term | Meaning |
|------|----------|
| **Knowledge Graph** | Maps *what* is known — static facts and citations. |
| **Reasoning Graph** | Maps *how* understanding evolves — problems, conjectures, and evidence relationships. |
| **ReSearcher** | The agent connecting these graphs through verifiable reasoning. |

---

## ⚙️ Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS  
- **Backend:** Node.js / Vercel Serverless  
- **Intelligence Layer:** Perplexity API (grounded search + citations)  
- **Data Sources:** NeurIPS 2024 / arXiv / Google Scholar metadata  
- **Payments (demo):** Stripe sandbox for sponsorship flows  

---

## 🚀 Vision

> “If LinkedIn is the career graph of the industrial era,  
> **ReSearcher** is the reasoning graph of the intelligence era.”

Every paper, experiment, and idea becomes a living node in an evolving network of curiosity.  
ReSearcher helps people and organisations **ask better questions — and reason their way to better answers.**

---

## 🧪 Quick Start

```bash
# Install dependencies
npm install

# Set environment variables (see .env.example for Perplexity API key)
cp .env.example .env.local

# Run development server
npm run dev

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
