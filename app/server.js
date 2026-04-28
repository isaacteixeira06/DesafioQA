const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// BUG 1: Session com configuração insegura
app.use(
  session({
    secret: "123456", // BUG: Secret fraco e hardcoded
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // BUG: Deveria ser true em produção
      httpOnly: false, // BUG: Vulnerável a XSS
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias - BUG: Muito tempo
    },
  }),
);

// Banco de dados simulado (em produção seria um DB real)
const users = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    email: "admin@test.com",
    role: "admin",
  },
  {
    id: 2,
    username: "user",
    password: "user123",
    email: "user@test.com",
    role: "user",
  },
  {
    id: 3,
    username: "teste",
    password: "123456",
    email: "teste@test.com",
    role: "user",
  },
];

// BUG 2: Senhas armazenadas em texto plano
// BUG 3: Não há validação de força de senha

// Contador de tentativas de login (BUG 4: não implementado corretamente)
let loginAttempts = {};

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Rota de health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Rota de login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // BUG 5: Não valida se os campos estão vazios corretamente
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Usuário e senha são obrigatórios" });
  }

  // BUG 6: Validação SQL Injection vulnerável
  // Simulando uma query SQL vulnerável
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  console.log("Query executada:", query); // Log para debug

  // BUG 7: Mensagem de erro revela informação sensível
  let user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: `Usuário '${username}' não encontrado no sistema`, // BUG: Revela se usuário existe
    });
  }

  // BUG 8: Lógica de validação de senha com falha
  // Às vezes aceita senha errada (1 em 10 tentativas)
  const randomFactor = Math.random();
  if (user.password === password || randomFactor < 0.1) {
    // BUG: 10% de chance de aceitar senha errada

    // BUG 9: Não limpa tentativas de login anterior
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;

    return res.json({
      success: true,
      message: "Login realizado com sucesso!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email, // BUG 10: Expõe email no response
        role: user.role,
        password: user.password, // BUG 11: NUNCA enviar senha no response!
      },
    });
  }

  // BUG 12: Rate limiting não funciona corretamente
  if (!loginAttempts[username]) {
    loginAttempts[username] = 0;
  }
  loginAttempts[username]++;

  // BUG 13: O bloqueio nunca é aplicado (condição nunca é verdadeira)
  if (loginAttempts[username] > 1000) {
    // Deveria ser 3-5 tentativas
    return res.status(429).json({
      success: false,
      message: "Muitas tentativas de login. Tente novamente mais tarde.",
    });
  }

  return res.status(401).json({
    success: false,
    message: "Senha incorreta!", // BUG: Revela que o usuário existe
  });
});

// Rota de registro
app.post("/register", (req, res) => {
  const { username, password, email } = req.body;

  // BUG 14: Validação de email muito fraca
  if (!email.includes("@")) {
    // BUG: Aceita emails inválidos como "a@b"
    return res.status(400).json({ success: false, message: "Email inválido" });
  }

  // BUG 15: Não verifica se usuário já existe adequadamente
  const existingUser = users.find((u) => u.username == username); // BUG: Usa == em vez de ===

  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "Usuário já existe" });
  }

  // BUG 16: Não valida força da senha
  // Aceita senhas como "1", "a", etc.

  // BUG 17: ID gerado de forma insegura
  const newUser = {
    id: users.length + 1, // BUG: Pode gerar IDs duplicados
    username: username,
    password: password, // BUG: Senha em texto plano
    email: email,
    role: "user",
  };

  // BUG 18: Não sanitiza o input antes de salvar
  users.push(newUser);

  // BUG 19: Loga automaticamente após registro (pode não ser desejado)
  req.session.userId = newUser.id;
  req.session.username = newUser.username;

  return res.json({
    success: true,
    message: "Usuário registrado com sucesso!",
    user: newUser, // BUG: Retorna senha no response
  });
});

// Rota de dashboard (área autenticada)
app.get("/dashboard", (req, res) => {
  // BUG 20: Verificação de autenticação fraca
  if (req.session.userId || req.query.admin === "true") {
    // BUG: Backdoor com query parameter
    const user = users.find((u) => u.id === req.session.userId);
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
  } else {
    res.redirect("/");
  }
});

// Rota de logout
app.post("/logout", (req, res) => {
  // BUG 21: Não destrói a sessão completamente
  req.session.userId = null; // BUG: Deveria usar req.session.destroy()
  res.json({ success: true, message: "Logout realizado" });
});

// Rota de dados do usuário
app.get("/api/user", (req, res) => {
  // BUG 22: Não verifica autenticação
  const userId = req.session.userId || req.query.userId; // BUG: Aceita userId por query param
  const user = users.find((u) => u.id === parseInt(userId));

  if (user) {
    return res.json({
      success: true,
      user: user, // BUG: Retorna senha
    });
  }

  res.status(404).json({ success: false, message: "Usuário não encontrado" });
});

// BUG 23: Rota administrativa sem proteção adequada
app.get("/api/users", (req, res) => {
  // BUG: Qualquer um pode acessar lista de todos os usuários
  if (req.query.secret === "admin123") {
    // BUG: Proteção trivial
    return res.json({ success: true, users: users }); // BUG: Expõe todas as senhas
  }
  res.status(403).json({ success: false, message: "Acesso negado" });
});

// BUG 24: Rota de reset de senha insegura
app.post("/reset-password", (req, res) => {
  const { username, newPassword } = req.body;

  // BUG: Não requer verificação de identidade
  const user = users.find((u) => u.username === username);

  if (user) {
    user.password = newPassword; // BUG: Qualquer um pode resetar qualquer senha
    return res.json({ success: true, message: "Senha alterada com sucesso!" });
  }

  res.status(404).json({ success: false, message: "Usuário não encontrado" });
});

// Banco de dados simulado para coletas
const coletas = [];
let coletaIdCounter = 1;

// BUG 66: Rota de coleta sem autenticação validada corretamente
app.get("/coleta", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/");
  }
  res.sendFile(path.join(__dirname, "public", "coleta.html"));
});

// BUG 67: API de coleta aceita qualquer campo sem validação rigorosa
app.post("/api/coleta", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: "Não autenticado" });
  }

  const {
    beneficiarioId,
    beneficiarioNome,
    indicador1,
    indicador2,
    indicador3,
    indicador4,
    observacoes,
    status,
  } = req.body;

  // BUG 68: Validação fraca - aceita valores vazios como string vazia
  if (!beneficiarioId || !beneficiarioNome) {
    return res
      .status(400)
      .json({ success: false, message: "ID e Nome são obrigatórios" });
  }

  // BUG 69: Não valida que indicadores são realmente números
  // BUG 70: Não valida faixa de valores (0-100 para percentuais)
  // BUG 71: Não valida que nota está entre 0-10

  const coleta = {
    id: coletaIdCounter++,
    beneficiarioId: beneficiarioId,
    beneficiarioNome: beneficiarioNome,
    indicador1: parseFloat(indicador1),
    indicador2: parseFloat(indicador2),
    indicador3: parseFloat(indicador3),
    indicador4: indicador4 ? parseFloat(indicador4) : 0,
    observacoes: observacoes || "",
    status: status || "em_progresso",
    usuarioColeta: req.session.username,
    // BUG 72: Armazena timestamp em formato ISO sem validação de fuso horário
    timestamp: new Date().toISOString(),
  };

  coletas.push(coleta);

  // BUG 73: Retorna todos os dados de coleta incluindo informações sensíveis
  // Deveria retornar apenas ID confirmação de sucesso
  res.json({
    success: true,
    message: "Coleta submetida com sucesso!",
    coletaId: coleta.id,
    data: coleta,
  });
});

// BUG 74: Retorna histórico sem filtrar por usuário
app.get("/api/coleta/historico", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: "Não autenticado" });
  }

  // BUG 75: Retorna TODAS as coletas de TODOS os usuários
  // Deveria filtrar: coletas.filter(c => c.usuarioColeta === req.session.username)
  const userColetas = coletas;

  // BUG 76: Expõe informações sensíveis como usuarioColeta
  res.json({
    success: true,
    coletas: userColetas,
    total: userColetas.length,
  });
});

// BUG 77: Upload em lote sem validação real de arquivo
app.post("/api/coleta/lote", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: "Não autenticado" });
  }

  const validarDuplicatas = req.body.validarDuplicatas === "true";

  // BUG 78: Não processa realmente arquivo enviado
  // BUG 79: Simula sucesso sem validar dados reais
  // BUG 80: Não valida campos obrigatórios do CSV

  const coletasAdicionadas = parseInt(Math.random() * 10) + 1;

  // BUG 81: Não registra qual usuário fez upload
  // BUG 82: Não valida integridade de dados antes de inserir

  res.json({
    success: true,
    message: `${coletasAdicionadas} registros processados`,
    inseridos: coletasAdicionadas,
    erros: 0,
  });
});

// BUG 83: Health check sem validação de integridade
app.get("/health", (req, res) => {
  const uptime = process.uptime();
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: uptime.toFixed(2),
    memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});
