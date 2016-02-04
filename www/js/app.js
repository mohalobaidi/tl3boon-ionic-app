// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'ionic-timepicker', 'ionic-datepicker', 'ion-google-place'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .directive('disableTap', function($timeout) {
    return {
      link: function() {

        //$timeout(function() {
        //  document.querySelector('.pac-container').setAttribute('data-tap-disabled', 'true');
        //},500);
      }
    };
  })

  .config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // login page

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      .state('signup', {
        url: '/signup/step/1',
        templateUrl: 'templates/signup.html',
        controller: 'SignupCtrl'
      })

      .state('signup2', {
        url: '/signup/step/2',
        templateUrl: 'templates/signup2.html',
        controller: 'Signup2Ctrl'
      })

      .state('profile', {
        url: '/profile/:id',
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      })

      .state('create', {
        url: '/create',
        templateUrl: 'templates/tab-create.html',
        controller: 'CreateMapCtrl'
      })

      .state('create2', {
        url: '/create/:latLng',
        templateUrl: 'templates/tab-create2.html',
        controller: 'CreateFormCtrl'
      })

      // setup an abstract state for the tabs directive

      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.matches', {
        url: '/matches',
        views: {
          'tab-matches': {
            templateUrl: 'templates/tab-matches.html',
            controller: 'MatchesCtrl'
          }
        }
      })

      .state('tab.match-detail', {
        url: '/matches/id/:matchId',
        views: {
          'tab-matches': {
            templateUrl: 'templates/match-detail.html',
            controller: 'MatchDetailCtrl'
          }
        }
      })

      .state('tab.nearMatches', {
        url: '/nearMatches',
        views: {
          'tab-nearMatches': {
            templateUrl: 'templates/tab-nearMatches.html',
            controller: 'NearMatchesCtrl'
          }
        }
      })

      .state('tab.nearMatches-detail', {
        url: '/nearMatches/id/:matchId',
        views: {
          'tab-nearMatches': {
            templateUrl: 'templates/match-detail.html',
            controller: 'NearMatchDetailCtrl'
          }
        }
      })

      .state('tab.chats', {
        url: '/chats',
        views: {
          'tab-chats': {
            templateUrl: 'templates/tab-chats.html',
            controller: 'ChatsCtrl'
          }
        }
      })

      .state('tab.chat-detail', {
        url: '/chats/:chatId',
        views: {
          'tab-chats': {
            templateUrl: 'templates/chat-detail.html',
            controller: 'ChatDetailCtrl'
          }
        }
      })

      .state('tab.account', {
        url: '/account',
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-account.html',
            controller: 'AccountCtrl'
          }
        }
      })
      .state('tab.edit', {
        url: '/account/edit',
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-edit.html',
            controller: 'EditCtrl'
          }
        }
      })
      .state('tab.password', {
        url: '/account/edit/password',
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-pass.html',
            controller: 'PassCtrl'
          }
        }
      });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

  })

  .filter('matchLength', function() {

    return function(input) {
      input = [input/4] - [-0.5];
      return "0" + Math.floor(input) + ":" +  (([input - Math.floor(input)] == 0) ? "0" : "") + [60 * [input - Math.floor(input)]] ;
    };

  })

  .filter('checkImg', function() {

    return function(input) {
      if(input == null)
        return 'http://www.freelanceme.net/Images/default%20profile%20picture.png';
      else
        return 'http://www.american.edu/uploads/profiles/large/chris_palmer_profile_11.jpg';
    };
  })

  .filter('players', function() {

    return function(input) {
      return ((input < 10) ? ("0" + input) : input);
    };

  })

  .run(function($http, $cordovaPush) {

    var iosConfig = {
      "badge": true,
      "sound": true,
      "alert": true
    };

    document.addEventListener("deviceready", function(){
      $cordovaPush.register(iosConfig).then(function(deviceToken) {
        // Success -- send deviceToken to server, and store for future use
        console.log("deviceToken: " + deviceToken);
        $http.post("http://server.co/", {user: "Bob", tokenID: deviceToken})
      }, function(err) {
        alert("Registration error: " + err)
      });


      $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
        if (notification.alert) {
          navigator.notification.alert(notification.alert);
        }

        if (notification.sound) {
          var snd = new Media(event.sound);
          snd.play();
        }

        if (notification.badge) {
          $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
            // Success!
          }, function(err) {
            // An error occurred. Show a message to the user
          });
        }
      });

      // WARNING! dangerous to unregister (results in loss of tokenID)
      $cordovaPush.unregister(options).then(function(result) {
        // Success!
      }, function(err) {
        // Error
      });

    }, false);
  });
