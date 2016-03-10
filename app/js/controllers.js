'use strict';

/* Controllers */

var reddimgurApp = angular.module('reddimgurControllers', []);

reddimgurApp.controller('ImgurCtrl', ['$scope', '$http', '$q',
  function ($scope, $http, $q) {
    $scope.images = [];
    $scope.currentSub = 'pics';
    $http.get('./subreddits.json')
      .then(function(data) {
        $scope.subreddit = data.data;
        $scope.currentSub = data.data[0];
      });

    var subreddit = 'r/pics';
    getSubreddit(subreddit);

    $scope.enhance = false;

    $scope.selectSub = function(sub) {
      $scope.currentSub = sub;
      getSubreddit(sub.data.url);
    };

    $scope.viewInImgur = function(pic, $event) {
      window.open('http://imgur.com/gallery/' + pic.data.data.id);

      if ($event.stopPropagation) $event.stopPropagation();
      if ($event.preventDefault) $event.preventDefault();
      $event.cancelBubble = true;
      $event.returnValue = false;
    };

    $scope.viewInReddit = function(permalink, $event) {
      window.open('http://www.reddit.com' + permalink);

      if ($event.stopPropagation) $event.stopPropagation();
      if ($event.preventDefault) $event.preventDefault();
      $event.cancelBubble = true;
      $event.returnValue = false;
    };

    function getSubreddit(subreddit) {
      $http.jsonp('http://www.reddit.com/' + subreddit +'.json?jsonp=JSON_CALLBACK')
      .then(function(data) {
        for (var i in data.data.data.children) {
          if ((!(data.data.data.children[i].data.domain.includes('imgur')) ||
            data.data.data.children[i].data.url.includes('gallery')))  {
            data.data.data.children.splice(i, 1);
          }
        }

        var ids = getIdArray(data.data.data.children);
        $http.defaults.headers.common.Authorization = 'Client-ID 8c83be9ff273b18';
        getAllLinks(ids).then(function(datas) {
          $scope.imgur = formatPics(datas);
        }).catch(function(error) {
          console.log('error', error);
        });
      }).catch(function(error) {
        console.log('error', error);
      });
    }

    function getAllLinks(ids) {
      var promises = ids.map(function(id) {
        return $http.get('https://api.imgur.com/3/image/' + id);
      });
      return $q.all(promises);
    }

    function getIdArray(obj) {
      var idArray = [];

      for (var i in obj) {
          var link = obj[i].data.url;
          var slash = link.indexOf("/", 12);
          var dot = link.indexOf(".", slash);
          var id = (dot > 0 ? link.slice(slash + 1, dot) : link.slice(slash + 1));

          if (id.length > 8) {
            obj.splice(i, 1);
          } else {
            idArray.push(id);
          }
      }
      $scope.reddit = obj;
      return idArray;
    }

    function formatPics(obj) {
      for (var i in obj) {
        var link = obj[i].data.data.link;
        var dot = link.indexOf(".", 20);
        var size = randomSize();

        obj[i].data.data.thumb = [link.slice(0, dot), size, link.slice(dot)].join('');
        obj[i].data.data.span = getSpan(size);
        obj[i].data.data.permalink = $scope.reddit[i].data.permalink;
        obj[i].data.data.title = $scope.reddit[i].data.title;
      }
      return obj;
    }


    function randomSize() {
      var r = Math.random();
      if (r < 0.8) {
        return "s";
      } else {
        return "b";
      }
    }

    function getSpan(size) {
      if (size == "s") {
        return 1;
      } else {
        return 2;
      }
    }
}]);