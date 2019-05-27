var $stateprovideRef = null;
var helloModule = angular.module('firstApp', ['ngCookies', 'ngRoute', 'ui.router', 'ngSanitize', 'ngMaterial', 'ngclipboard', 'ngMessages']);


helloModule.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when("", "/Login");
    $urlRouterProvider.otherwise('/Login');



    $stateProvider
        .state('Home.Dashboard', {
            name: 'Dashboard',
            url: '/Dashboard',
            templateUrl: 'dashboard.html',
            controller: 'dashboardController',
        })

    .state('Home.Users', {
        name: 'Users',
        url: '/Users',
        templateUrl: 'users.html',
        controller: 'userController'
    })

    .state('Home.CreateUser', {
        name: 'CreateUser',
        url: '/CreateUser',
        templateUrl: 'createuser.html',
        controller: 'createUserController'
    })

    .state('Home.Sendnot', {
        name: 'Sendnot',
        url: '/Sendnot',
        templateUrl: 'sendNot.html',
        controller: 'sendNotController'
    })

    .state('Home.Approvlas', {
        name: 'Approvals',
        url: '/Approvals',
        templateUrl: 'approvals.html',
        controller: 'approvalsController'
    })

    .state('Home.Publish', {
        name: 'Publish',
        url: '/Publish',
        templateUrl: 'publish.html',
        controller: 'publishController'
    })

    .state('Home', {
        name: 'Home',
        url: '',
        templateUrl: 'home.html',
        controller: 'homeController'
    })

    .state('Login', {
        name: 'Login',
        url: '/Login',
        templateUrl: 'login.html',
        controller: 'hello'
    })

    .state('Home.Details', {
        name: 'Details',
        url: '/Details',
        templateUrl: 'description.html',
        controller: 'descriptionController'
    })


    $stateprovideRef = $stateProvider;
})


helloModule.controller('hello', function($scope, $http, $cookies, $location, $mdDialog) {
    $scope.student = {
        firstname: 'salam',
        lastname: 'shaik'
    }

    $scope.authenticate = function() {
        console.log($scope.phone, $scope.password);
        $scope.calling = false;
        $scope.message = "";
        if ($scope.email == "") {
            $scope.calling = false;
            $scope.message = "Email is empty"
            console.log('phone is empty');
        } else if ($scope.password == "") {
            $scope.calling = false;
            $scope.message = 'password is empty'
            console.log('password is empty');
        } else {
            var url = "http://localhost:6110/alogin"
            var data = {
                email: $scope.email,
                password: $scope.password,
            }
            $scope.calling = true;
            $http.post(url, data).then(function(msg) {
                $scope.calling = true;
                console.log(msg);
                if (msg.status == 200) {
                    if (msg.data.status == "success") {
                        $scope.calling = false;
                        $cookies.put('token', msg.data.token);
                        $cookies.put('user_id', msg.data.user_id);
                        $cookies.put('email', msg.data.email);
                        $cookies.put('arole', msg.data.admin_role);
                        $scope.message = msg.data.message;
                        $location.path('/Dashboard');
                    } else {
                        $scope.calling = false;
                        $scope.message = msg.message;
                        $mdDialog.show(
                            $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Message')
                            .textContent(msg.data.message)
                            .ariaLabel('Under Review')
                            .ok('Ok')
                        );
                    }
                } else if (msg.status == 400) {
                    $scope.calling = false;
                    console.log(msg.data);
                    $scope.message = msg.data
                } else {
                    $scope.calling = false;
                    $scope.message = "Error occurred"
                }
            })
        }
    }


})

helloModule.controller('postbody', function($scope, $http, $cookies, $state, $mdToast, $log, $location) {
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
        } else if (msg.data.status = "Failed") {
            $scope.isLoading = false;
            console.log(msg.data.message);
        }
    })

    $scope.formatText = function(data) {
        var forData = data.replace(/<[^>]+>/gm, '')
        return forData.replace('from internet', '');
    }

    $scope.likeButton = function(post_id, index) {
        $scope.post_id = post_id;
        $scope.email = $cookies.get('email');
        $scope.token = $cookies.get('token');
        $scope.user_id = $cookies.get('user_id');

        var data = {
            post_id: $scope.post_id,
            email: $scope.email,
            token: $scope.token,
            user_id: $scope.user_id
        }


        if ($scope.email == "" || $scope.email == undefined) {
            $mdToast.show(
                    $mdToast.simple()
                    .textContent('Please login to like')
                    .position('top right')
                    .hideDelay(3000))
                .then(function() {
                    $log.log('Toast dismissed.');
                }).catch(function() {
                    $log.log('Toast failed or was forced to close early by another toast.');
                });
        } else if ($scope.token == "" || $scope.email == undefined) {
            $mdToast.show(
                    $mdToast.simple()
                    .textContent('Please login to like')
                    .position('top right')
                    .hideDelay(3000))
                .then(function() {
                    $log.log('Toast dismissed.');
                }).catch(function() {
                    $log.log('Toast failed or was forced to close early by another toast.');
                });

        } else if ($scope.user_id == "" || $scope.user_id == undefined) {
            $mdToast.show(
                    $mdToast.simple()
                    .textContent('Please login to like')
                    .position('top right')
                    .hideDelay(3000))
                .then(function() {
                    $log.log('Toast dismissed.');
                }).catch(function() {
                    $log.log('Toast failed or was forced to close early by another toast.');
                });
        } else {
            $http.post("https://admin.naaradh.in/like_post", data).then(function(data) {
                console.log('like_data', data);
                if (data.data.status == "success") {
                    if (data.data.delete == 1) {
                        $mdToast.show(
                                $mdToast.simple()
                                .textContent('Removed your like')
                                .position('top right')
                                .hideDelay(3000))
                            .then(function() {
                                $log.log('Toast dismissed.');
                            }).catch(function() {
                                $log.log('Toast failed or was forced to close early by another toast.');
                            });
                    } else {
                        $mdToast.show(
                                $mdToast.simple()
                                .textContent('Liked')
                                .position('top right')
                                .hideDelay(3000))
                            .then(function() {
                                $log.log('Toast dismissed.');
                            }).catch(function() {
                                $log.log('Toast failed or was forced to close early by another toast.');
                            });
                    }


                    // $scope.likesCount = ;
                    $scope.dataArray[index].likes_count = data.data.likes_count;

                } else {
                    $mdToast.show(
                            $mdToast.simple()
                            .textContent('Error occurred')
                            .position('top right')
                            .hideDelay(3000))
                        .then(function() {
                            $log.log('Toast dismissed.');
                        }).catch(function() {
                            $log.log('Toast failed or was forced to close early by another toast.');
                        });
                }
            })
        }
    }

    $scope.shareButton = function(id) {
        $mdToast.show(
                $mdToast.simple()
                .textContent('Link copied to clipboard')
                .position('top right')
                .hideDelay(3000))
            .then(function() {
                $log.log('Toast dismissed.');
            }).catch(function() {
                $log.log('Toast failed or was forced to close early by another toast.');
            });
    }

    $scope.setlike = function(data) {
        console.log('inside set like function');
        if (data == undefined || data == "") {
            return "Like"
        } else {
            return "Likes: " + data;
        }
    }

    $scope.goToDescription = function(id) {
        $location.path('/Details').search({ id: id, type: "posts" });
    }


})


helloModule.controller('placebody', function($scope, $http, $cookies, $mdToast, $location) {
    $scope.cardtitle = "Salam"
    $scope.arr = [];
    $scope.arr.length = 0;
    $scope.isLoading = true;

    $scope.token = $cookies.get("token");
    var data = {
        token: $scope.token,
        testin: 'testing'
    }


    $scope.likeButton = function(place_id, index) {
        $scope.place_id = place_id;
        $scope.email = $cookies.get('email');
        $scope.token = $cookies.get('token');
        $scope.user_id = $cookies.get('user_id');

        var data = {
            place_id: $scope.place_id,
            email: $scope.email,
            token: $scope.token,
            user_id: $scope.user_id
        }

        if ($scope.email == "" || $scope.email == undefined) {
            $mdToast.show(
                    $mdToast.simple()
                    .textContent('Please login to like')
                    .position('top right')
                    .hideDelay(3000))
                .then(function() {
                    $log.log('Toast dismissed.');
                }).catch(function() {
                    $log.log('Toast failed or was forced to close early by another toast.');
                });
        } else if ($scope.token == "" || $scope.email == undefined) {
            $mdToast.show(
                    $mdToast.simple()
                    .textContent('Please login to like')
                    .position('top right')
                    .hideDelay(3000))
                .then(function() {
                    $log.log('Toast dismissed.');
                }).catch(function() {
                    $log.log('Toast failed or was forced to close early by another toast.');
                });

        } else if ($scope.user_id == "" || $scope.user_id == undefined) {
            $mdToast.show(
                    $mdToast.simple()
                    .textContent('Please login to like')
                    .position('top right')
                    .hideDelay(3000))
                .then(function() {
                    $log.log('Toast dismissed.');
                }).catch(function() {
                    $log.log('Toast failed or was forced to close early by another toast.');
                });
        } else {
            $http.post("https://admin.naaradh.in/like_place", data).then(function(data) {
                console.log('like_data', data);
                if (data.data.status == "success") {
                    if (data.data.delete == 1) {
                        $mdToast.show(
                                $mdToast.simple()
                                .textContent('Removed your like')
                                .position('top right')
                                .hideDelay(3000))
                            .then(function() {
                                $log.log('Toast dismissed.');
                            }).catch(function() {
                                $log.log('Toast failed or was forced to close early by another toast.');
                            });
                    } else {
                        $mdToast.show(
                                $mdToast.simple()
                                .textContent('Liked')
                                .position('top right')
                                .hideDelay(3000))
                            .then(function() {
                                $log.log('Toast dismissed.');
                            }).catch(function() {
                                $log.log('Toast failed or was forced to close early by another toast.');
                            });
                    }


                    // $scope.likesCount = ;
                    $scope.dataArray[index].likes_count = data.data.likes_count;

                } else {
                    $mdToast.show(
                            $mdToast.simple()
                            .textContent('Error occurred')
                            .position('top right')
                            .hideDelay(3000))
                        .then(function() {
                            $log.log('Toast dismissed.');
                        }).catch(function() {
                            $log.log('Toast failed or was forced to close early by another toast.');
                        });
                }
            })

        }

        // console.log('cookiesData', $scope.post_id, $scope.email, $scope.token, $scope.user_id);


    }

    $http.post("https://admin.naaradh.in/demo_place_limit", data).then(function(msg) {
        console.log(msg);
        if (msg.data.status == "success") {
            $scope.isLoading = false;
            $scope.dataArray = msg.data.data
            var post_id;
            angular.forEach($scope.dataArray, function(item) {
                // item.description = item.description.replace(/<[^>]+>/gm, "");
                // var state = {
                //     name: 'Home.' + item.place_id,
                //     templateUrl: 'description.html',
                //     params: item,
                //     url: '/place',
                //     controller: 'descriptionController'
                // }
                // $stateprovideRef.state(state);
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

    $scope.shareButton = function() {
        $mdToast.show(
                $mdToast.simple()
                .textContent('Link copied to clipboard')
                .position('top right')
                .hideDelay(3000))
            .then(function() {
                $log.log('Toast dismissed.');
            }).catch(function() {
                $log.log('Toast failed or was forced to close early by another toast.');
            });
    }


    $scope.setlike = function(data) {
        if (data == undefined || data == "") {
            return "Like"
        } else {
            return "Likes: " + data;
        }
    }

    $scope.goToDescription = function(id) {
        $location.path('/Details').search({ id: id, type: "places" });
    }
})


helloModule.controller('alienbody', function($scope, $cookies, $http, $mdToast, $log, $location) {
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
                // var state = {
                //     name: 'Home.' + item.alienPost_id,
                //     templateUrl: 'description.html',
                //     params: item,
                //     url: '/alien',
                //     controller: 'descriptionController'
                // }
                // $stateprovideRef.state(state);
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


    $scope.likeButton = function(alienPost_id, index) {
        $scope.alienPost_id = alienPost_id;
        $scope.email = $cookies.get('email');
        $scope.token = $cookies.get('token');
        $scope.user_id = $cookies.get('user_id');

        var data = {
            alienPost_id: $scope.alienPost_id,
            email: $scope.email,
            token: $scope.token,
            user_id: $scope.user_id
        }


        if ($scope.email == "" || $scope.email == undefined) {
            $mdToast.show(
                    $mdToast.simple()
                    .textContent('Please login to like')
                    .position('top right')
                    .hideDelay(3000))
                .then(function() {
                    $log.log('Toast dismissed.');
                }).catch(function() {
                    $log.log('Toast failed or was forced to close early by another toast.');
                });
        } else if ($scope.token == "" || $scope.email == undefined) {
            $mdToast.show(
                    $mdToast.simple()
                    .textContent('Please login to like')
                    .position('top right')
                    .hideDelay(3000))
                .then(function() {
                    $log.log('Toast dismissed.');
                }).catch(function() {
                    $log.log('Toast failed or was forced to close early by another toast.');
                });

        } else if ($scope.user_id == "" || $scope.user_id == undefined) {
            $mdToast.show(
                    $mdToast.simple()
                    .textContent('Please login to like')
                    .position('top right')
                    .hideDelay(3000))
                .then(function() {
                    $log.log('Toast dismissed.');
                }).catch(function() {
                    $log.log('Toast failed or was forced to close early by another toast.');
                });
        } else {
            $http.post("https://admin.naaradh.in/like_alien", data).then(function(data) {
                console.log('like_data', data);
                if (data.data.status == "success") {
                    if (data.data.delete == 1) {
                        $mdToast.show(
                                $mdToast.simple()
                                .textContent('Removed your like')
                                .position('top right')
                                .hideDelay(3000))
                            .then(function() {
                                $log.log('Toast dismissed.');
                            }).catch(function() {
                                $log.log('Toast failed or was forced to close early by another toast.');
                            });
                    } else {
                        $mdToast.show(
                                $mdToast.simple()
                                .textContent('Liked')
                                .position('top right')
                                .hideDelay(3000))
                            .then(function() {
                                $log.log('Toast dismissed.');
                            }).catch(function() {
                                $log.log('Toast failed or was forced to close early by another toast.');
                            });
                    }


                    // $scope.likesCount = ;
                    $scope.dataArray[index].likes_count = data.data.likes_count;

                } else {
                    $mdToast.show(
                            $mdToast.simple()
                            .textContent('Error occurred')
                            .position('top right')
                            .hideDelay(3000))
                        .then(function() {
                            $log.log('Toast dismissed.');
                        }).catch(function() {
                            $log.log('Toast failed or was forced to close early by another toast.');
                        });
                }
            })
        }

        // console.log('cookiesData', $scope.post_id, $scope.email, $scope.token, $scope.user_id);



    }

    $scope.shareButton = function() {
        $mdToast.show(
                $mdToast.simple()
                .textContent('Link copied to clipboard')
                .position('top right')
                .hideDelay(3000))
            .then(function() {
                $log.log('Toast dismissed.');
            }).catch(function() {
                $log.log('Toast failed or was forced to close early by another toast.');
            });
    }


    $scope.setlike = function(data) {
        if (data == undefined || data == "") {
            return "Like"
        } else {
            return "Likes: " + data;
        }
    }

    $scope.goToDescription = function(id) {
        $location.path('/Details').search({ id: id, type: 'aliens' });
    }
})

helloModule.controller('moviebody', function($scope, $http, $cookies, $mdToast, $location) {
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
                // var state = {
                //     name: 'Home.' + item.movie_id,
                //     templateUrl: 'description.html',
                //     params: item,
                //     url: '/movie',
                //     controller: 'descriptionController'
                // }
                // $stateprovideRef.state(state);
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


    $scope.likeButton = function(movie_id, index) {
        $scope.movie_id = movie_id;
        $scope.email = $cookies.get('email');
        $scope.token = $cookies.get('token');
        $scope.user_id = $cookies.get('user_id');

        var data = {
            movie_id: $scope.movie_id,
            email: $scope.email,
            token: $scope.token,
            user_id: $scope.user_id
        }


        if ($scope.email == "" || $scope.email == undefined) {
            $mdToast.show(
                    $mdToast.simple()
                    .textContent('Please login to like')
                    .position('top right')
                    .hideDelay(3000))
                .then(function() {
                    $log.log('Toast dismissed.');
                }).catch(function() {
                    $log.log('Toast failed or was forced to close early by another toast.');
                });
        } else if ($scope.token == "" || $scope.email == undefined) {
            $mdToast.show(
                    $mdToast.simple()
                    .textContent('Please login to like')
                    .position('top right')
                    .hideDelay(3000))
                .then(function() {
                    $log.log('Toast dismissed.');
                }).catch(function() {
                    $log.log('Toast failed or was forced to close early by another toast.');
                });

        } else if ($scope.user_id == "" || $scope.user_id == undefined) {
            $mdToast.show(
                    $mdToast.simple()
                    .textContent('Please login to like')
                    .position('top right')
                    .hideDelay(3000))
                .then(function() {
                    $log.log('Toast dismissed.');
                }).catch(function() {
                    $log.log('Toast failed or was forced to close early by another toast.');
                });
        } else {
            $http.post("https://admin.naaradh.in/like_movie", data).then(function(data) {
                console.log('like_data', data);
                if (data.data.status == "success") {
                    if (data.data.delete == 1) {
                        $mdToast.show(
                                $mdToast.simple()
                                .textContent('Removed your like')
                                .position('top right')
                                .hideDelay(3000))
                            .then(function() {
                                $log.log('Toast dismissed.');
                            }).catch(function() {
                                $log.log('Toast failed or was forced to close early by another toast.');
                            });
                    } else {
                        $mdToast.show(
                                $mdToast.simple()
                                .textContent('Liked')
                                .position('top right')
                                .hideDelay(3000))
                            .then(function() {
                                $log.log('Toast dismissed.');
                            }).catch(function() {
                                $log.log('Toast failed or was forced to close early by another toast.');
                            });
                    }


                    // $scope.likesCount = ;
                    $scope.dataArray[index].likes_count = data.data.likes_count;

                } else {
                    $mdToast.show(
                            $mdToast.simple()
                            .textContent('Error occurred')
                            .position('top right')
                            .hideDelay(3000))
                        .then(function() {
                            $log.log('Toast dismissed.');
                        }).catch(function() {
                            $log.log('Toast failed or was forced to close early by another toast.');
                        });
                }
            })

        }



        // console.log('cookiesData', $scope.post_id, $scope.email, $scope.token, $scope.user_id);


    }

    $scope.shareButton = function() {
        $mdToast.show(
                $mdToast.simple()
                .textContent('Link copied to clipboard')
                .position('top right')
                .hideDelay(3000))
            .then(function() {
                $log.log('Toast dismissed.');
            }).catch(function() {
                $log.log('Toast failed or was forced to close early by another toast.');
            });
    }


    $scope.setlike = function(data) {
        if (data == undefined || data == "") {
            return "Like"
        } else {
            return "Likes: " + data;
        }
    }


    $scope.goToDescription = function(id) {
        $location.path('/Details').search({ id: id, type: 'movies' });
    }
})


helloModule.controller('descriptionController', function($scope, $location, $http, $mdToast, dataToPass) {
    console.log('descriptionController', dataToPass);
    $scope.id = $location.search().id;
    $scope.type = $location.search().type;

    if (!$scope.id && !$scope.type) {
        if (dataToPass.hasOwnProperty('post_id')) {
            $scope.id = dataToPass.post_id;
            $scope.type = "posts"
        } else if (dataToPass.hasOwnProperty('place_id')) {
            $scope.id = dataToPass.place_id;
            $scope.type = "places"
        } else if (dataToPass.hasOwnProperty('alienPost_id')) {
            $scope.id = dataToPass.alienPost_id;
            $scope.type = "aliens"
        } else if (dataToPass.hasOwnProperty('movie_id')) {
            $scope.id = dataToPass.movie_id;
            $scope.type = "movies"
        }
    }

    var data = {
        id: $scope.id,
        type: $scope.type
    }
    $http.post("https://admin.naaradh.in/get_data", data).then(function(data) {
            if (data.data.status == "success") {
                console.log(data.data);
                $scope.cardtitle = data.data.data.title;
                $scope.carddescription = data.data.data.description;
            } else if (data.data.status == "Failed") {
                $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000))
                    .then(function() {
                        $log.log('Toast dismissed.');
                    }).catch(function() {
                        $log.log('Toast failed or was forced to close early by another toast.');
                    });
            } else {
                $mdToast.show(
                        $mdToast.simple()
                        .textContent("Error occurred")
                        .position('top right')
                        .hideDelay(3000))
                    .then(function() {
                        $log.log('Toast dismissed.');
                    }).catch(function() {
                        $log.log('Toast failed or was forced to close early by another toast.');
                    });
            }
        })
        // $scope.cardtitle = $location.search().paramTitle;
        // $scope.carddescription = $location.search().paramDescription;
})

helloModule.controller('authenticate', function($scope) {
    console.log('submit clicked');
})

helloModule.controller('homeController', function($scope, $mdDialog, $cookies, $location, $mdToast, $log, $window) {

    $window.onbeforeunload = function(evt) {
        $cookies.remove('user_id');
        $cookies.remove('token');
        $cookies.remove('email');
        $cookies.remove('arole');

    }

    $scope.navItem = "Posts";
    $scope.openMenu = function($mdMenu, ev) {
        $scope.user_id = $cookies.get("user_id");
        $scope.token = $cookies.get("token");
        $scope.email = $cookies.get('email');
        console.log('cookiesdata', $scope.phone, $scope.token);
        if ($scope.user_id == "" || $scope.token == "" || $scope.email == "") {
            console.log('userNotLoggedIN');
            $scope.showLoginOptions = true;
            $scope.showUserOptions = false;
            $scope.number = "2";
            $mdMenu.open(ev);
        } else if ($scope.user_id == undefined || $scope.token == undefined || $scope.email == undefined) {
            console.log('userNotLoggedIn-2')
            $scope.showLoginOptions = true;
            $scope.showUserOptions = false;
            $scope.number = "2";
            $mdMenu.open(ev);
        } else {
            console.log('userLoggedIn');
            $scope.showLoginOptions = false;
            $scope.showUserOptions = true;
            $scope.number = "4";
            $mdMenu.open(ev);
        }
    }

    $scope.goToLogin = function() {
        $location.path("/Login");
    }

    $scope.goToRegister = function() {
        $location.path("/Register");
    }

    $scope.goToFeedback = function() {
        $location.path("/Feedback")
    }

    $scope.goToNotifications = function() {
        $location.path("/Notifications");
    }

    $scope.goToUsers = function() {
        $location.path('/Users');
    }

    $scope.sendToNotifications = function() {
        $location.path('/Sendnot')
    }

    $scope.goToPublish = function() {
        $location.path('/Publish');
    }

    $scope.goToApprovals = function() {
        $location.path('/Approvals');
    }

    $scope.goToHome = function() {
        $location.path('/Dashboard');
    }

    $scope.goToLogout = function() {
        $cookies.remove('user_id');
        $cookies.remove('token');
        $cookies.remove('email');
        $cookies.remove('arole');
        $location.path('/Login')
    }

    $scope.goToCreateUsers = function() {
        $location.path('/CreateUser')
    }

    $scope.logout = function() {
        $cookies.remove('user_id');
        $cookies.remove('token');
        $cookies.remove('email');
        $location.path('/Login');
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


helloModule.controller('writerController', function($scope, $cookies, $mdToast, $log, $http, $mdDialog) {
        $scope.user_id = $cookies.get("user_id");
        $scope.token = $cookies.get("token");
        $scope.email = $cookies.get('email');
        $scope.story = "";
        $scope.storyType = $scope.postCategory;


        console.log($scope.user, $scope.token, "salam");


        if ($scope.user_id == "" || $scope.token == "" || $scope.email == "") {
            console.log('user Not Logged In');
            $scope.loggedIn = false;
            $scope.quillDataJSON = "Please login to write a story";
            $scope.quillDataText = "Please login to write a story";
            $scope.quillDataHTML = "Please login to write a story";
        } else if ($scope.user_id == undefined || $scope.token == undefined || $scope.email == undefined) {
            $scope.loggedIn = false;
            $scope.quillDataJSON = "Please login to write a story";
            $scope.quillDataText = "Please login to write a story";
            $scope.quillDataHTML = "Please login to write a story";
        } else {
            console.log('user Logged In');
            $scope.loggedIn = true;
            $scope.quillDataJSON = "Preview will be displayed here";
            $scope.quillDataText = "Preview will be displayed here";
            $scope.quillDataHTML = "Preview will be displayed here";
        }

        $scope.quillData = "hahaha";
        $scope.quillConfig = "hahaConfig";

        $scope.changeData = function() {
            $scope.quillData = "config";
        };

        $scope.clickMe = function() {
            alert("thanks!");
        };

        $scope.postStory = function() {
            console.log($scope.story);
            if ($scope.postCategory == undefined || $scope.postCategory == "") {
                $mdToast.show(
                        $mdToast.simple()
                        .textContent('Please Select category')
                        .position('top right')
                        .hideDelay(3000))
                    .then(function() {
                        $log.log('Toast dismissed.');
                    }).catch(function() {
                        $log.log('Toast failed or was forced to close early by another toast.');
                    });
            } else if ($scope.story == undefined || $scope.story == "" || $scope.story == "<p><br></p>") {
                $mdToast.show(
                        $mdToast.simple()
                        .textContent('Story is empty')
                        .position('top right')
                        .hideDelay(3000))
                    .then(function() {
                        $log.log('Toast dismissed.');
                    }).catch(function() {
                        $log.log('Toast failed or was forced to close early by another toast.');
                    });

            } else if ($scope.title == undefined || $scope.title == "") {
                $mdToast.show(
                        $mdToast.simple()
                        .textContent('Story title is empty')
                        .position('top right')
                        .hideDelay(3000))
                    .then(function() {
                        $log.log('Toast dismissed.');
                    }).catch(function() {
                        $log.log('Toast failed or was forced to close early by another toast.');
                    });
            } else {
                var data = {
                        user_id: $cookies.get('user_id'),
                        email: $cookies.get('email'),
                        token: $cookies.get('token'),
                        title: $scope.title,
                        description: $scope.story,
                    }
                    // console.log($scope.postCategory)
                if ($scope.postCategory == "Post") {
                    var url = "https://admin.naaradh.in/send_post";
                } else if ($scope.postCategory == "Place") {
                    var url = "https://admin.naaradh.in/send_place";
                } else if ($scope.postCategory == "Alien") {
                    var url = "https://admin.naaradh.in/send_alien";
                } else if ($scope.postCategory == "Movie") {
                    var url = "https://admin.naaradh.in/send_movie";
                }


                $http.post(url, data).then(function(data) {
                    if (data.data.status == "success") {
                        $mdDialog.show(
                            $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Under Review')
                            .textContent('You post is successfully posted. We will notify you once it is published.\nThanks for your contribution')
                            .ariaLabel('Under Review')
                            .ok('Got it!')
                        );
                    } else if (data.data.status == "Failed") {
                        $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.data.message)
                                .position('top right')
                                .hideDelay(3000))
                            .then(function() {
                                $log.log('Toast dismissed.');
                            }).catch(function() {
                                $log.log('Toast failed or was forced to close early by another toast.');
                            });
                    } else {
                        $mdToast.show(
                                $mdToast.simple()
                                .textContent('Error occurred. Sorry for the inconvenience')
                                .position('top right')
                                .hideDelay(3000))
                            .then(function() {
                                $log.log('Toast dismissed.');
                            }).catch(function() {
                                $log.log('Toast failed or was forced to close early by another toast.');
                            });
                    }
                })

            }
        }

    })
    // .directive('quillEditor', function($compile, $http) {
    //     return {
    //         restrict: 'E',
    //         link: function($scope, $element) {
    //             var template = '<div id="editor">' +
    //                 '<p>Start your story here</p>' +
    //                 '<p><br></p>'
    //             '</div>';
    //             var linkFunc = $compile(template);
    //             var content = linkFunc($scope);
    //             $element.append(content);

//             // setup quill config after adding to DOM
//             var quill = new Quill('#editor', {
//                 modules: {
//                     // ImageResize: {},
//                     toolbar: [
//                         [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//                         // [{ 'header': 1 }, { 'header': 2 }],
//                         [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
//                         ['bold', 'italic', 'underline', 'strike', 'link'],
//                         [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
//                         [{ 'font': [] }],
//                         [{ 'align': [] }],
//                         ['clean'], // remove formatting button
//                         ['blockquote', 'code-block'],
//                         ['video', 'image'],
//                         [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//                         [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
//                         [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
//                     ]
//                 },
//                 placeholder: 'Compose an epic...',
//                 theme: 'snow' // or 'bubble'
//             });


//             quill.getModule('toolbar').addHandler('image', () => {
//                 selectLocalImage();
//             });


//             selectLocalImage = function() {
//                 console.log('Clicked on select localImage');
//                 const input = document.createElement('input');
//                 input.setAttribute('type', 'file');
//                 input.click();

//                 input.onchange = () => {
//                     const file = input.files[0];
//                     if (/^image\//.test(file.type)) {
//                         saveToServer(file);
//                     } else {
//                         console.warn('You could only upload images.');
//                     }
//                 }
//             }

//             saveToServer = function(file) {
//                 console.log('on save to server');
//                 var fd = new FormData();
//                 fd.append('upload', file);

//                 $http.post('https://admin.naaradh.in/upload', fd, {
//                     withCredentials: false,
//                     headers: { 'Content-Type': undefined },
//                     transformRequest: angular.identity
//                 }).then(function(data) {
//                     insertInEditor(data.data);
//                 })
//             }

//             insertInEditor = function(data) {
//                 const range = quill.getSelection();
//                 console.log('')
//                 quill.insertEmbed(range.index, 'image', 'https://admin.naaradh.in/uploads/' + data.image_url);
//             }


//             quill.on('text-change', function() {
//                 var delta = quill.getContents();
//                 var text = quill.getText();
//                 var justHtml = quill.root.innerHTML;

//                 console.log(justHtml);

//                 $scope.$apply(function() {
//                     $scope.quillDataJSON = JSON.stringify(delta);
//                     $scope.quillDataText = text;
//                     $scope.quillDataHTML = justHtml;
//                     $scope.story = justHtml;
//                 });
//             });
//         },
//     };
// })


helloModule.controller('registerController', function($scope, $http, $location, $mdToast) {
    $scope.register = function() {
        console.log('Entered');
        if ($scope.name == "" || $scope.name == undefined) {
            $scope.message = "Name is empty"
        } else if ($scope.password == "" || $scope.password == undefined) {
            $scope.message = "Password is empty";
        } else if ($scope.cpassword == "" || $scope.cpassword == undefined) {
            $scope.message = "Confirm password is empty";
        } else if ($scope.password != $scope.cpassword) {
            $scope.message = "Passwords are not matching";
        } else {
            var data = {
                fullname: $scope.name,
                device_type: "web",
                login_by: "manual",
                password: $scope.password,
                email: $scope.email
            }
            var url = "https://admin.naaradh.in/register"
            $http.post(url, data).then(function(data) {
                if (data.status == 200) {
                    if (data.data.status == "success") {
                        $mdToast.show(
                                $mdToast.simple()
                                .textContent('Successfully registered')
                                .position('top right')
                                .hideDelay(3000))
                            .then(function() {
                                $log.log('Toast dismissed.');
                            }).catch(function() {
                                $log.log('Toast failed or was forced to close early by another toast.');
                            });
                        $location.path('/Login')
                    } else if (data.data.status == "Failed") {
                        $scope.message = data.data.message;
                    } else {
                        $scope.message = "Error occurred";
                    }
                } else {
                    console.log('Error Occured');
                }
            })

        }
    }
})


helloModule.controller('feedbackController', function($scope, $mdToast, $log, $http, $cookies) {
    $scope.submitFeedback = function() {
        if ($scope.feedbackType == "" || $scope.feedbackType == undefined) {
            $mdToast.show(
                    $mdToast.simple()
                    .textContent('Please select feedback type')
                    .position('top right')
                    .hideDelay(3000))
                .then(function() {
                    $log.log('Toast dismissed.');
                }).catch(function() {
                    $log.log('Toast failed or was forced to close early by another toast.');
                });
        } else if ($scope.feedbackInput == "" || $scope.feedbackInput == undefined) {
            $mdToast.show(
                    $mdToast.simple()
                    .textContent('Feedback is empty')
                    .position('top right')
                    .hideDelay(3000))
                .then(function() {
                    $log.log('Toast dismissed.');
                }).catch(function() {
                    $log.log('Toast failed or was forced to close early by another toast.');
                });
        } else {
            // console.log('All good');
            var data = {
                user_id: $cookies.get('user_id'),
                token: $cookies.get('token'),
                email: $cookies.get('email'),
                type: $scope.feedbackType,
                message: $scope.feedbackInput
            }

            $http.post('https://admin.naaradh.in/send_feedback', data).then(function(data) {
                if (data.data.status == "success") {
                    $mdToast.show(
                            $mdToast.simple()
                            .textContent('Feedback submitted successfully')
                            .position('top right')
                            .hideDelay(3000))
                        .then(function() {
                            $log.log('Toast dismissed.');
                        }).catch(function() {
                            $log.log('Toast failed or was forced to close early by another toast.');
                        });
                } else if (data.data.status == "Failed") {
                    $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000))
                        .then(function() {
                            $log.log('Toast dismissed.');
                        }).catch(function() {
                            $log.log('Toast failed or was forced to close early by another toast.');
                        });
                } else {
                    $mdToast.show(
                            $mdToast.simple()
                            .textContent('An error occurred')
                            .position('top right')
                            .hideDelay(3000))
                        .then(function() {
                            $log.log('Toast dismissed.');
                        }).catch(function() {
                            $log.log('Toast failed or was forced to close early by another toast.');
                        });
                }
            })
        }
    }
})

helloModule.controller('notificationsController', function($scope, $cookies, $http) {
    var data = {
        email: $cookies.get('email'),
        user_id: $cookies.get('user_id'),
        token: $cookies.get('token')
    }
    $http.post('https://admin.naaradh.in/read_notification', data).then(function(data) {
        console.log('readFeedbackRes', data);
    })
})


helloModule.controller('dashboardController', function($scope, $cookies, $http, $mdToast, $location) {

    if ($cookies.get('token') == '' || $cookies.get('token') == undefined) {
        $location.path('/Login');
    } else {
        var user_id, token;
        user_id = $cookies.get('user_id');
        token = $cookies.get('token');

        var data = {
            user_id: user_id,
            token: token
        }

        $http.post('https://admin.naaradh.in/dashboard', data).then(function(data) {
            console.log(data.data.data);
            if (data.data.status == 'success') {
                $scope.uc = data.data.data.uc;
                $scope.pc = data.data.data.pc;
                $scope.plc = data.data.data.plc;
                $scope.ac = data.data.data.ac;
                $scope.mc = data.data.data.mc;

            } else if (data.data.status == 'Failed') {
                $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000))
                    .then(function() {
                        $log.log('Toast dismissed.');
                    }).catch(function() {
                        $log.log('Toast failed or was forced to close early by another toast.');
                    });
            }
        })

    }



})


helloModule.controller('userController', function($scope, $cookies, $http, $mdToast, $location) {


    if ($cookies.get('token') == '' || $cookies.get('token') == undefined) {
        $location.path('/Login');
    } else {
        var user_id, token;
        user_id = $cookies.get('user_id');
        token = $cookies.get('token');
        var data = {
            user_id: user_id,
            token: token
        }

        $http.post('https://admin.naaradh.in/list_users', data).then(function(incomingData) {
            console.log('incomingData', incomingData);
            if (incomingData.data.status == 'success') {
                $scope.dataArray = incomingData.data.data;

            } else if (incomingData.data.status == 'Failed') {
                $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000))
                    .then(function() {
                        $log.log('Toast dismissed.');
                    }).catch(function() {
                        $log.log('Toast failed or was forced to close early by another toast.');
                    });
            }

            $scope.blockUser = function(user_id) {
                localUserId = $cookies.get('user_id');
                token = $cookies.get('token');

                var data = {
                    user_id: localUserId,
                    token: token,
                    opertaion_value: 'bu',
                    vuid: user_id
                }


                $http.post('https://admin.naaradh.in/user_operation', data).then(function(incomingData) {
                    console.log(incomingData);
                    if (incomingData.data.status == 'success') {
                        $mdToast.show(
                                $mdToast.simple()
                                .textContent('successfully blocked the user')
                                .position('top right')
                                .hideDelay(3000))
                            .then(function() {
                                $log.log('Toast dismissed.');
                            }).catch(function() {
                                $log.log('Toast failed or was forced to close early by another toast.');
                            });
                    } else if (incomingData.data.status == 'Failed') {
                        $mdToast.show(
                                $mdToast.simple()
                                .textContent(incomingData.data.message)
                                .position('top right')
                                .hideDelay(3000))
                            .then(function() {
                                $log.log('Toast dismissed.');
                            }).catch(function() {
                                $log.log('Toast failed or was forced to close early by another toast.');
                            });
                    }
                })
            }

            $scope.deleteUser = function(user_id) {
                localUserId = $cookies.get('user_id');
                token = $cookies.get('token');

                var data = {
                    user_id: localUserId,
                    token: token,
                    opertaion_value: 'du',
                    vuid: user_id
                }

                $http.post('https://admin.naaradh.in/user_operation', data).then(function(incomingData) {
                    if (incomingData.data.status == 'success') {
                        $mdToast.show(
                                $mdToast.simple()
                                .textContent('successfully deleted the user')
                                .position('top right')
                                .hideDelay(3000))
                            .then(function() {
                                $log.log('Toast dismissed.');
                            }).catch(function() {
                                $log.log('Toast failed or was forced to close early by another toast.');
                            });


                        var sendingData = {
                            user_id: localUserId,
                            token: token
                        }

                        $http.post('https://admin.naaradh.in/list_users', sendingData).then(function(someData) {
                            if (someData.data.status == 'success') {
                                $scope.dataArray = someData.data.data;
                            } else if (someData.data.status == 'Failed') {
                                console.log(someData);
                            }
                        })

                    } else if (incomingData.data.status == 'Failed') {
                        $mdToast.show(
                                $mdToast.simple()
                                .textContent(incomingData.data.message)
                                .position('top right')
                                .hideDelay(3000))
                            .then(function() {
                                $log.log('Toast dismissed.');
                            }).catch(function() {
                                $log.log('Toast failed or was forced to close early by another toast.');
                            });
                    }
                })

            }



        })

    }


})

helloModule.controller('approvalsController', function($scope, $cookies, $mdToast, $log, $http, $mdDialog, $location) {


    if ($cookies.get('token') == '' || $cookies.get('token') == undefined) {
        $location.path('/Login');
    } else {
        $scope.user_id = $cookies.get('user_id');
        $scope.token = $cookies.get('token');
        $scope.email = $cookies.get('email');

        var postsData, placesData, aliensData, moviesData;
        $scope.finalData = "";

        $scope.formatText = function(data) {
            var forData = data.replace(/<[^>]+>/gm, '')
            return forData.replace('from internet', '');
        }

        var data = {
            user_id: $scope.user_id,
            token: $scope.token,
            email: $scope.email,
            type: 'posts'
        }
        $http.post('https://admin.naaradh.in/approval', data).then(function(data) {
            console.log(data.data);
            postsData = data.data.data;
            var data_pl = {
                user_id: $scope.user_id,
                token: $scope.token,
                email: $scope.email,
                type: 'places'
            }
            $http.post('https://admin.naaradh.in/approval', data_pl).then(function(data) {
                console.log(data.data);
                placesData = data.data.data;
                placesData = postsData.concat(placesData);
                var data_al = {
                    user_id: $scope.user_id,
                    token: $scope.token,
                    email: $scope.email,
                    type: 'aliens'
                }
                $http.post('https://admin.naaradh.in/approval', data_al).then(function(data) {
                    console.log(data.data);
                    aliensData = data.data.data;
                    aliensData = placesData.concat(aliensData);
                    var data_mo = {
                        user_id: $scope.user_id,
                        token: $scope.token,
                        email: $scope.email,
                        type: 'movies'
                    }
                    $http.post('https://admin.naaradh.in/approval', data_mo).then(function(data) {
                        console.log(data.data);
                        moviesData = data.data.data;
                        $scope.finalData = aliensData.concat(moviesData);
                        console.log('finaldata', $scope.finalData);
                    })
                })
            })

        })



        $scope.showDailog = function(ev, data) {
            $mdDialog.show({
                    locals: { dataToPass: data },
                    controller: 'descriptionController',
                    templateUrl: 'description.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        }


        $scope.approvePost = function(data) {

            var dataToSend = "";

            if (data.hasOwnProperty('post_id')) {
                $scope.contentType = "edit_post";
                $scope.contentId = data.post_id;

                var dataToSend = {
                    email: $scope.email,
                    user_id: $scope.user_id,
                    token: $scope.token,
                    type: $scope.contentType,
                    post_id: data.post_id
                };
            } else if (data.hasOwnProperty('place_id')) {
                $scope.contentType = "edit_place";
                $scope.contentId = data.place_id;
                var dataToSend = {
                    email: $scope.email,
                    user_id: $scope.user_id,
                    token: $scope.token,
                    type: $scope.contentType,
                    place_id: data.place_id
                };
            } else if (data.hasOwnProperty('alienPost_id')) {
                $scope.contentType = "edit_alien";
                $scope.contentId = data.alienPost_id;
                var dataToSend = {
                    email: $scope.email,
                    user_id: $scope.user_id,
                    token: $scope.token,
                    type: $scope.contentType,
                    alienPost_id: data.alienPost_id
                };
            } else if (data.hasOwnProperty('movie_id')) {
                $scope.contentType = "edit_movie";
                $scope.contentId = data.movie_id;
                var dataToSend = {
                    email: $scope.email,
                    user_id: $scope.user_id,
                    token: $scope.token,
                    type: $scope.contentType,
                    movie_id: data.movie_id
                };
            }


            $http.post('https://admin.naaradh.in/approval', dataToSend).then(function(data) {
                if (data.data.status == "success") {
                    $mdToast.show(
                            $mdToast.simple()
                            .textContent("Post is approved successfully")
                            .position('top right')
                            .hideDelay(3000))
                        .then(function() {
                            $log.log('Toast dismissed.');
                        }).catch(function() {
                            $log.log('Toast failed or was forced to close early by another toast.');
                        });

                    var data = {
                        user_id: $scope.user_id,
                        token: $scope.token,
                        email: $scope.email,
                        type: 'posts'
                    }
                    $http.post('https://admin.naaradh.in/approval', data).then(function(data) {
                        console.log(data.data);
                        postsData = data.data.data;
                        var data_pl = {
                            user_id: $scope.user_id,
                            token: $scope.token,
                            email: $scope.email,
                            type: 'places'
                        }
                        $http.post('https://admin.naaradh.in/approval', data_pl).then(function(data) {
                            console.log(data.data);
                            placesData = data.data.data;
                            placesData = postsData.concat(placesData);
                            var data_al = {
                                user_id: $scope.user_id,
                                token: $scope.token,
                                email: $scope.email,
                                type: 'aliens'
                            }
                            $http.post('https://admin.naaradh.in/approval', data_al).then(function(data) {
                                console.log(data.data);
                                aliensData = data.data.data;
                                aliensData = placesData.concat(aliensData);
                                var data_mo = {
                                    user_id: $scope.user_id,
                                    token: $scope.token,
                                    email: $scope.email,
                                    type: 'movies'
                                }
                                $http.post('https://admin.naaradh.in/approval', data_mo).then(function(data) {
                                    console.log(data.data);
                                    moviesData = data.data.data;
                                    $scope.finalData = aliensData.concat(moviesData);
                                    console.log('finaldata', $scope.finalData);
                                })
                            })
                        })

                    })

                } else if (data.data.status == 'Failed') {
                    $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000))
                        .then(function() {
                            $log.log('Toast dismissed.');
                        }).catch(function() {
                            $log.log('Toast failed or was forced to close early by another toast.');
                        });
                }
            })
        }

        $scope.rejectPost = function(data) {
            var dataToSend = "";

            if (data.hasOwnProperty('post_id')) {
                $scope.contentType = "rm_post";
                $scope.contentId = data.post_id;

                var dataToSend = {
                    email: $scope.email,
                    user_id: $scope.user_id,
                    token: $scope.token,
                    type: $scope.contentType,
                    post_id: data.post_id
                };
            } else if (data.hasOwnProperty('place_id')) {
                $scope.contentType = "rm_place";
                $scope.contentId = data.place_id;
                var dataToSend = {
                    email: $scope.email,
                    user_id: $scope.user_id,
                    token: $scope.token,
                    type: $scope.contentType,
                    place_id: data.place_id
                };
            } else if (data.hasOwnProperty('alienPost_id')) {
                $scope.contentType = "rm_alien";
                $scope.contentId = data.alienPost_id;
                var dataToSend = {
                    email: $scope.email,
                    user_id: $scope.user_id,
                    token: $scope.token,
                    type: $scope.contentType,
                    alienPost_id: data.alienPost_id
                };
            } else if (data.hasOwnProperty('movie_id')) {
                $scope.contentType = "rm_movie";
                $scope.contentId = data.movie_id;
                var dataToSend = {
                    email: $scope.email,
                    user_id: $scope.user_id,
                    token: $scope.token,
                    type: $scope.contentType,
                    movie_id: data.movie_id
                };
            }


            $http.post('https://admin.naaradh.in/approval', dataToSend).then(function(data) {
                if (data.data.status == "success") {
                    $mdToast.show(
                            $mdToast.simple()
                            .textContent("Post is rejected successfully")
                            .position('top right')
                            .hideDelay(3000))
                        .then(function() {
                            $log.log('Toast dismissed.');
                        }).catch(function() {
                            $log.log('Toast failed or was forced to close early by another toast.');
                        });

                    var data = {
                        user_id: $scope.user_id,
                        token: $scope.token,
                        email: $scope.email,
                        type: 'posts'
                    }
                    $http.post('https://admin.naaradh.in/approval', data).then(function(data) {
                        console.log(data.data);
                        postsData = data.data.data;
                        var data_pl = {
                            user_id: $scope.user_id,
                            token: $scope.token,
                            email: $scope.email,
                            type: 'places'
                        }
                        $http.post('https://admin.naaradh.in/approval', data_pl).then(function(data) {
                            console.log(data.data);
                            placesData = data.data.data;
                            placesData = postsData.concat(placesData);
                            var data_al = {
                                user_id: $scope.user_id,
                                token: $scope.token,
                                email: $scope.email,
                                type: 'aliens'
                            }
                            $http.post('https://admin.naaradh.in/approval', data_al).then(function(data) {
                                console.log(data.data);
                                aliensData = data.data.data;
                                aliensData = placesData.concat(aliensData);
                                var data_mo = {
                                    user_id: $scope.user_id,
                                    token: $scope.token,
                                    email: $scope.email,
                                    type: 'movies'
                                }
                                $http.post('https://admin.naaradh.in/approval', data_mo).then(function(data) {
                                    console.log(data.data);
                                    moviesData = data.data.data;
                                    $scope.finalData = aliensData.concat(moviesData);
                                    console.log('finaldata', $scope.finalData);
                                })
                            })
                        })

                    })

                } else if (data.data.status == 'Failed') {
                    $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000))
                        .then(function() {
                            $log.log('Toast dismissed.');
                        }).catch(function() {
                            $log.log('Toast failed or was forced to close early by another toast.');
                        });
                }
            })

        }




    }



})

helloModule.controller('sendNotController', function($scope, $mdToast, $log, $cookies, $http, $location) {

    if ($cookies.get('token') == '' || $cookies.get('token') == undefined) {
        $location.path('/Login');
    } else {
        $scope.user_id = $cookies.get('user_id');
        $scope.email = $cookies.get('email');
        $scope.token = $cookies.get('token');


        $scope.sendNot = function() {
            console.log($scope.rtitle, $scope.rdescription);
            if ($scope.title == "" || $scope.title == undefined) {
                $mdToast.show(
                        $mdToast.simple()
                        .textContent('Please Enter Title')
                        .position('top right')
                        .hideDelay(3000))
                    .then(function() {
                        $log.log('Toast dismissed.');
                    }).catch(function() {
                        $log.log('Toast failed or was forced to close early by another toast.');
                    });
            } else if ($scope.description == "" || $scope.description == undefined) {
                $mdToast.show(
                        $mdToast.simple()
                        .textContent('Please Enter Description')
                        .position('top right')
                        .hideDelay(3000))
                    .then(function() {
                        $log.log('Toast dismissed.');
                    }).catch(function() {
                        $log.log('Toast failed or was forced to close early by another toast.');
                    });
            } else {
                var data = {
                    user_id: $scope.user_id,
                    token: $scope.token,
                    email: $scope.email,
                    title: $scope.title,
                    description: $scope.description
                }

                $http.post('https://admin.naaradh.in/send_notification', data).then(function(data) {
                    if (data.data.status == 'success') {
                        $mdToast.show(
                                $mdToast.simple()
                                .textContent('Successfully posted your notification')
                                .position('top right')
                                .hideDelay(3000))
                            .then(function() {
                                $log.log('Toast dismissed.');
                            }).catch(function() {
                                $log.log('Toast failed or was forced to close early by another toast.');
                            });
                    } else if (data.data.status == 'Failed') {
                        $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.data.message)
                                .position('top right')
                                .hideDelay(3000))
                            .then(function() {
                                $log.log('Toast dismissed.');
                            }).catch(function() {
                                $log.log('Toast failed or was forced to close early by another toast.');
                            });
                    }
                })
            }
        }
    }


})

helloModule.controller('publishController', function($scope, $cookies, $mdToast, $log, $http, $mdDialog, $location) {

        if ($cookies.get('token') == '' || $cookies.get('token') == undefined) {
            $location.path('/Login');
        } else {
            $scope.user_id = $cookies.get("user_id");
            $scope.token = $cookies.get("token");
            $scope.email = $cookies.get('email');
            $scope.quillData = "hahaha";
            $scope.quillConfig = "hahaConfig";

            $scope.changeData = function() {
                $scope.quillData = "config";
            };

            $scope.clickMe = function() {
                alert("thanks!");
            };

            $scope.StoryType = $scope.postCategory;


            $scope.postStory = function() {
                if ($scope.postCategory == undefined || $scope.postCategory == "") {
                    $mdToast.show(
                            $mdToast.simple()
                            .textContent('Please Select category')
                            .position('top right')
                            .hideDelay(3000))
                        .then(function() {
                            $log.log('Toast dismissed.');
                        }).catch(function() {
                            $log.log('Toast failed or was forced to close early by another toast.');
                        });
                } else if ($scope.story == undefined || $scope.story == "" || $scope.story == "<p><br></p>") {
                    $mdToast.show(
                            $mdToast.simple()
                            .textContent('Story is empty')
                            .position('top right')
                            .hideDelay(3000))
                        .then(function() {
                            $log.log('Toast dismissed.');
                        }).catch(function() {
                            $log.log('Toast failed or was forced to close early by another toast.');
                        });

                } else if ($scope.title == undefined || $scope.title == "") {
                    $mdToast.show(
                            $mdToast.simple()
                            .textContent('Story title is empty')
                            .position('top right')
                            .hideDelay(3000))
                        .then(function() {
                            $log.log('Toast dismissed.');
                        }).catch(function() {
                            $log.log('Toast failed or was forced to close early by another toast.');
                        });
                } else {
                    var data = {
                            user_id: $cookies.get('user_id'),
                            email: $cookies.get('email'),
                            token: $cookies.get('token'),
                            title: $scope.title,
                            description: $scope.story,
                        }
                        // console.log($scope.postCategory)
                    if ($scope.postCategory == "Post") {
                        var url = "https://admin.naaradh.in/send_post";
                    } else if ($scope.postCategory == "Place") {
                        var url = "https://admin.naaradh.in/send_place";
                    } else if ($scope.postCategory == "Alien") {
                        var url = "https://admin.naaradh.in/send_alien";
                    } else if ($scope.postCategory == "Movie") {
                        var url = "https://admin.naaradh.in/send_movie";
                    }


                    $http.post(url, data).then(function(data) {
                        if (data.data.status == "success") {
                            $mdDialog.show(
                                $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('Under Review')
                                .textContent('You post is successfully posted. We will notify you once it is published.\nThanks for your contribution')
                                .ariaLabel('Under Review')
                                .ok('Got it!')
                            );
                        } else if (data.data.status == "Failed") {
                            $mdToast.show(
                                    $mdToast.simple()
                                    .textContent(data.data.message)
                                    .position('top right')
                                    .hideDelay(3000))
                                .then(function() {
                                    $log.log('Toast dismissed.');
                                }).catch(function() {
                                    $log.log('Toast failed or was forced to close early by another toast.');
                                });
                        } else {
                            $mdToast.show(
                                    $mdToast.simple()
                                    .textContent('Error occurred. Sorry for the inconvenience')
                                    .position('top right')
                                    .hideDelay(3000))
                                .then(function() {
                                    $log.log('Toast dismissed.');
                                }).catch(function() {
                                    $log.log('Toast failed or was forced to close early by another toast.');
                                });
                        }
                    })

                }
            }


        }


    })
    .directive('quillEditor', function($compile, $http) {
        return {
            restrict: 'E',
            link: function($scope, $element) {
                var template = '<div id="editor">' +
                    '<p>Start your story here</p>' +
                    '<p><br></p>'
                '</div>';
                var linkFunc = $compile(template);
                var content = linkFunc($scope);
                $element.append(content);

                // setup quill config after adding to DOM
                var quill = new Quill('#editor', {
                    modules: {
                        // ImageResize: {},
                        toolbar: [
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            // [{ 'header': 1 }, { 'header': 2 }],
                            [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
                            ['bold', 'italic', 'underline', 'strike', 'link'],
                            [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
                            [{ 'font': [] }],
                            [{ 'align': [] }],
                            ['clean'], // remove formatting button
                            ['blockquote', 'code-block'],
                            ['video', 'image'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
                            [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
                        ]
                    },
                    placeholder: 'Compose an epic...',
                    theme: 'snow' // or 'bubble'
                });


                quill.getModule('toolbar').addHandler('image', () => {
                    selectLocalImage();
                });


                selectLocalImage = function() {
                    console.log('Clicked on select localImage');
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.click();

                    input.onchange = () => {
                        const file = input.files[0];
                        if (/^image\//.test(file.type)) {
                            saveToServer(file);
                        } else {
                            console.warn('You could only upload images.');
                        }
                    }
                }

                saveToServer = function(file) {
                    console.log('on save to server');
                    var fd = new FormData();
                    fd.append('upload', file);

                    $http.post('https://admin.naaradh.in/upload', fd, {
                        withCredentials: false,
                        headers: { 'Content-Type': undefined },
                        transformRequest: angular.identity
                    }).then(function(data) {
                        insertInEditor(data.data);
                    })
                }

                insertInEditor = function(data) {
                    const range = quill.getSelection();
                    console.log('')
                    quill.insertEmbed(range.index, 'image', 'https://admin.naaradh.in/uploads/' + data.image_url);
                }


                quill.on('text-change', function() {
                    var delta = quill.getContents();
                    var text = quill.getText();
                    var justHtml = quill.root.innerHTML;

                    console.log(justHtml);

                    $scope.$apply(function() {
                        $scope.quillDataJSON = JSON.stringify(delta);
                        $scope.quillDataText = text;
                        $scope.quillDataHTML = justHtml;
                        $scope.story = justHtml;
                    });
                });
            },
        };
    });

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

helloModule.controller('createUserController', function($scope, $cookies, $http, $mdToast, $log, $location) {
    if ($cookies.get('token') == '' || $cookies.get('token') == undefined) {
        $location.path('/Login');
    } else {
        $scope.createUser = function() {
            var data = {
                user_id: $cookies.get('user_id'),
                token: $cookies.get('token'),
                email: $cookies.get('email'),
                fullname: $scope.fullname,
                email: $scope.email,
                password: $scope.password,
                vadmin_role: $scope.admin_role,
                sadmin_role: $cookies.get('arole')
            }

            $http.post('http://localhost:6110/adda', data).then(function(data) {
                if (data.data.status == 'success') {
                    $mdToast.show(
                            $mdToast.simple()
                            .textContent('successfully created user')
                            .position('top right')
                            .hideDelay(3000))
                        .then(function() {
                            $log.log('Toast dismissed.');
                        }).catch(function() {
                            $log.log('Toast failed or was forced to close early by another toast.');
                        });
                } else if (data.data.status == 'Failed') {
                    $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000))
                        .then(function() {
                            $log.log('Toast dismissed.');
                        }).catch(function() {
                            $log.log('Toast failed or was forced to close early by another toast.');
                        });
                }
            })
        }
    }



})