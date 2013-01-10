Rower.Sound = function(soundName, soundFile) {
    
    var _soundName = soundName;
    var _soundFile = soundFile;
    
    LowLatencyAudio.preloadFX(soundName, soundFile);
    
    
    this.play = function() {
       LowLatencyAudio.play(_soundName);
    }
    
}

