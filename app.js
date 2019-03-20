var $stateprovideRef = null;
var helloModule = angular.module('firstApp', ['ngCookies', 'ngRoute', 'ui.router', 'ngSanitize']);


helloModule.config(function($routeProvider) {
    $routeProvider
        .when("/login", {
            templateUrl: "login.html",
            controller: 'hello'
        })
        .when("/home", {
            templateUrl: "home.html",
            controller: 'homeController'
        }).
    otherwise({
        redirectTo: '/login'
    })
});

helloModule.config(function($stateProvider) {
    var postState = {
        name: 'posts',
        // url:'/posts',
        templateUrl: 'posts.html',
        controller: 'postbody'
    }

    var placesState = {
        name: 'places',
        // url:'/places',
        templateUrl: 'places.html',
        controller: 'placebody'
    }

    var alienState = {
        name: 'aliens',
        // url:'/aliens',
        templateUrl: 'aliens.html',
        controller: 'alienbody'
    }

    var movieState = {
        name: 'movies',
        // url:'/movies',
        templateUrl: 'movies.html',
        controller: 'moviebody'
    }

    $stateProvider.state(postState);
    $stateProvider.state(placesState);
    $stateProvider.state(alienState);
    $stateProvider.state(movieState);
    $stateprovideRef = $stateProvider;
})


helloModule.controller('hello', function($scope, $http, $cookies, $location) {
    $scope.student = {
        firstname: 'salam',
        lastname: 'shaik'
    }

    $scope.authenticate = function() {
        console.log($scope.phone, $scope.password);
        $scope.calling = true;
        $scope.message = "";
        if ($scope.phone == "") {
            $scope.calling = false;
            $scope.message = "phone is empty"
            console.log('phone is empty');
        } else if ($scope.password == "") {
            $scope.calling = false;
            $scope.message = 'password is empty'
            console.log('password is empty');
        } else if (($scope.phone + "").length < 10) {
            $scope.calling = false;
            $scope.message = "phone number is invalid"
            console.log('phone length is invalid');
        } else {
            var url = "https://naaradh.in/login"
            var data = {
                phone: $scope.phone,
                password: $scope.password,
                device_type: "Web",
                android_id: "123456789",
                login_by: "manual",
                fcm_token: "fGnniI7jCHo:APA91bFAMJaSouAJZaVLbjhZGRD6m4rPfFFCfAFQ93naYY6AqZ3Xy4j52T2Tf9KZlhtn833J9xMjFg8-AHMQly-L3nPftZ34JSljRmkACKgkfwgtfECbTS_2fBwzs2iwVIAX74Oog7Fw"
            }
            $http.post(url, data).then(function(msg) {
                $scope.calling = false;
                console.log(msg);
                if (msg.status == 200) {
                    if (msg.data.status == "success") {
                        $cookies.put('token', msg.data.token);
                        $cookies.put('user', msg.data.phone);
                        $scope.message = msg.data.message;
                        $location.path('/home');
                    } else if (msg.data.status == "Failed") {
                        $scope.message = msg.message;
                    }
                } else if (msg.status == 400) {
                    console.log(msg.data);
                    $scope.message = msg.data;
                } else {
                    $scope.message = "Another error"
                }
            })
        }
    }


})

helloModule.controller('postbody', function($scope, $http, $cookies, $state) {
    $scope.cardtitle = "Salam"
    $scope.arr = [];
    $scope.arr.length = 0;

    $scope.token = $cookies.get("token");
    var data = {
        token: $scope.token
    }

    $http.post("https://naaradh.in/demo_post_limit", data).then(function(msg) {
        console.log(msg);
        if (msg.data.status == "success") {
            $scope.dataArray = msg.data.data
            var post_id;
            angular.forEach($scope.dataArray, function(item) {
                var state = {
                    name: item.post_id,
                    templateUrl: 'description.html',
                    params: item,
                    controller: 'descriptionController'
                }
                $stateprovideRef.state(state);
            })
        } else if (msg.data.status = "Failed") {
            console.log(msg.data.message);
        }
    })
})


helloModule.controller('placebody', function($scope, $http, $cookies) {
    $scope.cardtitle = "Salam"
    $scope.arr = [];
    $scope.arr.length = 0;

    $scope.token = $cookies.get("token");
    var data = {
        token: $scope.token
    }

    $http.post("https://naaradh.in/demo_place_limit", data).then(function(msg) {
        console.log(msg);
        if (msg.data.status == "success") {
            $scope.dataArray = msg.data.data
            var post_id;
            angular.forEach($scope.dataArray, function(item) {
                var state = {
                    name: item.place_id,
                    templateUrl: 'description.html',
                    params: item,
                    controller: 'descriptionController'
                }
                $stateprovideRef.state(state);
            })
        } else if (msg.data.status = "Failed") {
            console.log(msg.data.message);
        }
    })
})


helloModule.controller('alienbody', function($scope, $cookies, $http) {
    $scope.cardtitle = "Salam"
    $scope.arr = [];
    $scope.arr.length = 0;

    $scope.token = $cookies.get("token");
    var data = {
        token: $scope.token
    }

    $http.post("https://naaradh.in/demo_alien_limit", data).then(function(msg) {
        console.log(msg);
        if (msg.data.status == "success") {
            $scope.dataArray = msg.data.data
            var post_id;
            angular.forEach($scope.dataArray, function(item) {
                var state = {
                    name: item.alienPost_id,
                    templateUrl: 'description.html',
                    params: item,
                    controller: 'descriptionController'
                }
                $stateprovideRef.state(state);
            })
        } else if (msg.data.status = "Failed") {
            console.log(msg.data.message);
        }
    })
})

helloModule.controller('moviebody', function($scope, $http, $cookies) {
    $scope.cardtitle = "Salam"
    $scope.arr = [];
    $scope.arr.length = 0;

    $scope.token = $cookies.get("token");
    var data = {
        token: $scope.token
    }

    $http.post("https://naaradh.in/demo_movie_limit", data).then(function(msg) {
        console.log(msg);
        if (msg.data.status == "success") {
            $scope.dataArray = msg.data.data
            var post_id;
            angular.forEach($scope.dataArray, function(item) {
                var state = {
                    name: item.movie_id,
                    templateUrl: 'description.html',
                    params: item,
                    controller: 'descriptionController'
                }
                $stateprovideRef.state(state);
            })
        } else if (msg.data.status = "Failed") {
            console.log(msg.data.message);
        }
    })
})


helloModule.controller('descriptionController', function($scope, $stateParams) {
    console.log($stateParams.title);
    $scope.cardtitle = $stateParams.title;
    $scope.carddescription = $stateParams.description;
})

helloModule.controller('authenticate', function($scope) {
    console.log('submit clicked');
})

helloModule.controller('homeController', function($scope) {

})