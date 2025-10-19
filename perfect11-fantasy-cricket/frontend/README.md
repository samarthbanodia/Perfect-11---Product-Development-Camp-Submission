# Perfect 11 Frontend

Next.js 15 frontend application for Perfect 11 fantasy cricket prediction platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utility functions
│   └── utils.ts          # Tailwind utils
├── public/               # Static assets
│   └── perfect_11_logo.png
└── package.json          # Dependencies

```

## 🛠️ Tech Stack

- **Framework**: Next.js 15.1
- **React**: 19.0
- **TypeScript**: 5.0
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks

## 🔌 API Integration

The frontend connects to the Flask backend at `http://localhost:5000`.

Update the API URL in your components if deploying to production.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Styling

Uses Tailwind CSS with custom configuration. Theme colors and styles are defined in:
- `tailwind.config.ts`
- `app/globals.css`

## 🤝 Contributing

See main [README.md](../README.md) for contribution guidelines.
