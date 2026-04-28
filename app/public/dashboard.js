// Carrega dados do usuário ao abrir o dashboard
window.addEventListener("load", async () => {
  await loadUserData();
});

// Função para carregar dados do usuário
async function loadUserData() {
  const userDataDiv = document.getElementById("userData");

  try {
    // BUG 51: Não verifica se usuário está autenticado antes de fazer request
    const response = await fetch("/api/user");
    const data = await response.json();

    if (data.success) {
      const user = data.user;

      // BUG 52: Exibe senha do usuário na tela
      userDataDiv.innerHTML = `
                <p><strong>ID:</strong> ${user.id}</p>
                <p><strong>Usuário:</strong> ${user.username}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Role:</strong> ${user.role}</p>
                <p><strong>Senha:</strong> <span class="password-display">${user.password}</span></p>
            `;
    } else {
      // BUG 53: Não redireciona para login se não autenticado
      userDataDiv.innerHTML = "<p>Erro ao carregar dados do usuário</p>";
    }
  } catch (error) {
    console.log("Erro:", error);
    userDataDiv.innerHTML = "<p>Erro ao carregar dados</p>";
  }
}

// Função para carregar todos os usuários (admin)
async function loadAllUsers() {
  const allUsersDiv = document.getElementById("allUsersData");
  allUsersDiv.innerHTML = "<p>Carregando...</p>";

  try {
    // BUG 54: Hardcoded secret no código do cliente
    const response = await fetch("/api/users?secret=admin123");
    const data = await response.json();

    if (data.success) {
      let html = "<h3>Lista de Todos os Usuários:</h3>";

      // BUG 55: Exibe senhas de todos os usuários
      data.users.forEach((user) => {
        html += `
                    <div class="user-card">
                        <p><strong>ID:</strong> ${user.id}</p>
                        <p><strong>Usuário:</strong> ${user.username}</p>
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Role:</strong> ${user.role}</p>
                        <p><strong>Senha:</strong> <span class="password-display">${user.password}</span></p>
                    </div>
                `;
      });

      allUsersDiv.innerHTML = html;
    } else {
      allUsersDiv.innerHTML = "<p>Erro ao carregar usuários</p>";
    }
  } catch (error) {
    console.log("Erro:", error);
    allUsersDiv.innerHTML = "<p>Erro ao carregar dados</p>";
  }
}

// Função de logout
async function logout() {
  try {
    const response = await fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.success) {
      // BUG 56: Não limpa localStorage ao fazer logout
      // localStorage.removeItem('user');
      // localStorage.removeItem('loggedIn');

      window.location.href = "/";
    }
  } catch (error) {
    console.log("Erro ao fazer logout:", error);
    // BUG 57: Redireciona mesmo se logout falhar
    window.location.href = "/";
  }
}

// BUG 58: Não há timeout de sessão por inatividade
// BUG 59: Não há proteção contra CSRF
// BUG 60: Console.log expõe muita informação em produção
