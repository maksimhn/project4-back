var models = require('../models'),
  Expense = models.Expense,
  User = models.User,
  Car = models.Car;


var expensesCollector = function(user, res, requestedCarId, interval){
    var d;
    var timeSpan = isFinite(interval) ? interval : (+interval || 0);
    var expensesFound = [];

    var getOneCarExpenses = function() {
        Expense.findAll({
            where: {
                CarId: requestedCarId,
                dateInMilliseconds: {
                    $lt: new Date().getTime(),
                    $gt: new Date().getTime() - d
                }
            }
        }).then(function(expenses){
            expensesFound = expenses;
        });
        return expensesFound;
    };

    var getAllCarsExpenses = function() {
        user.getCars().then(function(cars){
            cars.forEach(function(car){
                car.getExpenses({
                    where: {
                        CarId: requestedCarId,
                        dateInMilliseconds: {
                            $lt: new Date().getTime(),
                            $gt: new Date().getTime() - d
                        }
                    }
                }).then(function(expenses){
                    expensesFound = expensesFound.concat(expenses);
                })
            });
        });
        return expensesFound;
    };

    if (timeSpan === 0) {
        d = Date.now();
        console.log('we got === 0 in expensesCollector, timeSpan is ', timeSpan);
    } else {
        d = timeSpan * 24 * 60 * 60 * 1000;
    }

    if (requestedCarId == '0') {
        res.json(getOneCarExpenses());
    } else {
        res.json(getAllCarsExpenses());
    }
};

module.exports = expensesCollector;
