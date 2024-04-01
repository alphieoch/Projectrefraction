// Open side navigation menu
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

// Close side navigation menu
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

$(document).ready(function() {
    // Top bar
    const topBar = $('<div>', { id: 'topBar' }).appendTo('body');

    // Bottom bar
    const bottomBar = $('<div>', { id: 'bottomBar' }).appendTo('body');

    // Circle
    const circle = $('<div>', { class: 'circle' }).appendTo('#output');

    // Black dot
    const blackDot = $('<div>', { class: 'black-dot' }).appendTo(circle);

    // Track details container
    const trackDetailsContainer = $('<div>', { class: 'track-details' }).appendTo(bottomBar);

    // Track name
    const trackName = $('<div>', { class: 'track-name', text: 'Track Name' }).appendTo(trackDetailsContainer);

    // Track artist
    const trackArtist = $('<div>', { class: 'track-artist', text: 'Artist' }).appendTo(trackDetailsContainer);

    // Controls container
    const controlsContainer = $('<div>', { class: 'controls-container' }).appendTo(bottomBar);

    // Control buttons
    const backBtn = $('<button>', { class: 'control-button' }).html('<i class="material-icons">skip_previous</i>').appendTo(controlsContainer);
    const playPauseBtn = $('<button>', { class: 'control-button' }).html('<i class="material-icons">play_arrow</i>').appendTo(controlsContainer);
    const forwardBtn = $('<button>', { class: 'control-button' }).html('<i class="material-icons">skip_next</i>').appendTo(controlsContainer);

    // Audio element
    var audioElement = $("<audio>");

    function setVolume(myVolume) {
        if (audioElement != undefined) {
            audioElement.volume = myVolume;
        }
    }

    // Volume container
    const volumeContainer = $('<div>', { class: 'volume-container' }).appendTo(bottomBar);

    // Volume slider container
    const volumeSliderContainer = $('<div>', { id: 'player' }).appendTo(volumeContainer);

    // Volume icons
    const volumeDownIcon = $('<i>', { class: 'fas fa-volume-down' }).appendTo(volumeSliderContainer);
    const volumeUpIcon = $('<i>', { class: 'fas fa-volume-up' }).appendTo(volumeSliderContainer);

    // Volume slider
    const volumeSlider = $('<div>', { id: 'volume' }).appendTo(volumeSliderContainer);

    // Initialize volume slider
    volumeSlider.slider({
        min: 0,
        max: 1,
        value: 1,
        step: 0.01,
        range: "min",
        slide: function(event, ui) {
            setVolume(ui.value);
        }
    });

    // Event listener for play/pause button
    playPauseBtn.on('click', function() {
        if (circle.hasClass('spinning')) {
            circle.removeClass('spinning');
            blackDot.css('animation', '');
            $(this).html('<i class="material-icons">play_arrow</i>');
        } else {
            circle.addClass('spinning');
            blackDot.css('animation', 'moveDot 10s linear infinite');
            $(this).html('<i class="material-icons">pause</i>');
        }
    });

    // Event listeners for back and forward buttons (placeholders)
    backBtn.on('click', function() {
        console.log('Back button clicked');
    });

    forwardBtn.on('click', function() {
        console.log('Forward button clicked');
    });
});