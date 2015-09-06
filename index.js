var yt = require('googleapis').youtube('v3');
var EventEmitter = require('events').EventEmitter;

module.exports = channelVideos;


/*
 * Initialize channel videos object with API key
 *
 * @param {String} key
 * @return {Object} channelVideos object
 */
function channelVideos(key) {
  if (!key) throw new Error('Please initialize with a YouTube API key');
  return {
    channelPlaylistId: channelPlaylistId,
    playlistPage: playlistPage,
    allPlaylistPages: allPlaylistPages,
    allUploads: allUploads
  };


  /*
   * Make Promise for the playlistId of uploads for specified channel
   *
   * @param {String} channel
   * @return {Promise} Promise for playlistId
   */
  function channelPlaylistId(channel) {
    return new Promise(function(resolve, reject) {
      var options = {
        part: 'contentDetails',
        forUsername: channel,
        auth: key
      };
      yt.channels.list(options,function(err, data) {
        if (err) reject(err);
        if (data.items.length === 0) return reject(Error('Channel has no uploads'));
        resolve(data.items[0].contentDetails.relatedPlaylists.uploads);
      });
    });
  }


  /*
   * Make Promise for a page of video snippets from a playlist
   *
   * @param {String} playlistId
   * @param {String} pageToken
   * @param {Number} max (optional)
   * @return {Promise} Promise for one page of video snippets from playlist
   */
  function playlistPage(playlistId, pageToken, max) {
    var options = {
      part: 'snippet',
      playlistId: playlistId,
      auth: key
    };
    if (max) {
      options.maxResults = max;
    }
    else {
      options.maxResults = 50;
    }
    if (pageToken) {
      options.pageToken = pageToken;
    }
    return new Promise(function(resolve, reject) {
      yt.playlistItems.list(options, function(err, data) {
        if (err) reject(err);
        resolve({
          pageToken: data.nextPageToken,
          items: data.items
        });
      });
    });
  }


  /*
   * Make Promise for all video snippets from given playlist
   *
   * @param {String} playlistId
   * @return {Promise} Promise for object of all video snippets
   */
  function allPlaylistPages(playlistId) {
    return new Promise(function(resolve, reject) {
      var emitter = new EventEmitter();
      var allPages = {
        videoCount: 0,
        pageCount: 0,
        items: []
      };
      emitter.on('nextPage', function(token) {
        playlistPage(playlistId,token).then(function(res) {
          allPages.pageCount++;
          allPages.videoCount += res.items.length;
          allPages.items = allPages.items.concat(res.items);
          if (res.pageToken) {
            emitter.emit('nextPage', res.pageToken);
          }
          else {
            resolve(allPages);
          }
        }).catch(function(err) { reject(err); });
      });
      emitter.emit('nextPage');
    });
  }

  function allUploads(channel) {
    return new Promise(function(resolve, reject) {
      channelPlaylistId(channel)
      .then(function(res) {
        return allPlaylistPages(res);
      }).then(function(res) {
        resolve(res);
      });
    });
  }
}

