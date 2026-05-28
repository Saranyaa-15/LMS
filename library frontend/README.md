# Library Management System — Angular Frontend

## Tech Stack
- Angular 17 (Standalone Components)
- TypeScript
- Bootstrap 5.3
- Bootstrap Icons
- RxJS

## Project Structure
```
src/
├── app/
│   ├── core/
│   │   ├── interceptors/    # HTTP error interceptor
│   │   ├── models/          # TypeScript interfaces
│   │   └── services/        # API service layer
│   ├── shared/
│   │   └── components/      # Reusable UI (Alert, Spinner, ConfirmModal)
│   ├── features/
│   │   ├── dashboard/       # Dashboard page
│   │   ├── books/           # Book list, form, detail
│   │   ├── members/         # Member list, form, detail
│   │   └── transactions/    # Issue, Return, History
│   ├── app.component.*      # Root shell with navbar
│   ├── app.config.ts        # App bootstrap config
│   └── app.routes.ts        # Lazy-loaded routes
├── environments/            # Dev / prod configs
├── index.html
├── main.ts
└── styles.css
```

## Setup & Run

### Prerequisites
- Node.js 18+
- Angular CLI: `npm install -g @angular/cli`
- Backend running on `http://localhost:8080`

### Install
```bash
npm install
```

### Run (with proxy to backend)
```bash
npm start
# App runs at http://localhost:4200
```

### Build for Production
```bash
npm run build:prod
# Output in dist/library-frontend/
```

## Features
- **Dashboard** — stats overview with quick action cards
- **Books** — list with live search, add/edit form, detail view with transaction history
- **Members** — list with filter, add/edit form, detail view with issue summary
- **Issue Book** — select book + member, shows availability, 14-day due date
- **Return Book** — select member → see active issues → process return
- **Transaction History** — filter by member or book, filter by status

## Notes
- All API calls go through Angular proxy (`proxy.conf.json`) to avoid CORS in development
- Reactive Forms used throughout
- Standalone components (no NgModules)
- Lazy-loaded feature routes
