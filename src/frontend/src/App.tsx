import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Teste from "./Pages/teste";
import NavBar from "./components/NavBar";
import Home from "./Pages/Home";

import Header from "./components/Header";

import ProductsPage from "./Pages/Products";
import SignUpPage from "./Pages/UserSignUp";
import PageNotFound from "./Pages/NotFound";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
       <Header/>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="products" element={<ProductsPage />} /> {/* Ensure to provide an element */}
          <Route path="teste" element={<Teste />} />
          <Route path="signUpPage" element={<SignUpPage />} />
          <Route path="*" element={<PageNotFound />} />

        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;