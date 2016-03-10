(function (angular) {

  'use strict';

  /* Controllers */

  angular
    .module('reddimgurControllers', [])
    .controller('ImgurCtrl', ImgurController);
      function ImgurController($scope, $http, $q, $mdDialog) {
        $scope.images = [];
        $http.get('./subreddits.json')
          .then(function(data) {
            console.log(data.data.data.children);
            $scope.subreddit = data.data;
            $scope.currentSub = data.data.data.children[0].data.url;
            getSubreddit($scope.currentSub);
          });

        //var subreddit = 'r/pics';
        //getSubreddit(subreddit);

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
            var children = data.data.data.children;
            children.forEach(function(child, i) {
              if ((!(child.data.domain.includes('imgur')) ||
                child.data.url.includes('gallery')))  {
                children.splice(i, 1);
              }
            });

            var ids = getIdArray(children);
            $http.defaults.headers.common.Authorization = 'Client-ID 8c83be9ff273b18';
            getAllLinks(ids).then(function(images) {
              $scope.imgur = formatPics(images);
            }).catch(function(error) {
              console.error('error', error);
            });
          }).catch(function(error) {
            console.error('error', error);
          });
        }

        function getAllLinks(ids) {
          var promises = ids.map(function(id) {
            return $http.get('https://api.imgur.com/3/image/' + id);
            console.log(id);
          });
          return $q.all(promises);
        }

        function getIdArray(redditPosts) {
          var idArray = [];

          redditPosts.forEach(function(post, i) {
            var link = post.data.url;
            var slash = link.indexOf('/', 12);
            var dot = link.indexOf('.', slash);
            var id = (dot > 0 ? link.slice(slash + 1, dot) : link.slice(slash + 1));

            if (id.length > 8) {
              redditPosts.splice(i, 1);
            } else {
              idArray.push(id);
            }
          });

          $scope.reddit = redditPosts;
          return idArray;
        }

        function formatPics(images) {
          images.forEach(function(image, i) {
            var imageData = image.data.data;
            var link = imageData.link;
            var dot = link.indexOf('.', 20);
            var size = randomSize();

            imageData.thumb = [link.slice(0, dot), size, link.slice(dot)].join('');
            imageData.redditThumb = $scope.reddit[i].data.thumbnail;
            imageData.span = getSpan(size);
            imageData.permalink = $scope.reddit[i].data.permalink;
            imageData.title = $scope.reddit[i].data.title;
          });
          return images;
        }


        function randomSize() {
          return Math.random() < 0.8 ? 's' : 'b';
        }

        function getSpan(size) {
          return size == 's' ? 1 : 2;
        }
  }
})(angular);