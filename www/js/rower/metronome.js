Rower.Metronome = (function() {
  
    var _sound;
    var _speed; // SPM
    
    var _interval; 
    var _timeoutId;
    var _lastTimestamp;
    
    return {
        start: function(speed, sound) {
            this.setSpeed(speed);
            _sound = sound;
            
            _lastTimestamp = (new Date()).getTime();
            function run() {

                var now = (new Date()).getTime();

                if( now - _lastTimestamp >= _interval ) {
                    _lastTimestamp = now;

                    if (_sound) {
                        _sound.play();
                    }                     

                    $(document).trigger('metronomePulse');
                }

                setTimeout(run, 10);
            };
            run();

        },
        
        setSpeed: function(speed) {
            _speed = speed;
            _interval = ((60 * 1000) / speed) ;
           // console.log('set speed to: '+speed);
        },
        
        getInterval: function() {
            return _interval;
        },
        
        getLastTimestamp: function() {
            return _lastTimestamp;
        }
        
        
        
        
    }
    
})();