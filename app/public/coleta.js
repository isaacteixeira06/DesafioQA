function showTab(tabName) {
  const tabs = document.querySelectorAll(".tab-content");
  const buttons = document.querySelectorAll(".nav-tab");

  tabs.forEach((tab) => tab.classList.remove("active"));
  buttons.forEach((btn) => btn.classList.remove("active"));

  document.getElementById(tabName).classList.add("active");
  event.target.classList.add("active");
}

function previewColeta() {
  const coletaData = {
    beneficiario: {
      id: document.getElementById("beneficiarioId").value,
      nome: document.getElementById("beneficiarioNome").value,
    },
    indicadores: {
      taxaConclusao: document.getElementById("indicador1").value,
      frequencia: document.getElementById("indicador2").value,
      nota: document.getElementById("indicador3").value,
      progresso: document.getElementById("indicador4").value,
    },
    observacoes: document.getElementById("observacoes").value,
    status: document.getElementById("status").value,
    timestamp: new Date().toISOString(),
  };

  const preview = document.getElementById("coletaPreview");
  const previewContent = document.getElementById("previewContent");
  previewContent.textContent = JSON.stringify(coletaData, null, 2);
  preview.style.display = "block";
}

function submitColeta(event) {
  event.preventDefault();

  const beneficiarioId = document.getElementById("beneficiarioId").value;
  const beneficiarioNome = document.getElementById("beneficiarioNome").value;
  const indicador1 = document.getElementById("indicador1").value;
  const indicador2 = document.getElementById("indicador2").value;
  const indicador3 = document.getElementById("indicador3").value;
  const status = document.getElementById("status").value;

  const messageDiv = document.getElementById("coletaMessage");

  // BUG 53: Validação inadequada - usa == ao invés de ===
  if (beneficiarioId == "" || beneficiarioNome == "") {
    showMessage(
      messageDiv,
      "ID e Nome do beneficiário são obrigatórios",
      "error",
    );
    return;
  }

  // BUG 54: Não valida que indicadores são números
  if (!indicador1 || !indicador2 || !indicador3) {
    showMessage(
      messageDiv,
      "Todos os indicadores principais são obrigatórios",
      "error",
    );
    return;
  }

  // BUG 55: Aceita valores negativos sem validação
  // Deveria validar: indicador1 >= 0 && indicador1 <= 100
  // Deveria validar: indicador2 >= 0 && indicador2 <= 100
  // Deveria validar: indicador3 >= 0 && indicador3 <= 10

  const coletaData = {
    beneficiarioId: beneficiarioId,
    beneficiarioNome: beneficiarioNome,
    indicador1: parseFloat(indicador1),
    indicador2: parseFloat(indicador2),
    indicador3: parseFloat(indicador3),
    indicador4: document.getElementById("indicador4").value || 0,
    observacoes: document.getElementById("observacoes").value,
    status: status || "em_progresso",
    timestamp: new Date().toISOString(),
  };

  // BUG 56: Não valida tamanho das observações antes de enviar
  // BUG 57: Não sanitiza entrada de observações (XSS potencial)

  fetch("/api/coleta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(coletaData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showMessage(
          messageDiv,
          data.message || "Coleta submetida com sucesso!",
          "success",
        );
        document.getElementById("coletaForm").reset();
        document.getElementById("indicadoresForm").reset();
        document.getElementById("coletaPreview").style.display = "none";

        // BUG 58: Limpa mensagem muito rápido (3 segundos) pode não ser legível
        setTimeout(() => {
          messageDiv.style.display = "none";
        }, 3000);
      } else {
        showMessage(
          messageDiv,
          data.message || "Erro ao submeter coleta",
          "error",
        );
      }
    })
    .catch((error) => {
      // BUG 59: Mensagem de erro expõe detalhes técnicos
      showMessage(messageDiv, "Erro na requisição: " + error.message, "error");
    });
}

function submitLote(event) {
  event.preventDefault();

  const fileInput = document.getElementById("arquivoCSV");
  const file = fileInput.files[0];
  const messageDiv = document.getElementById("loteMessage");

  if (!file) {
    showMessage(messageDiv, "Selecione um arquivo", "error");
    return;
  }

  // BUG 60: Não valida tipo de arquivo no lado do cliente
  // Deveria verificar se é realmente CSV/Excel antes de enviar
  // const validTypes = ['text/csv', 'application/vnd.ms-excel'];
  // if (!validTypes.includes(file.type)) { ... }

  const formData = new FormData();
  formData.append("arquivo", file);
  formData.append(
    "validarDuplicatas",
    document.getElementById("validarDuplicatas").checked,
  );

  // BUG 61: Sem limite de tamanho de arquivo
  // Deveria verificar: if (file.size > 10 * 1024 * 1024) { ... }

  fetch("/api/coleta/lote", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // BUG 62: Mensagem mostra quantidade inserida mas pode estar errada
        showMessage(
          messageDiv,
          `${data.inseridos} registros inseridos com sucesso!`,
          "success",
        );
        fileInput.value = "";
      } else {
        showMessage(
          messageDiv,
          data.message || "Erro ao fazer upload do arquivo",
          "error",
        );
      }
    })
    .catch((error) => {
      showMessage(messageDiv, "Erro na requisição: " + error.message, "error");
    });
}

function loadHistorico() {
  const historicoDiv = document.getElementById("historicoData");
  historicoDiv.innerHTML = "<p>Carregando...</p>";

  // BUG 63: Não filtra coletas por usuário
  // Sistema retorna TODAS as coletas de TODOS os usuários
  fetch("/api/coleta/historico")
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.coletas.length > 0) {
        let html = "";
        // BUG 64: Não oculta dados de outros usuários
        // Mostra beneficiarioId, nomes, datas para coletas de outros QAs
        data.coletas.forEach((coleta) => {
          html += `
            <div class="user-card">
              <strong>ID: ${coleta.beneficiarioId}</strong><br>
              Nome: ${coleta.beneficiarioNome}<br>
              Status: ${coleta.status}<br>
              Data: ${new Date(coleta.timestamp).toLocaleString("pt-BR")}<br>
              Indicadores: Taxa ${coleta.indicador1}%, Freq ${coleta.indicador2}%, Nota ${coleta.indicador3}<br>
              <!-- BUG 65: Mostra nome do usuário que fez a coleta (pode ser sensível) -->
              Coletado por: ${coleta.usuarioColeta}
            </div>
          `;
        });
        historicoDiv.innerHTML = html;
      } else {
        historicoDiv.innerHTML = "<p>Nenhuma coleta encontrada.</p>";
      }
    })
    .catch((error) => {
      historicoDiv.innerHTML = `<p style="color: red;">Erro ao carregar histórico: ${error.message}</p>`;
    });
}

function showMessage(element, message, type) {
  element.textContent = message;
  element.className = `message ${type}`;
  element.style.display = "block";
}

function logout() {
  fetch("/logout", { method: "POST" })
    .then(() => {
      window.location.href = "/";
    })
    .catch((error) => console.error("Erro ao fazer logout:", error));
}

document.addEventListener("DOMContentLoaded", function () {
  const coletaForm = document.getElementById("coletaForm");
  if (coletaForm) {
    coletaForm.addEventListener("submit", submitColeta);
  }
});
