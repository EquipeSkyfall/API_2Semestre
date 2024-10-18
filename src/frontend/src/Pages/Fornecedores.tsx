import SupplierList from "../components/SuplierList";
import FornecedorForm from "../components/SupplierForm";

function Fornecedor() {
  return (
    <div className="Fornecedor">
      <FornecedorForm />

      <SupplierList/>
    </div>
  );
}

export default Fornecedor;
