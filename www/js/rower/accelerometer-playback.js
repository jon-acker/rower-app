Rower.AccelerometerPlayback = function(_sampleInterval) {
    var _watchId;
    var _mockData;
    var _currentTimeStamp, _timeDiff, _firstTimestamp;

    this.start = function() {

        $.get('spec/mock-data.csv', function(data) {
            _mockData = data.split("\n");
            
            _firstTimestamp = parseFloat(_mockData[0].split(",")[2]);
            _currentTimeStamp = (new Date()).getTime();
            _timeDiff = _currentTimeStamp - _firstTimestamp;
            
            _watchId = setInterval(function() {
                var values = _mockData.shift().split(",");
               
                var accel = {
                    x: parseFloat(values[0]),
                    y: 0,
                    z: parseFloat(values[1]),
                    timestamp: _timeDiff + parseFloat(values[2])
                }
           
                $(document).trigger('accelDataReceived', accel)

            }, _sampleInterval);

        });

    }

    this.stop = function() {
        clearInterval(_watchId);
    }

};