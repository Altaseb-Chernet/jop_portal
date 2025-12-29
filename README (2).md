# Job Portal Frontend

A modern, responsive React TypeScript application for a comprehensive job portal platform, featuring job search, application management, user authentication, and administrative controls.

## 🎨 Architecture Overview

### Technology Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4.x
- **State Management**: React Query (TanStack Query) + Context API
- **Routing**: React Router DOM v7
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Headless UI + Heroicons + Lucide React
- **HTTP Client**: Axios with interceptors
- **Animations**: Framer Motion
- **File Handling**: PDF.js, Mammoth (Word docs)
- **Theme**: Custom dark/light theme system

### Core Features

#### 🔐 Authentication System
- JWT-based authentication with automatic token refresh
- Role-based routing and component protection
- Password reset with OTP verification
- Persistent login state with local storage
- Automatic logout on token expiration

#### 👥 Multi-Role User Experience
- **Job Seekers**: Job search, applications, CV management, job alerts
- **Employers**: Job posting, application management, company profile
- **Administrators**: User management, payment oversight, CV templates

#### 💼 Job Management
- Advanced job search with filters (location, type, salary, experience)
- Job details with application forms
- Job posting and editing for employers
- Job alert subscriptions

#### 📄 CV Management
- PDF CV upload and preview
- CV template system (admin managed)
- Document validation and size limits
- Download functionality

#### 💳 Payment Integration
- Subscription-based premium features
- Chapa payment gateway integration
- Payment success/failure handling
- Subscription management

#### 🎨 User Experience
- Responsive design for mobile and desktop
- Dark/light theme toggle
- Smooth animations and transitions
- Loading states and error handling
- Toast notifications

## 📁 Project Structure

```
src/
├── components/             # Reusable UI components
│   ├── Footer.tsx         # Site footer
│   ├── Layout.tsx         # Main layout wrapper
│   ├── ProtectedRoute.tsx # Route protection HOC
│   ├── Sidebar.tsx        # Navigation sidebar
│   ├── Spinner.tsx        # Loading spinner
│   ├── Toast.tsx          # Notification system
│   └── TopNavbar.tsx      # Top navigation bar
├── context/               # React Context providers
│   └── AuthContext.tsx    # Authentication state management
├── hooks/                 # Custom React hooks
│   └── useTheme.ts        # Theme management hook
├── lib/                   # Utility libraries
│   ├── api.ts            # Axios instance configuration
│   ├── env.ts            # Environment variables
│   ├── queryClient.ts    # React Query configuration
│   ├── storage.ts        # Local storage utilities
│   └── theme.ts          # Theme utilities
├── pages/                 # Page components
│   ├── AdminUsersPage.tsx        # Admin user management
│   ├── AdminCvTemplatesPage.tsx  # CV template management
│   ├── AdminPaymentPage.tsx      # Payment oversight
│   ├── DashboardPage.tsx         # User dashboard
│   ├── CvsPage.tsx              # CV management
│   ├── EmployerApplicationsPage.tsx # Application management
│   ├── EmployerJobsPage.tsx     # Job posting management
│   ├── HomePage.tsx             # Landing page
│   ├── JobDetailsPage.tsx       # Individual job view
│   ├── JobsPage.tsx             # Job search results
│   ├── LoginPage.tsx            # Authentication
│   ├── MyApplicationsPage.tsx   # Job seeker applications
│   ├── ProfilePage.tsx          # User profile
│   ├── RegisterPage.tsx         # User registration
│   └── ...
├── services/              # API service layer
│   ├── api.ts            # Base API configuration
│   ├── auth.ts           # Authentication services
│   ├── jobs.ts           # Job-related API calls
│   ├── applications.ts   # Application management
│   ├── cvs.ts            # CV handling
│   ├── dashboard.ts      # Dashboard data
│   ├── payment.ts        # Payment processing
│   └── users.ts          # User management
└── types/                # TypeScript type definitions
    ├── auth.ts           # Authentication types
    └── job.ts            # Job-related types
```

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)
- **Backend API**: Running on `http://localhost:8000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-portal-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create `.env.local` file:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000` |

### Theme Configuration

The application supports dark and light themes with automatic system preference detection:

```typescript
// src/lib/theme.ts
export const applyTheme = (theme: 'light' | 'dark') => {
  // Theme application logic
}

export const getInitialTheme = (): 'light' | 'dark' => {
  // Theme detection logic
}
```

### API Configuration

Axios is configured with interceptors for authentication and error handling:

```typescript
// src/services/api.ts
export const api = axios.create({
  baseURL: API_BASE_URL,
})

// Request interceptor for JWT tokens
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthStorage()
      window.location.assign('/login')
    }
    return Promise.reject(error)
  }
)
```

## 🏗️ Component Architecture

### Layout System

#### Layout.tsx
Main application layout with responsive sidebar and top navigation:

```tsx
export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopNavbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
```

#### ProtectedRoute.tsx
Role-based route protection component:

```tsx
interface ProtectedRouteProps {
  roles: UserRole[]
  children: ReactNode
}

export const ProtectedRoute = ({ roles, children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()

  if (isLoading) return <Spinner />
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
```

### State Management

#### Authentication Context
Global authentication state using React Context:

```tsx
// src/context/AuthContext.tsx
interface AuthContextType {
  user: User | null
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
  isLoading: boolean
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Authentication logic implementation
}
```

#### React Query Integration
Server state management with caching and synchronization:

```tsx
// src/lib/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})
```

### Form Handling

React Hook Form with Zod validation for type-safe forms:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: LoginFormData) => {
    // Handle form submission
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

## 🎨 Styling & UI

### Tailwind CSS Configuration

Custom Tailwind configuration with theme support:

```javascript
// tailwind.config.js
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          // ... more colors
        },
      },
    },
  },
}
```

### Component Library

#### Custom Components
- **Toast**: Notification system with different types (success, error, warning)
- **Spinner**: Loading indicator with multiple sizes
- **Modal**: Accessible modal dialogs using Headless UI

#### Icon System
Using Lucide React for consistent iconography:

```tsx
import { Search, Heart, User, Settings } from 'lucide-react'

export const JobSearchIcon = () => <Search className="h-5 w-5" />
```

### Responsive Design

Mobile-first responsive design with Tailwind breakpoints:

```tsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid layout */}
</div>

// Hide/show elements based on screen size
<div className="block md:hidden">Mobile only</div>
<div className="hidden md:block">Desktop only</div>
```

## 🔄 Data Flow & API Integration

### Service Layer Architecture

Each feature has its own service module for API calls:

```typescript
// src/services/jobs.ts
export const jobsApi = {
  getJobs: (params: JobSearchParams) =>
    api.get<PaginatedResponse<Job>>('/jobs', { params }),

  getJobById: (id: number) =>
    api.get<Job>(`/jobs/${id}`),

  createJob: (jobData: CreateJobRequest) =>
    api.post<Job>('/jobs', jobData),

  updateJob: (id: number, jobData: UpdateJobRequest) =>
    api.put<Job>(`/jobs/${id}`, jobData),

  deleteJob: (id: number) =>
    api.delete(`/jobs/${id}`),
}
```

### React Query Hooks

Custom hooks for data fetching with caching:

```tsx
// src/hooks/useJobs.ts
export const useJobs = (params: JobSearchParams) => {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => jobsApi.getJobs(params),
    keepPreviousData: true,
  })
}

export const useJob = (id: number) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsApi.getJobById(id),
    enabled: !!id,
  })
}

export const useCreateJob = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: jobsApi.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs'])
    },
  })
}
```

## 📱 Page Components

### Authentication Flow

#### LoginPage.tsx
User authentication with form validation:

```tsx
export const LoginPage = () => {
  const loginMutation = useLogin()

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate('/dashboard')
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
        {/* Login form fields */}
      </form>
    </div>
  )
}
```

### Dashboard System

Role-based dashboard with different content for each user type:

```tsx
export const DashboardPage = () => {
  const { user } = useAuth()

  const renderDashboard = () => {
    switch (user?.role) {
      case 'ADMIN':
        return <AdminDashboard />
      case 'EMPLOYER':
        return <EmployerDashboard />
      case 'JOB_SEEKER':
        return <JobSeekerDashboard />
      default:
        return <div>Invalid user role</div>
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {renderDashboard()}
    </div>
  )
}
```

### Job Management Pages

#### JobsPage.tsx
Advanced job search with filtering:

```tsx
export const JobsPage = () => {
  const [searchParams, setSearchParams] = useState<JobSearchParams>({})
  const { data: jobs, isLoading } = useJobs(searchParams)

  return (
    <div className="space-y-6">
      <JobFilters onFilterChange={setSearchParams} />
      <JobList jobs={jobs?.data || []} loading={isLoading} />
      <Pagination
        currentPage={jobs?.currentPage || 1}
        totalPages={jobs?.totalPages || 1}
        onPageChange={(page) => setSearchParams(prev => ({ ...prev, page }))}
      />
    </div>
  )
}
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Configuration
Using Vitest for fast unit testing:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

## 🚀 Deployment

### Build Optimization

Vite configuration for production builds:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@headlessui/react', 'lucide-react'],
        },
      },
    },
  },
})
```

### Environment-Specific Builds

```bash
# Development
npm run dev

# Staging
npm run build -- --mode staging

# Production
npm run build
```

## 🔍 Performance Optimization

### Code Splitting
Automatic route-based code splitting with React Router:

```tsx
const JobsPage = lazy(() => import('./pages/JobsPage'))
const JobDetailsPage = lazy(() => import('./pages/JobDetailsPage'))

// In App.tsx
<Route path="/jobs" element={
  <Suspense fallback={<Spinner />}>
    <JobsPage />
  </Suspense>
} />
```

### Image Optimization
```tsx
// Lazy loading images
import { lazy, Suspense } from 'react'

const LazyImage = lazy(() => import('./components/LazyImage'))

<Suspense fallback={<div>Loading...</div>}>
  <LazyImage src={imageUrl} alt="Job image" />
</Suspense>
```

### Bundle Analysis
```bash
npm run build -- --mode analyze
```

## 🔧 Development Tools

### ESLint Configuration
TypeScript-aware linting with React rules:

```javascript
// eslint.config.js
export default defineConfig([
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.app.json'],
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Custom rules
    },
  },
])
```

### TypeScript Configuration

Strict TypeScript configuration for type safety:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Use TypeScript for all new code
- Follow React best practices and hooks guidelines
- Maintain consistent code formatting with ESLint
- Write meaningful commit messages
- Add tests for new features
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🗺️ Roadmap

- [ ] Progressive Web App (PWA) support
- [ ] Advanced job search with filters and sorting
- [ ] Real-time notifications with WebSocket
- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] AI-powered job recommendations
- [ ] Video interview integration
- [ ] Advanced CV parsing and analysis

---

**Built with ❤️ using React & TypeScript**
