#  Desafio Técnico QA - Automação E2E com Cypress e Docker

Este repositório contém a resolução do desafio técnico de Quality Assurance. O projeto consiste na orquestração de uma aplicação base (intencionalmente vulnerável) e na execução automatizada de uma suíte de testes E2E (End-to-End) utilizando o Cypress.

Todo o ambiente foi encapsulado utilizando Docker, garantindo que a aplicação e os testes rodem de forma isolada e com comportamento idêntico em qualquer máquina.

---

##  Artefatos de QA e Documentação

Além da automação, toda a análise técnica exigida pelo desafio está documentada em arquivos dedicados na raiz do projeto:

* 📄 **`casos_de_teste.md`**: Detalhamento dos cenários de testes planejados (Mapeamento E2E).
* 🐞 **`BUGS_GABARITO.md`**: Documentação das falhas e vulnerabilidades encontradas no sistema base.
* ✅ **`checklist_prevencao.md`**: Recomendações e boas práticas para evitar as falhas encontradas.

---

## Tecnologias Utilizadas

* **Cypress (v15.x):** Framework moderno para automação E2E.
* **Docker & Docker Compose:** Orquestração de containers para a aplicação e para a automação.
* **Mochawesome:** Geração de relatórios HTML interativos com evidências (screenshots).
* **Node.js & TypeScript:** Base do projeto e tipagem estática.

---

## Pré-requisitos 

Para rodar o projeto, você precisa ter instalado:

1. **Docker Desktop** 
2. **Git** 
3. **Node.js** 
---

## Como Executar o Projeto

Abra o terminal na pasta do projeto e siga os passos abaixo:

### 1. Automação Total 
Este comando sobe a aplicação, aguarda ela ficar pronta, roda todos os testes e desliga os containers ao final:

```bash
npm run docker:run