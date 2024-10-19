import './styles.css'; // Importando o CSS

function Report() {

  return (
    <div className="container">
      <div className="rectangle">

        <div className="section"></div>

        <div className="section">
          <div className="sub-section">
            Produtos
          </div>
          <div className="sub-section">
            Fornecedor
          </div>
          <div className="sub-section">
            Setor
          </div>
        </div>

        <div className="section">
          <button className="generate-report-button">GERAR RELATÓRIO</button>
        </div>

      </div>
    </div>
  );
};

export default Report;
