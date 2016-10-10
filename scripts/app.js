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
    {path: '/news', component: 'news'},
    {path: '/', redirectTo: '/home'}
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
})


