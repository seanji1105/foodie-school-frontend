import "./index.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import SchoolPage from "./pages/SchoolPage";
import SchoolPageDetail from "./pages/DateDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/school/:schoolName" element={<SchoolPage />} />
          <Route
            path="/school/:schoolName/:data"
            element={<SchoolPageDetail />}
          />
          <Route path="/school" element={<SchoolPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
