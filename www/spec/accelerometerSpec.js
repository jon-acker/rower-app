window.onAccelDataReceived = function(){};
$(document).on('accelDataReceived', function(event, data) {
    window.onAccelDataReceived(); 
});


describe('module Rower.Accelerometer ->', function() {
    
    describe ('Rower.Accelerometer.start', function() {
        var accelerometer = new Rower.AccelerometerPlayback(50);

        it ('should be an instance of Rower.AccelerometerPlayback', function() {
            expect(accelerometer instanceof Rower.AccelerometerPlayback).toBeTruthy();
        });

        it ('should be able to start emitting events', function() {

            runs(function() {
                spyOn(window, 'onAccelDataReceived');
                accelerometer.start();
            });

            waitsFor(function() {
                return (window.onAccelDataReceived.calls.length >= 10);
            }, 'onAccelDataReceived should be called at least 10 times', 500);

            runs (function() {
                expect(window.onAccelDataReceived).toHaveBeenCalled();
            })

        });

        it ('should be able to stop emitting events', function() {
            runs(function() {
                spyOn(window, 'onAccelDataReceived');
                accelerometer.start();
                setTimeout(function() {
                    accelerometer.stop();
                }, 200);
            });

            waitsFor(function() {
                    return (window.onAccelDataReceived.calls.length >= 4);
                }, 'onAccelDataReceived should have been called at lease 4 times in 200ms', 200
            );
        });
    });
    
});


