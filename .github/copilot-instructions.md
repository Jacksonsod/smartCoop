# SmartCoop AI Coding Guidelines

## Architecture Overview
- **Multi-tenant React app** for agricultural cooperative management using React 18, TypeScript, Vite, and Tailwind CSS
- **Authentication**: Context-based with role-based access (SUPER_ADMIN, COOP_ADMIN, CLERK, FINANCE, INSPECTOR, FARMER)
- **Data Layer**: Mock API with localStorage persistence via `StorageService`; all data filtered by `tenantId`
- **Routing**: React Router v6 with protected routes wrapped in `RequireAuth`
- **Modules**: Feature-based organization in `src/modules/` (dashboard, farmers, harvests, batches, payments, pricing)

## Key Patterns
- **Component Imports**: Use barrel exports from `src/components/index.ts` (e.g., `import { Button, Card, Table } from '../../components'`)
- **API Calls**: Always pass `user.tenantId` for multi-tenant filtering; handle loading/error states
- **State Management**: Auth via `useAuth()` hook; local component state for UI
- **Icons**: Lucide React icons (e.g., `import { Plus, Edit } from 'lucide-react'`)
- **Charts**: Recharts for data visualization in dashboard
- **Forms**: Custom form components from `src/components/Form.tsx`

## Developer Workflows
- **Start Dev Server**: `npm run dev` (Vite dev server on localhost:5173)
- **Build**: `npm run build` (TypeScript compilation + Vite build)
- **Lint**: `npm run lint` (ESLint with TypeScript rules)
- **Preview**: `npm run preview` (serve built app)
- **Debug Auth**: Use `debug-login.html` for testing login flows

## Conventions
- **File Structure**: `src/modules/{feature}/{Component}.tsx` for feature components
- **Types**: Centralized in `src/types/index.ts`; use enums for fixed values (e.g., `CropType`, `Grade`)
- **Mock Data**: Realistic delays (800ms) in `src/services/mockApi.ts`; tenant-specific data in `src/data/mockData.ts`
- **Error Handling**: Display user-friendly messages; log to console for debugging
- **Styling**: Tailwind CSS utility classes; custom components for consistency

## Integration Points
- **External APIs**: Axios for HTTP (currently mocked); replace `mockApi` with real endpoints
- **Persistence**: localStorage via `StorageService`; migrate to backend database
- **Tenant Isolation**: All data operations filter by `user.tenantId` from auth context</content>
<parameter name="filePath">/home/jackson/Documents/smartCoop/.github/copilot-instructions.md