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
import User from "./Pages/User";
import AutoNotifier from "./components/AutoToast/AutoNotifier";
import { ProductIdsProvider } from "./contexts/ProductsIdsContext";
import ProductReport from './components/ReportMostSoldProduct'; // Importando o novo componente
import SalesReport from "./components/SalesReport";             //importando novo novo componente

axios.defaults.withCredentials = true;
axios.defaults.credentials = "include";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ProductIdsProvider>
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
                    <Route element={<PrivateRoutes />}>
                      <Route path="products" element={<ProductsPage />} />
                      <Route path="teste" element={<Teste />} />
                      <Route path="Movimentacao" element={<Movimentacao />} />
                      <Route path="Report" element={<Report />} />
                      <Route path="Historico" element={<Historico />} />
                      <Route path="fornecedor" element={<Fornecedor />} />
                      <Route path="usuario" element={<User />} />
                      <Route path="product-report" element={<ProductReport />} /> {/* Nova rota para o relatório de produtos */}
                      <Route path="/sales-report" element={<SalesReport />} />  {/*Nova rota para gráfico detalhado*/}
                      <Route path="*" element={<PageNotFound />} />
                    </Route>
                  </Routes>
                  <AutoNotifier />
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </ProductIdsProvider>
    </QueryClientProvider>
  );
}

export default App;
