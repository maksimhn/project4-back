var models = require('../models'),
  Expense = models.Expense,
  User = models.User,
  Car = models.Car;


var expensesCollector = function(user, res, requestedCarId, interval){
    var d;
    var timeSpan = isFinite(interval) ? interval : (+interval || 0);
    var expensesFound = [];

    if (timeSpan === 0) {
        d = Date.now();
        console.log('we got === 0 in expensesCollector, timeSpan is ', timeSpan);
    } else {
        d = timeSpan * 24 * 60 * 60 * 1000;
    }

    if (carId == '0') {
        res.json(getOneCarExpenses());
    } else {
        res.json(getAllCarsExpenses());
    }

    var getOneCarExpenses = function() {
        Expense.findAll({
            where: {
                carId: requestedCarId,
                dateInMilliseconds: {
                    $lt: new Date().getTime(),
                    $gt: new Date().getTime() - d
                }
            }
        }).then(function(expenses){
            console.log('expenses found are ', expenses);
            expensesFound = expenses;
        });
        return expensesFound;
    };

    var getAllCarsExpenses = function() {
        user.getCars().then(function(cars){
            cars.forEach(function(car){
                car.getExpenses({
                    where: {
                        carId: requestedCarId,
                        dateInMilliseconds: {
                            $lt: new Date().getTime(),
                            $gt: new Date().getTime() - d
                        }
                    }
                }).then(function(expenses){
                    console.log('expenses found for all cars are ', expenses);
                    expensesFound = expensesFound.concat(expenses);
                })
            });
        });
        return expensesFound;
    };
};

module.exports = expensesCollector;
