Rower.Datastream = {};

Rower.Datastream.sampleInterval = 20;


Rower.Datastream.filter = function(cutoff) {
    
    var _prevData = {x: 0, y: 0, z: 0};


   
    function _filter(data, type) {
        var _dt = Rower.Datastream.sampleInterval / 1000;
        var _alpha = _dt / (cutoff + _dt);
        //console.log('a '+ _alpha);
    
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

        return {
            x: newAx,
            y: newAy,
            z: newAz,
            timestamp: data.timestamp
        }
        
    }
   
    this.lowPass = function(data) {
        return _filter(data, 'LOWPASS');
    }
        
    this.highPass = function(data) {
        return _filter(data, 'HIGHPASS');
        
    }
   
};

/**
 * Initialize filters and process raw acceleration
 * received from data source
 * 
 * @receives {event} accelDataReceived
 * @triggers {event} accelDataProcessed
 */
Rower.Datastream.start = function() {
    var _gravityDataFilter = (new Rower.Datastream.filter(0.1)).highPass; 
    var _noiseDataFilter = (new Rower.Datastream.filter(0.1)).lowPass;
        
    var timestamp;
    var numSamples = 0;
    var sumSamplesDiffs = 0;    
    
    $(document).on('accelDataReceived', function(event, accelRaw) {
        var accel = _noiseDataFilter(_gravityDataFilter(accelRaw));
        //accel.c = Math.sqrt(accel.z*accel.z + accel.x*accel.x) * ((accel.z>0)?1:-1);
        //accel.c = (accel.z*2 + accel.x*2)/2;
        accel.c = accel.z;
        
        if (numSamples === 0) {
            timestamp = accel.timestamp;
        }
        
        if (numSamples > 0) {
            sumSamplesDiffs += (accel.timestamp - timestamp);
            timestamp = accel.timestamp;
            Rower.Datastream.sampleInterval = sumSamplesDiffs/numSamples;
        }
                
        numSamples++;

        $(document).trigger('accelDataProcessed', accel);

    });

};


/**
 * Append acceleration values to local
 * file data.txt
 *
 * @param {object} accel
 */
Rower.Datastream.record = function(accel) {
     
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        
        fileSystem.root.getFile(
            "data.txt", 
            {create: true, exclusive: false},
            
            //success
            function(file) {
                file.createWriter(
                    function(writer) {
                        writer.onwrite = function(evt) {
                            console.log("write success");
                        };
                        writer.seek(writer.length);
                        writer.write(accel.x + ',' + accel.z + ',' + accel.timestamp + "\n");    
                    },
                    function(error) {
                        console.log(error.code);
                    }
                );
            },
            
            //error
            function() {
                console.log('could not open file' + error.code);
            }
        );
    });

}

/**
 * Delete acceleration data file
 */
Rower.Datastream.remove = function() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {

        fileSystem.root.getFile('data.txt', null, function(file) {
            file.remove();
        });
    });
}

/**
 * Read contents of acceleration data file
 * and call successCallback with results string
 *
 * @param {function} successCallback
 */
Rower.Datastream.read = function(successCallback) {
    	
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        fileSystem.root.getFile("data.txt", null, 

            // file exists locally
            function (fileEntry) {
                fileEntry.file(

                    // read file successfully
                    function(f) {
                        var reader = new FileReader();
                        reader.onloadend = function(evt) {
                            successCallback(evt.target.result);
                        };
                        reader.readAsText(f);
                    },

                    // couldn't read file
                    function(error) {
                        throw error;
                    }

                );

            }, 

            // file not found (not cached)
            function (error) {
                throw error.code;
            }
        );
    });  	

}
