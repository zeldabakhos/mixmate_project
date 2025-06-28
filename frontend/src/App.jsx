import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import CreateProduct from "./pages/CreateProduct";
import HomePage from "./pages/HomePage";
import LogInPage from "./pages/LogInPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage from "./pages/SignUpPage";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart"; // (not CartPage)


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
            <Route path="/add-product" element={<CreateProduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <FooterComp/>
      </Router>
    </>
  );
};

export default App;
