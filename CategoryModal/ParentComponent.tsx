import React, { useState } from 'react';
import CategoryModal from './index'; // Ajuste o caminho conforme necessário

const ParentComponent: React.FC = () => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  return (
    <div>
      {/* Botão para abrir o modal */}
      <button
        onClick={() => setIsCategoryModalOpen(true)}
        className="btn-primary"
      >
        Abrir Modal
      </button>

      {/* Modal sendo renderizado condicionalmente */}
      {isCategoryModalOpen && (
        <CategoryModal
          setIsCategoryModalOpen={setIsCategoryModalOpen}
          refetch={() => console.log("Recarregar dados")}
        />
      )}
    </div>
  );
};

export default ParentComponent;
