var YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search.list';
var YOUTUBE_BASE_URL1 = 'https://www.googleapis.com/youtube/v3/channels.list';
var YOUTUBE_BASE_URL2 = 'https://gdata.youtube.com/feeds/api/standardfeeds/mostPopular';
var API_KEY = 'AIzaSyA_MlA_Pv1yElF8PY9hy_Ak6Mmr6g2xltY';

function getChannelsList(searchTerm, callback) {
  var settings = {
    url: YOUTUBE_BASE_URL,
    data: {
      part: 'snippet',
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
    getMostPopularVideos(query, displayYouTubeSearchData);
    //getChannelsList(query, displayYouTubeSearchData);
  });
}

$(function(){watchSubmit();});
