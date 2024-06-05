$(document).ready(function () {
    const player = new Plyr('#video-player');

    $('#downloadForm').submit(async function (event) {
        event.preventDefault();

        const formData = new FormData($(this)[0]);

        try {
            const response = await downloadVideo(formData);
            // Display success message
            $('#progress-message').text('Download complete!');
            $('#progress').removeClass('error').addClass('success').fadeIn();

            // Update video source for Plyr player
            updatePlayerSource(response.video_path);

            // Show Plyr video player
            $('#video-container').show();
        } catch (error) {
            // Display error message
            $('#progress-message').text('An error occurred during download. Please try again.');
            $('#progress').removeClass('success').addClass('error').fadeIn();
        }
    });

    // Function to play the selected video file
    window.playSelectedVideo = function () {
        const selectedVideo = $('#playback_video')[0].files[0];

        if (selectedVideo) {
            const videoURL = URL.createObjectURL(selectedVideo);

            // Update video source for Plyr player
            updatePlayerSource(videoURL);

            // Show Plyr video player
            $('#video-container').show();
        }
    };

    function updatePlayerSource(source) {
        // Update video source for Plyr player
        const videoSource = {
            type: 'video',
            sources: [
                {
                    src: source,
                    type: 'video/mp4', // Adjust this based on the actual video type
                },
            ],
        };

        player.source = videoSource;
    }

    async function downloadVideo(formData) {
        try {
            const response = await $.ajax({
                url: '/download',
                type: 'POST',
                data: formData,
                async: true,
                cache: false,
                contentType: false,
                processData: false
            });

            return response;
        } catch (error) {
            throw new Error('An error occurred during download.');
        }
    }
});
