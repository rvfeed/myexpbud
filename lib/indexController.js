app.controller('insertDataController', function($scope, $http, $timeout, budgetService) {
    var todoList = this;
    console.log("okkkk")
        // var n = new budgetFactory();
    budgetService.getData(function(data) {
        $scope.kindsData = data.data.types;
        $scope.kindsDataModel = $scope.kindsData[0].name;
    });
    $scope.updateData = "no";
    $scope.updateDataId = 0;
    $scope.subBtnText = "Submit";
    $scope.getResult = function(period) {
        getBudgetData(period);
    }

    $scope.insertData = function() {

        if ($scope.updateData == "yes") {
            update = false;
            $scope.budgetRow["update"] = "yes";
        }
        if (isNaN($scope.budgetRow.price)) {
            $scope.msg = "Please enter number";
            return false;
        }
        var method = "POST";
        var id = "";
        if ($scope.budgetRow._id) {
            method = "PUT";
            id = "/" + $scope.budgetRow._id;
        }
        $scope.budgetRow["date"] = $("#itemDate").val();
        $scope.budgetRow["type"] = $scope.kindsDataModel;
        $scope.budgetRow["name"] = $scope.name;
        budgetService.sendData(method, id, $scope.budgetRow, function(data) {
            console.log(data);
            console.log("okkkk");
            $scope.budgetRow = {};
            getBudgetData();
            var flag;
            if ($scope.updateData) {
                flag = "Updated";
            }
            else {
                flag = "Added";
            }
            $scope.updateData = false;
            $scope.subBtnText = "Submit";
            // Temporary fix
            $scope.budgetRow = {};
            $scope.msg = flag + " succesfully";
            timeOut(3000);
            // if successful, bind success message to message
            console.log("err");

        });


    }
    var timeOut = function(time) {
        if (time === undefined) {
            time = 3000;
        }
        var countUp = function() {
            $scope.msg = "";
            $scope.msgData = "";
        }
        $timeout(countUp, time);
    }
    var getTotal = function(result) {
        var total = 0;
        for (var i = 0; i < result.length; i++) {
            var item = result[i];
            total += (+item.price);
        }
        return total;
    }
    var getBudgetData = function(flag) {
        var param = "";

        var update = false;

        if (flag != undefined) {
            if (flag == "w" || flag == "m" || flag == "y" || flag == "t") {
                param = "?p=" + flag;
            }
            else {
                param = "/" + flag;
                update = true;
            }

        }
        else {
            param = "";
        }
        budgetService.getBudgetData(param, function(data) {
            console.log(flag);
            console.log(data);
            var result = data.data;
            if (!update) {
                $scope.getTotal = getTotal(result);
                $scope.resultData = result;
            }
            else {
                console.log(data);
                $scope.budgetRow = result;
                $scope.name = result.name;
                $scope.kindsDataModel = result.type;
            }

        });
    }

    getBudgetData();

    $scope.deleteRow = function(id) {
        if (!confirm("Are you sure?")) {
            return false;
        }
        budgetService.deleteRow(id, function(data) {
            getBudgetData();
            $scope.msgData = "Deleted succesfully";
        });
    }
    $scope.updateRow = function(id) {
        $scope.updateData = "yes";
        $scope.updateDataId = id;
        $scope.subBtnText = "Update";
        getBudgetData(id);
    }

});
