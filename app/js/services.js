'use strict';

/* Services */

var reddimgurServices = angular.module('reddimgurServices', []);

reddimgurServices.factory('RedditService', ['$http', '$q', function($http, $q, config) {
    return {
      getRedditPosts: function(config) {
        return $http.get('https://www.reddit.com/r/:sub.json', {'sub': config.sub})
          .then(function(response) {
            if (typeof response.data === 'object') {
              return response.data;
            } else {
              return $q.reject(response.data);
            }
          }, function(response) {
            return $q.reject(response.data);
          });
      }
  };
}]);

reddimgurServices.factory('ImgurService',['$http', '$q', function($http, $q, config) {
    return {
      getImage: function(config) {
        return $http.get('https://api.imgur.com/3/image/:id', {'id': config})
          .then(function(response) {
            if (typeof response.data === 'object') {
              return response.data;
            } else {
              return $q.reject(response.data);
            }
          }, function(response) {
            return $q.reject(response.data);
          });
      }
  };
}]);
