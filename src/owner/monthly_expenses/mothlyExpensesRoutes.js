const router = require("express").Router();
const monthlyExpenseControllers = require("./mothlyExpensesControllers");

router.post(
  "/add-monthly-expense",
  monthlyExpenseControllers.createNewMonthlyExpense
);
router.get(
  "/all/monthly-expense",
  monthlyExpenseControllers.getAllMonthlyExpenseInfor
);
router.get("/infor/:id", monthlyExpenseControllers.getMonthlyExpenseInfor);
router.put(
  "/update/monthly-expense",
  monthlyExpenseControllers.updateMonthlyExpenseInfor
);
router.delete(
  "/delete/monthly-expense/:id",
  monthlyExpenseControllers.deleleMonthlyExpenseInfor
);

module.exports = router;
