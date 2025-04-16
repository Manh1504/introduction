window.addEventListener('click', function () {
    const audio = document.getElementById('myAudio');
    audio.loop = true; 
    audio.play();
}, { once: true });