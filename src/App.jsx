import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import RosterPage from "./pages/RosterPage";
import ErrorBoundary from "./components/ErrorBoundary";
import { RosterProvider } from "./context/RosterContext";
import Battle from "./pages/Battle";

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ErrorBoundary>
        <RosterProvider>
          <div className="min-h-screen bg-gray-50">
            <header className="bg-gradient-to-r from-pokemon-red to-pokemon-blue text-white shadow-lg sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <Link to="/" className="flex items-center space-x-2">
                    <img
                      src="/pokeball.png"
                      alt="Pokéball"
                      className="w-8 h-8 animate-bounce-slow"
                    />
                    <h1 className="text-2xl font-bold">Pokédex</h1>
                  </Link>
                  <nav className="flex space-x-4">
                    <Link
                      to="/"
                      className="hover:text-pokemon-yellow transition-colors"
                    >
                      Home
                    </Link>
                    <Link
                      to="/roster"
                      className="hover:text-pokemon-yellow transition-colors"
                    >
                      My Roster
                    </Link>
                    <Link
                      to="/battle"
                      className="hover:text-pokemon-yellow transition-colors"
                    >
                      Battle
                    </Link>
                  </nav>
                </div>
              </div>
            </header>
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pokemon/:name" element={<Detail />} />
                <Route path="/roster" element={<RosterPage />} />
                <Route path="/battle" element={<Battle />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </RosterProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
