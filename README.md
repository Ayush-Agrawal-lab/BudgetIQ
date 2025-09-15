# 💰 BudgetIQ - Intelligent Personal Finance Manager

<div align="center">

![BudgetIQ Logo](https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=200&fit=crop&crop=center)

**A modern, AI-powered personal finance management application built with React & TypeScript**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC.svg)](https://tailwindcss.com/)
[![College Project](https://img.shields.io/badge/BTech-3rd_Year_Project-orange.svg)](#)

</div>

---

## 🌟 Overview

BudgetIQ is a comprehensive personal finance management application designed to help users take control of their financial life through intelligent insights, beautiful visualizations, and seamless user experience. Built as a BTech 3rd year project, it demonstrates advanced frontend development skills with production-ready architecture.

### ✨ Key Highlights

- 🎯 **Smart Financial Tracking** - Comprehensive income & expense management across multiple accounts
- 🌍 **Multi-Currency Support** - Handle 8+ currencies with real-time conversion (USD, EUR, GBP, JPY, INR, CAD, AUD, CHF)
- 🌙 **Elegant Dark/Light Themes** - Seamless theme switching with persistent preferences
- 📊 **Interactive Data Visualization** - Beautiful charts and graphs using Recharts
- 🚀 **Performance Optimized** - Lazy loading, code splitting, and efficient state management
- 🎨 **Modern UI/UX** - Clean design with smooth animations and micro-interactions
- 📱 **Responsive Design** - Perfect experience across all devices
- 🛡️ **Type-Safe** - Built with TypeScript for reliability and maintainability

---

## 🚀 Features

### 💳 Core Financial Management
- **Multi-Account Support** - Cash, Bank, UPI, Credit Cards, and more
- **Transaction Management** - Add, edit, delete, and categorize transactions
- **Smart Categorization** - Predefined and custom categories with visual indicators
- **Real-time Balance Tracking** - Live updates across all accounts

### 📈 Analytics & Insights
- **Financial Overview Dashboard** - Quick snapshot of your financial health
- **Spending Analysis** - Detailed breakdowns by category, time period, and account
- **Interactive Charts** - Donut charts, trend lines, and comparative visualizations
- **Transaction History** - Comprehensive filtering and search capabilities

### 🌐 Personalization
- **Currency Management** - Support for 8 major currencies with real-time rates
- **Location Services** - City/country-based personalization
- **Theme Customization** - Dark/Light mode with system preference detection
- **Flexible Settings** - Comprehensive user preferences and configurations

### 🎨 User Experience
- **Smooth Animations** - Motion/React powered transitions and micro-interactions
- **Loading States** - Elegant skeleton screens and progress indicators
- **Error Handling** - Comprehensive error boundaries and user feedback
- **Accessibility** - WCAG compliant with keyboard navigation support

---

## 🛠️ Technology Stack

### Frontend Core
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript 5** - Full type safety and enhanced developer experience
- **Tailwind CSS v4** - Utility-first styling with custom design tokens
- **Vite** - Lightning-fast build tool and development server

### UI & Components
- **shadcn/ui** - High-quality, accessible component library
- **Lucide React** - Beautiful, customizable icons
- **Recharts** - Powerful, declarative charts and data visualization
- **Motion/React** - Smooth animations and transitions

### State Management & Utils
- **React Context** - Lightweight state management for themes, currency, and location
- **React Hook Form** - Performant forms with easy validation
- **React Error Boundary** - Graceful error handling and recovery

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **Prettier** - Code formatting and consistency
- **Git** - Version control with conventional commits

---

## 📱 Screenshots

<div align="center">

### 🌙 Dark Mode Dashboard
![Dashboard Dark](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop)

### ☀️ Light Mode Analytics
![Analytics Light](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop)

### 📊 Transaction Management
![Transactions](https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=500&fit=crop)

</div>

---

## 🏗️ Installation & Setup

### Prerequisites
- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/budgetiq.git
cd budgetiq

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup

```bash
# Optional: Create environment file for API keys
cp .env.example .env.local
```

---

## 📖 Usage Guide

### Getting Started
1. **Launch the Application** - Open your browser and navigate to the development server
2. **Create Account** - Sign up with email or use demo mode
3. **Set Preferences** - Choose your currency, location, and theme
4. **Add Accounts** - Create your financial accounts (Bank, Cash, etc.)
5. **Start Tracking** - Begin adding transactions and monitoring your finances

### Key Features Usage

#### 💰 Adding Transactions
- Navigate to "Add Transaction" from the sidebar
- Select account, category, and amount
- Add description and date
- Transaction is automatically categorized and reflected in your balance

#### 📊 Viewing Analytics
- Visit the "Insights" page for detailed financial analysis
- Interactive charts show spending patterns and trends
- Filter by date range, category, or account type

#### ⚙️ Customization
- Access Settings to modify preferences
- Switch between currencies with automatic conversion
- Toggle dark/light theme based on preference
- Adjust location for personalized features

---

## 🏗️ Project Structure

```
budgetiq/
├── public/                    # Static assets
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── figma/           # Figma integration components
│   │   ├── SimpleDashboardOptimized.tsx
│   │   ├── AddTransactionEnhanced.tsx
│   │   ├── SimpleInsightsEnhanced.tsx
│   │   └── ...              # Other feature components
│   ├── styles/
│   │   └── globals.css      # Global styles & Tailwind config
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── guidelines/
│   └── Guidelines.md        # Development guidelines
├── package.json             # Dependencies and scripts
└── README.md               # Project documentation
```

### Component Architecture

- **App.tsx** - Main application with routing and authentication
- **Context Providers** - Currency, Location, and Theme management
- **Feature Components** - Dashboard, Transactions, Accounts, Insights
- **UI Components** - Reusable shadcn/ui based components
- **Utility Components** - Error boundaries, loading states, etc.

---

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Code Quality

- **TypeScript** - Strict type checking enabled
- **ESLint** - Comprehensive linting rules
- **Prettier** - Consistent code formatting
- **Conventional Commits** - Structured commit messages

### Performance Optimizations

- **Lazy Loading** - Components loaded on-demand
- **Code Splitting** - Automatic bundle optimization
- **Memoization** - React.memo and useMemo for expensive operations
- **Efficient Re-renders** - Optimized context usage and state management

---

## 🎯 Future Enhancements

### Planned Features
- 🤖 **AI-Powered Insights** - Machine learning-based spending predictions
- 🔄 **Real-time Sync** - Multi-device synchronization
- 📱 **Mobile App** - Native iOS and Android applications
- 🏦 **Bank Integration** - Direct connection to financial institutions
- 📊 **Advanced Analytics** - Investment tracking and portfolio management
- 🎯 **Goal Setting** - Financial goal tracking and achievement
- 💡 **Smart Notifications** - Intelligent spending alerts and suggestions

### Technical Improvements
- **Backend Integration** - Node.js/Express API with PostgreSQL
- **Authentication** - JWT-based secure authentication system
- **Data Persistence** - Cloud-based data storage and backup
- **Performance Monitoring** - Real-time performance analytics
- **Testing Suite** - Comprehensive unit and integration tests

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Write TypeScript with proper type annotations
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

### Areas for Contribution
- 🐛 Bug fixes and improvements
- ✨ New features and enhancements
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Testing and quality assurance
- 🌐 Internationalization support

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 BudgetIQ

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 👨‍💻 Author & Contact

<div align="center">

**[Your Name]**  
*BTech Computer Science & Engineering Student*  
*3rd Year, [Your University Name]*

[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=About.me&logoColor=white)](https://yourportfolio.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/yourprofile)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:your.email@example.com)

</div>

### Project Stats

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/yourusername/budgetiq?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/budgetiq?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/yourusername/budgetiq?style=social)

</div>

---

## 🙏 Acknowledgments

- **shadcn/ui** - For the beautiful component library
- **Tailwind CSS** - For the excellent utility-first CSS framework
- **Recharts** - For powerful data visualization capabilities
- **Lucide** - For the comprehensive icon library
- **React Community** - For continuous inspiration and support
- **Open Source Contributors** - For making development accessible to everyone

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

**Built with ❤️ for the future of personal finance management**

</div>

---

*Last updated: December 2024*