if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load({libraries: 'visualization'});
  });  
  Meteor.subscribe("tweets");
  Meteor.subscribe("tweetcount");
  Template.body.events({
    'change .search': function(e) {
      e.preventDefault();
      $('#search-div').toggleClass('loading');
      Meteor.call('removeAllTweets');
      var keyword = $('#search').val();
      Meteor.call('streamTweets', $('#search').val(), function(res) {
        console.log('function returned');
        $('#search-div').toggleClass('loading');
      });
    },
    'click .maps-button': function(e) {
      e.preventDefault();
      Meteor.call('streamTweets', 'keyword', function(res) {
        console.log('function returned');
        $('#search-div').toggleClass('loading');
      });
    }
  });
  Template.body.onCreated(function() {
    this.maps = new ReactiveVar(false);

  })
  Template.body.helpers({
   checkMapsToggle: function() {
     return Template.instance().maps.get();
   },
   mapsLoaded: function() {
     if(Template.instance().maps.get())
       return 'green';
     return 'red';
   }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    /*var stream = T.stream('statuses/filter', { track: 'paris' })
    stream.on('tweet', Meteor.bindEnvironment(function (tweet) {
      var userName = tweet.user.name;
      var userScreenName = tweet.user.screen_name;
      var userTweet = tweet.text;
      var tweetDate = tweet.created_at;
      var profileImg = tweet.user.profile_image_url;
      if(Tweets.find().count() < 50) {
        Tweets.insert({user: userName, userscreen: userScreenName, tweet: userTweet, picture: profileImg, date: tweetDate}, function(error){
          if(error)
          console.log(error);
        });
      }
    }))*/
  });
}
