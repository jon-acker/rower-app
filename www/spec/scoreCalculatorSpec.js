describe ('module Rower.ScoreCalculator ->', function() {
//        beforeEach(function() {
//            Rower.ScoreCalculator.start();
//        })        
    Rower.ScoreCalculator.start();
    
    describe('Rower.ScoreCalculator.start', function() {

       it ('should listen for backwardsRowingDetected events', function() {

            //var onBackwardsRowingDetected = jasmine.createSpy('onBackwardsRowingDetected');

            runs(function() {
                setTimeout(function() {
                   $(document).trigger('backwardsRowingDetected', {timestamp: 12345}); 
                }, 100);
            }),

            waits(150);

            runs(function() {
                expect(Rower.ScoreCalculator.getLastStrokeTimestamp()).toBe(12345)
            });


       });
    });
    
     describe('Rower.ScoreCalculator.calculate', function() {     

        it ('should increment the score when stroke is close to metronome pulse', function() {
            
            runs(function() {
                $(document).trigger('metronomePulse');
                
                setTimeout(function() {
                    $(document).trigger('backwardsRowingDetected', {timestamp: (new Date()).getTime()}); 
                }, 100);               
            }),

            waits(150);

            runs (function() {
               var score = Rower.ScoreCalculator.getCurrentScore();
               expect(score).toBe(1);
            });

        });
        
        it ('should not increment the score when stroke is far from metronome pulse', function() {
            
            runs(function() {
                $(document).trigger('metronomePulse');
                
                setTimeout(function() {
                    $(document).trigger('backwardsRowingDetected', {timestamp: (new Date()).getTime()}); 
                }, 310);               
            }),

            waits(320);

            runs (function() {
               var score = Rower.ScoreCalculator.getCurrentScore();
               expect(score).toBe(1);
            });

        });      
        
                
        it ('should increment the score when stroke is close to the next metronome pulse', function() {
            
            runs(function() {
                $(document).trigger('metronomePulse');
                
                setTimeout(function() {
                    $(document).trigger('backwardsRowingDetected', {timestamp: (new Date()).getTime()}); 
                }, 490);               
            }),

            waits(550);

            runs (function() {
               var score = Rower.ScoreCalculator.getCurrentScore();
               expect(score).toBe(2);
            });

        }); 

    });  

});