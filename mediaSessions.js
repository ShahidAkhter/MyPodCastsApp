if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata(podcasts);

    navigator.mediaSession.setActionHandler("play", () => {
        /* Code excerpted. */
    });
    navigator.mediaSession.setActionHandler("pause", () => {
        /* Code excerpted. */
    });
    navigator.mediaSession.setActionHandler("seekbackward", () => {
        try {
            timeBackward.click();
        } catch (error) {
            console.log('Not Suppoted');
        }
    });
    navigator.mediaSession.setActionHandler("seekforward", () => {
        try {
            timeForward.click();
        } catch (error) {
            console.log('Not Suppoted');
        }
    });
    navigator.mediaSession.setActionHandler("previoustrack", () => {
        try {
            podcastPrevious.click();
        } catch (error) {
            console.log('Not Suppoted');
        }
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => {
        try {
            podcastNext.click();
        } catch (error) {
            console.log('Not Suppoted');
        }
    });
}


const actionHandlers = [
    // play
    [
        "play",
        async () => {
            // play our audio
            masterPlay.click();
            // set playback state
            navigator.mediaSession.playbackState = "playing";
            // update our status element
            // updateStatus(allMeta[index], "Action: play  |  Track is playing…");
        },
    ],
    [
        "pause",
        () => {
            // pause out audio
            masterPlay.click();
            // set playback state
            navigator.mediaSession.playbackState = "paused";
            // update our status element
            // updateStatus(allMeta[index], "Action: pause  |  Track has been paused…");
        },
    ],
];

for (const [action, handler] of actionHandlers) {
    try {
        navigator.mediaSession.setActionHandler(action, handler);
    } catch (error) {
        console.log(`The media session action "${action}" is not supported yet.`);
    }
}
