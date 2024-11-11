# Sistema de Controle de Estoque - Sprint 3

Este documento descreve as **User Stories** desenvolvidas durante a **Sprint 3** do projeto de gestão de estoque. Nesta sprint, o foco foi introduzir notificações automáticas e ferramentas administrativas para maior controle e segurança, além de otimizar a organização logística do estoque.

## User Stories da Sprint 3

| **Prioridade** | **User Story**                                                                                                       | **Estimativa (UCP)** | **Requisitos do Parceiro** |
|----------------|----------------------------------------------------------------------------------------------------------------------|----------------------|----------------------------|
| Média          | Como gerente, quero receber notificações automáticas quando o estoque de um item estiver abaixo do nível mínimo      | 10                   | R8                         |
| Média          | Como gerente, quero ser notificado automaticamente quando produtos estiverem próximos da data de validade            | 10                   | R9                         |
| Média          | Como gerente, quero registrar locais de armazenamento, fornecedores e setores                                       | 15                   | R4                         |
| Média          | Como administrador, quero manter um registro detalhado de compras e um log de alterações no sistema                  | 15                   | R10                        |
| Média          | Como administrador, quero que os usuários do sistema tenham diferentes níveis de acesso (administrador, gerente, funcionário) | 15                   | R1                         |

### Detalhamento das User Stories

1. **Notificação de Estoque Abaixo do Nível Mínimo**
   - **Como:** Gerente
   - **Quero:** Receber notificações automáticas quando o estoque de um item estiver abaixo do nível mínimo.
   - **Para que:** Posso tomar decisões rápidas para repor o estoque antes que itens esgotem.
   - **Critérios de Aceitação:**
     - Sistema notifica o gerente automaticamente sempre que o estoque de um item atinge o nível mínimo configurado.
     - Notificações podem ser vistas na interface ou enviadas por e-mail.

2. **Notificação de Produtos Próximos da Data de Validade**
   - **Como:** Gerente
   - **Quero:** Ser notificado automaticamente quando produtos estiverem próximos da data de validade.
   - **Para que:** Posso organizar promoções ou priorizar a venda desses produtos antes que vençam.
   - **Critérios de Aceitação:**
     - Sistema notifica o gerente automaticamente quando produtos estão próximos da data de validade configurada.
     - Notificações podem ser configuradas com antecedência ajustável.

3. **Registro de Locais de Armazenamento, Fornecedores e Setores**
   - **Como:** Gerente
   - **Quero:** Registrar locais de armazenamento, fornecedores e setores.
   - **Para que:** Manter uma base de dados organizada e otimizar o controle logístico.
   - **Critérios de Aceitação:**
     - Gerentes podem registrar, editar e excluir locais de armazenamento, fornecedores e setores.
     - Informações ficam visíveis em relatórios e podem ser associadas aos produtos no estoque.

4. **Registro Detalhado de Compras e Log de Alterações**
   - **Como:** Administrador
   - **Quero:** Manter um registro detalhado de todas as compras realizadas e um log de alterações no sistema.
   - **Para que:** Garantir histórico de compras e alterações para auditoria e rastreabilidade.
   - **Critérios de Aceitação:**
     - Sistema registra cada compra, com detalhes como data, fornecedor, quantidade e responsável pela ação.
     - Um log de alterações é criado, registrando quem fez modificações e quais itens foram alterados.

5. **Níveis de Acesso Diferenciados para Usuários**
   - **Como:** Administrador
   - **Quero:** Que os usuários do sistema tenham diferentes níveis de acesso (administrador, gerente, funcionário).
   - **Para que:** Possibilitar um controle mais seguro e adequado às funções de cada tipo de usuário.
   - **Critérios de Aceitação:**
     - Administrador pode atribuir e alterar níveis de acesso dos usuários.
     - Acesso e funcionalidades disponíveis são restritos conforme o nível de cada usuário, garantindo maior segurança no sistema.

---

As user stories desenvolvidas nesta sprint focam em melhorar a segurança e o controle administrativo, oferecendo notificações e registros detalhados para melhor gerenciamento do estoque. Estas funcionalidades visam agilizar a tomada de decisões e aprimorar a organização do sistema de controle de estoque.
