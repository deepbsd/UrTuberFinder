/*
var YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
var YOUTUBE_BASE_URL1 = 'https://www.googleapis.com/youtube/v3/channels';
var YOUTUBE_BASE_URL2 = 'https://gdata.youtube.com/feeds/api/standardfeeds/mostPopular';
*/

var YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';
var API_KEY = 'AIzaSyA_MlA_Pv1yElF8PY9hy_Ak6Mmr6g2xltY';

//Accept a YouTube endpoint and some URL parameters (a key-value object)
//and return a pre-formatted string to be used as a target for an HTTP request.
function youTubeRequest(endpoint, parameters) {
  parameters = Object.assign({}, {key: API_KEY}, parameters)
  parameters = Object.keys(parameters)
    .map(function (key) {
      return key + '=' + parameters[key]
    })
    .join('&')

  var url = '@baseurl/@endpoint?@parameters'
    .replace('@baseurl', YOUTUBE_BASE_URL)
    .replace('@endpoint', endpoint)
    .replace('@parameters', parameters)
  console.log({url: url})

  return jQuery.get(url, {dataType: 'json'})

}  // End of youTubeRequest()


// Once we have the list of content providers, we use this function to
// return their top videos
function getUserVideos(username) {
  return youTubeRequest('channels', {      // should this be 'channels' or 'videos'?
    part: 'snippet',
    forUsername: username
  })
    .then(function(payload) {
      if (payload.items.length <= 0) {
        throw new Error('YouTube Data API does not return any videos for the given username')
      }

      return jQuery.get(youTubeRequest('search', {
        channelId: payload.items[0].id,
        type: 'video',           
        part: 'snippet',
        maxResults: 50
      }), {
        dataType: 'json'
      })
    })
      .then(function(payload) {
        if (payload.items.length <= 0) {
          throw new Error('YouTube Data API did return any videos for the given channel')
        }

        var videoPromises = payload.items.map(function(video) {
          return jQuery.get(youTubeRequest('videos', {
            id: video.id.videoId,
            part: 'contentDetails,statistics'
          }), {
            dataType: 'json'
          })
        })

        return Promise.all(videoPromises)
      })
        .then(function(videos) {
          console.log("Wow! Too much work to get those videos:", videos)
        })
        .catch(function(e) {
          console.log('Something went wrong:', e)
        })
}  // End of getUserVideos()


// This function finds the best channels for a user-specified query string
function queryBestRatedChannelsFor(q) {
  youTubeRequest('search', {
    type: 'channel',
    part: 'snippet',
    q: q,
    order: 'rating',
    maxResults: 50
  })
    .then(function(payload) {
      console.log('queryBestRatedChannelsFor', payload)
      displayYouTubeSearchData(payload)
    })
    .catch(function(e) {
      console.log('Error: ', e)
    })
}  // End of queryBestRatedChannelsFor()



/*
// Not sure if I want to use this function again...
function getChannelsList(searchTerm, callback) {
  var settings = {
    url: YOUTUBE_BASE_URL1,
    data: {
      part: 'snippet',
      managedByMe: false,
      domain: 'global',
      maxResults: 15,
      order: 'rating',
      regionCode: 'US',
      relevanceLanguage: 'en',
      type: 'channel',
      key: API_KEY,
      publishedAfter: '2016-01-01T00:00:00.00Z',
      q: searchTerm,
      r: 'json',
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);
}

function getMostPopularVideos(searchTerm, callback) {
  var settings = {
    url: YOUTUBE_BASE_URL2,
    data: {
      part: 'snippet',
      chart: 'mostPopular',
      maxResults: 15,
      //order: 'rating',
      regionCode: 'US',
      relevanceLanguage: 'en',
      type: 'video',
      key: API_KEY,
      publishedAfter: '2016-01-01T00:00:00.00Z',
      q: searchTerm,
      r: 'json',
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);
}
*/

function displayYouTubeSearchData(data) {
  var resultElement = '<h2>Results for '+data.items[0].snippet.channelTitle+'</h2>';
  console.log('Here\'s the object: '+JSON.stringify(data));

  if (data.items) {
    data.items.forEach(function(item) {
      try {
        // One is for channels, the other for videos
        //resultElement += '<div class="video-box"><figure><a href="http://www.youtube.com/channel/'+item.id.channelId+'"><img src="'+item.snippet.thumbnails.medium.url+'"/><figcaption class="caption" style="width:350px">'+item.snippet.description+'</figcaption></a></figure></div>';
        resultElement += '<div class="video-box"><figure><a href="http://www.youtube.com/channel/'+item.id.channelId+'"><img src="'+item.snippet.thumbnails.medium.url+'"/><figcaption class="caption" style="width:350px">'+item.snippet.description+'</figcaption></a></figure></div>';
      } catch (e) {
        console.log('Error: '+e);
      }
    });
  }
  else {
    resultElement += '<p>No results</p>';
  }
  
  $('.js-search-results').html(resultElement);
}

function watchSubmit() {
  $('.js-search-form').submit(function(e) {
    e.preventDefault();
    var query = $(this).find('.js-query').val();
    console.log('Query string: '+query);
    //getMostPopularVideos(query, displayYouTubeSearchData);
    //getChannelsList(query, displayYouTubeSearchData);
    queryBestRatedChannelsFor(query)
  });
}

$(function(){watchSubmit();});
