// Windows.css
// Author: William Boeckman
// Last Updated: 5/9/2024

// TODO: Write code to reveal image information on hover

// TODO (if there is time): Auto load images from specified 
// local directory automatically, then dump a ton of my 
// photos inside!


var gm = (function() {
    var GALLERY, images;
    
    // None of this works :(
    const load_bigscreen = (evt) => {
        const bs = document.getElementById('bigscreen');
        bs.style.display = "block";
        alert();
    }
    
    function register_images() {
        GALLERY = document.getElementById('gallery');
        images = GALLERY.getElementsByTagName('img');
        
        for (var i = 0; i < images.length; i++) {
            images[i].alt
            images[i].addEventListener('click', load_bigscreen);
        }
    }
    
    function open_bigscreen() {
        const bs = document.getElementById('bigscreen');
        bs.style.display = "block";
    
    }
    
    function close_bigscreen() {
        const bs = document.getElementById('bigscreen');
        bs.style.display = "none";
    }
    
    
    return {
        register_images: register_images,
        open_bigscreen: open_bigscreen,
        close_bigscreen: close_bigscreen
    }
})();


