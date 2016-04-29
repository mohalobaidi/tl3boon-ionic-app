function Tl3boonSDK() {
    //this.apiUrl = "http://api.tl3boon.com" // Production URL
    this.apiUrl = "http://modsoft.co";// Development URL
    this.token = null;
    this.VERBS = {
        GET : "GET",
        POST : "POST",
        PUT : "PUT",
        DELETE : "DELETE"
    };
    this.checkCookies = function(){
        var cookieManager = new CookiesManager();
        var token = cookieManager.getCookie("token");
        if (token == "" || token == null) {
            ////alert("no cookies for you thank you come again");
            //window.location.href = "#login";
            return false;
        }else{
            this.token = token;
            //alert(token);
            return true;
        }
    };

    this.getMatches = function(callback){
        this.sendRequest("matches",this.VERBS.GET,null,null,callback);
    };
    this.getMatchesOfPlayer = function(id, callback){
        this.sendRequest("matches",this.VERBS.GET,null,"player="+id,callback);
    };
    this.getMatch = function(id, players,callback){
        this.sendRequest("matches/"+id,this.VERBS.GET,null,"players="+players,callback);
    };
    this.getMatchByLocation = function(location,callback){
        this.sendRequest("matches",this.VERBS.GET,null,"location="+location,callback);
    };
    this.getPlayers = function(callback){
        this.sendRequest("players",this.VERBS.GET,null,"players=true",callback);
    };
    this.getPlayer = function(id,callback){
        if(id == null){
            id = "";
        }else{
            id = "/"+id
        }
        this.sendRequest("players"+id,this.VERBS.GET,null,null,callback);
    };
    this.updatePlayerDetails = function(parms,callback){
        this.sendRequest("players",this.VERBS.PUT, parms,null,callback);
    };
    this.getFriends = function(callback){
        this.sendRequest("friends",this.VERBS.GET,null,null,callback);
    };
    this.getFriendsOfPlayer = function(id,callback){
        this.sendRequest("friends/"+id,this.VERBS.GET,null,null,callback);
    };
    this.addFriend = function(id,callback){
        this.sendRequest("friends/"+id,this.VERBS.POST,null,null,callback);
    };
    this.createMatch = function(place,time,location,numberOfPlayerNeeded, numberOfExistingPlayers,matchLength,notes,splitAmount,callback){
        var parms = "place="+encodeURIComponent(place)+"&location="+location+"&time="+time+"&match_length="+matchLength+"&number_of_players_needed="+numberOfPlayerNeeded+"&number_of_existing_players="+numberOfExistingPlayers+"&notes="+notes+"&split_amount="+splitAmount;
        console.log(parms);
        this.sendRequest("matches",this.VERBS.POST,parms,null,callback);
    };
    this.joinMatch = function(id,callback){
        this.sendRequest("matches/"+id,this.VERBS.POST,null,null,callback);
    };
    this.unjoinMatch = function(id,callback){
        this.sendRequest("matches/"+id,this.VERBS.DELETE,null,null,callback);
    };
    this.deleteMatch = function(id,callback){
        this.sendRequest("matches/"+id,this.VERBS.DELETE,null,null,callback);
    };
    this.invaitePlayerToMatch = function(playerId,matchId,callback){
        var parms = "player="+playerId+"&match="+matchId;
        this.sendRequest("invites",this.VERBS.POST,parms,null,callback);
    };
    this.acceptInvite = function(matchId,callback){
        this.sendRequest("invites/"+mathcId,this.VERBS.PUT,prams,null,callback);
    };
    this.deleteInvaitePlayerToMatch = function(playerId,matchId,callback){
        var parms = "player="+playerId+"&match="+matchId;
        this.sendRequest("invites",this.VERBS.DELETE,parms,null,callback);
    };
    this.getImage = function(id,callback){
        this.sendRequest("images/"+id,this.VERBS.GET,null,null,callback);
    };
    this.uploadImage = function(image,callback){
        var formData = new FormData();
        if (!image.type.match('image.*')) {
            //alert("this is not a image");
        }
        formData.append('image', image, image.name);
        this.sendRequest("players",this.VERBS.PUT,formData,null,callback);
    };
    this.signin = function(username,password,callback){
        var parms = "username="+username+"&password="+password;
        var that = this;
        this.sendRequest("auth/login",this.VERBS.POST,parms, null,function(data,statusCode){
            if (statusCode == 200) {
                that.token = data["key"];
                var cookieManager = new CookiesManager();
                cookieManager.setCookie("token",that.token,60);
            }
            that.excuteCallback(callback,JSON.stringify(data),statusCode);

        });
    };
    this.signout = function(callback){
        var that = this;
        this.sendRequest("auth/logout",this.VERBS.POST,null, null, function(data,statusCode){
            if (statusCode == 200 || statusCode == 401) {
                var cookieManager = new CookiesManager();
                that.token = null;
                cookieManager.deleteCookie("token");
            }
            that.excuteCallback(callback,JSON.stringify(data),statusCode);
        });
    };
    this.signup = function(email,username,firstname,lastname,password,passwordConfirm,position,age,callback){
        var parms = "email="+email+"&username="+username+"&first_name="+firstname+"&last_name="+lastname+"&password1="+password+"&password2="+passwordConfirm+"&position="+position+"&age="+age;
        this.sendRequest("auth/registration",this.VERBS.POST,parms, null,callback);
    };
    this.registerDeviceForPushNotification = function (tokenID, os, callback) {
        var parms = "registration_id="+tokenID+"&os="+os;
        this.sendRequest("notifications", this.VERBS.POST, parms, null, callback);
    };
    this.unregisterDeviceFromPushNotification = function (tokenID, os, callback) {
        var parms = "registration_id="+tokenID+"&os="+os;
        this.sendRequest("notifications", this.VERBS.DELETE, parms, null, callback);

    };
    this.sendRequest = function(resource,method,paramters,query,callback){
        /****************************
         * Resource is URl of Requested Data
         *
         * Method is The HTTP verb ("GET","POST","PUT","DELETE")
         *
         * Paramters
         ****************************/
        var that = this;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState == 4) {
                that.excuteCallback(callback,xmlhttp.responseText,xmlhttp.status);

            }
        };
        xmlhttp.open(method,this.apiUrl+"/"+resource+"/?format=json&"+query,true);
        if (this.token != null) {
            xmlhttp.setRequestHeader("authorization","Token "+this.token);
        }
        if (method == this.VERBS.POST || method == this.VERBS.PUT) {
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }
        xmlhttp.send(paramters);
    };
    this.excuteCallback = function(callback,data,statusCode){
        if (callback != null) {
            console.log(data);
            if (statusCode != 204) {
                data = JSON.parse(data);
            }
            callback(data,statusCode);
        }
    };
    this.isFunction = function(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }
}

function CookiesManager() {
    this.setCookie = function(cname, cvalue, exdays) {
        localStorage.setItem(cname, cvalue);
    };
    this.deleteCookie = function (cname) {
        localStorage.removeItem(cname);
    };
    this.getCookie = function (cname) {
        return localStorage.getItem(cname);
    }
}

//
//function CookiesManager() {
//    this.setCookie = function(cname, cvalue, exdays) {
//    var d = new Date();
//    d.setTime(d.getTime() + (exdays*24*60*60*1000));
//    var expires = "expires="+d.toUTCString();
//    document.cookie = cname + "=" + cvalue + "; " + expires;
//    }
//
//    this.getCookie = function (cname) {
//        var name = cname + "=";
//        var ca = document.cookie.split(';');
//        for(var i=0; i<ca.length; i++) {
//            var c = ca[i];
//            while (c.charAt(0)==' ') c = c.substring(1);
//            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
//        }
//        return "";
//    }
//
//    this.checkCookie = function () {
//        var user = getCookie("username");
//        if (user != "") {
//            //alert("Welcome again " + user);
//        } else {
//            user = prompt("Please enter your name:", "");
//            if (user != "" && user != null) {
//                setCookie("username", user, 365);
//            }
//        }
//    }
//}
