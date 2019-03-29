var $stateprovideRef = null;
var helloModule = angular.module('firstApp', ['ngCookies', 'ngRoute', 'ui.router', 'ngSanitize', 'ngMaterial', 'ngMessages']);


helloModule.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when("", "/Posts");

    $stateProvider
        .state('Home.Posts', {
            name: 'Posts',
            url: '/Posts',
            templateUrl: 'posts.html',
            controller: 'postbody'
        })

    .state('Home.Places', {
        name: 'Places',
        url: '/Places',
        templateUrl: 'places.html',
        controller: 'placebody'
    })

    .state('Home.Aliens', {
        name: 'Aliens',
        url: '/Aliens',
        templateUrl: 'aliens.html',
        controller: 'alienbody'
    })

    .state('Home.Movies', {
        name: 'Movies',
        url: '/Movies',
        templateUrl: 'movies.html',
        controller: 'moviebody'
    })

    .state('Home', {
        name: 'Home',
        url: '',
        templateUrl: 'home.html',
        controller: 'homeController'
    })

    .state('Home.Login', {
        name: 'Login',
        url: '/Login',
        templateUrl: 'login.html',
        controller: 'hello'
    })

    .state('Home.Write', {
        name: 'WriteStory',
        url: '/WriteStory',
        templateUrl: 'Write.html',
        controller: 'writerController'
    })


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
            var url = "https://admin.naaradh.in/login"
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
                        $location.path('/Posts');
                    } else {
                        $scope.message = msg.message;
                    }
                } else if (msg.status == 400) {
                    console.log(msg.data);
                    $scope.message = msg.data
                } else {
                    $scope.message = "Error occurred"
                }
            })
        }
    }


})

helloModule.controller('postbody', function($scope, $http, $cookies, $state, $mdToast) {
    $scope.cardtitle = "Salam"
    $scope.arr = [];
    $scope.arr.length = 0;
    $scope.isLoading = true;

    $scope.token = $cookies.get("token");
    var data = {
        token: $scope.token,
        testin: 'testing'
    }

    $http.post("https://admin.naaradh.in/demo_post_limit", data).then(function(msg) {
        console.log(msg);
        if (msg.data.status == "success") {
            $scope.isLoading = false;
            $scope.dataArray = msg.data.data
            var post_id;
            angular.forEach($scope.dataArray, function(item) {
                // item.description = item.description.replace(/<[^>]+>/gm, "");

                // console.log('itemDescription', item.description.replace(/<[^>]+>/gm, ""));
                var state = {
                    name: 'Home.' + item.post_id,
                    templateUrl: 'description.html',
                    params: item,
                    url: '/post',
                    controller: 'descriptionController'
                }
                $stateprovideRef.state(state);
            })
        } else if (msg.data.status = "Failed") {
            $scope.isLoading = false;
            console.log(msg.data.message);
        }
    })

    $scope.formatText = function(data) {
        var forData = data.replace(/<[^>]+>/gm, '')
        return forData.replace('from internet', '');
    }

    $scope.likeButton = function() {
        $mdToast.show(
                $mdToast.simple()
                .textContent('Under Construction')
                .position('top right')
                .hideDelay(3000))
            .then(function() {
                $log.log('Toast dismissed.');
            }).catch(function() {
                $log.log('Toast failed or was forced to close early by another toast.');
            });
    }

    $scope.shareButton = function() {
        $mdToast.show(
                $mdToast.simple()
                .textContent('Under Construction')
                .position('top right')
                .hideDelay(3000))
            .then(function() {
                $log.log('Toast dismissed.');
            }).catch(function() {
                $log.log('Toast failed or was forced to close early by another toast.');
            });
    }
})


helloModule.controller('placebody', function($scope, $http, $cookies, $mdToast) {
    $scope.cardtitle = "Salam"
    $scope.arr = [];
    $scope.arr.length = 0;
    $scope.isLoading = true;

    $scope.token = $cookies.get("token");
    var data = {
        token: $scope.token,
        testin: 'testing'
    }

    $http.post("https://admin.naaradh.in/demo_place_limit", data).then(function(msg) {
        console.log(msg);
        if (msg.data.status == "success") {
            $scope.isLoading = false;
            $scope.dataArray = msg.data.data
            var post_id;
            angular.forEach($scope.dataArray, function(item) {
                // item.description = item.description.replace(/<[^>]+>/gm, "");
                var state = {
                    name: 'Home.' + item.place_id,
                    templateUrl: 'description.html',
                    params: item,
                    url: '/place',
                    controller: 'descriptionController'
                }
                $stateprovideRef.state(state);
            })
        } else if (msg.data.status = "Failed") {
            console.log(msg.data.message);
            $scope.isLoading = false;
        }
    })

    $scope.formatText = function(data) {
        var forData = data.replace(/<[^>]+>/gm, '')
        return forData.replace('from internet', '');
    }


    $scope.likeButton = function() {
        $mdToast.show(
                $mdToast.simple()
                .textContent('Under Construction')
                .position('top right')
                .hideDelay(3000))
            .then(function() {
                $log.log('Toast dismissed.');
            }).catch(function() {
                $log.log('Toast failed or was forced to close early by another toast.');
            });
    }

    $scope.shareButton = function() {
        $mdToast.show(
                $mdToast.simple()
                .textContent('Under Construction')
                .position('top right')
                .hideDelay(3000))
            .then(function() {
                $log.log('Toast dismissed.');
            }).catch(function() {
                $log.log('Toast failed or was forced to close early by another toast.');
            });
    }
})


helloModule.controller('alienbody', function($scope, $cookies, $http, $mdToast) {
    $scope.cardtitle = "Salam"
    $scope.arr = [];
    $scope.arr.length = 0;
    $scope.isLoading = true;

    $scope.token = $cookies.get("token");
    var data = {
        token: $scope.token,
        testin: 'testing'
    }

    $http.post("https://admin.naaradh.in/demo_alien_limit", data).then(function(msg) {
        console.log(msg);
        if (msg.data.status == "success") {
            $scope.isLoading = false;
            $scope.dataArray = msg.data.data
            var post_id;
            angular.forEach($scope.dataArray, function(item) {
                // item.description = item.description.replace(/<[^>]+>/gm, "");
                var state = {
                    name: 'Home.' + item.alienPost_id,
                    templateUrl: 'description.html',
                    params: item,
                    url: '/alien',
                    controller: 'descriptionController'
                }
                $stateprovideRef.state(state);
            })
        } else if (msg.data.status = "Failed") {
            console.log(msg.data.message);
            $scope.isLoading = false;
        }
    })

    $scope.formatText = function(data) {
        var forData = data.replace(/<[^>]+>/gm, '')
        return forData.replace('from internet', '');
    }


    $scope.likeButton = function() {
        $mdToast.show(
                $mdToast.simple()
                .textContent('Under Construction')
                .position('top right')
                .hideDelay(3000))
            .then(function() {
                $log.log('Toast dismissed.');
            }).catch(function() {
                $log.log('Toast failed or was forced to close early by another toast.');
            });
    }

    $scope.shareButton = function() {
        $mdToast.show(
                $mdToast.simple()
                .textContent('Under Construction')
                .position('top right')
                .hideDelay(3000))
            .then(function() {
                $log.log('Toast dismissed.');
            }).catch(function() {
                $log.log('Toast failed or was forced to close early by another toast.');
            });
    }
})

helloModule.controller('moviebody', function($scope, $http, $cookies, $mdToast) {
    $scope.cardtitle = "Salam"
    $scope.arr = [];
    $scope.arr.length = 0;
    $scope.isLoading = true;
    $scope.token = $cookies.get("token");
    var data = {
        token: $scope.token,
        testin: 'testing'
    }

    $http.post("https://admin.naaradh.in/demo_movie_limit", data).then(function(msg) {
        console.log(msg);
        if (msg.data.status == "success") {
            $scope.isLoading = false;
            $scope.dataArray = msg.data.data
            var post_id;
            angular.forEach($scope.dataArray, function(item) {
                // item.description = item.description.replace(/<[^>]+>/gm, "");
                var state = {
                    name: 'Home.' + item.movie_id,
                    templateUrl: 'description.html',
                    params: item,
                    url: '/movie',
                    controller: 'descriptionController'
                }
                $stateprovideRef.state(state);
            })
        } else if (msg.data.status = "Failed") {
            console.log(msg.data.message);
            $scope.isLoading = false;
        }
    })

    $scope.formatText = function(data) {
        var forData = data.replace(/<[^>]+>/gm, '')
        return forData.replace('from internet', '');
    }


    $scope.likeButton = function() {
        $mdToast.show(
                $mdToast.simple()
                .textContent('Under Construction')
                .position('top right')
                .hideDelay(3000))
            .then(function() {
                $log.log('Toast dismissed.');
            }).catch(function() {
                $log.log('Toast failed or was forced to close early by another toast.');
            });
    }

    $scope.shareButton = function() {
        $mdToast.show(
                $mdToast.simple()
                .textContent('Under Construction')
                .position('top right')
                .hideDelay(3000))
            .then(function() {
                $log.log('Toast dismissed.');
            }).catch(function() {
                $log.log('Toast failed or was forced to close early by another toast.');
            });
    }
})


helloModule.controller('descriptionController', function($scope, $stateParams) {
    console.log($stateParams.title);
    $scope.cardtitle = $stateParams.title;
    $scope.carddescription = $stateParams.description;
})

helloModule.controller('authenticate', function($scope) {
    console.log('submit clicked');
})

helloModule.controller('homeController', function($scope, $mdDialog, $cookies, $location, $mdToast, $log) {
    $scope.openMenu = function($mdMenu, ev) {
        $scope.phone = $cookies.get("user");
        $scope.token = $cookies.get("token");
        console.log('cookiesdata', $scope.phone, $scope.token);
        if ($scope.phone == "" || $scope.token == "") {
            $location.path('/Login')
        } else {
            $mdMenu.open(ev);
        }
    }

    $scope.logout = function() {
        $cookies.put("phone", "");
        $cookies.put("token", "");
        $mdToast.show(
                $mdToast.simple()
                .textContent('Successfully logged out')
                .position('top right')
                .hideDelay(3000))
            .then(function() {
                $log.log('Toast dismissed.');
            }).catch(function() {
                $log.log('Toast failed or was forced to close early by another toast.');
            });
    };
})


helloModule.controller('writerController', function($scope) {

})

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}