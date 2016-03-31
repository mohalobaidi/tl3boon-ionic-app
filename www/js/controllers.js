var sdk = new Tl3boonSDK();
angular.module('starter.controllers', ['ionic','ngCordova'])

  .controller('LoginCtrl', function($scope, $state, $rootScope) {

    if (sdk.checkCookies() == true){
      //alert(sdk.checkCookies());
      $state.go('tab.matches');
    }else{
      //alert(sdk.checkCookies());
    }


    $scope.login = function(user) {

      sdk.signin(user.username ,user.password ,function(data,statusCode){
        if (statusCode == 200) {
          $state.go('tab.matches');
        } else if (statusCode == 400) {
          //alert(statusCode);
        } else {
          //alert(statusCode);
        }
      });

    };

  })

  .controller('SignupCtrl', function($scope, $state, $rootScope) {
    if (sdk.checkCookies() == true){
      //alert(sdk.checkCookies());
      $state.go('tab.matches');
    }else{
      //alert(sdk.checkCookies());
    }


    $scope.signup = function(user) {

      $rootScope.uname = user.uname;
      $rootScope.pass1 = user.pass1;
      $rootScope.pass2 = user.pass2;
      $rootScope.email = user.email;

      $state.go('signup2');

    };

  })

  .controller('Signup2Ctrl', function($scope, $state, $rootScope) {

    if (sdk.checkCookies() == true){
      //alert(sdk.checkCookies());
      $state.go('tab.matches');
    }else{
      //alert(sdk.checkCookies());
    }


    $scope.signup = function(user) {

      sdk.signup($rootScope.email,$rootScope.uname,user.fname,user.lname,$rootScope.pass1,$rootScope.pass2,user.position,user.age ,function(data,statusCode){
        if (statusCode == 200) {
          $state.go('tab.matches');
        } else if (statusCode == 400) {
          alert(statusCode);
        } else {
          alert(statusCode);
        }
      });

    };

  })

  .controller('CreateMapCtrl', function($scope, $state, $rootScope, $timeout, $cordovaGeolocation) {

    $scope.latLng = new google.maps.LatLng(24.6333, 46.7167);

    $cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: true}).then(function(position){

      $scope.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    }, function(error){
      console.log("Could not get location");
    });

    //START
    var marker = new google.maps.Marker({
      position: null,
      map: null,
      title: '543543543',
      animation: google.maps.Animation.DROP,
      draggable: true
    });

    function getReverseGeocodingData(latLng) {
      latlng = new google.maps.LatLng(latLng.lat(), latLng.lng());
      // This is making the Geocode request
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
          alert(status);
        }
        // This is checking to see if the Geoeode Status is OK before proceeding
        if (status == google.maps.GeocoderStatus.OK) {
          console.log(results);
          var address = (results[0].formatted_address);
          $rootScope.latLng = latLng.lat()+", "+latLng.lng();
        }
      });
    }

    function placeMarkerAndPanTo(latLng, map) {
      marker.setMap(map);
      marker.setPosition(latLng);
      getReverseGeocodingData(latLng);
      if(document.getElementById('createNext').hasAttribute("disabled")){
        document.getElementById('createNext').removeAttribute("disabled");
        document.getElementById('createNext').className += ' button-positive';}
      document.getElementById('createNext').setAttribute("href","#/create/"+latLng.lat()+","+latLng.lng());
      $scope.$apply();
      //map.panTo(latLng);
    }

    $scope.map_options = {
      zoom: 6,
      center: $scope.latLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };


    // create map
    map = new google.maps.Map(document.getElementById('map'), $scope.map_options);

    // listener
    map.addListener('click', function(e) {
      placeMarkerAndPanTo(e.latLng, map);
    });

    google.maps.event.addListener(marker,'dragend',function(event) {
      getReverseGeocodingData(event.latLng);
      if(document.getElementById('createNext').hasAttribute("disabled")){
        document.getElementById('createNext').removeAttribute("disabled");
        document.getElementById('createNext').className += ' button-positive';
      }
      document.getElementById('createNext').setAttribute("href","#/tab/matches/create/"+event.latLng.lat()+","+event.latLng.lng());
      $scope.$apply();
    });

    // Bias the SearchBox results towards current map's viewport.


    // [START region_getplaces]
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.Autocomplete(input, {
      componentRestrictions: {country: "sa"}
    });
    searchBox.bindTo('bounds', map);

    searchBox.addListener('place_changed', function() {
      var place = searchBox.getPlace();
      console.log(place);
      if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);  // Why 17? Because it looks good.
      }

      placeMarkerAndPanTo(place.geometry.location, map);

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

    });

    input.onkeydown = function(){
      document.querySelector('.pac-container').style.visibility = 'inherit';
      $timeout(function(){
        if(document.querySelector('.pac-item') != null) {
          console.log("Working");
          document.querySelector('.pac-container').setAttribute('data-tap-disabled', 'true');
          document.querySelector('.pac-container').onmouseover = function (e) {
            if(document.querySelector('.pac-item-selected') != null){
              document.querySelector('.pac-item-selected').className = "pac-item";
            }
            var element = e.srcElement;
            for (var i = 0; i < 5; i++) {
              if (element.className == 'pac-item') { break; }
              console.log(element);
              element = element.parentNode;
            }
            if(element.classList.length < 2){
              element.className += " pac-item-selected";
              google.maps.event.trigger( input, 'blur', {} );
            }else{
              alert(e.path.length +": "+ JSON.stringify(e.path));
            }
          }
        }
        console.log("not Working");
      },1000);
    };
    // [END region_getplaces]
    var dirService= new google.maps.DirectionsService();
    var dirRenderer= new google.maps.DirectionsRenderer();
    //END

  })

  .controller('MatchesCtrl', function($scope, $state, $rootScope, $timeout, $ionicModal, $cordovaGeolocation, $cordovaSocialSharing) {

    if(sdk.checkCookies() == false){

      $state.go('login');
      alert("going to login page");

    }else{

      sdk.getMatches(function (data, statusCode) {
        if (statusCode == 200) {
          $scope.matches = data;
          $scope.$apply();
        } else if (statusCode == 400) {
          console.log(statusCode);
        } else {
          console.log(statusCode);
        }
      });

    };

    $scope.doRefresh = function() {
      sdk.getMatches(function (data, statusCode) {
        if (statusCode == 200) {
          $scope.matches = data;
          $scope.$apply();
          $scope.$broadcast('scroll.refreshComplete');
        } else if (statusCode == 400) {
          alert(statusCode);
        } else {
          alert(statusCode);
        }
      });
    };

    $scope.deleteMatch = function(event, index, id) {
      sdk.deleteMatch(id,function(data,statusCode){
        if(statusCode == 204){
          $scope.matches.splice(index, 1);
          event.path[3].style.maxHeight = '0px';
          event.path[3].style.transform = 'translateX(-100%)';
          event.path[3].style.padding = '0';
          event.path[3].style.opacity = '0';
          if(index == 0){
            event.path[3].style.margin = '0px';
          }else{
            event.path[3].style.margin = '-10px';
          }
        }
      });
    };

    function arrayObjectIndexOf(myArray, searchTerm, property) {
      for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
      }
      return -1;
    };

    $scope.joinMatch = function(id) {
      //alert('join');
      sdk.joinMatch(id,function(data,statusCode){
        if(statusCode == 201){
          alert();
          var myid = arrayObjectIndexOf($scope.matches,id,"id");
          console.log(data);
          $scope.matches[myid].joined = true;
          $scope.matches[myid].number_of_players_needed = $scope.matches[myid].number_of_players_needed - 1;
          $scope.$apply();
        }
      });
    };

    $scope.unjoinMatch = function(id) {
      //alert('unjoin');
      sdk.unjoinMatch(id,function(data,statusCode){
        if(statusCode == 204){
          console.log(data);
          var myid = arrayObjectIndexOf($scope.matches,id,"id");
          $scope.matches[myid].joined = false;
          $scope.matches[myid].number_of_players_needed = $scope.matches[myid].number_of_players_needed + 1;
          $scope.$apply();
        }
      });
    };

    $scope.go = function(location){
      $state.go(location);
    };

    $scope.share = function () {
      window.plugins.socialsharing.shareViaTwitter('Digital Signature Maker', null /* img */, 'https://play.google.com/store/apps/details?id=com.prantikv.digitalsignaturemaker', null, function(errormsg){alert("Error: Cannot Share")});
    }

  })

  .controller('NearMatchesCtrl', function($scope, $state, $rootScope, $timeout, $ionicModal, $cordovaGeolocation) {


    if(sdk.checkCookies() == false){

      $state.go('login');
      alert("going to login page");

    }else{
      $cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: true}).then(function(position){

        $scope.latLng = JSON.stringify(position.coords.latitude)+","+JSON.stringify(position.coords.longitude);
        console.log($scope.latLng);
        sdk.getMatchByLocation( $scope.latLng , function ( data, statusCode) {
          if (statusCode == 200) {
            $scope.matches = data;
            $scope.$apply();
          } else if (statusCode == 400) {
            console.log(statusCode);
          } else {
            console.log(statusCode);
          }
        });

      }, function(error){
        console.log("Could not get location");
      });

    };

    $scope.doRefresh = function() {
      sdk.getMatchByLocation( $scope.latLng , function ( data, statusCode) {
        if (statusCode == 200) {
          console.log($scope.latLng);
          $scope.matches = data;
          $scope.matches = data;
          $scope.$broadcast('scroll.refreshComplete');
        } else if (statusCode == 400) {
          alert(statusCode);
        } else {
          alert(statusCode);
        }
      });
    };

    $scope.deleteMatch = function(event, index, id) {
      sdk.deleteMatch(id,function(data,statusCode){
        if(statusCode == 204){
          $scope.matches.splice(index, 1);
          event.path[3].style.maxHeight = '0px';
          event.path[3].style.transform = 'translateX(-100%)';
          event.path[3].style.padding = '0';
          event.path[3].style.opacity = '0';
          if(index == 0){
            event.path[3].style.margin = '0px';
          }else{
            event.path[3].style.margin = '-10px';
          }
        }
      });
    };

    function arrayObjectIndexOf(myArray, searchTerm, property) {
      for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
      }
      return -1;
    };

    $scope.joinMatch = function(id) {
      alert('join');
      sdk.joinMatch(id,function(data,statusCode){
        if(statusCode == 201){
          var myid = arrayObjectIndexOf($scope.matches.data,id,"id");
          $scope.matches.data[myid].joined = true;
          $scope.$apply();
        }
      });
    };

    $scope.unjoinMatch = function(id) {
      alert('unjoin');
      sdk.unjoinMatch(id,function(data,statusCode){
        if(statusCode == 204){
          var myid = arrayObjectIndexOf($scope.matches.data,id,"id");
          $scope.matches.data[myid].joined = false;
          $scope.$apply();
        }
      });
    };

    $scope.go = function(location){
      $state.go(location);
    }

  })

  .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('MatchDetailCtrl', function($scope, $stateParams, Chats, $ionicLoading, $ionicHistory) {

    $scope.goBack = function() {
      $ionicHistory.goBack();
    };

    if(sdk.checkCookies() == false){

      $state.go('login');
      //alert("going to login page");

    } else {

      sdk.getMatch($stateParams.matchId, true, function (data, statusCode) {
        if (statusCode == 200) {
          $scope.match = data;
          $scope.$apply();
        } else if (statusCode == 400) {
          console.log(statusCode);
        } else {
          console.log(statusCode);
        }
      });
    };

    $scope.deleteMatch = function(id) {
      sdk.deleteMatch(id,function(data,statusCode){
        if(statusCode == 204){
          $state.go('tab.matches');
        }
      });
    };

    $scope.joinMatch = function(id) {
      sdk.joinMatch(id,function(data,statusCode){
        if(statusCode == 201){
          $scope.match.joined = true;
          $scope.$apply();
        }
      });
    };

    $scope.unjoinMatch = function(id) {
      sdk.unjoinMatch(id,function(data,statusCode){
        if(statusCode == 204){
          $scope.match.joined = false;
          $scope.$apply();
        }
      });
    };

  })

  .controller('NearMatchDetailCtrl', function($scope, $stateParams, Chats, $ionicLoading) {

    if(sdk.checkCookies() == false){

      $state.go('login');
      //alert("going to login page");

    }else {

      sdk.getMatch($stateParams.matchId, function (data, statusCode) {
        if (statusCode == 200) {
          $scope.match = data;
          $scope.$apply();
        } else if (statusCode == 400) {
          console.log(statusCode);
        } else {
          console.log(statusCode);
        }
      });
    };

  })

  .controller('AccountCtrl', function($scope, $state, $rootScope, $ionicPopover) {

    $ionicPopover.fromTemplateUrl('templates/popover.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.popover = popover;
    });


    if(sdk.checkCookies() == false){

      $state.go('login');
      //alert("going to login page");

    }else{

      sdk.getPlayer(null, function(data, statusCode){
        if (statusCode == 200) {
          $scope.user = data;
          $scope.$apply();

          sdk.getMatchesOfPlayer( $scope.user.id, function (data, statusCode) {
            if (statusCode == 200) {
              $scope.matches = data;
              $scope.$apply();
            } else if (statusCode == 400) {
              console.log(statusCode);
            } else {
              console.log(statusCode);
            }
          });

        } else if (statusCode == 400) {
          console.log(statusCode);
        } else {
          console.log(statusCode);
        }
      });

    };

    $scope.doRefresh = function() {
      sdk.getMatches(function (data, statusCode) {
        if (statusCode == 200) {
          $scope.$broadcast('scroll.refreshComplete');
        } else if (statusCode == 400) {
          //alert(statusCode);
        } else {
          //alert(statusCode);
        }
      });
    };

    $scope.deleteMatch = function(event, index, id) {
      sdk.deleteMatch(id,function(data,statusCode){
        if(statusCode == 204){
          $scope.matches.splice(index, 1);
          event.path[3].style.maxHeight = '0px';
          event.path[3].style.transform = 'translateX(-100%)';
          event.path[3].style.padding = '0';
          event.path[3].style.opacity = '0';
          if(index == 0){
            event.path[3].style.margin = '0px';
          }else{
            event.path[3].style.margin = '-10px';
          }
        }
      });
    };

    function arrayObjectIndexOf(myArray, searchTerm, property) {
      for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
      }
      return -1;
    };

    $scope.joinMatch = function(id) {
      //alert('join');
      sdk.joinMatch(id,function(data,statusCode){
        if(statusCode == 201){
          var myid = arrayObjectIndexOf($scope.matches.data,id,"id");
          $scope.matches.data[myid].joined = true;
          $scope.$apply();
        }
      });
    };

    $scope.unjoinMatch = function(id) {
      //alert('unjoin');
      sdk.unjoinMatch(id,function(data,statusCode){
        if(statusCode == 204){
          var myid = arrayObjectIndexOf($scope.matches.data,id,"id");
          $scope.matches.data[myid].joined = false;
          $scope.$apply();
        }
      });
    };

    $scope.go = function(location){
      $state.go(location);
    };

    $scope.signOut = function(){

      sdk.signout(function(data,statusCode){
        if (statusCode == 200) {
          $state.go('login');
        } else if (statusCode == 400) {
          //alert(statusCode);
          $state.go('login');
        } else {
          //alert(statusCode);
          $state.go('login');
        }
      });

    };
  })

  .controller('EditCtrl', function($scope, $state, $rootScope, $ionicPopover) {


  })

  .controller('PassCtrl', function($scope, $state, $rootScope, $ionicPopup) {

    $scope.showPopup = function() {
      $scope.data = {};

      // An elaborate, custom popup
      var showPopup = $ionicPopup.show({
        template: 'Are you sure you want to change your <b>password</b>?',
        title: 'Change Password',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Change</b>',
            type: 'button-assertive',
            onTap: function (e) {

            }
          }
        ]
      });
    };

  })

  .controller('ProfileCtrl', function($scope, $state, $stateParams, $rootScope, $ionicHistory) {

    $scope.goBack = function() {
      $ionicHistory.goBack();
    };

    if(sdk.checkCookies() == false){

      $state.go('login');
      //alert("going to login page");

    }else{

      sdk.getPlayer($stateParams.id, function(data, statusCode){
        if (statusCode == 200) {
          $scope.user = data;
          //alert(data);
          $scope.$apply();

          sdk.getMatchesOfPlayer( $scope.user.id, function (data, statusCode) {
            if (statusCode == 200) {
              $scope.matches = data;
              $scope.$apply();
            } else if (statusCode == 400) {
              console.log(statusCode);
            } else {
              console.log(statusCode);
            }
          });

        } else if (statusCode == 400) {
          console.log(statusCode);
        } else {
          console.log(statusCode);
        }
      });

    };

    $scope.doRefresh = function() {
      sdk.getMatches(function (data, statusCode) {
        if (statusCode == 200) {
          $scope.$broadcast('scroll.refreshComplete');
        } else if (statusCode == 400) {
          //alert(statusCode);
        } else {
          //alert(statusCode);
        }
      });
    };

    $scope.deleteMatch = function(event, index, id) {
      sdk.deleteMatch(id,function(data,statusCode){
        if(statusCode == 204){
          $scope.matches.splice(index, 1);
          event.path[3].style.maxHeight = '0px';
          event.path[3].style.transform = 'translateX(-100%)';
          event.path[3].style.padding = '0';
          event.path[3].style.opacity = '0';
          if(index == 0){
            event.path[3].style.margin = '0px';
          }else{
            event.path[3].style.margin = '-10px';
          }
        }
      });
    };

    function arrayObjectIndexOf(myArray, searchTerm, property) {
      for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
      }
      return -1;
    };

    $scope.joinMatch = function(id) {
      //alert('join');
      sdk.joinMatch(id,function(data,statusCode){
        if(statusCode == 201){
          var myid = arrayObjectIndexOf($scope.matches.data,id,"id");
          $scope.matches.data[myid].joined = true;
          $scope.$apply();
        }
      });
    };

    $scope.unjoinMatch = function(id) {
      //alert('unjoin');
      sdk.unjoinMatch(id,function(data,statusCode){
        if(statusCode == 204){
          var myid = arrayObjectIndexOf($scope.matches.data,id,"id");
          $scope.matches.data[myid].joined = false;
          $scope.$apply();
        }
      });
    };

    $scope.go = function(location){
      $state.go(location);
    };

    $scope.signOut = function(){

      sdk.signout(function(data,statusCode){
        if (statusCode == 200) {
          $state.go('login');
        } else if (statusCode == 400) {
          //alert(statusCode);
          $state.go('login');
        } else {
          //alert(statusCode);
          $state.go('login');
        }
      });

    };
  })

  .controller('CreateFormCtrl', function($scope, $state, $rootScope, $filter, $ionicPopup, $ionicHistory) {

    $scope.matches = [];
    $scope.matches.time = new Date().getHours()*60*60;
    $scope.matches.date = ((new Date()).getHours() * 60 * 60);
    $scope.matches.nPlayers = 2,
      $scope.matches.ePlayers = 0,
    $scope.matches.matchLength = 0;

    $scope.timePickerObject = {
      inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
      step: 15,  //Optional
      format: 12,  //Optional
      titleLabel: '12-hour Format',  //Optional
      setLabel: 'Set',  //Optional
      closeLabel: 'Close',  //Optional
      setButtonType: 'button-positive',  //Optional
      closeButtonType: 'button-stable',  //Optional
      callback: function (val) {    //Mandatory
        timePickerCallback(val);
      }
    };

    $scope.datePickerObject = {
      titleLabel: null,  //Optional
      todayLabel: 'Today',  //Optional
      closeLabel: 'Close',  //Optional
      setLabel: 'Set',  //Optional
      setButtonType : 'button-clear button-positive',  //Optional
      todayButtonType : 'button-clear button-stable',  //Optional
      closeButtonType : 'button-clear button-assertive',  //Optional
      val: new Date(),  //Optional
      mondayFirst: true,  //Optional
      weekDaysList: ["Sun", "Mon", "Tue", "Wed", "thu", "Fri", "Sat"], //Optional
      monthList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"], //Optional
      templateType: 'popup2', //Optional
      showTodayButton: 'true', //Optional
      from: new Date(2012, 8, 2), //Optional
      to: new Date(2018, 8, 25),  //Optional
      callback: function (val) {  //Mandatory
        datePickerCallback(val);
      }
    };

    $scope.matches.timeDate = $filter('date')($scope.datePickerObject.val,'yyyy-MM-dd') +" "+ $filter('date')((($scope.matches.time-10800)*1000),'hh:mm a');

    function timePickerCallback(val) {
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        $scope.matches.time = val;
        $scope.matches.timeDate = $filter('date')($scope.datePickerObject.val,'yyyy-MM-dd') +" "+ $filter('date')((($scope.matches.time-10800)*1000),'hh:mm a');
      }
    }

    function datePickerCallback(val) {
      if (typeof(val) === 'undefined') {
        console.log('No date selected');
      } else {
        console.log('Selected date is : ', val);
        var selectedDate = new Date(val);
        $scope.datePickerObject.val = val;
        $scope.matches.timeDate = $filter('date')($scope.datePickerObject.val,'dd-MM-yyyy') +" "+ $filter('date')((($scope.matches.time-10800)*1000),'hh:mm a');
        console.log($scope.matches.timeDate);
      }
    }

    $scope.goBack = function() {
      $ionicHistory.goBack();
      $ionicHistory.goBack();
    };

    $scope.createMatch = function() {
      //alert($scope.matches.timeDate);
      sdk.createMatch($scope.matches.location,
        $scope.matches.timeDate,
        $rootScope.latLng,
        $scope.matches.nPlayers,
        $scope.matches.ePlayers,
        ([[$scope.matches.matchLength -  parseInt(-1) ] * 15] - parseInt(-15)),
        function(data,statusCode){

          if (statusCode == 201) {
            $state.go('tab.matches');
          }else{
            for (var key in data) {
              $scope.showPopup('Error',key+" -: "+data[key])
            };
          }
        }
      );
    };
    $scope.showPopup = function(title, template) {
      $scope.data = {};

      // An elaborate, custom popup
      var showPopup = $ionicPopup.show({
        template: template,
        title: title,
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>ok</b>',
            type: 'button-assertive',
            onTap: function (e) {

            }
          }
        ]
      });
    };

    $scope.autoExpand = function(e) {
      var element = typeof e === 'object' ? e.target : document.getElementById(e);
      setTimeout(function(){
        element.style.cssText = 'height:auto; padding:0';
        //for box-sizing other than "content-box" use:
        //el.style.cssText = '-moz-box-sizing:content-box';
        element.style.cssText = 'height:' + (element.scrollHeight + 38) + 'px';
      },0);
    };
    function expand() {
      $scope.autoExpand('TextArea');
    }
  });

/*$ionicModal.fromTemplateUrl('templates/tab-create.html', {
 scope: $scope,
 animation: 'slide-in-up'
 }).then(function(modal) {
 $scope.tabCreate = modal;
 });
 $ionicModal.fromTemplateUrl('templates/tab-create2.html', {
 scope: $scope,
 animation: 'slide-in-up'
 }).then(function(modal) {
 $scope.tabCreate2 = modal;
 });
 $scope.openModal = function() {
 $scope.tabCreate.show();

 //START
 var marker = new google.maps.Marker({
 position: null,
 map: null,
 title: '543543543',
 animation: google.maps.Animation.DROP,
 draggable: true
 });

 function getReverseGeocodingData(latLng) {
 latlng = new google.maps.LatLng(latLng.lat(), latLng.lng());
 // This is making the Geocode request
 var geocoder = new google.maps.Geocoder();
 geocoder.geocode({ 'latLng': latlng }, function (results, status) {
 if (status !== google.maps.GeocoderStatus.OK) {
 //alert(status);
 }
 // This is checking to see if the Geoeode Status is OK before proceeding
 if (status == google.maps.GeocoderStatus.OK) {
 console.log(results);
 var address = (results[0].formatted_address);
 $scope.matches.location = address;
 $scope.matches.latLng = latLng.lat()+", "+latLng.lng();
 }
 });
 }

 function placeMarkerAndPanTo(latLng, map) {
 marker.setMap(map);
 marker.setPosition(latLng);
 getReverseGeocodingData(latLng);
 $scope.$apply();
 //map.panTo(latLng);
 }

 $scope.map_options = {
 zoom: 6,
 center: $scope.latLng,
 mapTypeId: google.maps.MapTypeId.ROADMAP
 };

 // create map
 map = new google.maps.Map(document.getElementById('map'), $scope.map_options);

 // listener
 map.addListener('click', function(e) {
 placeMarkerAndPanTo(e.latLng, map);
 });
 // Create the search box and link it to the UI element.
 var input = document.getElementById('pac-input');
 var searchBox = new google.maps.places.SearchBox(input);
 console.log( google.maps.places);

 // Bias the SearchBox results towards current map's viewport.
 map.addListener('bounds_changed', function() {
 searchBox.setBounds(map.getBounds());
 });

 var markers = [];
 // [START region_getplaces]
 // Listen for the event fired when the user selects a prediction and retrieve
 // more details for that place.
 searchBox.addListener('places_changed', function() {
 var places = searchBox.getPlaces();

 if (places.length == 0) {
 return;
 }

 // Clear out the old markers.
 markers.forEach(function(marker) {
 marker.setMap(null);
 });
 markers = [];

 // For each place, get the icon, name and location.
 var bounds = new google.maps.LatLngBounds();
 places.forEach(function(place) {
 var icon = {
 url: place.icon,
 size: new google.maps.Size(71, 71),
 origin: new google.maps.Point(0, 0),
 anchor: new google.maps.Point(17, 34),
 scaledSize: new google.maps.Size(25, 25)
 };

 // Create a marker for each place.
 markers.push(new google.maps.Marker({
 map: map,
 icon: icon,
 title: place.name,
 position: place.geometry.location
 }).addListener("click",function(e) {
 placeMarkerAndPanTo(e.latLng, map);
 }));

 if (place.geometry.viewport) {
 // Only geocodes have viewport.
 bounds.union(place.geometry.viewport);
 } else {
 bounds.extend(place.geometry.location);
 }
 });
 map.fitBounds(bounds);
 });
 // [END region_getplaces]
 var dirService= new google.maps.DirectionsService();
 var dirRenderer= new google.maps.DirectionsRenderer();
 //END

















 };

 $scope.nextModal = function() {
 $scope.tabCreate.hide();
 $scope.tabCreate2.show();
 };

 $scope.closeModal = function() {
 $scope.tabCreate.hide();
 $scope.tabCreate2.hide();
 };
 //Cleanup the modal when we're done with it!
 $scope.$on('$destroy', function() {
 $scope.modal.remove();
 });
 // Execute action on hide modal
 $scope.$on('modal.hidden', function() {
 // Execute action
 });
 // Execute action on remove modal
 $scope.$on('modal.removed', function() {
 // Execute action

 .controller('CreateMapCtrl', function($scope, $state, $rootScope, $cordovaGeolocation) {

 $scope.latLng = new google.maps.LatLng(24.6333, 46.7167);

 $cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: true}).then(function(position){

 $scope.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

 }, function(error){
 console.log("Could not get location");
 });

 //START
 var marker = new google.maps.Marker({
 position: null,
 map: null,
 title: '543543543',
 animation: google.maps.Animation.DROP,
 draggable: true
 });

 function getReverseGeocodingData(latLng) {
 latlng = new google.maps.LatLng(latLng.lat(), latLng.lng());
 // This is making the Geocode request
 var geocoder = new google.maps.Geocoder();
 geocoder.geocode({ 'latLng': latlng }, function (results, status) {
 if (status !== google.maps.GeocoderStatus.OK) {
 //alert(status);
 }
 // This is checking to see if the Geoeode Status is OK before proceeding
 if (status == google.maps.GeocoderStatus.OK) {
 console.log(results);
 var address = (results[0].formatted_address);
 $rootScope.location = address;
 $rootScope.latLng = latLng.lat()+", "+latLng.lng();
 }
 });
 }

 function placeMarkerAndPanTo(latLng, map) {
 marker.setMap(map);
 marker.setPosition(latLng);
 getReverseGeocodingData(latLng);
 if(document.getElementById('createNext').hasAttribute("disabled")){
 document.getElementById('createNext').removeAttribute("disabled");
 document.getElementById('createNext').className += ' button-positive';}
 document.getElementById('createNext').setAttribute("href","#/tab/matches/create/"+latLng.lat()+","+latLng.lng());
 $scope.$apply();
 //map.panTo(latLng);
 }

 $scope.map_options = {
 zoom: 6,
 center: $scope.latLng,
 mapTypeId: google.maps.MapTypeId.ROADMAP,
 disableDefaultUI: true
 };

 // create map
 map = new google.maps.Map(document.getElementById('map'), $scope.map_options);

 // listener
 map.addListener('click', function(e) {
 placeMarkerAndPanTo(e.latLng, map);
 });

 google.maps.event.addListener(marker,'dragend',function(event) {
 getReverseGeocodingData(event.latLng);
 if(document.getElementById('createNext').hasAttribute("disabled")){
 document.getElementById('createNext').removeAttribute("disabled");
 document.getElementById('createNext').className += ' button-positive';
 }
 document.getElementById('createNext').setAttribute("href","#/tab/matches/create/"+event.latLng.lat()+","+event.latLng.lng());
 $scope.$apply();
 });

 // Create the search box and link it to the UI element.
 var input = document.getElementById('pac-input');
 map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

 var searchBox = new google.maps.places.Autocomplete(input, {
 componentRestrictions: {country: "sa"}
 });
 searchBox.bindTo('bounds', map);

 // Bias the SearchBox results towards current map's viewport.


 // [START region_getplaces]
 // Listen for the event fired when the user selects a prediction and retrieve
 // more details for that place.
 searchBox.addListener('place_changed', function() {
 var place = searchBox.getPlace();
 if (!place.geometry) {
 window.//alert("Autocomplete's returned place contains no geometry");
 return;
 }

 // If the place has a geometry, then present it on a map.
 if (place.geometry.viewport) {
 map.fitBounds(place.geometry.viewport);
 } else {
 map.setCenter(place.geometry.location);
 map.setZoom(17);  // Why 17? Because it looks good.
 }

 placeMarkerAndPanTo(place.geometry.location, map);

 var address = '';
 if (place.address_components) {
 address = [
 (place.address_components[0] && place.address_components[0].short_name || ''),
 (place.address_components[1] && place.address_components[1].short_name || ''),
 (place.address_components[2] && place.address_components[2].short_name || '')
 ].join(' ');
 }

 infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
 infowindow.open(map, marker);
 });
 // [END region_getplaces]
 var dirService= new google.maps.DirectionsService();
 var dirRenderer= new google.maps.DirectionsRenderer();
 //END

 })
 });












 .controller('CreateMapCtrl', function($scope, $state, $rootScope, $cordovaGeolocation) {

 $scope.latLng = new google.maps.LatLng(24.6333, 46.7167);

 $cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: true}).then(

 function(position){

 $scope.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

 }, function(error){
 console.log("Could not get location");
 }
 );

 //START
 var marker = new google.maps.Marker({
 position: null,
 map: null,
 title: '543543543',
 animation: google.maps.Animation.DROP,
 draggable: true
 });

 function getReverseGeocodingData(latLng) {
 latlng = new google.maps.LatLng(latLng.lat(), latLng.lng());
 // This is making the Geocode request
 var geocoder = new google.maps.Geocoder();
 geocoder.geocode({ 'latLng': latlng }, function (results, status) {
 if (status !== google.maps.GeocoderStatus.OK) {
 //alert(status);
 }
 // This is checking to see if the Geoeode Status is OK before proceeding
 if (status == google.maps.GeocoderStatus.OK) {
 console.log(results);
 var address = (results[0].formatted_address);
 $rootScope.location = address;
 $rootScope.latLng = latLng.lat()+", "+latLng.lng();
 }
 });
 }

 function placeMarkerAndPanTo(latLng, map) {
 marker.setMap(map);
 marker.setPosition(latLng);
 getReverseGeocodingData(latLng);
 if(document.getElementById('createNext').hasAttribute("disabled")){
 document.getElementById('createNext').removeAttribute("disabled");
 document.getElementById('createNext').className += ' button-positive';}
 document.getElementById('createNext').setAttribute("href","#/tab/matches/create/"+latLng.lat()+","+latLng.lng());
 $scope.$apply();
 //map.panTo(latLng);
 }

 $scope.map_options = {
 zoom: 6,
 center: $scope.latLng,
 mapTypeId: google.maps.MapTypeId.ROADMAP,
 disableDefaultUI: true
 };

 // create map
 map = new google.maps.Map(document.getElementById('map'), $scope.map_options);

 // listener
 map.addListener('click', function(e) {
 placeMarkerAndPanTo(e.latLng, map);
 });

 google.maps.event.addListener(marker,'dragend',function(event) {
 getReverseGeocodingData(event.latLng);
 if(document.getElementById('createNext').hasAttribute("disabled")){
 document.getElementById('createNext').removeAttribute("disabled");
 document.getElementById('createNext').className += ' button-positive';
 }
 document.getElementById('createNext').setAttribute("href","#/tab/matches/create/"+event.latLng.lat()+","+event.latLng.lng());
 $scope.$apply();
 });


 var service = new google.maps.places.PlacesService(map);
 $scope.results = [];
 $scope.pacInput = { query: '' };
 $scope.$watch('pacInput.query', function(query, oldVal) {
 $scope.results = [];
 if(query != "") {
 service.radarSearch({
 bounds: map.getBounds(),
 keyword: query
 }, function (results, status) {
 if (status !== google.maps.places.PlacesServiceStatus.OK) {
 console.error(status);
 return;
 }
 for (var i = 0; i < results.length; i++) {
 console.log(results[i].place_id);
 service.getDetails({placeId: results[i].place_id}, function (place, status) {
 if (status == google.maps.places.PlacesServiceStatus.OK) {
 console.log(place.adr_address);
 $scope.results.push(place);
 $scope.$apply();
 }
 });
 if(i+1 == results.length){
 console.log(results.length);
 }
 }
 });
 }
 });



 // [END region_getplaces]
 var dirService= new google.maps.DirectionsService();
 var dirRenderer= new google.maps.DirectionsRenderer();
 //END

 })

 */
