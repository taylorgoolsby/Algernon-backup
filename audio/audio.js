
const googleTTS = require('google-tts-api');
const player = require('play-sound')();

const text = "サーバーが例外を投げる可能性があります。";
const language = 'ja';
const speed = 1; // Speed can be 1 for normal speed and 0.24 for slowest speed
const outputFile = 'output.mp3';

googleTTS(text, language, speed)
    .then((url) => {
        console.log('TTS URL:', url);
        player.play(url, function(err){
            if (err) console.log(`Could not play the sound: ${err}`);
        });
    })
    .catch((err) => {
        console.error(err);
    });
