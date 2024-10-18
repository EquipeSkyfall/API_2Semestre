import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Teste from "./Pages/teste";
import NavBar from "./components/NavBar";
import Home from "./Pages/Home";
import ProductsPage from "./Pages/Products";
import PageNotFound from "./Pages/NotFound";
import Relatorio from "./Pages/Relatorio";
import Historico from "./Pages/Historico";
import Login from "./Pages/login";
import Fornecedor from "./Pages/Fornecedores";
import Movimentacao from "./Pages/Movimentacao";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Página inicial sem NavBar */}
          <Route path="/" element={<Login />} /> {/* Use Login com maiúscula */}
          <Route path="/cadastrar" element={<Home />} />
          
          {/* Rotas com NavBar */}
          <Route
            path="*"
            element={
              <>
                <NavBar />
                <Routes>
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="teste" element={<Teste />} />
                  <Route path="Movimentacao" element={<Movimentacao />} />
                  <Route path="Relatorio" element={<Relatorio />} />
                  <Route path="Historico" element={<Historico />} />
                  <Route path="fornecedor" element={<Fornecedor />} />
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;