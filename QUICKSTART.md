# Quick Start Guide - Authentication System

## 🚀 Getting Started

This guide will help you quickly set up and run the My World App with the new authentication system.

## Prerequisites

- .NET 9.0 or higher
- Node.js 18+ and npm
- SQL Server (LocalDB or full instance)
- Visual Studio Code or Visual Studio

## 🔧 Backend Setup

### 1. Navigate to Backend

```bash
cd BackendApp
```

### 2. Update Connection String

Edit `appsettings.Development.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=MyWorldDb;Trusted_Connection=true;"
}
```

### 3. Run Database Migrations

```bash
dotnet ef database update
```

This will:

- Create the database
- Apply all migrations
- Seed roles (Admin, Developer, User)
- Create demo admin user: `admin@example.com` / `Admin123!`

### 4. Start Backend Server

```bash
dotnet run
```

Backend will be available at: `http://localhost:5000`

## 🎨 Frontend Setup

### 1. Navigate to Frontend

```bash
cd UI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## 🧪 Testing the Auth System

### Login as Admin

1. Visit `http://localhost:5173/login`
2. Enter:
    - Email: `admin@example.com`
    - Password: `Admin123!`
3. Click "Sign In"
4. Access Expense Tracker from sidebar (admin-only feature)

### Register as New User

1. Visit `http://localhost:5173/register`
2. Fill in:
    - First Name: Your first name
    - Last Name: Your last name
    - Email: your@email.com
    - Password: YourPassword123!
    - Confirm Password: YourPassword123!
3. Click "Create Account"
4. You'll be logged in as a regular User
5. Access Learning App from sidebar

### Test Protected Routes

1. Log out from the user menu
2. Try accessing `http://localhost:5173/expenses` directly
3. You should be redirected to login page
4. Log in as admin to access it

## 📁 Key Files Created

### Frontend

```
src/
├── contexts/
│   └── AuthContext.tsx          # Auth state management
├── api/
│   └── apiClient.ts             # HTTP client with auth
├── components/
│   └── ProtectedRoute.tsx        # Route protection wrapper
└── app/
    ├── auth/
    │   └── pages/
    │       ├── Login.tsx         # Login page
    │       ├── Register.tsx       # Register page
    │       └── auth.css           # Auth styling
    └── error/
        └── pages/
            ├── Unauthorized.tsx   # Access denied page
            └── error.css          # Error page styling
```

### Backend

```
BackendApp/
├── Controllers/
│   └── AuthController.cs         # Updated with new endpoints
├── Models/
│   └── Dtos/
│       └── AuthDtos.cs           # Updated DTOs
└── Program.cs                    # Updated with JWT config
```

## 🔐 Authentication Flow

```
User Registration
├─ Submit email, password, name
├─ Backend validates & creates user
├─ Assign "User" role by default
├─ Generate JWT token
└─ Store token in localStorage

User Login
├─ Submit email, password
├─ Backend validates credentials
├─ Generate JWT token
├─ Include roles in token
├─ Store token & user info locally
└─ Redirect to home

Protected Route Access
├─ Check if token exists
├─ Validate token not expired
├─ Check required roles (if any)
├─ Allow access or redirect to login
└─ Auto-include token in API requests
```

## 🎯 Key Features

### ✅ Implemented

- [x] User registration with validation
- [x] Secure login with JWT tokens
- [x] Role-based access control (Admin/User)
- [x] Protected routes with automatic redirects
- [x] User menu in header
- [x] Logout functionality
- [x] Admin-only features (Expense Tracker)
- [x] Responsive design with light/dark mode
- [x] Error handling and validation
- [x] API client with automatic token injection

### 🔜 Suggested Enhancements

- Email verification for new accounts
- Password reset functionality
- Refresh token implementation
- Multi-factor authentication (MFA)
- Social login (Google, GitHub)
- Activity logging
- Session management dashboard

## 🛠️ Common Tasks

### Create New Admin User

Update `Program.cs`:

```csharp
var newAdminEmail = "newadmin@example.com";
var newAdminUser = new IdentityUser { UserName = newAdminEmail, Email = newAdminEmail };
var result = await userManager.CreateAsync(newAdminUser, "YourPassword123!");
if (result.Succeeded)
{
    await userManager.AddToRoleAsync(newAdminUser, "Admin");
}
```

### Assign Admin Role to Existing User

Use SQL:

```sql
INSERT INTO AspNetUserRoles (UserId, RoleId)
SELECT u.Id, r.Id
FROM AspNetUsers u, AspNetRoles r
WHERE u.Email = 'user@example.com' AND r.Name = 'Admin'
```

### Add New Protected Route

```tsx
<Route
    path="/new-admin-feature"
    element={
        <ProtectedRoute requiredRoles={["Admin"]}>
            <NewFeature />
        </ProtectedRoute>
    }
/>
```

### Show Feature Only to Admins

```tsx
const { hasRole } = useAuth();

return <>{hasRole("Admin") && <AdminFeature />}</>;
```

## 🐛 Troubleshooting

### "Cannot GET /api/auth/login"

- Backend not running - Start with `dotnet run`
- Wrong port - Check backend listening on 5000
- CORS issue - Verify CORS config in Program.cs

### "Unexpected token < in JSON"

- HTML response instead of JSON - Backend might be down
- Check backend console for errors

### Login button not working

- Check browser console (F12) for errors
- Verify network tab shows POST request
- Check backend response in network tab

### Sidebar not showing admin features

- Verify you're logged in as admin role
- Check localStorage has correct auth token
- Verify token contains admin role claim

### Dark mode not working

- Clear localStorage
- Refresh page
- Check CSS variables defined in theme

## 📊 Database Schema

The authentication system uses ASP.NET Identity tables:

- `AspNetUsers` - User accounts
- `AspNetRoles` - Role definitions (Admin, User, Developer)
- `AspNetUserRoles` - User to role mappings
- `AspNetClaims` - User claims
- `AspNetLogins` - External login mappings

## 📝 API Documentation

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "User"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Response

```json
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "roles": ["Admin"],
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "success": true,
    "message": "Login successful"
}
```

## 🎓 Learning Resources

- [JWT Introduction](https://jwt.io/introduction)
- [ASP.NET Identity](https://learn.microsoft.com/en-us/aspnet/identity/overview/getting-started/introduction-to-aspnet-identity)
- [React Authentication](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## ✨ Next Steps

1. Run the application following the setup steps above
2. Test login/register functionality
3. Explore admin and user features
4. Review the code in `AUTH_SETUP.md` for detailed documentation
5. Customize styling in auth.css and header.css
6. Add additional features as needed

## 📞 Support

For issues:

1. Check the troubleshooting section above
2. Review browser console and network tab
3. Check backend console for server errors
4. Review AUTH_SETUP.md for comprehensive documentation
