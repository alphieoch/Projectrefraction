$(document).ready(function() {
    // Top bar
    const topBar = $('<div>', { id: 'topBar' }).appendTo('body');

    // Bottom bar
    const bottomBar = $('<div>', { id: 'bottomBar' }).appendTo('body');

    // Circle
    const circle = $('<div>', { class: 'circle' }).appendTo('#output');

    // Inner circle for drag and drop
    const innerCircle = $('<div>', { class: 'inner-circle' }).appendTo(circle);
    const dragText = $('<div>', { class: 'drag-text', text: 'Drag Audio Here' }).appendTo(innerCircle);

    // Black dot
    const blackDot = $('<div>', { class: 'black-dot' }).appendTo(innerCircle);

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

    // Open side navigation menu
    function openNav() {
        document.getElementById("mySidenav").style.width = "250px";
    }

    // Close side navigation menu
    function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
    }

    // File upload and storage
    const audioFileInput = $('#audioFileInput');
    let storedAudioFile = null;

    audioFileInput.on('change', function(e) {
        const file = e.target.files[0];
        if (file.type.startsWith('audio/')) {
            storedAudioFile = file;
            console.log('Audio file uploaded:', file);
            playAudioFile(file);
        } else {
            console.error('Invalid file type. Please upload an audio file.');
        }
    });

    innerCircle.on('click', function() {
        audioFileInput.click();
    });

    // Drag and drop functionality
    innerCircle.on('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).addClass('drag-over');
    });

    innerCircle.on('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('drag-over');
    });

    innerCircle.on('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('drag-over');

        const file = e.originalEvent.dataTransfer.files[0];
        if (file.type.startsWith('audio/')) {
            storedAudioFile = file;
            console.log('Audio file dropped:', file);
            playAudioFile(file);
        } else {
            console.error('Invalid file type. Please upload an audio file.');
        }
    });

    function playAudioFile(file) {
        const reader = new FileReader();
        reader.onload = function() {
            const audioElement = $('<audio>').attr('src', reader.result).appendTo('body');
            audioElement.on('loadedmetadata', function() {
                jsmediatags.read(reader.result, {
                    onSuccess: function(tag) {
                        const trackName = tag.tags.title || file.name.split('.')[0];
                        const trackArtist = tag.tags.artist || 'Unknown Artist';
                        $('.track-name').text(trackName);
                        $('.track-artist').text(trackArtist);

                        // Get album art (if available)
                        const audioContext = new AudioContext();
                        audioContext.decodeAudioData(reader.result, function(buffer) {
                            const trackMetadata = buffer.metadata;
                            if (trackMetadata && trackMetadata.picture && trackMetadata.picture.data) {
                                const albumArtBlob = new Blob([trackMetadata.picture.data], { type: 'image/jpeg' });
                                const albumArtUrl = URL.createObjectURL(albumArtBlob);
                                const albumArt = $('<img>').attr('src', albumArtUrl).on('load', function() {
                                    const canvas = $('<canvas>').attr('width', circle.width()).attr('height', circle.height()).appendTo(circle);
                                    const ctx = canvas[0].getContext('2d');
                                    ctx.drawImage(this, 0, 0, canvas.width(), canvas.height());
                                    ctx.globalCompositeOperation = 'source-in';
                                    ctx.beginPath();
                                    ctx.arc(canvas.width() / 2, canvas.height() / 2, canvas.width() / 2, 0, 2 * Math.PI);
                                    ctx.fill();
                                });
                            }
                        });
                    },
                    onError: function(error) {
                        console.error('Error reading metadata:', error);
                    }
                });
            });
        };
        reader.readAsArrayBuffer(file);
    }
});