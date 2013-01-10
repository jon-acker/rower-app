var Rower = (function(){
    var _watchId = 0;
    var _accelerometer = null;
    
    return {
        start: function() {
            
            Rower.Metronome.start(30, new Rower.Sound('metro', 'js/metronome.mp3'));
            
            setTimeout(function() {
                Rower.Metronome.setSpeed(45); 
            }, 10000);
            
            //_accelerometer = new Rower.AccelerometerPlayback(Rower.Datastream.sampleInterval);
            _accelerometer = new Rower.Accelerometer(Rower.Datastream.sampleInterval);
            _accelerometer.start();
            Rower.UI.start();
            Rower.Datastream.start();
            Rower.Detector.start();
        },
        
        stop: function() {
            _accelerometer.stop();
        },
        
        getWatchId: function() {
            return _accelerometer.getId();
        },
        
        setAccelerometer: function(a) {
            _accelerometer = a;
        },
        
        getAccelerometer: function() {
            return _accelerometer;
        }
    }
    
})();

