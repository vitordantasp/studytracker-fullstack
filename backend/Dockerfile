# --- ETAPA 1: BUILD ---
# Usamos uma imagem que já tem Maven e Java 21
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Define a pasta de trabalho dentro do Linux do container
WORKDIR /app

# Copia o arquivo de dependências
COPY pom.xml .

# Baixa as dependências (Isso fica em cache para ser mais rápido nas próximas vezes)
RUN mvn dependency:go-offline

# Copia o código fonte do seu projeto para dentro do container
COPY src ./src

# Compila o projeto e gera o arquivo .jar (pula os testes para agilizar o deploy)
RUN mvn clean package -DskipTests

# --- ETAPA 2: RUN ---
# Agora usamos uma imagem leve, só com o Java (sem Maven)
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copia apenas o arquivo .jar gerado na etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta 8080 (padrão do Spring)
EXPOSE 8080

# O comando que faz o servidor rodar
ENTRYPOINT ["java", "-jar", "app.jar"]