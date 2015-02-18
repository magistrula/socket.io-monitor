var expect = require('chai').expect;
var MessageCounter = require('../MessageCounter');

describe('MessageCounter', function(){
  beforeEach(function(){
    this.messageCounter = new MessageCounter();
  });

  it('starts with empty inbound & outbound counters', function(){
    var expected = {
      inbound: {},
      outbound: {}
    }
    expect(this.messageCounter.data).to.eql(expected);
  })

  describe('inbound messages', function(){
    it('increments inbound messages with event names', function(){
      var expected = {
        'message_type' : {
          'event_name' : 2
        }
      }

      this.messageCounter.incrementInbound('message_type', 'event_name');
      this.messageCounter.incrementInbound('message_type', 'event_name');

      expect(this.messageCounter.data.inbound).to.eql(expected);
    })

    it('increments inbound messages without event names', function(){
      var expected = {
        'message_type' : 2
      }

      this.messageCounter.incrementInbound('message_type');
      this.messageCounter.incrementInbound('message_type');

      expect(this.messageCounter.data.inbound).to.eql(expected);
    });
  });

  describe('outbound messages', function(){
    it('increments outbound messages with event names', function(){
      var expected = {
        'message_type' : {
          'event_name' : 2
        }
      }

      this.messageCounter.incrementOutbound('message_type', 'event_name');
      this.messageCounter.incrementOutbound('message_type', 'event_name');

      expect(this.messageCounter.data.outbound).to.eql(expected);
    })

    it('increments outbound messages without event names', function(){
      var expected = {
        'message_type' : 2
      }

      this.messageCounter.incrementOutbound('message_type');
      this.messageCounter.incrementOutbound('message_type');

      expect(this.messageCounter.data.outbound).to.eql(expected);
    });
  });
});