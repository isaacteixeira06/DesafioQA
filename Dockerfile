# Usa a imagem oficial do Cypress com os navegadores já embutidos
FROM cypress/browsers:latest

# Define a pasta de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de configuração do Node e TypeScript
COPY package.json tsconfig.json ./

# Instala as dependências (Cypress, TypeScript, etc.)
RUN npm install

# Copia o restante dos arquivos do seu projeto
COPY . .

# Comando padrão: roda o Cypress no terminal (modo headless)
CMD ["npx", "cypress", "run"]