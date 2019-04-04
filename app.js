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

    .state('Home.Register', {
        name: "Register",
        url: '/Register',
        templateUrl: 'register.html',
        controller: 'registerController',
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
            var url = "https://admin.naaradh.in/login"
            var data = {
                email: $scope.email,
                password: $scope.password,
                device_type: "Web",
                android_id: "123456789",
                login_by: "manual",
                fcm_token: ""
            }
            $scope.calling = true;
            $http.post(url, data).then(function(msg) {
                $scope.calling = true;
                console.log(msg);
                if (msg.status == 200) {
                    if (msg.data.status == "success") {
                        $cookies.put('token', msg.data.token);
                        $cookies.put('user_id', msg.data.user_id);
                        $cookies.put('email', msg.data.email);
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

helloModule.controller('postbody', function($scope, $http, $cookies, $state, $mdToast, $log) {
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

        // console.log('cookiesData', $scope.post_id, $scope.email, $scope.token, $scope.user_id);
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

    $scope.setlike = function(data) {
        console.log('inside set like function');
        if (data == undefined || data == "") {
            return "Like"
        } else {
            return "Likes: " + data;
        }
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

        // console.log('cookiesData', $scope.post_id, $scope.email, $scope.token, $scope.user_id);
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


    $scope.setlike = function(data) {
        if (data == undefined || data == "") {
            return "Like"
        } else {
            return "Likes: " + data;
        }
    }
})


helloModule.controller('alienbody', function($scope, $cookies, $http, $mdToast, $log) {
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

        // console.log('cookiesData', $scope.post_id, $scope.email, $scope.token, $scope.user_id);
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


    $scope.setlike = function(data) {
        if (data == undefined || data == "") {
            return "Like"
        } else {
            return "Likes: " + data;
        }
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

        // console.log('cookiesData', $scope.post_id, $scope.email, $scope.token, $scope.user_id);
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


    $scope.setlike = function(data) {
        if (data == undefined || data == "") {
            return "Like"
        } else {
            return "Likes: " + data;
        }
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
            console.log('userNotLoggedIN');
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

    $scope.logout = function() {
        $cookies.put("user_id", "");
        $cookies.put("token", "");
        $cookies.put('email', "");
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


helloModule.controller('writerController', function($scope, $cookies, $mdToast) {
        $scope.user_id = $cookies.get("user_id");
        $scope.token = $cookies.get("token");
        $scope.story = "";
        $scope.storyType = $scope.postCategory;


        console.log($scope.user, $scope.token, "salam");


        if ($scope.user_id == "" || $scope.token == "") {
            console.log('user Not Logged In');
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



        // $scope.quillDataJSON = "Preview will be displayed here";
        // $scope.quillDataText = "Preview will be displayed here";
        // $scope.quillDataHTML = "Preview will be displayed here";

        $scope.quillData = "hahaha";
        $scope.quillConfig = "hahaConfig";

        $scope.changeData = function() {
            $scope.quillData = "config";
        };

        $scope.clickMe = function() {
            alert("thanks!");
        };

        $scope.postStory = function() {
            console.log("Entered Story", $scope.story);
            if ($scope.story == "") {
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
            } else {
                console.log($scope.storyType);
            }
        }

    })
    .directive('quillEditor', function($compile) {
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
    })


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