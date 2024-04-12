const express = require('express'); // Importar o módulo Express
const app = express();// Criar uma aplicação Express
const port = 3000;

app.use(express.json()); // Middleware para transformar o corpo das requisições em JSON

  let produtos = []; // simulação de "banco de dados"
  let currentId = 0; // simulação de criação de IDs únicos para cada produto

  const logHoraMiddleware = (req, res, next) => {
    const horaAtual = new Date().toISOString();
    console.log(
      `[${horaAtual}] Nova solicitação recebida para: ${req.method} ${req.originalUrl}`
    );
    next();
  };
  
  app.use(logHoraMiddleware);
    
  app.post("/produtos", (req, res) => {//para criar um novo produto
    const { titulo, descricao, preco } = req.body;
  
    if (!titulo || !descricao || !preco) {
      return res.status(400).json({
        error:
          "Todos os campos (titulo, descricao, preço) são obrigatórios.",
      });
    }
    const novoproduto = {
      id: produtos.length + 1,
      titulo,
      descricao,
      preco,
    };
  
    produtos.push(novoproduto);
  
    res.status(201).json(novoproduto);
  });
  
  app.get("/produtos", (req, res) => { // rota para listar produtos
    res.status(200).json(produtos);
  });
  
  app.put('/produtos/:id', (req, res) => { //rota para atualizar um produto
    const { id } = req.params;
    const { nome, preco, descricao } = req.body;
    const produtoIndex = produtos.findIndex(p => p.id === parseInt(id));
  
    if (produtoIndex > -1) {
      produtos[produtoIndex] = { id: produtos[produtoIndex].id, nome, preco, descricao };
      res.status(200).json(produtos[produtoIndex]);
    } else {
      res.status(404).send({ message: "Produto não encontrado!" });
    }
  });

  app.delete('/produtos/:id', (req, res) => { //rota para excluir um produto
    const { id } = req.params;
    produtos = produtos.filter(p => p.id !== parseInt(id));
    res.status(204).send({ message: "Produto deletado com sucesso!" });
  });

  // Permite que os clientes saibam quais métodos HTTP são permitidos para /produtos
app.options('/produtos', (req, res) => {
    // Define os cabeçalhos para permitir métodos específicos e, opcionalmente, cabeçalhos e tipos de conteúdo
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Adiciar outros cabeçalhos que são permitidos
    res.setHeader('Access-Control-Allow-Origin', '*'); // Ajuste conforme necessário para a sua política de CORS
  
    // Envia uma resposta vazia indicando que os métodos acima são permitidos
    res.status(204).send();
  });
  
  
  app.listen(port, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${port}`);
  });