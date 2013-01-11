Rower.ScoreCalculator = (function() {
   
   var _lastStrokeTimestamp = 0;
   
   var _lastMetronomePulse = 0;
   
   var _currentScore = 0;

   return {
       start: function() {
           _currentScore = 0;
           
           $(document).on('backwardsRowingDetected', function(event, accel) {
               _lastStrokeTimestamp = accel.timestamp;
               Rower.ScoreCalculator.calculate();
               $(document).trigger('scoreCalculated');
           });
           
           $(document).on('metronomePulse', function() {
               _lastMetronomePulse = (new Date()).getTime();
           });
       },
       
       calculate: function() {
           var distance = _lastStrokeTimestamp - _lastMetronomePulse;
           var errorMargin = 120;
           if (
                (distance < errorMargin) ||
                ( 
                    (distance < Rower.Metronome.getInterval()) && 
                    (distance > (Rower.Metronome.getInterval() - errorMargin)) 
                )
           ) {
               _currentScore++;
           };
           
       },
       
       getLastStrokeTimestamp: function() {
           return _lastStrokeTimestamp;
       },
       
       getCurrentScore: function() {
           return _currentScore;
       }
   }
   
})();
