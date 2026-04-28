window.addEventListener("load", async () => {
  await loadUserData();
});

async function loadUserData() {
  const userDataDiv = document.getElementById("userData");

  try {
    const response = await fetch("/api/user");
    const data = await response.json();

    if (data.success) {
      const user = data.user;

      userDataDiv.innerHTML = `
                <p><strong>ID:</strong> ${user.id}</p>
                <p><strong>Usuário:</strong> ${user.username}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Role:</strong> ${user.role}</p>
                <p><strong>Senha:</strong> <span class="password-display">${user.password}</span></p>
            `;
    } else {
      userDataDiv.innerHTML = "<p>Erro ao carregar dados do usuário</p>";
    }
  } catch (error) {
    console.log("Erro:", error);
    userDataDiv.innerHTML = "<p>Erro ao carregar dados</p>";
  }
}

async function loadAllUsers() {
  const allUsersDiv = document.getElementById("allUsersData");
  allUsersDiv.innerHTML = "<p>Carregando...</p>";

  try {
    const response = await fetch("/api/users?secret=admin123");
    const data = await response.json();

    if (data.success) {
      let html = "<h3>Lista de Todos os Usuários:</h3>";

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
      window.location.href = "/";
    }
  } catch (error) {
    console.log("Erro ao fazer logout:", error);
    window.location.href = "/";
  }
}
