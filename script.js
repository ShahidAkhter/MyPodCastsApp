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
            <span class="channels" id="channel${i}">
            <span class="channel">${element.channel}</span>
            </span>
            <span class="time" id="time${i}">
                <span class="timeDuration">${audioDuration}</span>
            </span>
            <span class="podcastList">
                <span class="timestamp"><img src="assets\\appImgs\\play-solid.svg" class="control-imgs plays" id="play${i}" alt="play"></img>
                </span>
            </span>
        </div>
        </div>`;
            playEvent();
            element.length = audioDuration;
            currentTimeDur.innerText = 0;
            setData(index);
        });
    });
}

const playEvent = async () => {
    Array.from(document.getElementsByClassName("plays")).forEach((element) => {
        element.addEventListener("click", async () => {
            resetplay();
            const index = parseInt(element.id.split("y")[1]);
            audio.src = podcasts[index].path;
            a = await alwaysRun();
            if (element.src === pause) {
                element.src = play;
                audio.pause();
            } else {
                element.src = pause;
                audio.play();
            }
            masterPlay.src = pause;
            audio.addEventListener('loadedmetadata', () => {
                alwaysRun(index);
            });
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
    audio.addEventListener('loadedmetadata', () => {
        setData(i);
    });
}

const setData = async (i) => {
    // console.log();
    timeDuration.innerText = podcasts[i].length;
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

masterPlay.addEventListener('click', async() => {
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
    audio.addEventListener('loadedmetadata', () => {
        alwaysRun();
    });
    
});

podcastNext.addEventListener('click', async () => {
    if (index >= podcasts.length - 1) {
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
        index = podcasts.length - 1;
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
    progress = parseInt((audio.currentTime / podcasts[index].length) * maxValueRange);
    myProgressBar.value = progress;
    if (audio.ended) {
        masterPlay.src=play;
    }
})

myProgressBar.addEventListener('change', () => {
    currentTimeDur.innerText = parseInt(audio.currentTime);
    audio.currentTime = (myProgressBar.value * podcasts[index].length) / maxValueRange;
    if (audio.ended) {
        masterPlay.src=play;
    }
})

timeBackward.addEventListener('click', () => {
    audio.currentTime -= time;
});
timeForward.addEventListener('click', () => {
    audio.currentTime += time;
});
