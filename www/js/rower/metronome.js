Rower.Metronome = (function() {
  
    /**
     * Sound object which can be injected
     *
     * @var {object} _sound
     */
    var _sound;
    
    
    var _speed; // SPM
    
    var _interval = 500; // default
    var _animInterval = Math.round(_interval/12); //
    var _timeoutId;
    var _lastTimestamp;
    var _lastAnimTimestamp;
    
    return {
        
        /**
         * Start the metronome loop
         *
         * @param {int} speed
         * @param {object} sound
         */
        start: function(speed, sound) {
            this.setSpeed(speed);
            _sound = sound;
            
            _lastAnimTimestamp = _lastTimestamp = (new Date()).getTime();
            
            (function _run() {

                var now = (new Date()).getTime();
                
                if (now - _lastAnimTimestamp >= _animInterval) {
                    _lastAnimTimestamp = now;
                    $(document).trigger('metronomeAnimationPulse');
                }

                if (now - _lastTimestamp >= _interval) {
                    _lastTimestamp = now;
                    $(document).trigger('metronomePulse');
                    _sound && _sound.play();
                }

                setTimeout(_run, 10);
            })();

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