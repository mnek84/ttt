'use strict';

/* Services */
tateti.factory('ApiService', function($q,$http,$timeout){     
    return{
        login:function(email,password){                       
            return $http.post(urlApi + 'login',{email:email,password:password});                                
        },
        getSeries:function(){
            var url = urlApi+'series?token='+token;
            console.log(url);
            return $http.post(url);    
        },
        getCapitulos:function(serie){
            console.log('('+serie+')');
            console.log('('+token+')');
            var url = urlApi+'videos';
            var data = { 'serie' : serie, 'token': token };
            console.log(url);
            return $http.post(url,urlApi);    
        }
    }
});

tateti.service('SettingsService', function() {
    var _variables = {};
    return {
        get: function(varname) {
            return (typeof _variables[varname] !== 'undefined') ? _variables[varname] : false;
        },
        set: function(varname, value) {
            _variables[varname] = value;
        }
    };
});


tateti.service('PreloadImage',function($q){
    return {
        preload: function(index, url){
            
            var deffered = $q.defer(),
            image = new Image();            
            image.src = url;
            
            if (image.complete) {            
                deffered.resolve({index:index,url:url});            
            } else {            
                image.addEventListener('load', function() {
                    deffered.resolve({index:index,url:this.src});
                });            
                image.addEventListener('error', function() {
                    console.log('error');
                    deffered.reject();
                });
            }
            
            return deffered.promise;
        }  
    };
});

/*
TicketUnico.service('LoginService', function($http, $q){
    return{
        login:function(email,password){
            var q = $q.defer();            
            return $http.post(api + '/auth',{email:email,password:password});            
        }
    }
});

TicketUnico.factory('AccesoService', function($q,$http,LoginUtility){

    return{
        getReserva:function(codigo){            
            return $http.post("http://ticketunico.com/admin/event/" + actualEvent + "/control/search",{search:codigo,meta:"codigo_reserva"});            
        },
        getToken:function(codigo){            
            return $http.post("http://ticketunico.com/admin/event/" + actualEvent + "/control/search",{search:codigo,meta:"qr_code"});            
        },

        getDocument:function(codigo){            
            return $http.post("http://ticketunico.com/admin/event/" + actualEvent + "/control/search",{search:codigo,meta:"document"});            
        },
        getListaGente:function(){            
            if (actualEvent)return $http.post("http://ticketunico.com/api/v2/acceso/lista",{e:actualEvent});            
            return $q.when(1);
        },
        getStatus:function(){            
            if (actualEvent)return $http.post("http://ticketunico.com/api/v2/acceso/status",{e:actualEvent});            
            return $q.when(1);
        },

        validateUnico:function(ticketId,masc,fem){
            return $http.post("http://ticketunico.com/admin/event/" + actualEvent + "/control/validate",{tid: ticketId,sm:masc,sf:fem});            
        }
    }
});

TicketUnico.factory('EventService', function($q,$http,LoginUtility){
    var datos;
    var localScope;
    return{
        get:function(){
            localScope.events = datos;
        },        
        setScope:function(scope){
            localScope = scope;
        },
        actualizar:function(){

            var tokenPromise = LoginUtility.getToken();

            
            
            var promise = $http.post(api + '/events?token=' + actualToken);                                 
            promise.then(function(data){
                
                datos = data.data;
                localScope.Events = datos;

                var eventos = data.data;

                for(var i=0;i<eventos.length;i++){
                    console.log(eventos[i].name);
                }

            },function(err){
                alert("Events " + err);
            });            
        }
    }    
});




TicketUnico.service('SettingsService', function() {
    var _variables = {};

    return {
        get: function(varname) {
            return (typeof _variables[varname] !== 'undefined') ? _variables[varname] : false;
        },
        set: function(varname, value) {
            _variables[varname] = value;
        }
    };
});

TicketUnico.factory('LoginUtility', function($http,LoginService) {
        var user;

        var username;
        var password;
        var scopeVar;

        var loginObj = {};

        loginObj.setScope = function(scope){
          scopeVar  = scope;
        }
        loginObj.setUser = function(data){
            user = data;
        }

        loginObj.getUser = function(){
          return user;
        }
        
        loginObj.setToken = function(token){
            actualToken = token;
        }

        loginObj.getToken = function(){            
            
            return actualToken;
        }

        loginObj.regenerateToken = function(){
           actualToken = "";
           return actualToken;
        }

        loginObj.checkOfflineUser = function(){
            return false;
        }

        loginObj.login = function(form) {            
            if(form.$valid) {

              modal.show();
              username = scopeVar.login.email;              
              password = scopeVar.login.password;                  
              
              var logInPromise = LoginService.login(username,password);

              
              logInPromise.then(function(rest){
                modal.hide();
                var data = rest.data; 
                if (data.error){
                    ons.notification.alert({
                      message: data.error,                      
                      title: 'Login Error',
                      buttonLabel: 'OK',
                      animation: 'default', 
                      callback: function() {
                        
                      }
                    }); 

                }else{                    
                    var userData = data.response.user;   
                    actualToken = data.response.token;
                    actualUser = userData;    
                    rootNavigator.resetToPage('dashboard.html',{animation:'push'});                           
                }

              },function(err){
                modal.hide();
                    ons.notification.alert({
                      message: "No pudimos conectarnos con el serivdor verifique su conexion",                      
                      title: 'Login Error',
                      buttonLabel: 'OK',
                      animation: 'default', 
                      callback: function() {
                        
                      }
                    });                     
              });
            }
        };

        loginObj.logout = function() {
            username = null;
        };

        loginObj.checkLogin = function() {               
            
                scopeVar.ons.slidingMenu.setMainPage("login.html", {closeMenu: true});
                        
        };

        return loginObj;
    });

*/