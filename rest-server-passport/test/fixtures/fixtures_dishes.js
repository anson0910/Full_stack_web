/* test/fixtures/fixtures_dishes.js */

module.exports = [

{
    "_id" : "000000000000000000001100",
    "updatedAt" : "2016-03-21T23:14:53.548Z",
    "createdAt" : "2016-03-21T23:14:53.548Z",
    "name" : "Uthapizza",
    "image" : "images/pizza.png",
    "category" : "main",
    "price" : 1050,
    "description" : "Red and Hot",
    "comments" : [ ],
    "label" : "",
    "__v" : 0
},
{
    "_id" : "000000000000000000001200",
    "updatedAt" : "2016-03-21T23:15:58.548Z",
    "createdAt" : "2016-03-21T23:15:58.548Z",
    "name" : "Fish and Chips",
    "image" : "images/fish.png",
    "category" : "main",
    "price" : 1799,
    "description" : "Silver fish with golden chips",
    "comments" : [ ],
    "label" : "",
    "__v" : 0,
    "comments" : [
        {
            "updatedAt" : "2016-03-22T16:20:57.564Z",
            "createdAt" : "2016-03-22T14:45:13.111Z",
            "postedBy": "570751b010f8b3ba29439e53",
            "comment" : "Makes you LOVE fish",
            "rating" : 5,
            "_id" : "000000000000000000001201"
        },
        {
            "updatedAt" : "2016-03-22T16:20:57.564Z",
            "createdAt" : "2016-03-22T14:45:13.111Z",
            "postedBy": "FFFFFFFFFFFFFFFFFFFFFFFF",
            "comment" : "Such a disgusting dish I will unregister immediatly !!!",
            "rating" : 1,
            "_id" : "000000000000000000001202"
        },
    ]
},
{
    "_id" : "000000000000000000001300",
    "updatedAt" : "2016-03-22T16:20:57.567Z",
    "createdAt" : "2016-03-22T14:03:37.678Z",
    "name" : "French fries",
    "description" : "Delicious potatoes",
    "category" : "main",
    "price" : 1999,
    "image" : "images/ffreis.png",
    "comments" : [
        {
            "updatedAt" : "2016-03-22T16:20:57.562Z",
            "createdAt" : "2016-03-22T14:44:21.955Z",
            "postedBy": "570751ca10f8b3ba29439e54",
            "comment" : "Just like at home !",
            "rating" : 5,
            "_id" : "000000000000000000001301"
        },
        {
            "updatedAt" : "2016-03-22T16:20:57.564Z",
            "createdAt" : "2016-03-22T14:45:13.111Z",
            "postedBy": "570751b010f8b3ba29439e53",
            "comment" : "Good but fat",
            "rating" : 4,
            "_id" : "000000000000000000001302"
        },
        {
            "updatedAt" : "2016-03-22T16:20:57.564Z",
            "createdAt" : "2016-03-22T14:50:34.037Z",
            "postedBy": "570751de10f8b3ba29439e55",
            "comment" : "Yummy",
            "rating" : 5,
            "_id" : "000000000000000000001303"
        },
    ],
    "label" : "",
    "__v" : 12
}

]
