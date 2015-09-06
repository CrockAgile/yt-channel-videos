# yt-channel-videos
Retrieve snippet data for all of a channel's videos

## Install
npm install -S yt-channel-videos

## Example
```javascript
var channelVids = require('yt-channel-videos')('YOUTUBE-API-KEY-HERE');

channelVids.allPlaylistPages('PLAYLIST-ID-HERE')
.then(function(res) {
  console.log(res); // { videoCount: X, pageCount: X, items: [...] }
}).catch(function(err) {
  throw err;
});
```

## License
MIT
