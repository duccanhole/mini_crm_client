# CRM Client - Enterprise SaaS Frontend

A production-grade Customer Relationship Management (CRM) client application built with modern frontend technologies. Demonstrates enterprise-scale architecture, clean separation of concerns, and real-world patterns for team collaboration and sales process optimization.

## Project Overview

This CRM client is designed as a scalable, maintainable frontend for managing complex business processes. It supports three distinct user roles (Admin, Manager, Sales) with granular permission-based access control, enabling teams to efficiently manage customer relationships, track sales activities, and collaborate in real-time.

The architecture emphasizes **separation of concerns**, **API-driven design**, and **maintainable component hierarchy**—patterns essential for production SaaS applications supporting multiple user types and complex workflows.

## Key Features

### Core Functionality
- **Multi-role Support**: Role-based access control (RBAC) for Admin, Manager, and Sales roles
- **Lead Management**: Pipeline tracking, status updates, value forecasting, and assignment workflows
- **Customer Management**: Comprehensive customer profiles with interaction history and metadata
- **Activity Tracking**: Chronological logging of all customer and lead interactions
- **Real-time Notifications**: Live updates on critical business events and assigned tasks
- **Dashboard Analytics**: Executive overview with revenue forecasts and team metrics

### Architecture Highlights
- **Enterprise Authentication**: JWT-based auth with secure token management and role propagation
- **Centralized API Layer**: Axios with interceptors for consistent request/response handling
- **Query Management**: TanStack React Query for server state synchronization and caching
- **Middleware Pipeline**: Auth + i18n middleware for cross-cutting concerns
- **Type Safety**: Full TypeScript implementation with strict compiler settings
- **Internationalization**: Multi-language support (en, vi) with locale-aware routing

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js (App Router) | 16.1.6 | Full-stack React framework with SSR/SSG |
| **Language** | TypeScript | 5 | Type-safe development |
| **UI Library** | Ant Design (antd) | 6.2.3 | Enterprise component library |
| **State Management** | TanStack React Query | 5.90.20 | Server state & caching |
| **Styling** | Tailwind CSS + CSS Modules | 4.1.18 | Utility-first + scoped styles |
| **HTTP Client** | Axios | 1.13.5 | HTTP requests with interceptors |
| **Charts** | Recharts + Ant Design Plots | 3.7.0 + 2.6.8 | Data visualization |
| **Auth** | JWT + js-cookie | 3.0.5 | Client-side token management |
| **i18n** | next-intl | 4.8.2 | Internationalization framework |
| **Utilities** | dayjs | 1.11.19 | Date/time handling |
| **Compiler** | React Compiler | 19.2.3 | Automatic memoization |

**Why these choices?**
- **Ant Design**: Enterprise-grade components with accessibility, reducing development time for production workflows
- **React Query**: Eliminates manual server state management, ensuring consistency and reducing bugs
- **Next.js App Router**: Modern routing with built-in middleware support and optimized performance
- **Type-safe stack**: Reduces runtime errors and improves maintainability for large teams

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│  React Components (Next.js App Router)                   │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
    ┌───▼────┐                   ┌───▼─────┐
    │ Hooks  │                   │Components│
    │ Layer  │                   │  Layer   │
    └───┬────┘                   └──────────┘
        │
    ┌───▼──────────────────────────────────┐
    │   TanStack React Query                │
    │   (Server State Management)           │
    └───┬──────────────────────────────────┘
        │
    ┌───▼──────────────────────────────────┐
    │   Service Layer (Business Logic)      │
    │   - AuthService                       │
    │   - UserService                       │
    │   - LeadService                       │
    │   - CustomerService, etc.             │
    └───┬──────────────────────────────────┘
        │
    ┌───▼──────────────────────────────────┐
    │   API Client Layer (axios)            │
    │   - Request Interceptors (JWT)        │
    │   - Response Interceptors (Errors)    │
    └───┬──────────────────────────────────┘
        │
    ┌───▼──────────────────────────────────┐
    │   Middleware (Next.js)                │
    │   - Auth Middleware                   │
    │   - i18n Middleware                   │
    └───┬──────────────────────────────────┘
        │
    └──────────────► REST API Backend
```

### Design Patterns

**1. Service Layer Pattern**
- Encapsulates API calls and business logic
- Reusable across components
- Example: `AuthService.login()`, `LeadService.getLeads()`

**2. Custom Hooks Pattern**
- React Query mutations/queries wrapped in semantic hooks
- Provides consistent error handling and side effects
- Example: `useLogin()`, `useLeadList()`

**3. RBAC (Role-Based Access Control)**
- Declarative permission model in `lib/rbac.ts`
- Fine-grained entity and action control
- Enforced at both UI and API layers

**4. JWT Token Management**
- Secure: Token stored in HTTP-only cookie (via middleware)
- Automatic: Injected into request headers via interceptor
- Reactive: 401/403 triggers re-authentication

**5. Query Caching Strategy**
- React Query handles server state
- Client state in component/context where needed
- Optimized for CRM workflows (paginated lists, detail views)

## Folder Structure

```
mini_crm_client/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Welcome/redirect page
│   └── [locale]/                # Locale-based routing
│       ├── auth/                # Authentication pages
│       │   ├── login/
│       │   └── register/
│       ├── admin/               # Admin dashboard
│       │   ├── users/
│       │   ├── customers/
│       │   ├── leads/
│       │   └── activities/
│       ├── manager/             # Manager dashboard
│       │   ├── overview/
│       │   ├── users/
│       │   └── [other modules]
│       └── sale/                # Sales dashboard
│           ├── customers/
│           ├── leads/
│           └── [other modules]
│
├── components/                   # Reusable React components
│   ├── layouts/                 # Layout wrappers
│   │   └── MainLayout.tsx
│   ├── pages/                   # Page-level components
│   │   ├── customers/
│   │   ├── leads/
│   │   ├── activities/
│   │   ├── users/
│   │   └── profile/
│   ├── shared/                  # Shared UI components
│   │   ├── NotificationDropdown.tsx
│   │   └── [others]
│   └── providers/               # Context providers
│       ├── QueryProvider.tsx    # React Query config
│       └── ThemeProvider.tsx    # Ant Design theme
│
├── hooks/                        # Custom React hooks
│   ├── useDebounce.ts           # Common utilities
│   ├── useLanguage.ts
│   ├── useUserInfo.ts
│   └── api/                     # React Query hooks
│       ├── useAuth.ts           # Login, register
│       ├── useLead.ts           # Lead CRUD operations
│       ├── useCustomer.ts
│       ├── useUser.ts
│       ├── useActivity.ts
│       ├── useNotification.ts
│       └── chart/
│           └── useChartData.ts
│
├── services/                     # Business logic layer
│   ├── auth.service.ts
│   ├── lead.service.ts
│   ├── customer.service.ts
│   ├── user.service.ts
│   ├── activity.service.ts
│   └── notification.service.ts
│
├── lib/                          # Utility libraries
│   ├── api-client.ts            # Axios instance with interceptors
│   ├── rbac.ts                  # Permission control
│   ├── validation.ts            # Form validation rules
│   └── dayjs.ts                 # Date utility config
│
├── types/                        # TypeScript definitions
│   ├── model.ts                 # Domain models (User, Lead, Customer, etc.)
│   └── api.ts                   # API request/response types
│
├── middleware/                   # Next.js middleware
│   └── auth.ts                  # Route protection & token extraction
│
├── i18n/                         # Internationalization
│   ├── request.ts               # i18n request config
│   └── routing.ts               # Locale routing setup
│
├── messages/                     # Localization files
│   ├── en.json                  # English translations
│   └── vi.json                  # Vietnamese translations
│
├── public/                       # Static assets
│
├── docs/                         # Documentation
│   └── auth.middleware.md
│
├── next.config.ts               # Next.js configuration with i18n
├── tsconfig.json                # TypeScript strict mode
├── middleware.ts                # Edge middleware
├── eslint.config.mjs            # Linting rules
├── postcss.config.mjs           # CSS processing
└── package.json                 # Dependencies & scripts
```

## Core Modules

### Authentication Module (`hooks/api/useAuth.ts`)

Handles user login, registration, and logout with role-based routing:

```typescript
const { mutate: login, isPending } = useLogin();

login(
  { email: 'user@example.com', password: 'secure' },
  {
    onSuccess: () => {
      // Routes to /admin, /manager, or /sale based on role
      // Tokens stored in cookies
    },
    onError: (error) => {
      // Display error message
    }
  }
);
```

**Key features**:
- Automatic role-based routing post-login
- Secure cookie-based token storage
- Error boundary handling

### Lead Management Module (`services/lead.service.ts`)

Provides complete lead CRUD operations tied to customer records:

- List leads with filters and pagination
- Create/edit leads with validation
- Track status changes (NEW → CONTACTED → QUALIFIED)
- Assign leads to sales representatives
- Forecast revenue from open deals

### Customer Management Module

Centralized customer database with:
- Customer profile and company information
- Communication history (calls, emails, meetings)
- Activity timeline
- Sales rep assignment
- Account metadata and notes

### Activity Tracking Module

Chronological event log for auditing and CRM value:
- Call logs
- Meeting notes
- Email correspondence
- Task completion
- Status updates

**Value**: Provides full visibility into customer interactions across the entire organization.

### Notifications Module

Real-time business event alerts:
- Lead assignment notifications
- Deal status changes
- Important customer updates
- Task reminders

Supports both notification dropdown (in-app) and potential backend integration for push/email.

### RBAC System (`lib/rbac.ts`)

Fine-grained permission control:

```typescript
// Permission matrix
{
  admin: { users: ['view', 'edit', 'delete'], ... },
  manager: { customers: ['view', 'edit'], leads: ['view', 'edit'] },
  sale: { customers: ['view', 'edit'], leads: ['view', 'edit'] }
}

// Usage
canDeleteUser = hasPermission(userRole, 'users', 'delete');
```

Enforced at three levels:
1. **Middleware**: Route-level protection
2. **Component**: UI element visibility
3. **API**: Backend validation

## Getting Started

### Prerequisites

- **Node.js** 18+ (v20 recommended)
- **pnpm** 8+ (or npm/yarn as alternatives)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd mini_crm_client

# Install dependencies
pnpm install

# Or with npm
npm install
```

### Development Server

```bash
pnpm dev
```

Starts development server at `http://localhost:3000`

- **Hot Module Reloading**: Changes reflect instantly
- **React Query DevTools**: Debug query states via panel
- **TypeScript**: Full type checking during development

### Build for Production

```bash
# Build optimized bundle
pnpm build

# Start production server
pnpm start
```

### Linting

```bash
# Run ESLint on all files
pnpm lint
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Optional: WebSocket for real-time notifications
# NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws

# Deployment
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important notes**:
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Token management is handled via middleware and cookies
- `.env.local` should be added to `.gitignore`

## API Integration

### Axios Client with Interceptors (`lib/api-client.ts`)

Provides a centralized HTTP client with automatic JWT injection:

```typescript
import apiClient from '@/lib/api-client';

// Automatically includes Authorization header with token
const response = await apiClient.get('/leads');
```

**Request Interceptor**:
- Retrieves JWT token from cookies
- Injects `Authorization: Bearer {token}` header
- Handles token expiration gracefully

**Response Interceptor**:
- Centralizes error handling
- Auto-redirects to login on 401/403
- Clears auth state on unauthorized access
- Formats error messages for UI

### Service Layer Pattern

Each domain has a dedicated service file:

```typescript
// services/lead.service.ts
const LeadService = {
  getLeads: async (params) => apiClient.get('/leads', { params }),
  getLeadById: async (id) => apiClient.get(`/leads/${id}`),
  createLead: async (data) => apiClient.post('/leads', data),
  updateLead: async (id, data) => apiClient.patch(`/leads/${id}`, data),
  deleteLead: async (id) => apiClient.delete(`/leads/${id}`),
};
```

Benefits:
- **Reusability**: Called from hooks and components
- **Maintainability**: Centralized endpoint management
- **Testability**: Easy to mock for unit tests

### React Query Integration (`hooks/api/`)

Custom hooks wrap React Query for semantic APIs:

```typescript
export const useLeadList = (filters) => {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: () => LeadService.getLeads(filters),
  });
};

// In components
const { data, isLoading, error } = useLeadList({ status: 'NEW' });
```

**Benefits**:
- Automatic caching and background refetching
- Optimistic updates support
- Built-in loading/error states
- Integrated with Ant Design message/notification

## Development Guidelines

### Component Architecture

**Layers**:
1. **Page Components** (`app/[locale]/*/page.tsx`): Route handlers
2. **Layout Components** (`components/pages/*`): Page logic and state
3. **UI Components** (`components/*`): Reusable, presentational
4. **Provider Components** (`components/providers/*`): Context wrappers

**Example**:
```typescript
// Page component (route handler)
export default function LeadsPage() {
  return <LeadsLayout />;
}

// Layout component (business logic)
function LeadsLayout() {
  const { data, isLoading } = useLeadList();
  return <LeadListView leads={data} />;
}

// UI component (presentational)
function LeadListView({ leads }) {
  return <Table dataSource={leads} />;
}
```

### Data Flow

```
Component → React Query Hook → Service Layer → API Client
     ↓                                          ↓
  UI State                            REST API Backend
```

### Type Safety

Project uses **strict TypeScript** configuration:
- `strict: true` in `tsconfig.json`
- `noImplicitAny` enabled
- All API responses typed via `types/api.ts`

**Example**:
```typescript
interface Lead {
  id: string;
  customer: Customer;
  value: number;
  status: LeadStatus;
  assignedTo: User;
  expectedCloseDate: string;
}

// Type-checked API calls
const { data: leads } = useLeadList(); // leads: Lead[] | undefined
```

### Form Validation

Ant Design Form with integrated validation (`lib/validation.ts`):

```typescript
form.validateFields(['email', 'name']).then(values => {
  // values are typed and validated
});
```

### Internationalization

Language switching via `next-intl`:

```typescript
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('common');
  return <h1>{t('welcome')}</h1>;
}
```

Supports English (en) and Vietnamese (vi) with locale-aware routing:
- `/en/admin/leads` → English UI
- `/vi/admin/leads` → Vietnamese UI

### Authentication Flow

```
User Input Login Credentials
         ↓
    useLogin() Hook
         ↓
    AuthService.login(credentials)
         ↓
    API Client (POST /auth/login)
         ↓
    Middleware Extracts Token
         ↓
    Token → HTTP-Only Cookie
         ↓
    Redirect by Role: /admin, /manager, or /sale
```

**Security considerations**:
- Token stored in HTTP-only cookie (immune to XSS)
- Middleware validates token before route access
- 401/403 responses trigger re-authentication
- Role propagated server-side for SSR safety

### State Management

**Server State** (React Query):
- Lists, detail views, paginated data
- Automatic refetching and caching
- Persistent across navigation

**Client State** (Component/Context):
- UI state (modals, dropdowns)
- Form values (before submission)
- Language/theme preferences

## Future Improvements

### Real-time Collaboration
- **WebSocket Integration**: Replace polling with bidirectional updates

### Analytics Enhancement
- **Custom Dashboards**: Role-based KPI visualizations
- **Sales Pipeline Analytics**: Stage conversion rates, deal velocity
- **Forecasting**: AI-driven revenue predictions

### Advanced Features
- **Export/Import**: Bulk operations for data management
- **Audit Logs**: Complete change history for compliance
- **Custom Fields**: Dynamic schema for flexible data models

### Testing & Quality
- **Unit Tests**: Jest for utilities, hooks, services
- **Integration Tests**: React Testing Library for components
- **E2E Tests**: Playwright for critical user flows
- **Performance Monitoring**: Web Vitals tracking

## License

This project is private and intended for portfolio demonstration purposes. 

If used in a production setting, ensure compliance with your organization's licensing requirements and data protection regulations (GDPR, data handling, etc.)

---

## Contributing

This is a portfolio project. For contributions or questions, please reach out directly.

## Support

For issues or feature requests related to the frontend architecture, refer to project documentation in `/docs` or contact the maintainer.

---

**Last Updated**: March 2026
