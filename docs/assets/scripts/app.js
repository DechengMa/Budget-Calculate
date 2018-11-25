var budgetController = (function() {
    //Capitalize first letter for function constructor 
    var Expense = function(id, description, value) {
       this.id = id;
       this.description = description;
       this.value = value;
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
        percentage: '.budget__expenses--percentage' 
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
                
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === 'exp'){
                element = DOMstrings.expensesContainer;
                 
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
//            2. replace the placeholder text with some actual data
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);

//            3.insert HTML to DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
            
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.income).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
        
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentage).textContent = obj.percentage + '%';
            }else {
                document.querySelector(DOMstrings.percentage).textContent = '---';
            }
        }, 
        
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
    
})();

var controller = (function(budgetContr, UIContr) {
    
    var setupEventListeners = function() {
        document.querySelector(DOM.inputBtn).addEventListener('click', function() {
            ctrlAddItem();
        })

        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        })
    }
    
    var DOM = UIContr.getDOMstrings();
    
    var updateBudget = function() {
        
        //1. Calculate budget
        budgetContr.calculateBudget();
        
        //2. Return the budget
        var budget = budgetContr.getBudget();
        
        //3. Display on the UI
        UIContr.displayBudget(budget);
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
        }
        
    }
    
    return {
        init: function() {
            console.log('App has started')
            UIContr.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            setupEventListeners();
        }
    };
    
})(budgetController, UIController);

controller.init();