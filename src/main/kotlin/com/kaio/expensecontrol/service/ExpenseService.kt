package com.kaio.expensecontrol.service

import com.kaio.expensecontrol.model.CreateExpenseRequest
import com.kaio.expensecontrol.model.Expense
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.util.concurrent.atomic.AtomicLong
import java.util.concurrent.ConcurrentHashMap

@Service
class ExpenseService {

    private val idGenerator = AtomicLong(0)
    private val expenses = ConcurrentHashMap<Long, Expense>()

    fun findAll(): List<Expense> =
        expenses.values.sortedByDescending { it.id }

    fun create(request: CreateExpenseRequest): Expense {
        require(request.description.isNotBlank()) {
            "A descrição é obrigatória."
        }
        require(request.amount > BigDecimal.ZERO) {
            "O valor deve ser maior que zero."
        }
        require(request.category.isNotBlank()) {
            "A categoria é obrigatória."
        }

        val expense = Expense(
            id = idGenerator.incrementAndGet(),
            description = request.description.trim(),
            amount = request.amount,
            category = request.category.trim(),
            dueDate = request.dueDate,
            paid = false
        )

        expenses[expense.id] = expense
        return expense
    }

    fun togglePaid(id: Long): Boolean {
        val expense = expenses[id] ?: return false

        expenses[id] = expense.copy(paid = !expense.paid)
        return true
    }

    fun delete(id: Long): Boolean =
        expenses.remove(id) != null

    fun total(): BigDecimal =
        expenses.values.fold(BigDecimal.ZERO) { total, expense ->
            total + expense.amount
        }
}
