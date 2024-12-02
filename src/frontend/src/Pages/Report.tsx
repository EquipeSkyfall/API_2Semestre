import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReportPage from '../components/ReportContainer';
import ProductReport from '../components/ReportMostSoldProduct';
import SalesReport from '../components/SalesReport';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ReportPage />} />
        <Route path="/product-report" element={<ProductReport />} />
        <Route path="/sales-report" element={<SalesReport />} />
      </Routes>
    </Router>
  );
}

export default App;
