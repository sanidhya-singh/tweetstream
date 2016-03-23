var heatmap;
var liveTweets;
var globalMap;
var image = '/images/favicon.png'
function ObjectId(hexString) { return new Mongo.ObjectID(hexString); };
var beachMarker = [];
var marker;

Template.maps.events({
  'change .screen-name': function() {
     $('#search-input').toggleClass('loading');
     console.log($('#search-input-box').val());
     var resultsCheck = false;
     Meteor.call('getUserTweets', $('#search-input-box').val(), function(error, result) {
       liveTweets.clear();
       console.log(result);
       $('#search-input').toggleClass('loading');
       for(i=0; i<result.length; i++) {
         if(result[i].coordinates && result[i].coordinates !== null) {
           resultsCheck = true;
           var tweetLocation = new google.maps.LatLng(result[i].coordinates.coordinates[1], result[i].coordinates.coordinates[0]);
           liveTweets.push(tweetLocation);
         }
       }
       if(resultsCheck !== true) {
        alert('Looks like this user has turned off Tweet Geo-tagging');
       }
     });
  },
  'click .instagram-login': function(e) {
    e.preventDefault();
    Meteor.loginWithInstagram(function (err, res) {
          if (err !== undefined)
            console.log('sucess ' + res)
          else
            console.log('login failed ' + err)
    });
  }
});

Template.maps.helpers({
  exampleMapOptions: function() {
    var style = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}]
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(28.6139, 77.2090),
        zoom: 3,
        styles: style
      };
    }
  },
  tweets: function() {
    return Tweets.find();
  },
  tweetcount: function() {
    return TweetCount.find();
  },
  placeHeat: function(data) {
     var tweetLocation = new google.maps.LatLng(data.coordinates[1], data.coordinates[0]);
     liveTweets.push(tweetLocation);
    document.getElementById('tweet-count').innerHTML = Tweets.find().count();
  },
  increaseTweetCount: function() {
    var tweetCount = TweetCount.findOne({_count: 0});
    document.getElementById('world-tweet-count').innerHTML = tweetCount.count;
  },
  mapLoaded: function() {
    return Session.get('mapLoaded');
  }
});

Template.maps.onCreated(function() {
  Session.set('mapLoaded', false);
  GoogleMaps.ready('exampleMap', function(map) {
    liveTweets = new google.maps.MVCArray();
    heatmap = new google.maps.visualization.HeatmapLayer({
      data: liveTweets,
      radius: 25
    });
    heatmap.setMap(map.instance);
    globalMap = map.instance;
    Session.set('mapLoaded', true);
    $('#dimmer').toggleClass('active');
    globalMap.addListener('idle', function(e) {
       var bounds = globalMap.getBounds();
       var ne = bounds.getNorthEast();
       var sw = bounds.getSouthWest();
    });
    $(function () {
        $("#map_canvas").css("height", $(window).height());
    });
    marker = new google.maps.Marker({
              position: {lat:28.6139, lng: 77.2090},
              map: globalMap,
              draggable: true,
              icon:  {
                    url: "\images\favicon.png",
                    scaledSize: new google.maps.Size(72, 72) // pixels
              }
            });
            google.maps.event.addListener(marker, 'dragend', function(event){
               console.log(event.latLng.lat());
               console.log(event.latLng.lng());
              Meteor.call('fetchTweets', event.latLng.lat(), event.latLng.lng(), function(error, result) {
                console.log(result);
                placeTweetMarkers(result.statuses);
              })
            });
  });
});


function placeTweetMarkers(statuses) {
  var infoWindow = new google.maps.InfoWindow();
  for(i=0; i<statuses.length; i++) {
    var data = statuses[i];
    if(statuses[i].geo && statuses[i].geo !== null) {
    var tweetMarker = new google.maps.Marker({
              position: {lat: statuses[i].geo.coordinates[0], lng: statuses[i].geo.coordinates[1]},
              map: globalMap,
              icon: statuses[i].user.profile_image_url
            });
     (function (tweetMarker, data) {
    google.maps.event.addListener(tweetMarker, "click", function (e) {
                    infoWindow.setContent("<div style = 'width:200px;min-height:40px'><strong>" + data.text + "</strong><p>" + data.user.screen_name + " on " + data.created_at + "</p></div>");
                    infoWindow.open(globalMap, tweetMarker);
                });
       })(tweetMarker, data);
  }
  }
}