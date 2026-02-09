// Windows.css
// Author: William Boeckman
// Last Updated: 5/6/2024

// ########################
//      Window Manager
// ########################
var wm = (function () {
    var os_loaded = false

    var active_window = "";
    var open_windows = [];

    // load after ALL other page content
    function init() {
        // check url for already "loaded" page (on refresh)
        var url = window.location.href;

        if (url.endsWith("#loaded")) {
            // disable loading screen
            document.getElementById("loading-screen").style.display = "none";
            os_loaded = true;
        }

        if (!os_loaded) {
            // run loading sequence
            setTimeout(function () {
                document.getElementById("loading-screen").style.display = "none";
                os_loaded = true;
                window.location.href += "#loaded";
                playAudio('./sfx/xp/Windows XP Startup.mp3', 0.25);

                setTimeout(function () {
                    // tutorial toast msg
                    document.getElementById("tutorial-msg").style.display = "block";
                    playAudio('./sfx/xp/Windows XP Balloon.mp3', 1);
                }, 5000);
            }, 3000);
        }

        // register window drag events to each window "page"
        document.querySelector("#home .topbar").addEventListener("pointerdown", move_window);
        document.querySelector("#about .topbar").addEventListener("pointerdown", move_window);
        document.querySelector("#contact .topbar").addEventListener("pointerdown", move_window);
        document.querySelector("#gallery .topbar").addEventListener("pointerdown", move_window);
        document.querySelector("#video .topbar").addEventListener("pointerdown", move_window);
        document.querySelector("#countdown .topbar").addEventListener("pointerdown", move_window);
    }

    function reorder_windows() {
        // iterate through each window (lowest to highest)
        for (var i = 0; i < open_windows.length; i++) {
            // set Z index to iterator
            document.getElementById(open_windows[i]).style.zIndex = i;
        }
    }

    function set_active_window(name) {
        if (name != "" && active_window != name) {
            active_window = name;
            reorder_windows()
        } else if (name == "") {
            // window has been closed, no active windows yet!
            active_window = "";
        }
    }

    const move_window = (evt) => {
        const el = evt.currentTarget;
        el.style.touchAction = "none";
        const p = el.parentElement;

        // drag event
        const move = (evt) => {
            p.style.left = `${p.offsetLeft + evt.movementX}px`;
            p.style.top = `${p.offsetTop + evt.movementY}px`;
        };

        // release event
        const up = () => {
            // upon release, check to see if window is off 
            // the desktop. If so, move window back inside.
            // bounds_adjust(p);

            removeEventListener("pointermove", move);
            removeEventListener("pointerup", up);
        };

        addEventListener("pointermove", move);
        // TODO: perhaps I can find another event to listen for to 
        // call for the window release...
        addEventListener("pointerup", up);
    };

    // private function, used to constrain window location on
    // mouse release
    function bounds_adjust(window) {
        const WINDOW_SIZE = [window.clientWidth,window.clientHeight];
        const WINDOW_POS = [window.style.left.replace("px",""), 
                            window.style.top.replace("px","")];
        const TBAR = window.getElementsByClassName('topbar')[0]
        const TBAR_HEIGHT = TBAR.clientHeight;
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        const DESKTOP_SIZE = [vw, vh];

        if (DESKTOP_SIZE[1] == 0) {
            alert("FATAL ERROR"); //UH-OH
        }
        if (WINDOW_POS[1] < 0) {
            // window topbar is above the desktop bounds
            alert("TOO HIGH!");
            window.style.top = "0px";
        }
        else if ((WINDOW_POS[1]+TBAR_HEIGHT) > DESKTOP_SIZE[1]) {
            // window topbar is below the desktop bounds
            alert("TOO LOW!");
            window.style.top = `${DESKTOP_SIZE[1]-TBAR_HEIGHT}px`;
        }
        if ((WINDOW_POS[0]+WINDOW_SIZE[0]-TBAR_HEIGHT) < 0) {
            // window is too far left of desktop bounds
            alert("TOO LEFT!");
            window.style.left = `${-WINDOW_SIZE[0]+TBAR_HEIGHT}px`;
        }
        else if ((WINDOW_POS[0]+TBAR_HEIGHT) > DESKTOP_SIZE[0]) {
            // window is too far right of desktop bounds
            alert("TOO RIGHT!");
            window.style.left = `${WINDOW_SIZE[0]-TBAR_HEIGHT}px`;
        }
    }

    function open_window(name) {
        // check to see if window isn't open, then open it
        if (!open_windows.includes(name)) {
            document.getElementById(name).style.display = "block";
            open_windows.push(name);

        }

        if (active_window != name) {
            // update active window 
            set_active_window(name);
            // force window reordering
            reorder_windows();
        }

        // play SFX
        playAudio('./sfx/xp/Windows XP Start.mp3', 0.5);
    }

    function close_window(name) {
        const i = open_windows.indexOf(name)
        if (i != -1) {
            document.getElementById(name).style.display = "none";
            open_windows.splice(i, 1);
            set_active_window("")
            // play SFX
            playAudio('./sfx/xp/Windows XP Menu Command.mp3', 1);

        } else {
            // this is bad, you broke it :(
            alert("FATAL WINDOWS ERROR");
            location.reload()
        }
    }

    function raise_window(name) {
        // splice out window from current order
        const i = open_windows.indexOf(name);
        open_windows.splice(i, 1);
        // push window to order
        open_windows.push(name);
        // set active window
        if (active_window != name) {
            set_active_window(name);
        }
        // finally, force reorder windows
        reorder_windows();
    }

    function get_open_windows() {
        return open_windows;
    }

    return {
        init: init,
        open_window: open_window,
        close_window: close_window,
        raise_window: raise_window,
        move_window: move_window,
        get_open_windows: get_open_windows
    }
})();

// ########################
//       TASKBAR CLOCK
// ########################
var clock = setInterval(function () {
    var is_pm = false
    // Get today's time in hours and minutes
    var current_hour = new Date().getHours();
    var current_min = new Date().getMinutes();

    // AM/PM: set flag, format hours
    if (current_hour > 12) {
        current_hour -= 12;
        is_pm = true
    }

    // 0-minute formatting fix
    if (current_min <= 9) { current_min = "0" + current_min }

    // construct formatted time string
    var formatted_time = current_hour + ":" + current_min

    // add either AM or PM depending on flag
    if (is_pm) {
        formatted_time += "PM"
    } else {
        formatted_time += "AM"
    }

    // update 'clock' HTML element
    document.getElementById("clock").innerHTML = formatted_time;
}, 1000);