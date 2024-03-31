$(document).ready(function() {
    // Top bar
    const topBar = $('<div>', { id: 'topBar' }).appendTo('body');

    // Bottom bar
    const bottomBar = $('<div>', { id: 'bottomBar' }).appendTo('body');

    // Circle
    const circle = $('<div>', { class: 'circle' }).appendTo('#output');

    // Black dot
    const blackDot = $('<div>', { class: 'black-dot' }).appendTo(circle);

    // Controls container
    const controlsContainer = $('<div>', { class: 'controls-container' }).appendTo(bottomBar);

    // Control buttons
    const backBtn = $('<button>', { class: 'control-button', text: '◄' }).appendTo(controlsContainer);
    const playPauseBtn = $('<button>', { class: 'control-button', text: '▶' }).appendTo(controlsContainer);
    const forwardBtn = $('<button>', { class: 'control-button', text: '►' }).appendTo(controlsContainer);

    // Track details
    const trackDetails = $('<div>', { class: 'track-details', text: 'Track Name - Artist' }).appendTo(bottomBar);

    // Volume container
    const volumeContainer = $('<div>', { class: 'volume-container' }).appendTo(bottomBar);

    // Volume range input
    const volumeRange = $('<input>', { type: 'range', class: 'volume-range', min: 0, max: 100, value: 50 }).appendTo(volumeContainer);

    // Event listener for play/pause button
    playPauseBtn.on('click', function() {
        if (circle.hasClass('spinning')) {
            circle.removeClass('spinning');
            blackDot.css('animation', '');
        } else {
            circle.addClass('spinning');
            blackDot.css('animation', 'moveDot 10s linear infinite');
        }
    });

    // Event listeners for back and forward buttons (placeholders)
    backBtn.on('click', function() {
        console.log('Back button clicked');
    });

    forwardBtn.on('click', function() {
        console.log('Forward button clicked');
    });

    // Event listener for volume change
    volumeRange.on('input', function() {
        const value = $(this).val();
        console.log('Volume changed:', value);
    });
});
