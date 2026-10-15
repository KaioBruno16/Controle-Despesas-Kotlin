package com.kaio.expensecontrol

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class ExpenseControlApplication

fun main(args: Array<String>) {
    runApplication<ExpenseControlApplication>(*args)
}
