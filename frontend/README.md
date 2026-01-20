# IntegrityOS Frontend

A role-based monitoring dashboard for pipeline integrity monitoring. The frontend receives data from a FastAPI backend and provides visualization and management capabilities based on user roles.

## Features

- **Role-Based Access Control (RBAC)**
  - Guest: Read-only access to dashboards and pipeline details
  - Expert: Full access including pipeline parameters and device management

- **Dashboard**
  - Pipeline cards showing key metrics per pipeline
  - Real-time status indicators (normal, warning, critical)
  - Years to Failure predictions

- **Pipeline Details**
  - Interactive charts for temperature, pressure, and thickness loss
  - Historical data visualization
  - Pipeline parameters overview

- **Expert-Only Features**
  - Pipeline Parameters Management
  - ESP32 Device Management
  - Add/Edit pipeline configurations

## User Credentials

### Guest Access
- Username: `guest`
- Password: `guest123`
- Access: Dashboard and Pipeline Details (read-only)

### Expert Access
- Username: `expert`
- Password: `expert123`
- Access: All features including pipeline parameters and device management

## Project Structure

```
/app
  /dashboard           # Dashboard with pipeline cards
  /pipeline
    /[id]             # Pipeline details page
    /parameters       # Pipeline parameters (Expert only)
  /devices            # Device management (Expert only)
  /login              # Login page
/components
  dashboard-layout.tsx  # Main layout with navigation
  pipeline-card.tsx     # Pipeline card component
  protected-route.tsx   # Route protection wrapper
/contexts
  auth-context.tsx      # Authentication context and logic
/types
  pipeline.ts           # TypeScript interfaces
```

## Routes & Access Control

| Route | Guest | Expert |
|-------|-------|--------|
| `/login` | ✅ | ✅ |
| `/dashboard` | ✅ | ✅ |
| `/pipeline/:id` | ✅ (read-only) | ✅ |
| `/pipeline/parameters` | ❌ | ✅ |
| `/devices` | ❌ | ✅ |

## Backend Integration

The application is designed to work with a FastAPI backend. Replace the mock data with actual API calls:

### API Endpoints (to be implemented)

- `GET /dashboard` - Get all pipelines
- `GET /pipeline/:id` - Get pipeline details
- `POST /pipelines` - Add/update pipeline parameters
- `GET /devices` - Get all devices
- `POST /devices` - Add new device

## Development

All data is currently mocked. To integrate with your backend:

1. Replace mock data in each page with actual fetch calls
2. Update API endpoints in the TODO comments
3. Configure CORS on your FastAPI backend
4. Test authentication flow with backend

## Notes

- Authentication is local (frontend-only) using localStorage
- No database authentication is performed
- All calculations are done by the backend
- Frontend only visualizes data received from backend
- UI preserves existing component styles
