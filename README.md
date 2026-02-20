# Smart Coop - Agricultural Cooperative Management System

A comprehensive frontend application for managing agricultural cooperatives, built with React 18, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Multi-tenant Architecture**: Support for multiple agricultural cooperatives
- **Role-based Access Control**: Admin, Clerk, and Finance roles with specific permissions
- **Mock API System**: Simulated backend with realistic data and API delays
- **Responsive Design**: Mobile-first approach with Tailwind CSS components

### Modules
- **Dashboard**: Overview with key metrics and statistics
- **Farmers Management**: Add, view, and manage farmer information
- **Harvest Tracking**: Record and track harvests with crop types and grades
- **Batch Management**: Group harvests into processing batches
- **Payment Processing**: Manage payments with status tracking

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **UI Framework**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios (mocked)
- **Code Quality**: ESLint + Prettier

## 📁 Project Structure

```
src/
├── app/                    # App configuration and routing
│   ├── App.tsx
│   └── router.tsx
├── auth/                   # Authentication components
│   ├── Login.tsx
│   └── RequireAuth.tsx
├── layout/                 # Layout components
│   ├── DashboardLayout.tsx
│   ├── Sidebar.tsx
│   └── Topbar.tsx
├── modules/                # Feature modules
│   ├── dashboard/
│   ├── farmers/
│   ├── harvests/
│   ├── batches/
│   └── payments/
├── services/               # API services
│   └── mockApi.ts
├── context/               # React contexts
│   └── AuthContext.tsx
├── types/                # TypeScript type definitions
│   └── index.ts
├── data/                 # Mock data
│   └── mockData.ts
└── theme/                # Tailwind CSS theme
    └── theme.ts
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🔐 Authentication

### Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | password |
| Clerk | clerk | password |
| Finance | finance | password |

### Role Permissions

- **Admin**: Full access to all modules
- **Clerk**: Access to farmers, harvests, and batches
- **Finance**: Access to payments and dashboard

## 🌐 Multi-Tenancy

The application simulates multi-tenancy with:
- Separate data for each tenant
- Tenant-specific user authentication
- Data isolation between cooperatives

## 📊 Mock Data

The application includes comprehensive mock data:
- Multiple users with different roles
- Sample farmers with farm information
- Harvest records with various crop types
- Batch processing data
- Payment records with different statuses

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Tailwind CSS theme system
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages
- **Form Validation**: Client-side validation with error messages
- **Status Indicators**: Color-coded chips and badges

## 🔧 Development

### Code Quality

- **ESLint**: Enforces code quality and consistency
- **Prettier**: Automatic code formatting
- **TypeScript**: Type safety throughout the application

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🚀 Deployment

The application is ready for deployment to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🔮 Future Enhancements

- Real backend integration
- Real-time notifications
- Advanced reporting and analytics
- Mobile app development
- Offline support
- Data export functionality

## 📝 License

This project is for educational purposes and demonstration.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or support, please open an issue in the repository.
