// Funções de navegação entre forms
function showLogin() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("resetPasswordForm").style.display = "none";

  // Atualiza tabs
  const tabs = document.querySelectorAll(".tab");
  tabs[0].classList.add("active");
  tabs[1].classList.remove("active");
}

function showRegister() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
  document.getElementById("resetPasswordForm").style.display = "none";

  // Atualiza tabs
  const tabs = document.querySelectorAll(".tab");
  tabs[0].classList.remove("active");
  tabs[1].classList.add("active");
}

function showResetPassword() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("resetPasswordForm").style.display = "block";
}

// Função de login
async function login(event) {
  event.preventDefault();

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const messageDiv = document.getElementById("loginMessage");

  // BUG 36: Validação de cliente fraca - aceita espaços em branco
  if (username.length === 0 || password.length === 0) {
    showMessage(messageDiv, "Por favor, preencha todos os campos", "error");
    return;
  }

  // BUG 37: Credenciais enviadas podem ser interceptadas (sem HTTPS mencionado)
  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      showMessage(messageDiv, data.message, "success");

      // BUG 38: Armazena dados sensíveis no localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("loggedIn", "true");

      // BUG 39: Delay desnecessário antes de redirecionar
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } else {
      showMessage(messageDiv, data.message, "error");
    }
  } catch (error) {
    // BUG 40: Mensagem de erro genérica não ajuda debug
    showMessage(messageDiv, "Erro ao fazer login", "error");
    console.log(error); // BUG: Usa console.log em vez de console.error
  }
}

// Função de registro
async function register(event) {
  event.preventDefault();

  const username = document.getElementById("registerUsername").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const passwordConfirm = document.getElementById(
    "registerPasswordConfirm",
  ).value;
  const messageDiv = document.getElementById("registerMessage");

  // BUG 41: Não valida se username tem caracteres especiais
  // BUG 42: Não valida tamanho mínimo de username

  // BUG 43: Validação de confirmação de senha tem bug de lógica
  if (password != passwordConfirm) {
    // BUG: Usa != em vez de !==
    showMessage(messageDiv, "As senhas não coincidem", "error");
    return;
  }

  // BUG 44: Não valida força da senha no cliente

  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (data.success) {
      showMessage(messageDiv, data.message, "success");

      // BUG 45: Armazena senha em localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } else {
      showMessage(messageDiv, data.message, "error");
    }
  } catch (error) {
    showMessage(messageDiv, "Erro ao registrar", "error");
  }
}

// Função de reset de senha
async function resetPassword(event) {
  event.preventDefault();

  const username = document.getElementById("resetUsername").value;
  const newPassword = document.getElementById("resetNewPassword").value;
  const messageDiv = document.getElementById("resetMessage");

  // BUG 46: Não requer confirmação de nova senha
  // BUG 47: Não pede email ou código de verificação

  try {
    const response = await fetch("/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, newPassword }),
    });

    const data = await response.json();

    if (data.success) {
      showMessage(messageDiv, data.message, "success");
      setTimeout(() => {
        showLogin();
      }, 2000);
    } else {
      showMessage(messageDiv, data.message, "error");
    }
  } catch (error) {
    showMessage(messageDiv, "Erro ao resetar senha", "error");
  }
}

// Função auxiliar para mostrar mensagens
function showMessage(element, message, type) {
  element.textContent = message;
  element.className = `message ${type}`;
  element.style.display = "block";

  // BUG 48: Mensagem desaparece muito rápido (3 segundos)
  setTimeout(() => {
    element.style.display = "none";
  }, 3000);
}

// BUG 49: Não limpa formulários após submit bem-sucedido
// BUG 50: Não previne múltiplos submits (double-click)
