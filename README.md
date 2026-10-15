# Expense Control Kotlin

Projeto simples de controle de despesas desenvolvido com Kotlin e Spring Boot.

## Tecnologias

- Kotlin
- Spring Boot
- Gradle
- HTML
- CSS
- JavaScript

## Funcionalidades

- Cadastrar despesas
- Listar despesas
- Excluir despesas
- Calcular total das despesas
- Frontend servido pelo próprio Spring Boot
- Configuração de CORS

## Como executar no IntelliJ IDEA

1. Abra o IntelliJ IDEA.
2. Selecione `Open` e escolha a pasta do projeto.
3. Aguarde o Gradle baixar as dependências.
4. Execute a classe `ExpenseControlApplication.kt`.
5. Abra no navegador:

http://localhost:8080

## Endpoints

- `GET /api/expenses` - lista despesas
- `GET /api/expenses/total` - mostra o total
- `POST /api/expenses` - cadastra uma despesa
- `DELETE /api/expenses/{id}` - exclui uma despesa
