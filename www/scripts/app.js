'use strict';

var tateti = ons.bootstrap('tateti', ['onsen']).config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://player.zembrion.com**']);
  $sceDelegateProvider.resourceUrlBlacklist(['']);
});



var urlApi = 'http://tateti.ionmicrosystems.com/api/v1/';
var firstTime = true;
var seriesData = false;
var email = 'api@tateti.tv';
var password = '123456';
var token = '';
var serieActual = '';
var actualMedia;


/* Controllers */

tateti.run(function($rootScope) {    
    
    $rootScope.screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    
    console.log('hola');
    $rootScope.loadData = function() {
        $rootScope.dataLoaded = false;     
    };    
    $rootScope.dataComplete = function() {
        $rootScope.dataLoaded = true;     
    };    
    
    $rootScope.devicePlatform = function() {
        if(ons.platform.isIPhone()) $rootScope.platform = 'iphone';
        if(ons.platform.isIPad()) $rootScope.platform = 'ipad';
        
        if(ons.platform.isAndroid()) 
            if(width>640)
                $rootScope.platform = 'android';        
            else
                $rootScope.platform = 'tablet';        
    }    
    
});
    
tateti.controller('AppController', function($scope,$rootScope) { 
    ons.ready(function() {   
        rootNavigator.resetToPage('slider.html',{animation:'fade'});      
    });    
});

tateti.controller('VideoController', function($scope,$rootScope,$timeout) { 
   
    $scope.close = function(){
        rootNavigator.resetToPage('serie.html',{animation:'fade'}); 
    }   
    
  $scope.mediaid = 'http://player.zembrion.com/media/o/'+actualMedia+'?autoplay=true';
    
    
});

tateti.controller('SerieController', function($scope,$rootScope,ApiService,PreloadImage) {        
    
    $rootScope.devicePlatform();
    
    $scope.capitulos = [];
    
    $scope.viewVideo = function(media){
        
        actualMedia = media;        
        rootNavigator.resetToPage('video.html',{animation:'fade'}); 
    }
    
    $scope.close = function(){
        rootNavigator.resetToPage('slider.html',{animation:'fade'}); 
    }
    
    // actualizar imagenes de las series
    $scope.update = function(index, value){
        //alert($scope.capitulos[index].thumbs);
        $scope.capitulos[index].thumbs = value; 
        
    }
    
    $scope.serie = serieActual;
    
    $scope.getCapitulos = function() {
                
        console.log(serieActual.id);
        var promise = ApiService.getCapitulos(serieActual.id);
        
        promise.then(function(response){
        
            var capitulos = response.data.data;
            
            for(var i in capitulos){        
                
                console.log('init');
                var thumbs = capitulos[i].thumbs['360'];
                
                // Imagen default prealoder para las imagenes que se obtienen de la api.
                capitulos[i].thumbs = 'images/LA2.gif';
                
                PreloadImage.preload(i,thumbs).then(
                    function(response){      
                        $scope.update(response.index,response.url);                                
                    },
                    function(error){                                
                        console.log(error);
                    }
                )
                console.log('init');
            }
            
            $scope.capitulos = capitulos;
            
        },function(err){
            // Error al obtener informacion
            console.log('Error al obtener los capitulos de la serie');
        });
    }
   
    $scope.getCapitulos();
});


tateti.controller('HomeController', function($scope,$rootScope,ApiService,PreloadImage) {  
            
    $rootScope.devicePlatform();    
    
    $scope.series = [];
    
    if(firstTime){
        $rootScope.loadData(); 
    }
    
    // actualizar imagenes de las series
    $scope.update = function(index, value){
        $scope.series[index].image = value;        
    }
    
    $scope.viewSerie = function(index){
        serieActual = seriesData[index];
        var options = {
          animation: 'slide'
        };
        rootNavigator.resetToPage("serie.html", options); 
    }
    
    // obtener la info de las series
    $scope.getSeries = function(){
        // Obtiene inicialmente las series
        
        if(seriesData){
            $scope.series = seriesData;
            $rootScope.dataComplete();
        }else{
            
            console.log('start getSeries');
            var promise = ApiService.getSeries();
        
            promise.then(function(response){
                
                console.log(response.data.status);
                if(response.data.status=='fail'){
                    console.log('No se pueden obtener las series');
                    console.log(response.data.message);
                }else{
                    var series = response.data.data;
                
                    for(var i in series){                
                        
                        var images = series[i].images;
                        
                        images = JSON.parse(images);
                        
                        var image = images.website_logo + '?' + Math.round(new Date().getTime()/1000);
                        
                        console.log(image);
                        
                        // Imagen default prealoder para las imagenes que se obtienen de la api.
                        series[i].image = 'images/LA2.gif';
                        
                        PreloadImage.preload(i,image).then(
                            function(response){                                                                
                                $scope.update(response.index,response.url);                                
                            },
                            function(error){                                
                            }
                        )                                             
                    }
                    
                    $scope.series = series;
                
                    seriesData = response.data.data;
                    
                    $rootScope.dataComplete();
                }            
            
                
                
            },function(err){
                // Error al obtener informacion
                console.log('Error al obtener las series');
            });
            
        }
        
        
    }
    
    
    // obtener la info de los capiulos en el historial del perfil
     
    
    if(firstTime){
        // Login a la API de TTT
        ApiService.login(email,password).then(    
            function(response){       
                if(response.data.status=='success'){
                    token = response.data.data.token;
                    firstTime = false;                                    
                    // Obtenemos las series disponibles
                    $scope.getSeries();                       
                }   
            },        
            function(err){                       
            }
        ); 
        firstTime = false;
    }else{
        $scope.series = seriesData;
    }
    
      
});