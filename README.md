# Fetch Frontend Take-Home Exercise

A modern web application for finding and matching with shelter dogs. Built with React, TypeScript, and Tailwind CSS.

Live site: [https://fetch-dogs-app.vercel.app](https://fetch-dogs-app.vercel.app)


## 🚀 Features

- User authentication with name and email
- Browse and search through a database of shelter dogs
- Filter dogs by breed
- Paginated results with customizable sorting
- Favorite dogs and generate matches
- Responsive and modern UI design
- Location-based filtering capabilities

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **UI Components**: 
  - React Select for dropdowns
  - RC Slider for range inputs
- **Build Tool**: Vite
- **Linting**: ESLint
- **Code Quality**: TypeScript strict mode

## 📋 Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd fetch-frontend-task
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── api/          # API integration and services
├── assets/       # Static assets
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
├── pages/        # Page components
├── types/        # TypeScript type definitions
└── main.tsx      # Application entry point
```

## 🔑 API Integration

The application integrates with the Fetch API service (`https://frontend-take-home-service.fetch.com`) and includes the following features:

- Authentication endpoints
- Dog search and filtering
- Location-based search
- Match generation
- Breed listing

## 🎯 Key Features Implementation

### Authentication
- Secure login with name and email
- Automatic cookie management for API requests
- Session handling

### Dog Search
- Advanced filtering by breed
- Pagination support
- Customizable sorting (breed, name, age)
- Comprehensive dog information display

### Favorites & Matching
- Add/remove dogs from favorites
- Generate matches from favorite dogs
- Interactive UI for managing selections

## 🧪 Development

- Run the development server:
  ```bash
  npm run dev
  ```

- Build for production:
  ```bash
  npm run build
  ```

- Preview production build:
  ```bash
  npm run preview
  ```

- Lint code:
  ```bash
  npm run lint
  ```

## 📝 Notes

- The application uses TypeScript for type safety
- Tailwind CSS is used for styling
- The project follows modern React best practices
- API integration includes proper error handling
- Responsive design for all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of the Fetch Frontend Take-Home Exercise and is intended for evaluation purposes only.
