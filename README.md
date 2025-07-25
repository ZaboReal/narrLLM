# HadithChainGraph

A full-stack web application for visualizing and analyzing Hadith narrator chains using interactive graphs and AI-powered insights.

## 🚀 Features

- **Interactive Graph Visualization**: Visualize Hadith narrator chains using React Flow
- **AI-Powered Analysis**: Integration with Google's Generative AI for intelligent insights
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS with shadcn/ui components
- **Real-time Data**: WebSocket support for live updates
- **Database Integration**: PostgreSQL database with Drizzle ORM
- **Responsive Design**: Mobile-friendly interface with dark/light theme support

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Node.js, TypeScript
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM
- **AI**: Google Generative AI
- **Graph Visualization**: React Flow
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Real-time**: WebSocket

## 📋 Prerequisites

- Node.js 18 or higher
- PostgreSQL database (Neon recommended)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd HadithChainGraph
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=your_postgresql_connection_string_here

# Optional: Set to development for hot reloading
NODE_ENV=development
```

**Database Options:**
- **Neon (Recommended)**: Sign up at [neon.tech](https://neon.tech) for a free PostgreSQL database
- **Local PostgreSQL**: Install and configure locally
- **Other Cloud Providers**: Any PostgreSQL-compatible database

### 4. Database Setup

Push the database schema:

```bash
npm run db:push
```

### 5. Import Narrator Data (Optional)

If you have narrator data to import:

```bash
npm run import-narrators
```

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
HadithChainGraph/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   └── ui/            # shadcn/ui components
├── server/                # Backend Express.js application
│   ├── routes.ts          # API routes
│   ├── db.ts             # Database configuration
│   └── index.ts          # Server entry point
├── shared/               # Shared TypeScript types and schema
├── attached_assets/      # CSV data files and assets
└── migrations/           # Database migrations (generated)
```

## 🎯 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🔧 Configuration

### Database Configuration

The application uses Drizzle ORM with PostgreSQL. Configure your database connection in the `.env` file:

```env
DATABASE_URL=postgresql://username:password@hostname/database
```

### AI Configuration

The application integrates with Google's Generative AI. Ensure you have the necessary API credentials configured.

## 🎨 UI Components

The application uses shadcn/ui components for a consistent and modern design:

- **Graph Visualization**: Interactive narrator chain graphs
- **Theme Toggle**: Dark/light mode support
- **Responsive Layout**: Mobile-first design
- **Toast Notifications**: User feedback system
- **Form Components**: Input validation and error handling

## 📊 Data Import

The application supports importing narrator data from CSV files. Place your CSV files in the `attached_assets/` directory and use the import script.

## 🔍 API Endpoints

The backend provides RESTful API endpoints for:

- Hadith data retrieval
- Narrator chain analysis
- AI-powered insights
- Graph data generation

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Variables for Production

Ensure all required environment variables are set in your production environment:

- `DATABASE_URL`
- `NODE_ENV=production`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify your database connection
3. Ensure all environment variables are set correctly
4. Check the browser's developer tools for frontend errors

## 🔗 Related Links

- [React Flow Documentation](https://reactflow.dev/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/) 