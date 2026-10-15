const API_URL = "/api/expenses";

const form = document.getElementById("expense-form");
const list = document.getElementById("expense-list");
const totalElement = document.getElementById("total");
const paidTotalElement = document.getElementById("paid-total");
const message = document.getElementById("message");
const dueDateInput = document.getElementById("dueDate");

dueDateInput.value = new Date().toISOString().split("T")[0];

function formatCurrency(value) {
    return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatDate(date) {
    if (!date) {
        return "";
    }

    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year}`;
}

function showMessage(text, type = "") {
    message.textContent = text;
    message.className = `message ${type}`;
}

async function loadExpenses() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Não foi possível carregar as despesas.");
        }

        const expenses = await response.json();

        renderExpenses(expenses);
        await loadTotal(expenses);

    } catch (error) {
        list.innerHTML = `<p class="empty">${error.message}</p>`;
    }
}

async function loadTotal(expenses) {
    const response = await fetch(`${API_URL}/total`);

if (!response.ok) {
    throw new Error("Não foi possível carregar o total.");
}

const data = await response.json();

totalElement.textContent = formatCurrency(data.total);

const paidTotal = expenses
    .filter(expense => expense.paid)
    .reduce(
        (total, expense) => total + Number(expense.amount),
        0
    );

if (paidTotalElement) {
    paidTotalElement.textContent = formatCurrency(paidTotal);
}
}

function renderExpenses(expenses) {
    if (expenses.length === 0) {
        list.innerHTML =
            '<p class="empty">Nenhuma despesa cadastrada.</p>';
        return;
    }

    list.innerHTML = expenses.map(expense => `
        <div class="expense-item">

            <div class="expense-info">

                <div class="expense-title">
                    ${escapeHtml(expense.description)}
                </div>

                <div class="expense-meta">
                    ${escapeHtml(expense.category)} •
                    Vencimento: ${formatDate(expense.dueDate)}
                </div>

            </div>

            <div class="expense-actions">

                <label class="paid-option">

                    <input
                        type="checkbox"
                        ${expense.paid ? "checked" : ""}
                        onchange="togglePaid(${expense.id})"
                    >

                    ${expense.paid ? "Pago" : ""}
                </label>

                <span class="expense-value">
                    ${formatCurrency(expense.amount)}
                </span>

                <button
                    class="delete-button"
                    onclick="deleteExpense(${expense.id})"
                >
                    Excluir
                </button>

            </div>

        </div>
    `).join("");
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

async function togglePaid(id) {
    try {
        const response = await fetch(`${API_URL}/${id}/paid`, {
            method: "PUT"
        });

        if (!response.ok) {
            throw new Error(
                "Não foi possível atualizar o status da despesa."
            );
        }

        showMessage(
            "Status da despesa atualizado!",
            "success"
        );

        await loadExpenses();

    } catch (error) {
        showMessage(error.message, "error");
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const expense = {
        description: document.getElementById("description").value,
        amount: Number(document.getElementById("amount").value),
        category: document.getElementById("category").value,
        dueDate: dueDateInput.value
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(expense)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Erro ao cadastrar despesa."
            );
        }

        form.reset();

        dueDateInput.value =
            new Date().toISOString().split("T")[0];

        showMessage(
            "Despesa cadastrada com sucesso!",
            "success"
        );

        await loadExpenses();

    } catch (error) {
        showMessage(error.message, "error");
    }
});

async function deleteExpense(id) {
    const confirmed = confirm(
        "Deseja excluir esta despesa?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(
                "Não foi possível excluir a despesa."
            );
        }

        showMessage(
            "Despesa excluída.",
            "success"
        );

        await loadExpenses();

    } catch (error) {
        showMessage(error.message, "error");
    }
}

document
    .getElementById("refresh")
    .addEventListener("click", loadExpenses);

loadExpenses();



