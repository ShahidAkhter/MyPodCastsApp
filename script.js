let maxValueRange = 10000;
let playList = document.getElementById('Playlist');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('progress-bar');
let timeDuration = document.getElementById('time-duration');
let currentTimeDur = document.getElementById('currentTimeDur');
let audioVolume = document.getElementById('volume-bar');
let timeBackward = document.getElementById('time_backward');
let timeForward = document.getElementById('time_forward');

let podcastBanner = document.getElementById('banner');
let podcastTitle = document.getElementById('title');
let podcastCreator = document.getElementById('creator');
let podcastChannel = document.getElementById('channel');

let podcastPrevious = document.getElementById('previous');
let podcastNext = document.getElementById('next');

let podcastsIndex = 0;
let time = 5;
let index = 0;
let lastIndex = (podcasts.length - 1);

let audio = new Audio();
audio.src = podcasts[podcastsIndex].path;
audioVolume.value = maxValueRange / 2;
let pause = `assets\\appImgs\\pause-solid.svg`;
let play = `assets\\appImgs\\play-solid.svg`;

const listing = async () => {
    podcasts.forEach((element, i) => {
        let audio = new Audio(element.path);
        audio.addEventListener('loadedmetadata', () => {
            let audioDuration = parseInt(audio.duration);
            playList.innerHTML += `<div class="songItem flex f-center f-left margin-2 padding-1 bg">
        <div class="imgList flex f-center">
            <img alt="${i}" id="${i}" class="border-radius"
            src="${element.cover}">
        </div>
        <div class="margin-x infoTabs w-1" id="infoTab${i}">
        <div class="text-size-1" id="title${i}">${element.title}</div>
        <div class="text-size-2" id="creator${i}">${element.creator}</div>
        </div>
        <div class="flex f-center">
            <span class="channels text-center" id="channel${i}">
            <span class="channel">${element.channel}</span>
            </span>
            <span class="time text-center" id="time${i}">
                <span class="timeDuration">${audioDuration}</span>
            </span>
            <span class="podcastList">
                <span class="timestamp"><img src="assets\\appImgs\\play-solid.svg" class="control-imgs plays" id="play${i}" alt="play"></img>
                </span>
            </span>
        </div>
        </div>`;
            playEvent();
            element.podcastLength = audioDuration;
            currentTimeDur.innerText = 0;
            alwaysRun(index);
        });
    });
}

// Changing cover style
const coverStyleChange = () => {
    podcastBanner.classList.toggle(`posChange`);
}
const playEvent = async () => {
    Array.from(document.getElementsByClassName("plays")).forEach((element) => {
        element.addEventListener("click", async () => {
            resetplay();
            index = parseInt(element.id.split("y")[1]);
            audio.src = podcasts[index].path;
            a = await alwaysRun(index);
            if (element.src == pause) {
                element.src = play;
                audio.pause();
            } else {
                element.src = pause;
                audio.play();
            }
            masterPlay.src = pause;
        });
    });
}

const resetplay = async () => {
    Array.from(document.getElementsByClassName("plays")).forEach((element) => {
        element.src = play;
        // audio.pause();
    });
}

const alwaysRun = async (i) => {
    // if (!index) {
    //     index=0;
    // }
    currentTimeDur.innerText = 0;
    audio.addEventListener('loadedmetadata', async () => {
        setData(i);
    });
}

const setData = async (i) => {
    // console.log(i)
    timeDuration.innerText = podcasts[i].podcastLength;
    podcastTitle.innerText = podcasts[i].title;
    podcastBanner.src = podcasts[i].cover;
    podcastCreator.innerText = podcasts[i].creator;
    podcastChannel.innerText = podcasts[i].channel;
}

const volumemeter = () => {
    audio.volume = audioVolume.value / maxValueRange;
}

listing();

audioVolume.addEventListener('change', () => {
    volumemeter();
})

podcastBanner.addEventListener('click', coverStyleChange)

masterPlay.addEventListener('click', async () => {
    // console.log(audio.src)
    if (audio.paused || audio.currentTime <= 0) {
        audio.play();
        masterPlay.src = pause;
        a = await resetplay();
        document.getElementById(`play${index}`).src = pause;
    }
    else {
        audio.pause();
        masterPlay.src = play;
        a = await resetplay();
    }
    a = await alwaysRun(index);
});

podcastNext.addEventListener('click', async () => {
    if (index >= lastIndex) {
        index = 0;
    }
    else {
        index += 1;
    }
    a = await resetplay();
    document.getElementById(`play${index}`).src = pause;
    masterPlay.src = pause;
    audio.src = podcasts[index].path;
    a = await alwaysRun(index);
    audio.play();

});

podcastPrevious.addEventListener('click', async () => {
    if (index <= 0) {
        index = lastIndex;
    }
    else {
        index -= 1;
    }
    a = await resetplay();
    document.getElementById(`play${index}`).src = pause;
    masterPlay.src = pause;
    audio.src = podcasts[index].path;
    a = await alwaysRun(index);
    audio.play();
});

// Listen to Events
audio.addEventListener('timeupdate', () => {
    // Update Seekbar
    currentTimeDur.innerText = parseInt(audio.currentTime);
    progress = parseInt((audio.currentTime / podcasts[index].podcastLength) * maxValueRange);
    myProgressBar.value = progress;
    if (audio.ended) {
        masterPlay.src = play;
        resetplay();
    }
});

myProgressBar.addEventListener('change', () => {
    currentTimeDur.innerText = parseInt(audio.currentTime);
    audio.currentTime = (myProgressBar.value * podcasts[index].podcastLength) / maxValueRange;
    if (audio.ended) {
        masterPlay.src = play;
        resetplay();
    }
});

timeBackward.addEventListener('click', () => {
    audio.currentTime -= time;
});
timeForward.addEventListener('click', () => {
    audio.currentTime += time;
});




// KeyboardEvent
window.addEventListener('keydown', (event) => {
    if (event.code == "Space") {
        masterPlay.click();
    }
    else if (event.ctrlKey && event.key == "ArrowLeft") {
        podcastPrevious.click();
    }
    else if (event.ctrlKey && event.key == "ArrowRight") {
        podcastNext.click();
    }
    else if (event.key == "ArrowLeft") {
        timeBackward.click();
    }
    else if (event.key == "ArrowRight") {
        timeForward.click();
    }
});
