import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import CreateIngredient from "./pages/CreateIngredient";
import HomePage from "./pages/HomePage";
import LogInPage from "./pages/LogInPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage from "./pages/SignUpPage";
import IngredientDetails from "./pages/IngredientDetails";
import Fridge from "./pages/Fridge"; // (not FridgePage)
import DrinksPage from "./pages/DrinksPage";
import WhatICanMakePage from "./pages/WhatICanMakePage";


//Components
import NavBar from "./components/NavBar"
import FooterComp from "./components/FooterComp"


const App = () => {
  return (
    <>
      <Router>
        <NavBar/>
        <main
          style={{ minHeight: "calc(100vh - 180px)" }}
          className="container d-flex flex-column justify-content-center align-items-center"
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LogInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/add-ingredient" element={<CreateIngredient />} />
            <Route path="/fridge" element={<Fridge />} />
            <Route path="/igredients/:id" element={<IngredientDetails />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/drinks" element={<DrinksPage />} />
            <Route path="/what-i-can-make" element={<WhatICanMakePage />} />

            

          </Routes>
        </main>
        <FooterComp/>
      </Router>
    </>
  );
};

export default App;
