# Lista de Compras

## Sobre o projeto

Um aplicativo web full-stack para gerenciamento de listas de compras. O sistema permite que o usuário adicione, liste, edite e remova itens da sua lista, oferecendo uma experiência profissional e fluida.

<div align="center">
  <img src="https://raw.githubusercontent.com/vitor-nery11/lista_compras_flask/main/docs/screenshot_1.png" alt="Tela do Sistema 1" width="45%" />
  &nbsp;
  <img src="https://raw.githubusercontent.com/vitor-nery11/lista_compras_flask/main/docs/screenshot_2.png" alt="Tela do Sistema 2" width="45%" />
</div>

## Funcionalidades

- Adicionar novos produtos à lista
- Visualizar todos os produtos cadastrados
- Atualizar informações (nome, quantidade, etc.) de um produto
- Remover produtos da lista
- Interface web responsiva e amigável

## Tecnologias

### Frontend
- React com TypeScript
- Vite
- Tailwind CSS
- Axios
- Lucide React
- Recharts

### Backend
- Python (3.12+)
- Flask
- Flask-SQLAlchemy
- Flask-CORS

## Estrutura do projeto

```text
lista_compras_flask/
├── backend/          # API REST feita em Flask
│   ├── app/          # Lógica da aplicação, rotas e modelos
│   ├── instance/     # Banco de dados local (SQLite, etc.)
│   ├── requirements.txt # Dependências do Python
│   └── run.py        # Arquivo principal para iniciar o servidor
│
├── frontend/         # Aplicação SPA feita em React + Vite
│   ├── public/       # Arquivos estáticos
│   ├── src/          # Código-fonte React, componentes e páginas
│   ├── package.json  # Dependências do Node.js
│   └── tailwind.config.js # Configurações do Tailwind CSS
└── README.md
```

## Pré-requisitos

- Node.js (v18 ou superior)
- Python (v3.12 ou superior)

## Instalação

### Backend
Abra o terminal, navegue até a pasta raiz do projeto e entre na pasta `backend`:
```bash
cd backend
python -m venv venv
```

Ative o ambiente virtual:
- Windows: `.\venv\Scripts\activate`
- Linux/macOS: `source venv/bin/activate`

Instale as dependências:
```bash
pip install -r requirements.txt
```

### Frontend
Abra outro terminal, navegue até a pasta raiz do projeto e entre na pasta `frontend`:
```bash
cd frontend
npm install
```

## Como executar

### Iniciando o Backend
Com o ambiente virtual ativado no terminal da pasta `backend`, execute:
```bash
python run.py
```
A API estará rodando, geralmente em `http://localhost:5000`.

### Iniciando o Frontend
No terminal da pasta `frontend`, execute:
```bash
npm run dev
```
Isso iniciará o servidor de desenvolvimento do Vite, geralmente acessível em `http://localhost:5173`.

## Rotas da API

### GET /produtos
Retorna a lista de todos os produtos cadastrados na lista de compras.

### POST /produtos
Cria um novo produto na lista de compras.

**Corpo da requisição (JSON):**
```json
{
  "nome": "Nome do Produto",
  "quantidade": 1,
  "preco": 10.50
}
```

### PUT /produtos/<id>
Atualiza os dados de um produto existente com base no seu ID.

**Corpo da requisição (JSON):**
```json
{
  "nome": "Produto Atualizado",
  "quantidade": 2,
  "preco": 15.00
}
```

### DELETE /produtos/<id>
Remove um produto específico da lista de compras através do seu ID.

## Exemplos de requisições

**Exemplo utilizando `curl` para criar um produto:**
```bash
curl -X POST http://localhost:5000/produtos \
-H "Content-Type: application/json" \
-d '{"nome": "Arroz", "quantidade": 2, "preco": 5.99}'
```

## Testes

Para executar os testes do backend (se configurados com pytest), ative o ambiente virtual na pasta `backend` e execute:
```bash
pytest
```

## Autor

Vitor Nery
[GitHub - vitor-nery11](https://github.com/vitor-nery11)
