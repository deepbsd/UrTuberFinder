var YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
var YOUTUBE_BASE_URL1 = 'https://www.googleapis.com/youtube/v3/channels';

function getChannelsList(searchTerm, callback) {
  var settings = {
    url: YOUTUBE_BASE_URL,
    data: {
      part: 'contentDetails',
      maxResults: 15,
      order: 'rating',
      regionCode: 'US',
      relevanceLanguage: 'en',
      type: 'channel',
      key: 'AIzaSyA_MlA_Pv1yElF8PY9hy_Ak6Mmr6g2xltY',
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

function getDataFromApi(searchTerm, callback) {
  var settings = {
    url: YOUTUBE_BASE_URL,
    data: {
      part: 'snippet',
      maxResults: 15,
      order: 'rating',
      regionCode: 'US',
      relevanceLanguage: 'en',
      type: 'video',
      key: 'AIzaSyA_MlA_Pv1yElF8PY9hy_Ak6Mmr6g2xltY',
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
        resultElement += '<div class="video-box"><figure><a href="http://www.youtube.com/watch?v='+item.id.videoId+'"><img src="'+item.snippet.thumbnails.medium.url+'"/><figcaption class="caption" style="width:350px">'+item.snippet.description+'</figcaption></a></figure></div>';
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
    getDataFromApi(query, displayYouTubeSearchData);
    //getChannelsList(query, displayYouTubeSearchData);
  });
}

$(function(){watchSubmit();});
