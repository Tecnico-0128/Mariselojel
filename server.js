const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


const CLIENTES_FILE = path.join(__dirname, 'clientes.json');
const PRODUTOS_FILE = path.join(__dirname, 'produtos.json');


const lerDados = (arquivo) => {
    if (!fs.existsSync(arquivo)) return [];
    return JSON.parse(fs.readFileSync(arquivo, 'utf-8'));
};

const salvarDados = (arquivo, dados) => {
    fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2));
};



app.get('/clientes', (req, res) => {
    res.json(lerDados(CLIENTES_FILE));
});

app.post('/clientes', (req, res) => {
    const clientes = lerDados(CLIENTES_FILE);
    const novoCliente = { id: Date.now().toString(), ...req.body };
    clientes.push(novoCliente);
    salvarDados(CLIENTES_FILE, clientes);
    res.status(201).json(novoCliente);
});

app.put('/clientes/:id', (req, res) => {
    const clientes = lerDados(CLIENTES_FILE);
    const index = clientes.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ erro: "Cliente não encontrado" });
    
    clientes[index] = { ...clientes[index], ...req.body };
    salvarDados(CLIENTES_FILE, clientes);
    res.json(clientes[index]);
});

app.delete('/clientes/:id', (req, res) => {
    let clientes = lerDados(CLIENTES_FILE);
    clientes = clientes.filter(c => c.id !== req.params.id);
    salvarDados(CLIENTES_FILE, clientes);
    res.status(204).send();
});



app.get('/produtos', (req, res) => {
    res.json(lerDados(PRODUTOS_FILE));
});

app.post('/produtos', (req, res) => {
    const produtos = lerDados(PRODUTOS_FILE);
    const novoProduto = { id: Date.now().toString(), ...req.body };
    produtos.push(novoProduto);
    salvarDados(PRODUTOS_FILE, produtos);
    res.status(201).json(novoProduto);
});

app.put('/produtos/:id', (req, res) => {
    const produtos = lerDados(PRODUTOS_FILE);
    const index = produtos.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ erro: "Equipamento não encontrado" });

    produtos[index] = { ...produtos[index], ...req.body };
    salvarDados(PRODUTOS_FILE, produtos);
    res.json(produtos[index]);
});


app.listen(PORT, () => {
    console.log(`Servidor rodando rodando em http://localhost:${PORT}`);
});
