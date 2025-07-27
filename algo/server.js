const express = require("express");
const bodyParser = require("body-parser");
const { nanoid } = require("nanoid");
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const scripts = {}; // Armazena scripts na memória

// Página inicial
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Rota para salvar script
app.post("/proteger", (req, res) => {
    const { codigo } = req.body;
    const id = nanoid(8);
    scripts[id] = codigo;

    const link = `http://localhost:${PORT}/p/${id}`;
    const lua = `loadstring(game:HttpGet("${link}", true))()`;

    res.send(`
        <h2>✅ Seu script protegido foi criado!</h2>
        <p>Cole isso no executor:</p>
        <pre>${lua}</pre>
        <a href="/">Proteger outro script</a>
    `);
});

// Rota para entregar script original
app.get("/p/:id", (req, res) => {
    const script = scripts[req.params.id];
    if (script) {
        res.setHeader("Content-Type", "text/plain");
        res.send(script);
    } else {
        res.status(404).send("print('❌ Script não encontrado')");
    }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
