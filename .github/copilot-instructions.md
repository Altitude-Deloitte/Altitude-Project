# Altitude Campaign Content Creation Platform - AI Coding Guide

## Project Overview

Angular 19 SSR application for AI-powered marketing campaign content generation (emails, blogs, social media, images, videos). Uses PrimeNG components, Tailwind CSS, NgRx Signals state management, and Socket.IO for real-time updates.

## Architecture Patterns

### Component Structure

- **Form-Review-Client Triads**: Each content type (email, blog, social, etc.) follows the pattern:
  - `*-form`: Input collection with reactive forms
  - `*-review`: Content preview and editing with TinyMCE
  - `*-client`: Client feedback and approval workflow
- **Lazy Loading**: All routes use `loadComponent()` for code splitting
- **Standalone Components**: No NgModules, components are self-contained with `imports` array

### State Management

- **NgRx Signals**: Modern reactive state using `signalStore()` in `src/app/store/`
  - `campaign.store.ts`: Campaign type selections
  - `tab.store.ts`: Navigation state
  - `meme.store.ts`: Meme generation state
- **BehaviorSubjects**: Service-level state in `ContentGenerationService` for form data sharing between triads

### Service Architecture

- **ContentGenerationService**: Centralized API communication with multiple endpoints
  - Backend APIs: GCP Cloud Run (`campaign-content-creation-backend-392853354701.asia-south1.run.app`)
  - Local services: Various localhost endpoints for different content types
  - Social media integrations (Facebook, Instagram tokens)
- **SocketConnectionService**: Real-time status updates with message queuing system

## Development Workflows

### Local Development

```bash
ng serve  # Standard dev server on port 4200
ng build --watch --configuration development  # Watch mode builds
```

### Component Generation

Follow the established pattern for new content types:

```bash
ng generate component components/[type]/[type]-form
ng generate component components/[type]/[type]-review
ng generate component components/[type]/[type]-client
```

### Theme System

- **PrimeNG Theming**: Custom preset in `src/theme-preset.ts` with purple primary colors
- **Dark Mode**: CSS class-based (`dark` class) with Tailwind utilities
- **Custom Colors**: Defined in `tailwind.config.js` (darkbg, lightbg, darksecondary, etc.)

## Key Conventions

### Routing

- All routes in `app.routes.ts` use lazy loading with `loadComponent()`
- Default redirect: `''` → `'login'`
- Component-specific routes follow kebab-case naming

### API Integration

- Axios for HTTP calls in services (not Angular HttpClient in main service)
- Socket.IO for real-time status updates with connection management
- File uploads handled through FormData with image preview functionality

### Form Patterns

- Reactive Forms with FormBuilder injection: `fb = inject(FormBuilder)`
- ViewChild for file inputs: `fileInput = viewChild('fileInput')`
- Signal-based form state: `isFormValid = signal(false)`

### Shared Components

- **Header/Footer**: Consistent navigation in `src/app/shared/`
- **Theme Toggler**: Dark/light mode switching service
- **Route Animations**: Fade transitions in `route-animations.ts`
- **Chat App**: Embedded chat functionality

## Build & Deployment

### SSR Configuration

- Server-side rendering enabled with `@angular/ssr`
- Entry points: `main.server.ts`, `server.ts`
- Docker support with `Dockerfile` and `nginx.conf`

### Production Build

- Bundle size limits: 1MB warning, 2MB error for initial chunks
- 4kB/8kB limits for component styles
- Output hashing enabled for cache busting

## Integration Points

### External APIs

- **Brand Fetch API**: Logo/brand asset retrieval
- **Social Media APIs**: Facebook/Instagram for content publishing
- **Image Generation**: Dedicated microservice on port 4000
- **Video Generation**: GCP backend endpoint
- **Content APIs**: Multiple backend services for different content types

### Real-time Features

- Socket.IO connection to GCP backend for generation status
- Message queuing system for status updates
- Signal-based reactive updates in components

## Testing Strategy

- Karma + Jasmine for unit tests
- Component spec files follow Angular CLI conventions
- Test configuration in `karma.conf.js` (inferred from dependencies)

When adding new features, ensure they follow the triadic component pattern, use NgRx Signals for state management, and maintain the established lazy loading and SSR compatibility.
