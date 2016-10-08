'use strict';

/**
 * @ngdoc overview
 * @name fastWebsiteApp
 * @description
 * # fastWebsiteApp
 *
 * Main module of the application.
 */
var app = angular
  .module('avimetApp', [
    'ngResource',
    'ngRoute',
    'ngNewRouter'
  ])

app.controller('RouterController', function ($router,$scope,$location,$resource,$http) {
  $router.config([
    {path: '/home', component: 'home'},
    {path: '/news', component: 'news'}
  ]);

  $scope._path =  $location;
  $scope.menu = $scope._path.$$path.substring(1, $scope._path.$$path.length);
  if ($scope.menu != "") {
    $('.' + $scope.menu).addClass('active');
  } else {
    $('.home').addClass('active');
  }

  $('.title-home').click(function () {
    $('.title-home').not($(this)).removeClass('active');
    $(this).addClass('active');
  })

  $scope.clickCss = function(route){
    $('.home').removeClass('active');
    $('.news').removeClass('active');
  }


});

app.config(function ($componentLoaderProvider,$httpProvider) {
  $componentLoaderProvider.setTemplateMapping(function (name) {
    // name is component name
    return 'views/' + name + '/' + name + '.html';
  })

  $httpProvider.interceptors.push(function($q){
    return {
      'request': function(config) {
        if(config.url.startsWith("/api")&&!document.URL.startsWith("http")) {
          config.url = config.url;
        }
        return config;
      },
      'responseError': function(response) {
        var status = response.status;

        if (status == 401) {
          console.log("未认证");
          window.onbeforeunload = function() {
            //return "您的未保存操作将丢失！"
          }
          window.location = "login.html";
          return;
        }

        if (status == 403 || status == 412 || status == 503) {
          toastr.warning(response.data);
          return;
        }

        if (status == 500) {
          toastr.error("抱歉，服务器异常");
          return;
        }

        return $q.reject(response);
      }
    };
  });

})

.run(function($rootScope){

  $.fn.form.settings.rules.phoneNumber=function(){
    var pattern=/(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
    return function(value){
      return pattern.test(value);
    }
  }();
  $.fn.form.settings.rules.plateNumber=function(){//验证车牌号码格式
    var pattern=/^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{6}$/;
    return function(value){
      return pattern.test(value);
    }
  }();
  $.fn.form.settings.rules.number=function(value){
    return $.isNumeric(value);
  };
  $.fn.form.settings.rules.positive=function(value){
    return ($.isNumeric(value) && value >= 0)||value=='';
  };
  $.fn.form.settings.rules.identiyCard=function() { //验证身份证号码
    var pattern=/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
    return function(value) {
      return pattern.test(value);
    }
  }();

  $.fn.form.settings.rules.length=function() { //长度验证
    return function(value) {
      return value.length <= 120 && value.length >= 0;
    }
  }();

});
