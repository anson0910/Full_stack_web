'use strict';

angular.module('confusionApp')

    .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {

        $scope.tab = 1;
        // Since the first tab is selected as default,
        // the filtText should not filter out any item from the menu.
        // Hence filtText is set to the empty string.
        $scope.filtText = '';
        $scope.showDetails = false;

        $scope.showMenu = false;
        $scope.message = "Loading ...";
        $scope.dishes = menuFactory.getDishes().query(
                function(response) {
                    $scope.dishes = response;
                    $scope.showMenu = true;
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                });

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

        $scope.showDish = false;
        $scope.message="Loading ...";
        $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)})
            .$promise.then(
                    function(response)  {
                        $scope.dish = response;
                        $scope.showDish = true;
                    },
                    function(response)  {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                    }
            );
    }])

    .controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory) {

        // Create a JavaScript object to hold the comment from the form
        $scope.mycomment = {rating:5, comment:"", author:"", date:""};

        $scope.submitComment = function () {
            // Record the date
            $scope.mycomment.date = new Date().toISOString();
            console.log($scope.mycomment);
            // Push comment into the dish's comment array
            $scope.dish.comments.push($scope.mycomment);
            // Update new dish object to server
            menuFactory.getDishes().update({id:$scope.dish.id}, $scope.dish);
            // Reset your form to pristine
            $scope.commentForm.$setPristine();
            // Reset JavaScript object that holds comment
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
        };
    }])

    .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', function($scope, menuFactory, corporateFactory)  {
        //var promotion = menuFactory.getPromotion(0);
        //var chef = corporateFactory.getLeader(3);

        $scope.showPromotion = false;
        $scope.showChef = false;
        $scope.showDish = false;
        $scope.messagePromotion = "Loading promotion ...";
        $scope.messageChef = "Loading chef ...";
        $scope.messageDish = "Loading dish ...";

        $scope.promotion = menuFactory.getPromotions().get({id:0})
                        .$promise.then(
                            function(response){
                                $scope.promotion = response;
                                $scope.showPromotion = true;
                            },
                            function(response) {
                                $scope.messagePromotion = "Error: " + response.status + " " + response.statusText;
                            }
                        );
        $scope.chef = corporateFactory.getLeaders().get({id:3})
                        .$promise.then(
                            function(response){
                                $scope.chef = response;
                                $scope.showChef = true;
                            },
                            function(response) {
                                $scope.messageChef = "Error: " + response.status + " " + response.statusText;
                            }
                        );
        $scope.dish = menuFactory.getDishes().get({id:0})
                        .$promise.then(
                            function(response){
                                $scope.dish = response;
                                $scope.showDish = true;
                            },
                            function(response) {
                                $scope.messageDish = "Error: " + response.status + " " + response.statusText;
                            }
                        );

    }])

    .controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory)    {
        $scope.showLeadership = true;
        $scope.messageLeadership = "Loading leadership ...";
        $scope.leadership = corporateFactory.getLeaders().query(
                            function(response){
                                $scope.leadership = response;
                                $scope.showLeadership = true;
                            },
                            function(response) {
                                $scope.messageLeadership = "Error: " + response.status + " " + response.statusText;
                            }
                        );
    }])

;
