Meteor.methods({
  'fetchTweets': function(lat, lng) {
    Future = Npm.require('fibers/future');
    var myFuture = new Future();
    T.get('search/tweets', {q: 's', geocode: lat + ',' + lng + ',1mi'}, function(err, data, response) {
      myFuture.return(data);
    })
    return myFuture.wait();
  },
  'fetchPlaceID': function(lat, lng) {
    Future = Npm.require('fibers/future');
    var myFuture = new Future();
    T.get('geo/reverse_geocode', {lat: lat, long: lng}, function(err, data, response) {
      myFuture.return(data);
    })
    return myFuture.wait();
  },
  'getUserTweets': function(screenName) {
    Future = Npm.require('fibers/future');
    var myFuture = new Future();
    T.get('statuses/user_timeline', {screen_name: screenName, count: 200}, function(err, data, response) {
      myFuture.return(data);
    })
    return myFuture.wait();
  },
  'removeAllTweets': function() {
    Tweets.remove({});
  },
  'streamTweets': function(keyword) {
    var stream = T.stream('statuses/filter', {locations:'67,7,97,37'})
    stream.on('tweet', Meteor.bindEnvironment(function (tweet) {
       if (tweet.coordinates){
                if (tweet.coordinates !== null){
                  if(Tweets.find().count() < 250000) {
                    Tweets.insert(tweet.coordinates, function(error){
                      if(error) {
                        console.log(error);
                        return null;
                      } else {
                        return true;
                      }
                    });
                  }
            }
       }
    var tweetCountStream = T.stream('statuses/filter', {locations: '-180,-90,180,90'})
    tweetCountStream.on('tweet', Meteor.bindEnvironment(function(tweet) {
      TweetCount.update({_count: 0}, {$inc: {count: 1}});
    }));

    }));
  }
});

/*var options = { tagName: 'cool dude' };
InstagramFetcher.fetchImages.fromTag(options, function ( images, pagination ) {
    // images is a collection of the found images
    console.log( images );
    // The pagination object contains id's used for pagination. See below!
    //console.log( pagination );
});*/

