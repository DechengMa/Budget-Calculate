var budgetController = (function() {
    var x = 23;
    
    var add = function(a) {
        return x + a;
    }
    
    return {
        publicTest: function(b) {
           return add(b);
        }
    }
})();

var UIController = (function() {
    
})();

var controller = (function(budgetContr, UIContr) {
        
    document.querySelector('.add__btn').addEventListener('click', function() {
        console.log('Clicked');
    })
    
})(budgetController, UIController);