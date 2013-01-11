/**
 * Rower user interface module
 */
Rower.UI = (function() {
     
    var _graph = new SmoothieChart();
    var _accelX = new TimeSeries({resetBounds: false});
    var _accelY = new TimeSeries({resetBounds: false});
    var _accelZ = new TimeSeries({resetBounds: false});
    var _strokeSound;
    
    _graph.streamTo(document.getElementById("graph"));
    _graph.addTimeSeries(_accelX, {strokeStyle:'rgb(0, 255, 0)', fillStyle:'rgba(0, 255, 0, 0.4)', lineWidth: 3});
    _graph.addTimeSeries(_accelY, {strokeStyle:'rgb(255, 0, 255)', fillStyle:'rgba(255, 0, 255, 0.3)', lineWidth:3});
    _graph.addTimeSeries(_accelZ, {strokeStyle:'rgb(0, 0, 255)', fillStyle:'rgba(0, 0, 255, 0.3)', lineWidth:3});

    
    $('#status').hide();


    return {
        
        start: function() {
          
            _strokeSound = new Rower.Sound('drum', 'js/drum.mp3');
                
            /**
             * @event accelDataProcessed
             * @param {object} event
             * @param {object} accelData
             * 
             */
            $(document).on('accelDataProcessed', function(event, accelData) {
                $('#accell').text(accelData.c.toFixed(2));
                Rower.UI.renderGraph(accelData);       
            });

            /**
             * @event backwardsRowingDetected
             * @param {object} event
             * 
             */
            $(document).on('backwardsRowingDetected', function(event, spm) {
                console.log('backwardsRowingDetected');
                _strokeSound.play();
                $('#status').text('SPM: ' + spm.toFixed(1)).show().delay(300).fadeOut(500);
            });
            

            /**
             * @event scoreCalculated
             * @param {object} event
             * 
             */
            $(document).on('scoreCalculated', function(event, spm) {
                $('#score').text(Rower.ScoreCalculator.getCurrentScore());
            });            
        },

        /**
         * Draw acceleration graph
         * 
         * @param {object} accel (x,y,z,c,timestamp)
         */
        renderGraph: function(accel) {
            _accelZ.append(accel.timestamp, accel.c); 
            //_accelX.append(accel.timestamp, accel.x);
        }
    }   
})();

