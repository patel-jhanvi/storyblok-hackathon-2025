# ☕ BrewBook

**A content discovery platform for developers to find study-friendly cafes**

Built for the Storyblok x Code & Coffee Hackathon 2025. BrewBook is a scalable, headless CMS-driven platform that helps developers discover the perfect cafe for coding sessions through AI-ranked search and geolocation-based filtering.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://your-brewbook-link.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-blue)](https://github.com/yourusername/brewbook)

---

## 🛠 Tech Stack

### Languages & Frameworks
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-0EA5E9?logo=tailwindcss&logoColor=white)

### Backend & APIs
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![REST API](https://img.shields.io/badge/REST-02569B?logo=rest&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)

### CMS & Content
![Storyblok](https://img.shields.io/badge/Storyblok-09B3AF?logo=storyblok&logoColor=white)

### AI & Data
![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?logo=pandas&logoColor=white)

### Cloud & Deployment
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?logo=netlify&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?logo=railway&logoColor=white)
![Google Maps](https://img.shields.io/badge/Google_Maps-4285F4?logo=googlemaps&logoColor=white)

---

## 🚀 What I Built

- **Headless CMS Architecture** using Storyblok for decoupled content management, enabling independent content updates without code deployments
- **Geolocation-based search** with Google Maps API integration for real-time, location-aware cafe discovery
- **AI-ranked indexing** using OpenAI API for intelligent cafe recommendations based on developer needs (WiFi quality, noise levels, power outlets, etc.)
- **Scalable frontend** built with Next.js 13+ App Router, leveraging Server Components and Client Components for optimal performance
- **RESTful backend** using FastAPI for fast, async API endpoints with automatic API documentation
- **Production deployment** with independent frontend (Vercel) and backend (Railway) scaling for high availability
- **Dynamic content workflows** enabling non-technical users to update cafe listings through Storyblok's visual editor

---

## ✨ Key Features

- 📍 **Real-time geolocation search** - Find cafes near you with distance calculations
- 🤖 **AI-powered recommendations** - Smart ranking based on developer-friendly amenities
- 🎨 **Responsive design** - Mobile-first approach with Tailwind CSS utilities
- ⚡ **Low-latency queries** - FastAPI backend with async processing for sub-100ms response times
- 📝 **CMS-driven content** - Update cafe data without touching code via Storyblok
- 🔄 **Headless architecture** - Frontend and backend independently scalable and maintainable
- 🔍 **Advanced filtering** - Filter by WiFi speed, seating capacity, noise level, power outlets, and more
- 🗺️ **Interactive maps** - Visual cafe locations with clustering for dense areas
- ⭐ **User reviews** - Community-driven ratings and reviews system
- 📱 **PWA support** - Install as mobile app with offline capabilities

---

## 🎯 Technical Highlights

### Architecture
- **Decoupled architecture**: Frontend and backend deployed separately, allowing independent scaling and updates
- **Headless CMS integration**: Storyblok provides content API, eliminating traditional database for content management
- **Type-safe development**: Full TypeScript implementation across frontend and backend for compile-time error catching
- **Modern React patterns**: Leverages Server Components for static content, Client Components for interactivity

### Performance
- **Server-side rendering**: Next.js SSR for faster initial page loads and better SEO
- **API route optimization**: Edge-cached responses for frequently accessed data
- **Image optimization**: Next.js Image component with automatic WebP conversion and lazy loading
- **Code splitting**: Automatic route-based code splitting for minimal initial bundle size

### Data Flow
1. User searches for cafes → Frontend sends request to FastAPI backend
2. Backend queries Storyblok CMS API for cafe data
3. Geolocation service calculates distances from user location
4. AI service ranks results based on user preferences
5. Results returned to frontend and rendered with React Server Components
6. Interactive features hydrated with Client Components

### Developer Experience
- **Hot module replacement**: Instant feedback during development
- **TypeScript IntelliSense**: Full autocomplete and type checking in VS Code
- **API documentation**: Auto-generated Swagger/OpenAPI docs from FastAPI
- **Linting & formatting**: ESLint + Prettier for consistent code style
- **Git hooks**: Pre-commit checks ensure code quality

---

## 📂 Project Structure
```
brewbook/
├── frontend/                 # Next.js application
│   ├── app/                 # Next.js 13+ App Router
│   │   ├── page.tsx        # Home page
│   │   ├── layout.tsx      # Root layout
│   │   ├── cafes/          # Cafe listing pages
│   │   └── api/            # API routes (proxy to backend)
│   ├── components/          # Reusable React components
│   │   ├── CafeCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── MapView.tsx
│   ├── lib/                # Utility functions
│   │   ├── api.ts          # API client
│   │   └── storyblok.ts    # Storyblok integration
│   └── public/             # Static assets
│
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── main.py         # FastAPI app entry point
│   │   ├── routers/        # API route handlers
│   │   │   ├── cafes.py
│   │   │   └── search.py
│   │   ├── services/       # Business logic
│   │   │   ├── ai_ranking.py
│   │   │   └── geolocation.py
│   │   └── models/         # Pydantic models
│   └── requirements.txt    # Python dependencies
│
└── README.md
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.9+
- Storyblok account with API token
- Google Maps API key (optional, for geolocation)
- OpenAI API key (optional, for AI ranking)

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/brewbook.git
cd brewbook/frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Add your environment variables
# NEXT_PUBLIC_STORYBLOK_TOKEN=your_storyblok_token
# NEXT_PUBLIC_API_URL=http://localhost:8000
# NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_key

# Run development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

### Backend Setup
```bash
# Navigate to backend directory
cd brewbook/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Add your environment variables
# STORYBLOK_TOKEN=your_storyblok_token
# OPENAI_API_KEY=your_openai_key

# Run development server
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`  
API docs available at `http://localhost:8000/docs`

---

## 🚢 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Backend (Railway)
1. Push code to GitHub
2. Connect repository to Railway
3. Add environment variables in Railway dashboard
4. Deploy automatically on push to main branch

---

## 📝 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_STORYBLOK_TOKEN=your_storyblok_access_token
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_api_key
```

### Backend (.env)
```env
STORYBLOK_TOKEN=your_storyblok_management_token
OPENAI_API_KEY=your_openai_api_key
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
```

---

## 🎨 Features Walkthrough

### 1. Geolocation Search
Users can search for cafes near their current location or any address. The system uses Google Maps Geocoding API to convert addresses to coordinates and calculates distances using the Haversine formula.

### 2. AI-Powered Ranking
Cafes are ranked using OpenAI's GPT model, which considers multiple factors:
- WiFi speed and reliability
- Noise level
- Seating availability
- Power outlet accessibility
- Operating hours
- Price range
- User reviews and ratings

### 3. CMS Content Management
Cafe owners or admins can manage cafe information through Storyblok's visual editor:
- Upload photos
- Update hours and amenities
- Respond to reviews
- All without touching code

### 4. Interactive Map
Built with Google Maps JavaScript API:
- Clustered markers for dense areas
- Click markers to view cafe details
- Filter visible cafes by criteria
- Get directions to selected cafe

---

## 🔧 API Endpoints

### GET /api/cafes
Fetch all cafes with optional filtering
```json
Query params: ?location=boston&radius=5&wifi_speed=fast
```

### GET /api/cafes/{id}
Get detailed information about a specific cafe

### POST /api/search
Advanced search with AI ranking
```json
{
  "location": "Boston, MA",
  "preferences": {
    "wifi_speed": "high",
    "noise_level": "quiet",
    "seating": "spacious"
  }
}
```

### GET /api/nearby
Find cafes near coordinates
```json
Query params: ?lat=42.3601&lng=-71.0589&radius=3
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Jhanvi Patel**

- Portfolio: [jhanvi-patel.netlify.app](https://jhanvi-patel.netlify.app)
- LinkedIn: [linkedin.com/in/jhanvikpatel](https://www.linkedin.com/in/jhanvikpatel)
- GitHub: [@patel-jhanvi](https://github.com/patel-jhanvi)
- Email: pateljhanvik@gmail.com

---

## 🙏 Acknowledgments

- Built for the **Storyblok x Code & Coffee Hackathon 2025**
- Thanks to Storyblok for the amazing headless CMS platform
- Inspired by the developer community's need for better coworking spaces

---

## 📸 Screenshots

### Home Page
![Home Page](./screenshots/home.png)

### Search Results
![Search Results](./screenshots/search.png)

### Cafe Details
![Cafe Details](./screenshots/details.png)

### Map View
![Map View](./screenshots/map.png)

---

**⭐ If you found this project helpful, please consider giving it a star!**

[![Star on GitHub](https://img.shields.io/github/stars/yourusername/brewbook?style=social)](https://github.com/yourusername/brewbook)
