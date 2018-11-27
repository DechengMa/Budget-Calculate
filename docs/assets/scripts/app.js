var budgetController = (function() {
    //Capitalize first letter for function constructor 
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome) {       
        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else {
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };
   
    var Income = function(id, description, value) {
       this.id = id;
       this.description = description;
       this.value = value;
    };
    
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };
   
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            //create new ID
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;  
            }else {
                ID = 0;
            }
            
            //Create new item based on
            if(type === 'exp') {
                newItem = new Expense(ID, des, val);
            }else if(type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            data.allItems[type].push(newItem);
            
            return newItem;
        },
        
        deleteItem: function(type, id) {
            var ids, index;
            
            ids = data.allItems[type].map(function(current) {
                return current.id;
            })
            
            index = ids.indexOf(id);
            
            if(index !== -1 ){
                data.allItems[type].splice(index, 1);
            }
        },
        
        calculateBudget: function() {
            
            // calculate total income and expense
            calculateTotal('exp');
            calculateTotal('inc');
            
            // cal budget = income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            // calculate the percentage
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else {
                data.percentage = -1;
            }
            
        },
        
        calculatePercentage: function() {
            data.allItems.exp.forEach(function(cur) {
                 cur.calcPercentage(data.totals.inc);
            });
            
        },
        
        getPercentage: function() {
            //this is a array 
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },
        
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        
        testing: function() {
            console.log(data);
        }
    }

})();

//budgetController.prototype;

var Expense = function(id, description, value) {
   this.id = id;
   this.description = description;
   this.value = value;
}

var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        income: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentage: '.budget__expenses--percentage',
        container: '.container',
        expensePercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
        
    var formatNumeber = function(num, type) {
        var numSplit, int, dec, sign;

        num = Math.abs(num)
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];

        if(int.length > 3 ){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length -3 , 3); 
            //input 2310, out put 2,310

        }
        
        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };
    
    var nodeListForEach = function(list, callback){
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i)
        }
    }; 
    
    return {
        getinput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,                                      
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        addListItem: function(obj, type) {
            var html, newHtml, element;
            
//            1.Create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === 'exp'){
                element = DOMstrings.expensesContainer;
                 
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
//            2. replace the placeholder text with some actual data
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%', formatNumeber(obj.value, type));

//            3.insert HTML to DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        deleteListItem: function(selectorID) {
//           document.getElementById(selectorID).parentNode.removeChild(document.getElementById(selectorID));
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        
        
        clearFields: function() {
            var fields, fieldsArr;
            //return a list                           //like css selector 
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            
            var fieldsArr = Array.prototype.slice.call(fields);
            
                            //callback function, 3 arguments, 
                            //current: value of the array that is been processed,
                            //array: entire array
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            //set focus back
            fieldsArr[0].focus();
            
        },
        
        displayBudget: function(obj) {
            
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumeber(obj.budget,type);
            document.querySelector(DOMstrings.income).textContent = formatNumeber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumeber(obj.totalExp, 'exp');
        
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentage).textContent = obj.percentage + '%';
            }else {
                document.querySelector(DOMstrings.percentage).textContent = '---';
            }
        }, 
        
        displayMonth: function() {
            var now, month,year;
            now = new Date();
            // var christmas = new Date(2018, 11, 25);
            months = ["Jan", 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            month = months[now.getMonth()];
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = month + ' ' + year;
        },
        
        displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMstrings.expensePercLabel);
            
            
            
            nodeListForEach(fields, function(current, index) {
                
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else {
                    current.textContent = '---';
                }
                
            });
            
        },
        
        changeType: function() {
            var fields = document.querySelectorAll( 
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );
            
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            })
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            
        },
        
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
    
})();

var controller = (function(budgetContr, UIContr) {
    
    var setupEventListeners = function() {
        var DOM = UIContr.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', function() {
            ctrlAddItem();
        });

        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UIContr.changeType);
        
    };
    
    
    var updateBudget = function() {
        
        //1. Calculate budget
        budgetContr.calculateBudget();
        
        //2. Return the budget
        var budget = budgetContr.getBudget();
        
        //3. Display on the UI
        UIContr.displayBudget(budget);
    };
    
    var updatePercentages = function() {
        
        // 1. Calculate percentages 
        budgetContr.calculatePercentage();
        
        // 2. Read percentages from the budget controller 
        var percentages = budgetContr.getPercentage();
        
        // 3. Update the UI
        UIContr.displayPercentages(percentages);
        
    }
    
    var ctrlAddItem = function () {
        
        var input, newItem;

        //1. Get the field input data
        input = UIContr.getinput();
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            
            //2. Add item to budget controller
            newItem = budgetContr.addItem(input.type, input.description, input.value);

            //3. Add the item to UI
            UIContr.addListItem(newItem, input.type);

            //4. Clear the fields 
            UIContr.clearFields();

            //5. Calculate and update budget
            updateBudget();
            
            //6. Calculate and update percentages 
            updatePercentages();
        }
        
    };
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID) {
            
            splitID = itemID.split('-');
            
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            //1. DELETE the item fomr the data structure
            budgetContr.deleteItem(type, ID);
            
            //2. Delele the item from the UI
            
            UIContr.deleteListItem(itemID);
            //3. Update UI
            updateBudget();
            
            //4. Calculate and update percentages 
            updatePercentages();
            
        }
        
    };
    
    return {
        init: function() {
            console.log('App has started');
            UIContr.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            setupEventListeners();
            UIContr.displayMonth();
        }
    };
    
})(budgetController, UIController);

controller.init();