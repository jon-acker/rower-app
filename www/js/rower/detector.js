/**
 * Detect and keep track of rowing states
 * 
 */
Rower.Detector = {};

Rower.Detector.start = function () {
    var _threshold = 0.8;
    var _accelThresholdState = 'THRSH_BELOW';
    
    var _accelSum = 0;
    var _shakeThreshold = 8;
    var _backwardsAccelSumThreshold = -5.5;
    var _forwardsAccelSumThreshold = 5;
    var _accelSumThresholdOver = false;
    var _numStrokes = 0;
    var _startTime = 0;
    var _spm = 0;
    var _movingAvg = 0;
    var _buffer = [];
    
    function _reset() {
        _accelSum = 0;
        _accelSumThresholdOver = false;        
    }
    
    function _getAvg(data) {
        var sum = data.reduce(function(p,c){return p+c});
        return (sum / data.length);
    }
    
    /**
     * @event accelDataProcessed
     * @param {object} event
     * @param {object} accel
     */
    $(document).on('accelDataProcessed', function(event, accel) {
        
        if (Math.abs(accel.c) > _shakeThreshold) {

            $(document).trigger('shakeDetected') ;
            //console.log('shake!');
            //_accelSum = 0;
            //_accelSumThresholdOver = false;  
            return;
            
        } 
        
        if ((accel.c <= -_threshold) && (_accelThresholdState != 'THRSH_OVER_NEGATIVE')) {

            _accelThresholdState = 'THRSH_OVER_NEGATIVE';
            //console.log(_accelThresholdState);
            _accelSum = 0;
            _accelSumThresholdOver = false;
            
            

        } else if ((accel.c >= _threshold) && (_accelThresholdState != 'THRSH_OVER_POSITIVE')) {

            _accelThresholdState = 'THRSH_OVER_POSITIVE';

            _accelSum = 0;
            _accelSumThresholdOver = false;  

        } 
        
        if ((_accelThresholdState == 'THRSH_OVER_NEGATIVE')) {
            
            _accelSum += accel.c;
            //console.log('over! - summing '+_accelSum);
          
            if ((_accelSum < _backwardsAccelSumThreshold) && (_accelSumThresholdOver === false)) {
                // update SPM
                _numStrokes++;
                _movingAvg = _numStrokes * 60000 / ((new Date()).getTime() - _startTime) ;
                
                _accelSum = 0;
                _accelSumThresholdOver = true;
                
                if (_buffer.length >= 10) {
                    _buffer.shift();
                }
                
                _buffer.push(accel);
                
                if (_buffer.length >= 1) {
                    var timeDiff = _buffer[_buffer.length-1].timestamp - _buffer[0].timestamp;
                    _spm = (10 * 60000) / timeDiff;
                }

                    
                
                $(document).trigger('backwardsRowingDetected', _spm);
            }

        } 

        if ((_accelThresholdState != 'THRSH_BELOW') && (accel.c > -_threshold) && (accel.c < _threshold)) {

            _accelThresholdState = 'THRSH_BELOW';
            
        }          
        
        if (_numStrokes === 1) {
            // start timer;
            _startTime = (new Date()).getTime();
        }
    });
    
    return {
        
        /**
         * @return {string} _accelThresholdState 
         */
        getState: function() {
            return _accelThresholdState;
        }
    }
 
};
