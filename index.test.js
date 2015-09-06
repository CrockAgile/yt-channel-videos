var chai = require('chai');
var channelVids = require('./index');
var config = require('./config.json');
var expect = chai.expect;
var assert = chai.assert;

describe('yt-channel-videos', function() {
  it('should get channel playlistId', function() {
    expect(true).to.be.true;
  });
  it('should be a function', function() {
    expect(channelVids).to.be.instanceof(Function);
  });
  it('should have key as string', function() {
    assert.isString(config.key);
  });
  it('should throw error when key unprovided', function() {
    expect(channelVids).to.throw(Error);
  });
  it('should not throw error when key provided', function() {
    expect(channelVids.bind(null,config.key)).to.not.throw(Error);
  });

  describe('channelVidsPlaylistId', function() {
    var playlistPromise;
    beforeEach(function() {
      playlistPromise = channelVids(config.key).channelPlaylistId('xpantherx');
    });
    it('should be a Promise', function() {
      expect(playlistPromise).to.be.instanceof(Promise);
    });
    it('should resolve to playlistId string', function() {
      return playlistPromise.then(function(res) {
        assert.isString(res);
      });
    });
    it('should error if no such channel', function() {
      var invalidChannel = channelVids(config.key).channelPlaylistId('!@#$%');
      return invalidChannel.catch(function(err) {
        expect(err).to.be.instanceof(Error);
      });
    });
  });

  describe('playlistPage', function() {
    //var playlistId = 'UUZsM8MOy0VC9blj_wBkbo-g'; // purgegamers uploads
    var playlistId = 'UUr5F2ScU7YbLnDRHw0-KtSQ'; // xpantherx uploads
    var chan = channelVids(config.key);
    var pagePromise;
    beforeEach(function() {
      pagePromise = chan.playlistPage(playlistId);
    });
    it('should be a Promise', function() {
      expect(pagePromise).to.be.instanceof(Promise);
    });
    it('should resolve to a playlist page response', function() {
      return pagePromise.then(function(res) {
        expect(res).to.have.property('items');
        expect(res).to.have.property('pageToken');
      });
    });
    it('should receive 50 items per page by default', function() {
      return pagePromise.then(function(res) {
        expect(res.items).to.have.length(50);
      });
    });
  });

  describe('allPlaylistPages', function() {
    //var playlistId = 'UUZsM8MOy0VC9blj_wBkbo-g'; // purgegamers uploads
    var playlistId = 'UUr5F2ScU7YbLnDRHw0-KtSQ'; // xpantherx uploads
    var chan = channelVids(config.key);
    var allPagePromise;
    beforeEach(function() {
      allPagePromise = chan.allPlaylistPages(playlistId);
    });
    it('should be a Promise', function() {
      expect(allPagePromise).to.be.instanceof(Promise);
    });
    it('should resolve to all playlist pages', function() {
      this.timeout(60000);
      return allPagePromise.then(function(res) {
        expect(res).to.have.property('pageCount');
        expect(res.videoCount).to.be.closeTo(res.pageCount * 50, 50);
      });
    });
  });

  describe('allUplods', function() {
    var uploadsPromise;
    beforeEach(function() {
      uploadsPromise = channelVids(config.key).allUploads('xpantherx');
    });
    it('should return all uploads', function() {
      this.timeout(30000);
      return uploadsPromise.then(function(res) {
        expect(res).to.have.property('pageCount');
        expect(res).to.have.property('videoCount');
        expect(res).to.have.property('items');
        expect(res.videoCount).to.be.closeTo(res.pageCount*50, 50);
      });
    });
  });
});
