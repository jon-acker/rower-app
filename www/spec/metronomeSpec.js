    
// replace phonegap LowLatencyAudio plugin with stubs
LowLatencyAudio = {
    preloadFX: function(){},
    play: function(){}
};


var speed = 30;
var interval = (speed* 1000)/60; 

var mockSound = jasmine.createSpyObj('mockSound', ['play']);
var onMetronomePulse = jasmine.createSpy('onMetronomePulse');

$(document).on('metronomePulse', function(event, data) {
    onMetronomePulse();
});



describe ('metronome start()', function() {

    
    it ('should trigger a metronomePulse event', function() {
        runs(function() {
            var sound = null
            Rower.Metronome.start(speed, sound);
        })
        
        waitsFor(function() {
            return (onMetronomePulse.calls.length > 1);
        });
        
        runs(function() {
            expect(onMetronomePulse).toHaveBeenCalled();
        });        
       
    });
    
    
    it ('should play its sound on every pulse', function() {
        runs(function() {
            Rower.Metronome.start(speed, mockSound);
        })
        
        waitsFor(function() {
            return (mockSound.play.calls.length > 0);
        });
        
        runs(function() {
            expect(mockSound.play).toHaveBeenCalled();
        });        
       
    });    
    
});


describe('metronome setSpeed()', function() {
    var _startTime;
    
    it ('should set a new speed', function() {
        
        runs(function() {
            onMetronomePulse.reset();
            _startTime = (new Date()).getTime();
            Rower.Metronome.start(speed);
        })
        
        waitsFor(function() {
            return (onMetronomePulse.calls.length >= 4);
        });
        
        runs(function() {
            var _totalTime =  Math.round(((new Date()).getTime() - _startTime) / 100);
            var _expectedTimeLapsed = 40 /* tenths of seconds */;
            
            expect(_totalTime).toBe(_expectedTimeLapsed );
        });   
        
    });
    
    it ('should emit more frequent events if speeded up', function() {
        
        runs(function() {
            onMetronomePulse.reset();
            _startTime = (new Date()).getTime();
            Rower.Metronome.start(0);
            Rower.Metronome.setSpeed(60);
        })
        
        waitsFor(function() {
            return (onMetronomePulse.calls.length >= 4);
        });
        
        runs(function() {
            
            var _totalTime =  Math.round(((new Date()).getTime() - _startTime) / 100);
            var _expectedTimeLapsed = 10; /* tenths of seconds */
            
            expect(_totalTime).toBe(_expectedTimeLapsed);
        });   
        
    });
    
    
    it ('should emit less frequent events if slowed down', function() {
        
        runs(function() {
            onMetronomePulse.reset();
            _startTime = (new Date()).getTime();
            Rower.Metronome.start(60)
            
            setTimeout(function() {
                Rower.Metronome.setSpeed(20);
            }, Rower.Metronome.getInterval()-10);
        })
        
        waitsFor(function() {
            return (onMetronomePulse.calls.length >= 4);
        });
        
        runs(function() {
            
            var _totalTime =  Math.round(((new Date()).getTime() - _startTime) / 100);
            var _expectedTimeLapsed = 30; /* tenths of seconds */
            
            expect(_totalTime).toBe(_expectedTimeLapsed);
        });   
        
    });    
})