# Angular Basic Project - AI Coding Agent Instructions

## Project Overview

**Angular 19 SSR (Server-Side Rendering) Application** with modern standalone components, routing, and Express server integration.

- **Angular Version:** 19.2.0 with SSR enabled
- **Rendering:** Client-side hydration with `withEventReplay()`
- **Architecture:** Standalone component-based (no NgModules)
- **Styling:** Component-scoped CSS + global `src/styles.css`

## Architecture & Key Files

### Component Structure

- **Root:** `src/app/app.component.ts` - Uses standalone `imports`, template-driven
- **Routing:** `src/app/app.routes.ts` - Lazy-loaded routes (currently empty)
- **Config:** `src/app/app.config.ts` - ApplicationConfig providers (DI, router, hydration)
- **Shared Components:** `src/app/shared/header/` - Reusable header with dropdown menus

**Pattern:** All components use `imports` array instead of `@NgModule()` declarations

### Server-Side Rendering (SSR)

```
src/main.ts              → Client bootstrap
src/main.server.ts       → Server bootstrap wrapper
src/server.ts            → Express server (AngularNodeAppEngine)
dist/angular-basic-project/browser  → Client assets
dist/angular-basic-project/server   → Server bundle
```

- SSR uses `AngularNodeAppEngine` for request handling
- Available for API endpoint creation via Express middleware (see `src/server.ts` comments)
- Hydration with event replay: `provideClientHydration(withEventReplay())`

### Shared Types & Services

- **Models:** `src/app/models/auth.model.ts` - Auth interfaces (User, RegisterRequest, AuthResponse, etc.)
- **Services:** `src/app/shared/services/auth.service.ts` - Authentication API calls and token management
- **Components:**
  - `src/app/components/register/` - User registration form with validation
  - `src/app/components/login/` - User login form

## Development Workflows

### Starting the Development Server

```bash
npm start    # ng serve → runs on http://localhost:4200/
npm run watch  # Build in watch mode for development
```

### Building & Deployment

```bash
npm run build       # Production build with optimizations (see angular.json budgets)
npm run serve:ssr:angular-basic-project  # Run SSR server locally
```

### Testing

```bash
npm test     # Karma + Jasmine (runs headless Chrome)
# Note: E2E tests not configured - use ng e2e after installing framework
```

## TypeScript Configuration

- **Target:** ES2022
- **Module:** ES2022
- **Strict Mode:** Enabled (`strict: true`)
- **Features:** `experimentalDecorators: true`, `esModuleInterop: true`
- **Angular Compiler:**
  - `strictTemplates: true` - Type-check all templates
  - `strictInjectionParameters: true`
  - `strictInputAccessModifiers: true`

**Implication:** Avoid loose typing; always annotate component inputs/outputs.

## Code Style & Conventions

### Component Pattern

```typescript
@Component({
  selector: "app-example", // Must start with 'app-' prefix
  imports: [CommonModule], // Explicit imports (no shared module)
  templateUrl: "./example.component.html",
  styleUrl: "./example.component.css",
})
export class ExampleComponent {
  // Implementation
}
```

- **Component files:** Paired CSS/HTML (not inline styles/templates)
- **Imports:** Use `CommonModule` for `*ngIf`, `*ngFor`; `RouterModule` for routing
- **Naming:** kebab-case for selectors, PascalCase for classes
- **Lifecycle:** Use `OnInit` when needed; avoid NgOnDestroy for simple cases

### File Organization

```
src/app/
├── (routes)           # Future: feature modules
├── shared/            # Reusable components (header)
├── app.routes.ts      # Route definitions
├── app.config.ts      # Provider configuration
└── app.component.ts   # Root component
```

## Key Dependencies

- **@angular/ssr** - Server rendering
- **@angular/common/http** - HTTP client for API calls
- **@angular/forms** - Reactive Forms (FormBuilder, Validators)
- **express** - Backend server
- **rxjs ~7.8.0** - Reactive patterns (import from 'rxjs' directly)
- **@angular/router** - Routing (lazy-loading ready)

## Testing Patterns

- **Test Files:** `.spec.ts` alongside source files
- **Framework:** Jasmine + Karma
- **Conventions:** Typical Angular testing (TestBed, component fixtures)

Example: `src/app/app.component.spec.ts`, `src/app/shared/header/header.component.spec.ts`

## Important Constraints & Build Budgets

**Production build budgets (from `angular.json`):**

- Initial bundle: 500KB warning, 1MB error
- Component styles: 4KB warning, 8KB error

Keep bundle size conscious when adding dependencies or large components.

## Extension Points

1. **Routes:** Add routes to `src/app/app.routes.ts` (currently has `/dang-ki` and `/dang-nhap`)
2. **Auth Service:** Extend `src/app/shared/services/auth.service.ts` with methods for password reset, profile update, etc.
3. **API Endpoints:** Update `apiUrl` in auth service; backend docs in `BACKEND_SETUP.md`
4. **Global Styles:** `src/styles.css`
5. **Services:** Create in `src/app/` or `src/app/shared/services/` with DI

## Authentication & Forms

### Form Validation Pattern

```typescript
// Use ReactiveFormsModule with FormBuilder
registerForm = this.fb.group(
  {
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6), Validators.pattern(/regex/)]],
  },
  { validators: customValidator },
); // Cross-field validation

// Template: [class.is-invalid]="isFieldInvalid('fieldName')"
```

### Auth Service API

- `register(data: RegisterRequest)` - Create account
- `login(data: LoginRequest)` - Login with credentials
- `loginWithGoogle(data: GoogleLoginRequest)` - OAuth login
- `logout()` - Clear tokens
- `getToken()` - Retrieve JWT from localStorage
- `isAuthenticated()` - Check auth status

### Token Management

- JWT stored in `localStorage` as `auth_token` and `refresh_token`
- BehaviorSubjects for reactive state: `user$`, `authenticated$`
- Error handling with custom error messages (Vietnamese localized)

### API Base Configuration

Update `apiUrl` in `AuthService` or use environment files:

```typescript
private apiUrl = 'http://localhost:3000/api/auth'; // Development
```

See `API_DOCUMENTATION.md` for endpoint specs and `BACKEND_SETUP.md` for implementation guide.

## Common Commands via Angular CLI

```bash
ng generate component my-component              # Create new component
ng generate service my-service                  # Create service with DI
ng generate guard auth-guard                    # Create auth guard
ng build --configuration=production             # Explicit prod build
```

## Hydration Notes

- Client hydrates existing DOM from SSR
- `withEventReplay()` captures user events during hydration
- Avoid DOM manipulation in constructors; use `OnInit` lifecycle
