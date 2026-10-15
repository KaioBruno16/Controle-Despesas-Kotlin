package com.kaio.expensecontrol.model

import java.math.BigDecimal
import java.time.LocalDate

data class Expense(
    val id: Long,
    val description: String,
    val amount: BigDecimal,
    val category: String,
    val dueDate: LocalDate,
    val paid: Boolean
)

data class CreateExpenseRequest(
    val description: String,
    val amount: BigDecimal,
    val category: String,
    val dueDate: LocalDate
)
