function showLogin() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("resetPasswordForm").style.display = "none";

  const tabs = document.querySelectorAll(".tab");
  tabs[0].classList.add("active");
  tabs[1].classList.remove("active");
}

function showRegister() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
  document.getElementById("resetPasswordForm").style.display = "none";

  const tabs = document.querySelectorAll(".tab");
  tabs[0].classList.remove("active");
  tabs[1].classList.add("active");
}

function showResetPassword() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("resetPasswordForm").style.display = "block";
}

async function login(event) {
  event.preventDefault();

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const messageDiv = document.getElementById("loginMessage");

  if (username.length === 0 || password.length === 0) {
    showMessage(messageDiv, "Por favor, preencha todos os campos", "error");
    return;
  }

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

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("loggedIn", "true");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } else {
      showMessage(messageDiv, data.message, "error");
    }
  } catch (error) {
    showMessage(messageDiv, "Erro ao fazer login", "error");
    console.log(error);
  }
}

async function register(event) {
  event.preventDefault();

  const username = document.getElementById("registerUsername").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const passwordConfirm = document.getElementById(
    "registerPasswordConfirm",
  ).value;
  const messageDiv = document.getElementById("registerMessage");

  if (password != passwordConfirm) {
    showMessage(messageDiv, "As senhas não coincidem", "error");
    return;
  }

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

async function resetPassword(event) {
  event.preventDefault();

  const username = document.getElementById("resetUsername").value;
  const newPassword = document.getElementById("resetNewPassword").value;
  const messageDiv = document.getElementById("resetMessage");

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

function showMessage(element, message, type) {
  element.textContent = message;
  element.className = `message ${type}`;
  element.style.display = "block";

  setTimeout(() => {
    element.style.display = "none";
  }, 3000);
}
