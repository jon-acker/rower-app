Rower.Accelerometer = function(_sampleInterval) {
    var _watchId;
    
    var options = { 
        frequency: _sampleInterval
    };
            
            //datastream.read();
            //datastream.remove();

    this.start = function() {
        _watchId = navigator.accelerometer.watchAcceleration(function(accelRaw) {
            $(document).trigger('accelDataReceived', accelRaw);

            //record
            //datastream.record(accelRaw);
        }, function() {}, options);             

    }
    
    this.stop = function() {
        navigator.accelerometer.clearWatch(_watchId);
    }
    
    this.getId = function() {
        return _watchId;
    }

};