'use strict';

angular.module('confusionApp')
    .constant("baseURL","http://localhost:3000/")
    .service('menuFactory', ['$resource', 'baseURL', function($resource, baseURL) {

        this.getDishes = function(){
            return $resource(baseURL + "dishes/:id", null, {'update':{method:'PUT'}});
        };

        // that returns a selected promotion
        this.getPromotions = function ()    {
            return $resource(baseURL + "promotions/:id", null, {'update':{method:'PUT'}});
            //return promotions[index];
        };
    }])

    .factory('corporateFactory', ['$resource', 'baseURL', function($resource, baseURL) {

        var corpfac = {};

        corpfac.getLeaders = function()   {
            return $resource(baseURL + "leadership/:id", null, {'update':{method:'PUT'}});
        };

        return corpfac;
    }])

;
