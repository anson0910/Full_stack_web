'use strict';

var app = angular.module('confusionApp');
app.controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {
        $scope.tab = 1;
        $scope.filtText = "";
        $scope.showDetails = false;
        // Since the first tab is selected as default,
        // the filtText should not filter out any item from the menu.
        // Hence filtText is set to the empty string.
        $scope.dishes = menuFactory.getDishes();

        $scope.select = function(setTab) {
            $scope.tab = setTab;
            if (setTab === 2)   {
                $scope.filtText = "appetizer";
            }
            else if (setTab === 3)  {
                $scope.filtText = "mains";
            }
            else if (setTab === 4)  {
                $scope.filtText = "dessert";
            }
            else {
                $scope.filtText = "";
            }
        };
        $scope.isSelected = function(checkTab)    {
            return ($scope.tab === checkTab);
        };
        $scope.toggleDetails = function()   {
            $scope.showDetails = !$scope.showDetails;
        };
    }]);

app.controller('ContactController', ['$scope', function($scope) {
        $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
        var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
        $scope.channels = channels;
        $scope.invalidChannelSelection = false;
    }]);

app.controller('FeedbackController', ['$scope', function($scope) {
        $scope.sendFeedback = function() {
            console.log($scope.feedback);
            if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                $scope.invalidChannelSelection = true;
                console.log('incorrect');
            }
            else {
                $scope.invalidChannelSelection = false;
                $scope.feedback = {mychannel:"", firstName:"", lastName:"",
                                   agree:false, email:"" };
                $scope.feedback.mychannel="";

                $scope.feedbackForm.$setPristine();
                console.log($scope.feedback);
            }
        };
    }]);

app.controller('DishDetailController', ['$scope', '$routeParams', 'menuFactory',
    function($scope, $routeParams, menuFactory) {
        var dish = menuFactory.getDish(parseInt($routeParams.id, 10));
        $scope.dish = dish;
    }]);

app.controller('DishCommentController', ['$scope', function($scope) {

        //Step 1: Create a JavaScript object to hold the comment from the form
        $scope.feedback = {author:"", rating:5, comment:"", date:""};

        $scope.submitComment = function () {
            //Step 2: This is how you record the date
            $scope.feedback.date = new Date().toISOString();

            // Step 3: Push your comment into the dish's comment array
            $scope.dish.comments.push($scope.feedback);
            //Step 4: reset your form to pristine
            $scope.commentForm.$setPristine();
            //Step 5: reset your JavaScript object that holds your comment
            $scope.feedback = {author:"", rating:5, comment:"", date:""};
        }
    }]);
