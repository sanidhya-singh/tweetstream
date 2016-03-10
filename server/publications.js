Meteor.publish('tweets', function() {
 return Tweets.find();
});

Meteor.publish('tweetcount', function() {
  return TweetCount.find();
})