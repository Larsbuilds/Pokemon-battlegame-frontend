# Pokemon React Game

A React-based Pokemon game built with Vite, Tailwind CSS, and the PokeAPI.

## Documentation

- [Tailwind CSS Setup Guide](docs/TAILWIND_SETUP.md) - Comprehensive guide for setting up Tailwind CSS in Vite + React projects
- [Project Structure](docs/PROJECT_STRUCTURE.md) - Overview of the project's file structure and components

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

## Deployment

This project is configured for deployment on Netlify. To deploy:

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Configure environment variables in Netlify dashboard (see `.env.example`)
4. Deploy!

The site will automatically deploy when you push to the main branch.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router
- PokeAPI

## Project Structure

```
src/
├── assets/
├── components/
│   ├── PokemonCard.jsx
│   ├── SearchBar.jsx
├── pages/
│   ├── Home.jsx
│   ├── Detail.jsx
├── hooks/
│   ├── usePokemon.js
├── App.jsx
├── main.jsx
```

## Features

- Browse Pokemon list
- Search Pokemon
- View detailed Pokemon information
- Responsive design
- Modern UI with Tailwind CSS

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
