volumeIcon.addEventListener('click', () => {
    volumeSideBar.classList.toggle(`volumePos`);
    volumeSideBar.classList.toggle(`displayNone`);
});

window.addEventListener('click', (e) => {
    if (e.target.id == `volumeIcon` || e.target.id == `volumeSideBar` || e.target.id == `volume-bar`) {
        return;
    }
    if (volumeSideBar.classList.contains(`volumePos`)) {
        volumeSideBar.classList.toggle(`volumePos`);
        volumeSideBar.classList.toggle(`displayNone`);
    }
});


audioVolume.addEventListener('change', () => {
    volumemeter();
})

isReplay.addEventListener('click', () => {
    isReplay.innerHTML = (isReplay.innerHTML == replayOff) ? replayOn : (isReplay.innerHTML == replayOn) ? replayOff : "hi";
});

podcastBanner.addEventListener('click', coverStyleChange)

masterPlay.addEventListener('click', async () => {
    a = await masterPlayerFunc()
});

podcastNext.addEventListener('click', async () => {
    if (index >= lastIndex) {
        index = 0;
    }
    else {
        index += 1;
    }
    prevNextbtnRunner(index);
    repeatTimeExitter.click();

});

podcastPrevious.addEventListener('click', async () => {
    if (index <= 0) {
        index = lastIndex;
    }
    else {
        index -= 1;
    }
    prevNextbtnRunner(index);
    repeatTimeExitter.click();

});

// Listen to Events
audio.addEventListener('timeupdate', async (event) => {
    // Update Seekbar
    progress = Number.parseInt((audio.currentTime / podcasts[index].integerLength) * maxValueRange);
    currentTimeDur.innerText = getPodcastLength(audio.currentTime);
    myProgressBar.value = progress;
    current = Math.floor(audio.currentTime)
    if (isReplay.innerHTML == replayOn && audio.ended) {
        masterPlay.click();
        return
    }
    // console.log(current,repeatTimeBeginVar, repeatTimeEndVar)
    if (isRepeaterOn) {
        // isRepeaterOn=false;
        if (current === repeatTimeEndVar) {
            try {
                audio.currentTime = repeatTimeBeginVar;
            } catch (error) {
                console.log(error)
            }
        }
    }
    if (audio.ended) {
        podcastNext.click();
        // masterPlay.src = play;
        // resetplay();
    }
});

audio.addEventListener('timeupdate', async () => {
    if (podcasts[index].captions.length == 0) {
        captionsDisplayer.innerText = "♪"
        return;
    }
    let currentTimeIs = `${Math.floor(audio.currentTime)}`;
    if (podcasts[index].captions[0][currentTimeIs]) {
        captionsDisplayer.innerText = podcasts[index].captions[0][currentTimeIs][0]
        return;
    }
})


myProgressBar.addEventListener('click', (event) => {
    const progressPercentage = event.offsetX / myProgressBar.clientWidth;
    audio.currentTime = progressPercentage * audio.duration;

    let currentTimeIs = Math.floor(audio.currentTime);
    if (podcasts[index].captions[0][currentTimeIs]) {
        captionsDisplayer.innerText = podcasts[index].captions[0][currentTimeIs][0]
        return;
    }

    currentTimeDur.innerText = getPodcastLength(audio.currentTime);
    if (isReplay.innerHTML == replayOn && audio.ended) {
        masterPlay.click();
        return
    }
    if (audio.ended) {
        masterPlay.src = play;
        resetplay();
    }
    repeatTimeExitter.click();
});
myProgressBar.addEventListener('change', (event) => {
    repeatTimeExitter.click();
});

timeBackward.addEventListener('click', () => {
    audio.currentTime -= time;
    repeatTimeExitter.click();
});
timeForward.addEventListener('click', () => {
    audio.currentTime += time;
    repeatTimeExitter.click();
});


// KeyboardEvent
window.addEventListener('keydown', (event) => {
    if (event.code == "Space") {
        event.preventDefault();
        masterPlay.click();
    }
    else if (event.ctrlKey && event.key == "ArrowLeft") {
        podcastPrevious.click();
    }
    else if (event.ctrlKey && event.key == "ArrowRight") {
        podcastNext.click();
    }
    else if (event.key === "ArrowLeft") {
        timeBackward.click();
    }
    else if (event.key === "ArrowRight") {
        timeForward.click();
    }
});