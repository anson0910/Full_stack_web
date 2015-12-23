'use strict';

angular.module('confusionApp')

    .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {

        $scope.tab = 1;
        $scope.filtText = '';
        $scope.showDetails = false;
        // Since the first tab is selected as default,
        // the filtText should not filter out any item from the menu.
        // Hence filtText is set to the empty string.

        $scope.dishes= menuFactory.getDishes();

        $scope.select = function(setTab) {
            $scope.tab = setTab;

            if (setTab === 2) {
                $scope.filtText = "appetizer";
            }
            else if (setTab === 3) {
                $scope.filtText = "mains";
            }
            else if (setTab === 4) {
                $scope.filtText = "dessert";
            }
            else {
                $scope.filtText = "";
            }
        };

        $scope.isSelected = function (checkTab) {
            return ($scope.tab === checkTab);
        };

        $scope.toggleDetails = function() {
            $scope.showDetails = !$scope.showDetails;
        };
    }])

    .controller('ContactController', ['$scope', function($scope) {

        $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

        var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

        $scope.channels = channels;
        $scope.invalidChannelSelection = false;

    }])

    .controller('FeedbackController', ['$scope', function($scope) {

        $scope.sendFeedback = function() {

            console.log($scope.feedback);

            if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                $scope.invalidChannelSelection = true;
                console.log('incorrect');
            }
            else {
                $scope.invalidChannelSelection = false;
                $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                $scope.feedback.mychannel="";
                $scope.feedbackForm.$setPristine();
                console.log($scope.feedback);
            }
        };
    }])

    .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {

        var dish= menuFactory.getDish(parseInt($stateParams.id,10));

        $scope.dish = dish;

    }])

    .controller('DishCommentController', ['$scope', function($scope) {

        // Create a JavaScript object to hold the comment from the form
        $scope.mycomment = {rating:5, comment:"", author:"", date:""};

        $scope.submitComment = function () {
            // Record the date
            $scope.mycomment.date = new Date().toISOString();
            console.log($scope.mycomment);
            // Push comment into the dish's comment array
            $scope.dish.comments.push($scope.mycomment);
            // Reset your form to pristine
            $scope.commentForm.$setPristine();
            // Reset JavaScript object that holds comment
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
        }
    }])

    .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', function($scope, menuFactory, corporateFactory)  {
        var dish = menuFactory.getDish(0);
        var promotion = menuFactory.getPromotion(0);
        var chef = corporateFactory.getLeader(3);

        $scope.dish = dish;
        $scope.promotion = promotion;
        $scope.chef = chef;
    }])

    .controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory)    {
        var leadership = corporateFactory.getLeaders;
        $scope.leadership = leadership;
    }])

;
