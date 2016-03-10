'use strict';

/* App Module */

var reddimgurApp = angular
.module('reddimgurApp', [
	'ngMaterial',
	'ngAnimate',
	'reddimgurControllers'
])
.config(function($mdThemingProvider, $mdIconProvider){

          $mdThemingProvider.theme('default')
              .primaryPalette('light-blue')
              .accentPalette('deep-orange');
});
