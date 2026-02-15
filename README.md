# Portfolio v2 — Connor Robinson

A modern, terminal-styled portfolio website built with Next.js 15, AWS Amplify Gen 2, and TypeScript.

## 🚀 Features

- **Terminal/CLI Aesthetic** — Pure black background, monospace fonts, ASCII art
- **Project Management** — Full CRUD interface with image uploads to S3
- **Authentication** — Cognito-based admin access for content management
- **Public/Guest Access** — Unauthenticated users can browse published projects
- **Interactive Game** — Hidden platformer easter egg
- **SEO Optimized** — Auto-generated sitemap, robots.txt, and comprehensive meta tags
- **Responsive Design** — Mobile-first approach with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS (terminal theme with sharp edges, no gradients)
- **Backend:** AWS Amplify Gen 2 (Data, Auth, Storage)
- **Database:** DynamoDB (via Amplify Data)
- **Storage:** S3 (via Amplify Storage)
- **Authentication:** Amazon Cognito
- **Hosting:** AWS Amplify Hosting

## 📦 Getting Started

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

## 📦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- AWS Account (for Amplify backend)
- AWS CLI configured

### Installation
## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [AWS Amplify Gen 2 Documentation](https://docs.amplify.aws/nextjs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

This is a personal portfolio project, but feel free to use it as reference or inspiration for your own work.

## 📄 License

This project is open source and available under the MIT License.

---

**Live Site:** [konarobinson.com](https://konarobinson.com)  
**Maintained by:** Connor Robinson
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Amplify Sandbox

To start the Amplify backend in sandbox mode:

```bash
npx ampx sandbox
```

This will deploy auth, data, and storage resources to your AWS account.

## 🔍 SEO & Search Engine Setup

**Important:** After deploying, follow the [SEO Setup Guide](./docs/SEO_SETUP_GUIDE.md) to:
- Verify your site with Google Search Console
- Submit your sitemap for indexing
- Set up Bing Webmaster Tools
- Add verification meta tags

The site includes:
- ✅ Auto-generated `robots.txt` at `/robots.ts`
- ✅ Auto-generated `sitemap.xml` at `/sitemap.ts`
- ✅ Comprehensive SEO metadata in all pages
- ✅ Open Graph and Twitter Card support

## 📁 Project Structure

```
portfolio_v2/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   ├── about/            # Contact page
│   ├── projects/         # Public projects listing & details
│   ├── manager/          # Admin project management (auth required)
│   ├── robots.ts         # Robots.txt generation
│   └── sitemap.ts        # Sitemap.xml generation
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── game/             # Platformer game
│   ├── landing/          # Home page sections
│   ├── manager/          # Admin UI components
│   ├── navigation/       # Nav bar & mobile menu
│   ├── projects/         # Project cards & grid
│   └── ui/               # Reusable UI components (terminal theme)
├── hooks/                 # Custom React hooks
│   ├── use-projects.ts   # Projects CRUD with auto auth detection
│   ├── use-project.ts    # Single project fetch
│   └── use-image-upload.ts # S3 image upload
├── lib/                   # Utilities & constants
│   ├── amplify-client.ts # Amplify Data client
│   ├── ascii/            # ASCII art generation
│   ├── constants/        # Navigation, skills, social links
│   └── utils/            # Helper functions
├── amplify/               # AWS Amplify Gen 2 backend config
│   ├── auth/             # Cognito configuration
│   ├── data/             # DynamoDB schema & authorization
│   ├── storage/          # S3 bucket configuration
│   └── backend.ts        # CDK customizations
└── types/                 # TypeScript type definitions
```

## 🎨 Design Principles

See [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) for full theme guidelines:

- **Pure black background** (`#000000`)
- **Monospace font only** (JetBrains Mono)
- **No rounded corners** — sharp edges everywhere
- **No shadows or gradients** — flat, minimal
- **Color palette:**
  - Primary text: `#D4D4D4` (neutral-300)
  - Accent/success: `#4ADE80` (green-400)
  - Error: `#F87171` (red-400)
  - Links: `#22D3EE` (cyan-400)

## 🔐 Authentication & Authorization

- **Public Access:** Uses Cognito Identity Pool's unauthenticated role
- **Admin Access:** Cognito User Pool with email/password
- **Authorization Rules:**
  - Guests: Read-only access to published projects
  - Authenticated: Full CRUD on all projects
- **Auth Mode Auto-Detection:** Hooks automatically use correct auth mode based on session

## 📝 Content Management

Access the admin panel at `/manager` (requires sign-in):
- Create/edit/delete projects
- Upload images to S3
- Mark projects as featured or published
- Associate skills with projects

## 🚢 Deployment

This project is deployed via AWS Amplify Hosting. Push to your Git branch to trigger automatic deployment.

```bash
git push origin main
```

Amplify will:
1. Build the Next.js app
2. Deploy backend resources (if changed)
3. Publish to CloudFront CDN

## 📚 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
