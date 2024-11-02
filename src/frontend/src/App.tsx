import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Teste from "./Pages/teste";
import NavBar from "./components/NavBar";
import Home from "./Pages/Home";
import ProductsPage from "./Pages/Products";
import PageNotFound from "./Pages/NotFound";
import Report from "./components/ReportContainer";
import Historico from "./Pages/Historico";
import Login from "./Pages/login";
import Fornecedor from "./Pages/Fornecedores";
import Movimentacao from "./Pages/Movimentacao";
import PrivateRoutes from "./components/PrivateRoute";
import axios from 'axios';
import AutoNotifier from "./components/AutoToast/AutoNotifier";

axios.defaults.withCredentials = true;
axios.defaults.credentials = "include";

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
                    <Route element={<PrivateRoutes/>}>
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="teste" element={<Teste />} />
                    <Route path="Movimentacao" element={<Movimentacao />} />
                    <Route path="Report" element={<Report />} />
                    <Route path="Historico" element={<Historico />} />
                    <Route path="fornecedor" element={<Fornecedor />} />
                    <Route path="*" element={<PageNotFound />} />
                    </Route>
                  </Routes>
              </>
            }
          />
        </Routes>
        <AutoNotifier />
      </BrowserRouter>
    </QueryClientProvider>

  );
}

export default App;