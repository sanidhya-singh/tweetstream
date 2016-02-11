if (Meteor.isClient) {
  Meteor.subscribe("tweets");
  Template.body.events({
    'change .search': function(e) {
      e.preventDefault();
      Meteor.call('removeAllTweets');
      var keyword = $('#search').val();
      Meteor.call('streamTweets', $('#search').val());
      location.reload();
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
