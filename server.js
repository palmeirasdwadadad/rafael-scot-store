const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// No Render usa a porta dele.
// No seu PC continua usando 3000.
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ========================================
// CONFIGURAÇÕES DA LOJA
// ========================================

let configuracoes = {
    nomeLoja: "Rafael Scot Store",
    pix: "58060640852"
};

// ========================================
// PRODUTOS
// ========================================

let produtos = [];

// Listar produtos
app.get("/api/produtos", (req, res) => {
    res.json(produtos);
});

// Adicionar produto
app.post("/api/produtos", (req, res) => {

    const {
        nome,
        preco,
        estoque,
        imagem,
        jogo
    } = req.body;

    if (
        !nome ||
        preco === undefined ||
        estoque === undefined ||
        !jogo
    ) {
        return res.status(400).json({
            erro: "Preencha nome, preço, estoque e jogo."
        });
    }

    const novoProduto = {
        id: Date.now(),
        nome: String(nome),
        preco: Number(preco),
        estoque: Number(estoque),
        imagem: imagem || "",
        jogo: String(jogo)
    };

    produtos.push(novoProduto);

    res.json({
        sucesso: true,
        produto: novoProduto
    });
});

// Excluir produto
app.delete("/api/produtos/:id", (req, res) => {

    const id = Number(req.params.id);

    produtos = produtos.filter(
        produto => produto.id !== id
    );

    res.json({
        sucesso: true
    });
});

// ========================================
// CONFIGURAÇÕES
// ========================================

app.get("/api/config", (req, res) => {
    res.json(configuracoes);
});

app.post("/api/config", (req, res) => {

    const {
        nomeLoja,
        pix
    } = req.body;

    if (nomeLoja) {
        configuracoes.nomeLoja = nomeLoja;
    }

    if (pix) {
        configuracoes.pix = pix;
    }

    res.json({
        sucesso: true,
        configuracoes
    });
});

// ========================================
// PEDIDOS
// ========================================

let pedidos = [];

// Criar pedido
app.post("/api/pedidos", (req, res) => {

    const {
        produtos: itens,
        total,
        cliente
    } = req.body;

    if (!itens || !itens.length) {
        return res.status(400).json({
            erro: "Carrinho vazio."
        });
    }

    const pedido = {
        id: Date.now(),
        cliente: cliente || "Cliente",
        produtos: itens,
        total: Number(total),
        status: "Pendente",
        criadoEm: new Date().toISOString()
    };

    pedidos.push(pedido);

    res.json({
        sucesso: true,
        pedido
    });
});

// Listar pedidos
app.get("/api/pedidos", (req, res) => {
    res.json(pedidos);
});

// ========================================
// REEMBOLSOS
// ========================================

let reembolsos = [];

// Solicitar reembolso
app.post("/api/reembolsos", (req, res) => {

    const {
        pedidoId,
        cliente,
        motivo
    } = req.body;

    if (!pedidoId || !motivo) {
        return res.status(400).json({
            erro: "Informe o pedido e o motivo."
        });
    }

    const reembolso = {
        id: Date.now(),
        pedidoId,
        cliente: cliente || "Cliente",
        motivo,
        status: "Pendente",
        criadoEm: new Date().toISOString()
    };

    reembolsos.push(reembolso);

    res.json({
        sucesso: true,
        reembolso
    });
});

// Listar reembolsos
app.get("/api/reembolsos", (req, res) => {
    res.json(reembolsos);
});

// ========================================
// STATUS
// ========================================

app.get("/api/status", (req, res) => {

    res.json({
        online: true,
        loja: configuracoes.nomeLoja,
        mensagem: "Loja funcionando!"
    });

});

// ========================================
// SERVIDOR
// ========================================

app.listen(PORT, "0.0.0.0", () => {

    console.log("=================================");
    console.log("🚀 RAFAEL SCOT STORE ONLINE!");
    console.log("🌐 Porta: " + PORT);
    console.log("💰 PIX: 58060640852");
    console.log("=================================");

});