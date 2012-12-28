var datastream = {};

datastream.filter = function(_sampleInterval, cutoff) {
    
    var _prevData = {x: 0, y: 0, z: 0};
    var _dt = _sampleInterval / 1000;
    var _alpha = _dt / (cutoff + _dt);
   
    function _filter(data, type) {

        var newAx = _prevData.x + _alpha * (data.x - _prevData.x);
        var newAy = _prevData.y + _alpha * (data.y - _prevData.y);
        var newAz = _prevData.z + _alpha * (data.z - _prevData.z);
        
        _prevData.x = data.x;
        _prevData.y = data.y;
        _prevData.z = data.z;
        
        if (type == 'HIGHPASS') {
            newAx = data.x - newAx;
            newAy = data.y - newAy;
            newAz = data.z - newAz;
        }


        data.x = newAx;
        data.y = newAy;
        data.z = newAz;      
    }
   
    this.lowPass = function(data, cutoff) {
        _filter(data, 'LOWPASS');
    }
        
    this.highPass = function(data, cutoff) {
        _filter(data, 'HIGHPASS');
        
    }
   
};