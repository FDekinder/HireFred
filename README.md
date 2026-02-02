# ReleaseNoteHub

A full-stack changelog and release notes SaaS with a beautiful animated landing page, built with Next.js and FastAPI.

![ReleaseNoteHub](https://via.placeholder.com/800x400/070A12/6366F1?text=ReleaseNoteHub)

## Features

- **Animated Landing Page** - Modern startup-style design with Framer Motion animations
- **Markdown Editor** - Write release notes with live preview
- **Public Changelog** - Beautiful timeline view of published releases
- **JWT Authentication** - Secure user registration and login
- **Draft/Publish Workflow** - Keep releases private until ready
- **Shareable Links** - Each release has a unique URL for sharing

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Framer Motion
- TanStack Query
- React Hook Form + Zod
- lucide-react icons

### Backend
- FastAPI
- SQLModel (SQLAlchemy + Pydantic)
- SQLite (easy switch to PostgreSQL)
- JWT authentication (python-jose)
- bcrypt password hashing

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│   Next.js App   │────▶│  FastAPI API    │
│   (Port 3000)   │     │   (Port 8000)   │
│                 │     │                 │
└─────────────────┘     └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │     SQLite      │
                        │   (Database)    │
                        │                 │
                        └─────────────────┘
```

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /auth/register` - Create a new account
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

### Releases (Protected)
- `GET /releases` - List user's releases
- `POST /releases` - Create a new release
- `GET /releases/{id}` - Get single release
- `PUT /releases/{id}` - Update release
- `DELETE /releases/{id}` - Delete release
- `POST /releases/{id}/publish` - Publish release
- `POST /releases/{id}/unpublish` - Unpublish release

### Public
- `GET /public/releases` - List published releases
- `GET /public/releases/{slug}` - Get single published release
- `GET /health` - Health check

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Login page |
| `/register` | Registration page |
| `/app` | Dashboard (protected) |
| `/app/releases/new` | Create release (protected) |
| `/app/releases/[id]/edit` | Edit release (protected) |
| `/changelog` | Public changelog |

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key-min-32-characters
DATABASE_URL=sqlite:///./releasenotes.db
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Future Improvements

- [ ] Email verification
- [ ] Password reset flow
- [ ] Team/organization support
- [ ] Custom domains for public changelog
- [ ] Webhooks for integrations
- [ ] AI-powered release note summaries
- [ ] RSS feed for changelog
- [ ] Embeddable widget
- [ ] Analytics dashboard
- [ ] Multi-language support

## License

MIT
