var data = [

    {
        "name" : "Aquaman",
        "publisher" : {
            "name" : "DC Comics",
            "foundation" : -1136066400000
        }
    },
    
    {
        "name" : "Black Panther",
        "publisher" : {
            "name" : "Marvel Comics",
            "foundation" : -978300000000
        }
    }
];

var nameOfSuperheroes = {
    "request" : [
        "name",
    ]
}

JFO.filter(data, nameOfSuperheroes);

var nameOfPublishers = {
    "request" : [
        "publisher.name"
    ],

    "groupBy" : "publisher.name"
}

JFO.filter(data, nameOfPublishers);

JFO.filter(data, {
    "exclude" : {}
});