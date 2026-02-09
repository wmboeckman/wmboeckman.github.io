// Utils.js
// Author: Will Boeckman
// Last Updated: 5/6/2024

// Helper function for playing an audio file (windows xp sfx)
const playAudio = (path, vol = 1.0) => {
    var x = new Audio(path);
    x.volume = vol;
    x.play()
}

// Load HTML file from local directory with modern "Fetch" code
// this will not work with older browsers, I will probably rewrite 
// to account for this.
const loadHTMLFile = (url, container) => {
    var result;
    fetch(url)
        .then(response => response.text())
        .then(text => container.innerHTML = text);
    return result;
}
