
import { createRoot } from 'react-dom/client'
import './index.css'
// import UserForm from './components/UserForm/index.tsx'
import Header from './components/Header/index.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MainWrapper from './components/MainWrapper/index.tsx'
import Footer from './components/Footer/index.tsx'
import NavBar from './components/NavBar/index.tsx'
// import DisplayAllUsers from './components/Teste/displayUsers.tsx'
// import ProductForm from './components/ProductForm/index.tsx'
// import ProductsList from './components/ProductsList/index.tsx'
import ProductsUpdateAndDelete from './components/ProductUpdateDeleteList/index.tsx'
import SearchBar from './components/SearchBar/index.tsx'
import SearchBar2 from './components/Teste/displayUsers.tsx'

// import Teste from './teste/teste.tsx'
 {/* <UserForm /> */}
  {/* <ProductsList/> */}
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(

     <QueryClientProvider client={queryClient}>
    <Header></Header>
    <NavBar></NavBar>
    
    <MainWrapper>
    {/* <ProductForm/> */}
     {/* <DisplayAllUsers/> */}
    <ProductsUpdateAndDelete/>
   {/* <Teste/> */}
    </MainWrapper>
    <Footer></Footer>
    {/* <SearchBar2/> */}
     </QueryClientProvider>

)
