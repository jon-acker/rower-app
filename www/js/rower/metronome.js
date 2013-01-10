Rower.Metronome = (function() {
  
    var _sound;
    var _speed; // SPM
    
    var _interval; 
    var _timeoutId;
    
    return {
        start: function(speed, sound) {
            this.setSpeed(speed);
            _sound = sound;
            
            var timestamp = (new Date()).getTime();
            function run() {

                var now = (new Date()).getTime();

                if( now - timestamp >= _interval ) {
                    timestamp = now;

                    if (_sound) {
                        _sound.play();
                    }                     
                    
                    $(document).trigger('metronomePulse');
                }

                setTimeout(run, 10);
            }
            run();            
            
        },
        
        setSpeed: function(speed) {
            _speed = speed;
            _interval = ((60 * 1000) / speed) ;
            console.log('set speed to: '+speed);
        },
        
        getInterval: function() {
            return _interval;
        },
        
        rampUp: function(to) {
            
        }
        
        
        
        
    }
    
})();