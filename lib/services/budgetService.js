  app.service("budgetService", function($http){
        
        this.getData = function(callback){
                 $http.get("kinds.json").then(function(data){
                return callback(data);
                });
        }
        this.sendData = function(method, id, budgetRow, callback){
             $http({
                method  : method,
                url     : '/blobs'+id,
                data    : $.param(budgetRow),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            }).then(function(data){
                return callback(data);
            });
        }
        this.getBudgetData = function(param, callback){
            $http({
                method  : 'GET',
                url     : '/blobs'+param,
                data : param
            }).then(function(data){
                return callback(data);
            });
        }
        this.deleteRow = function(id, callback){
            $http({
                method  : 'DELETE',
                url     : '/blobs/'+id,                
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            }).then(function(data) {
                return callback(data);
            });
        }
                //return types;       
    });