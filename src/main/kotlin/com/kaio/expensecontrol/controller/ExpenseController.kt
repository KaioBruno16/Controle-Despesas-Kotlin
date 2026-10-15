package com.kaio.expensecontrol.controller

import com.kaio.expensecontrol.model.CreateExpenseRequest
import com.kaio.expensecontrol.model.Expense
import com.kaio.expensecontrol.service.ExpenseService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal

@RestController
@RequestMapping("/api/expenses")
class ExpenseController(
    private val expenseService: ExpenseService
) {

    @GetMapping
    fun findAll(): List<Expense> =
        expenseService.findAll()

    @GetMapping("/total")
    fun total(): Map<String, BigDecimal> =
        mapOf("total" to expenseService.total())

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody request: CreateExpenseRequest): Expense =
        expenseService.create(request)

    @PutMapping("/{id}/paid")
    fun togglePaid(@PathVariable id: Long): Expense {
        if (!expenseService.togglePaid(id)) {
            throw NoSuchElementException("Despesa não encontrada.")
        }

        return expenseService.findAll().first { it.id == id }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: Long) {
        if (!expenseService.delete(id)) {
            throw NoSuchElementException("Despesa não encontrada.")
        }
    }
}
