# Authentication & Authorization System Documentation

## Overview

The My World App now includes a comprehensive authentication and authorization system with role-based access control (RBAC). Users can register, log in, and access features based on their assigned roles.

## Features

### Authentication

- **User Registration**: New users can create accounts with email, password, first name, and last name
- **User Login**: Secure login with JWT token generation
- **Session Management**: Automatic token storage and retrieval from localStorage
- **Logout**: Clear session and redirect to login page

### Authorization & Roles

- **Admin Role**: Access to expense tracker and admin tools
- **User Role**: Access to learning app and basic features
- **Protected Routes**: Routes automatically redirect unauthenticated users to login

### UI/UX

- **Modern Login/Register Pages**: Beautiful, responsive design with light/dark mode support
- **User Menu**: Dropdown menu in header showing user info and quick actions
- **Role-Based Sidebar**: Hides/shows admin features based on user role
- **Error Handling**: Graceful error messages and unauthorized access pages

## Architecture

### Backend Structure

#### Models & DTOs

- **AuthDtos.cs**: Contains RegisterDto, LoginDto, and AuthResponseDto
    - RegisterDto: Email, Password, FirstName, LastName, Role
    - LoginDto: Email, Password
    - AuthResponseDto: Complete response with token, roles, user info, and status

#### Controllers

- **AuthController.cs**: Handles authentication endpoints
    - POST `/api/auth/register`: User registration
    - POST `/api/auth/login`: User login
    - POST `/api/auth/register-admin`: Admin registration (protected)

#### JWT Configuration

- Located in Program.cs
- Token validity: 30 days
- Claims include: Subject, JTI, NameIdentifier, and Roles
- Validation settings configured for issuer, audience, and signing key

### Frontend Structure

#### Contexts

- **AuthContext.tsx**: Global authentication state management
    - Manages user state, token, and authentication methods
    - Provides useAuth() hook for consuming auth state
    - Handles login, register, logout, and role checking

#### Components

- **Login.tsx**: Login page with email/password
    - Demo credentials display
    - Password visibility toggle
    - Loading states
- **Register.tsx**: Registration page with form validation
    - First name, last name, email, password fields
    - Password confirmation matching
    - Form validation
- **Header.tsx**: Updated with user menu
    - Shows user avatar and name when logged in
    - Dropdown menu with user info and admin features
    - Login/Register links when not authenticated
- **Sidebar.tsx**: Updated with role-based visibility
    - Admin-only Expense Tracker section with badge
    - Admin Tools section with admin indicator
    - Conditional rendering based on user role

- **ProtectedRoute.tsx**: Route wrapper for authentication
    - Redirects unauthenticated users to login
    - Checks required roles for admin routes
    - Shows loading state while checking authentication

#### API

- **apiClient.ts**: HTTP client with automatic token injection
    - createApiEndpoint(): Creates axios instance with auth interceptors
    - Automatic token retrieval from localStorage
    - Automatic logout on 401 responses
    - Global error handling

## Setup Instructions

### Backend Setup

1. **Ensure JWT Configuration**

    ```csharp
    // In appsettings.json
    "Jwt": {
      "Key": "Your-super-secret-key-here-minimum-32-chars",
      "Issuer": "MyDevWorld",
      "Audience": "MyDevWorld"
    }
    ```

2. **Database Migration**

    ```bash
    dotnet ef migrations add AddAuthRoles
    dotnet ef database update
    ```

3. **Seed Roles and Demo Users**
   The application automatically creates roles (Admin, Developer, User) and a demo admin user on startup.

### Frontend Setup

1. **Install Dependencies**

    ```bash
    cd UI
    npm install
    ```

2. **Start Development Server**

    ```bash
    npm run dev
    ```

3. **Ensure Backend URL**
    - Update API_BASE_URL in `src/api/apiClient.ts` if needed
    - Default: `http://localhost:5000/api`

## Demo Accounts

Login credentials for testing:

### Admin Account

- **Email**: admin@example.com
- **Password**: Admin123!
- **Access**: Expense Tracker, Admin Tools

### Regular User Account

- **Email**: user@example.com
- **Password**: User123!
- **Access**: Learning App, Basic Features

> Note: Create these accounts through the register page or update the Program.cs seed method.

## User Flow

### Registration

1. User navigates to `/register`
2. Fills in email, password, first name, last name
3. Form validates password confirmation and minimum length
4. Submits to `/api/auth/register`
5. Backend creates user with "User" role
6. Returns JWT token and user details
7. Frontend stores token in localStorage
8. Redirects to home page

### Login

1. User navigates to `/login`
2. Enters email and password
3. Submits to `/api/auth/login`
4. Backend validates credentials
5. Generates JWT token
6. Returns token and user roles
7. Frontend stores token and user info
8. Redirects to home page

### Access Control

1. Protected routes check authentication via ProtectedRoute
2. Unauthenticated users redirected to `/login`
3. Routes requiring specific roles (e.g., Admin) check role permissions
4. Unauthorized access redirects to `/unauthorized`
5. Sidebar conditionally shows admin features

## Security Considerations

### Token Management

- Tokens stored in localStorage (consider using httpOnly cookies for production)
- Token automatically included in all API requests via interceptor
- Token validation on backend using JWT bearer schema
- Automatic logout on 401 unauthorized responses

### Password Security

- Minimum 6 characters required
- Validated on frontend and backend
- Uses ASP.NET Identity for secure hashing

### CORS

- Configured to accept requests from localhost:5173
- Can be extended to production domains

### Role-Based Access

- Roles assigned during registration (default: User)
- Admin role must be manually assigned by database
- Route-level protection using ProtectedRoute wrapper
- Component-level visibility based on hasRole() check

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/register-admin` - Admin registration (protected)

### Authorization Header

```
Authorization: Bearer {token}
```

## Response Format

### Success Response

```json
{
    "token": "eyJhbGc...",
    "roles": ["Admin"],
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "success": true,
    "message": "Login successful"
}
```

### Error Response

```json
{
    "success": false,
    "message": "Invalid login attempt"
}
```

## Extending the System

### Adding New Roles

1. Update Program.cs role seeding section
2. Add role checks in ProtectedRoute component
3. Update sidebar visibility logic

### Adding Admin Features

1. Wrap component with `ProtectedRoute requiredRoles={["Admin"]}`
2. Update sidebar to show/hide feature
3. Update Header menu with admin actions

### Custom Authorization

Use the `useAuth()` hook in any component:

```tsx
const { user, hasRole } = useAuth();

if (hasRole("Admin")) {
    // Show admin features
}
```

## Troubleshooting

### Login Not Working

- Check backend API is running on port 5000
- Verify CORS configuration includes frontend URL
- Check JWT configuration in appsettings.json
- Verify roles exist in database

### Protected Routes Not Loading

- Clear localStorage and retry login
- Check browser console for token errors
- Verify token format in API responses
- Check AuthContext is properly initialized

### Dark Mode Not Applying

- Ensure ThemeProvider wraps entire app
- Check data-theme attribute on html element
- Verify CSS variables use correct selectors

### Admin Features Not Showing

- Verify user has Admin role in database
- Check role claim in JWT token
- Verify ProtectedRoute has correct role requirements
- Check sidebar visibility logic

## Performance

- Auth state persisted in localStorage for instant page loads
- Loading states prevent UI flickering during auth checks
- Token included in all API requests automatically
- Efficient role checking with array includes()

## Future Enhancements

- [ ] Refresh token implementation
- [ ] Multi-factor authentication (MFA)
- [ ] Social login (Google, GitHub)
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Session management dashboard
- [ ] Audit logging for auth events
- [ ] Rate limiting on auth endpoints
- [ ] Activity logs per user

## Support

For issues or questions, check:

1. Browser console for errors
2. Network tab for API responses
3. Backend logs for server-side issues
4. Storage tab for token presence
