Meteor.methods({
  'removeAllTweets': function() {
    Tweets.remove({});
  },
  'streamTweets': function(keyword) {
    var stream = T.stream('statuses/filter', { track: keyword })
    stream.on('tweet', Meteor.bindEnvironment(function (tweet) {
      //console.log(tweet);
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
    }))
  }
});
