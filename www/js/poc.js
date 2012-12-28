var poc = (function(){
    
    var _graph = new SmoothieChart();
    var _accelX = new TimeSeries({resetBounds: true});
    var _accelY = new TimeSeries({resetBounds: true});
    var _accelZ = new TimeSeries({resetBounds: false});
    
    var _sampleInterval = 100; // sample every x milliseconds
    var _accelIsOverThreshold = false;
    var _threshold = 1.4;
    var _rowCount = 0;
    var _filterH = new datastream.filter(_sampleInterval, 0.8);
    var _filterL = new datastream.filter(_sampleInterval, 0.03);
    
    _graph.streamTo(document.getElementById("graph"));
    _graph.addTimeSeries(_accelX, { strokeStyle:'rgb(0, 255, 0)', fillStyle:'rgba(0, 255, 0, 0.4)', lineWidth: 2 });
    _graph.addTimeSeries(_accelY, { strokeStyle:'rgb(255, 0, 255)', fillStyle:'rgba(255, 0, 255, 0.3)', lineWidth:2 });
    _graph.addTimeSeries(_accelZ, { strokeStyle:'rgb(0, 0, 255)', fillStyle:'rgba(0, 0, 255, 0.3)', lineWidth:2 });

    return {
        start: function() {
            var options = { 
            	frequency: _sampleInterval
            };

            navigator.accelerometer.watchAcceleration(function(accel) {
                        
                _filterH.highPass(accel);                           
                _filterL.lowPass(accel);

                if (!_accelIsOverThreshold && (accel.z >= _threshold)) {
                    _rowCount++;
                    console.log('--> accel over thresh ' + accel.z + ' ' + _rowCount);
                    $('#status').fadeIn(200).delay(200).fadeOut(200);
                    _accelIsOverThreshold = true;


                } else if (_accelIsOverThreshold && (accel.z < _threshold)) {

                    //console.log('accel gone below thresh ' + accel.z);
                    //$('#status').fadeIn(50).fadeOut(50);
                    _accelIsOverThreshold = false; 
                }
                document.getElementById('accell').innerHTML = accel.z.toFixed(2);
                poc.drawUI(accel);

           }, function() {}, options);

        },

        drawUI: function(accel) {
            //_accelX.append(accel.timestamp, accel.x); 
            //_accelY.append(accel.timestamp, accel.y);
            _accelZ.append(accel.timestamp, accel.z);
        }
    }
    
})();

