window.onAccelDataProcessed = function(accelData) {
  
}

$(document).on('accelDataProcessed', function(event, accel) {
    window.onAccelDataProcessed(accel);
});

var mockData = {x:2, y:0, z:0, timestamp: 12345};
       

describe('Rower.Datastream.start', function() {
    
    Rower.Datastream.start();
    
    it('should trigger accelDataProcessed after processing data', function() {
        
        runs(function() {
            spyOn(window, 'onAccelDataProcessed');
            jQuery(document).trigger('accelDataReceived', mockData)
        });
        

        runs(function() {
            expect(window.onAccelDataProcessed).toHaveBeenCalled();
        });
        
    });
    
    it('expects non-changing acceleration to produce zero difference', function() {
        
        runs(function() {
            spyOn(window, 'onAccelDataProcessed');
            jQuery(document).trigger('accelDataReceived', mockData)
            jQuery(document).trigger('accelDataReceived', mockData)
            jQuery(document).trigger('accelDataReceived', mockData)
        });
        
        waitsFor(function() {
            return (window.onAccelDataProcessed.calls.length > 0);
        }, 'onAccelDataReceived should be called once', 100);

        // with non changing accel - filter should produce zero
        runs(function() {
            
            mockData.c = 0;
            mockData.x = 0;
            
            expect(window.onAccelDataProcessed).toHaveBeenCalledWith(mockData);
        });
        
    });
})
