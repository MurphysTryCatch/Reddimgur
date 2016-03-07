'use strict';

/* Services */

var reddimgurServices = angular.module('reddimgurServices', ['ngResource']);

reddimgurServices.factory('Imgur', ['$resource',
  function($resource){
    return $resource('https://api.imgur.com/3/gallery:subreddit', {}, {
      query: {
      	method:'GET',
      	params:{'subreddit': '/r/meme'},
      	isArray:false,
      	headers: {'Authorization': 'Client-ID 8c83be9ff273b18'}
      }
    });
  }]);

reddimgurServices.factory('Reddit', ['$resource',
  function($resource){
    return $resource('./subreddits.json', {}, {
      query: {
        method:'GET',
        isArray:false
      }
    });
  }]);