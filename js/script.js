let maxValueRange = 10000;
let playList = document.getElementById('Playlist');
let info = document.getElementById('info');
let myloader = document.getElementById('myloader');
let playerControl = document.getElementById('player-control');
// let expanCont = document.getElementById('expanCont');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('progress-bar');
let timeDuration = document.getElementById('time-duration');
let currentTimeDur = document.getElementById('currentTimeDur');
let volumeIcon = document.getElementById('volumeIcon');
let volumeSideBar = document.getElementById('volumeSideBar');
let audioVolume = document.getElementById('volume-bar');
let timeBackward = document.getElementById('time_backward');
let timeForward = document.getElementById('time_forward');

let podcastBanner = document.getElementById('banner');
let podcastTitle = document.getElementById('title');
let podcastCreator = document.getElementById('creator');
let podcastChannel = document.getElementById('channel');

let podcastPrevious = document.getElementById('previous');
let podcastNext = document.getElementById('next');

let captionsDisplayer = document.getElementById('captionDisplayer');

let isReplay=document.getElementById('isReplay');
let time = 5;
let index = 0;
let lastIndex = (podcasts.length - 1);

let audio = new Audio();
audio.src = podcasts[index].path;
audioVolume.value = maxValueRange;
let pause = `assets\\appImgs\\pause-solid.svg`;
let play = `assets\\appImgs\\play-solid.svg`;

let replayOn='Replay On'
let replayOff='Replay Off'
const listing = async () => {
    podcasts.forEach(async (element, i) => {
        a = await loadertoggle(true);
        let audio = new Audio(element.path);
        audio.addEventListener('loadedmetadata', async () => {
            element.podcastLength = await getPodcastLength(audio.duration);
            element.integerLength = await getIntegerpodcastLength(audio);
            playList.innerHTML += `<div class="songItem w-fit flex f-center f-left margin-2 padding-1 bg">
        <div class="imgList flex f-center">
            <img alt="${i}" id="${i}" class="border-radius imgCover"
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
                <span class="timeDur">${element.podcastLength}</span>
            </span>
            <span class="podcastList flex f-center">
                <span class="playnPause"><img src="assets\\appImgs\\play-solid.svg" class="control-imgs plays" id="play${i}" alt="play"></img>
                </span>
            </span>
        </div>
        </div>`;
            playEvent();
            setData(index);
        });
        audio.addEventListener('loadedmetadata', () => {
            loadertoggle(false);
        });
    });
}

// Changing cover style
// const coverStyleChange = () => {
//     podcastBanner.classList.toggle(`posChange`);
//     info.classList.toggle(`infoWidthChange`);
// }
const loadertoggle = async (bool) => {
    myloader.classList.toggle(`loadAnimator`);
    myloader.classList.toggle(`displayNone`);
    // console.log('Hello, world!');
    playerControl.disabled = bool;

}
const getPodcastLength = (audioLength) => {
    let audioLen = Number.parseInt(audioLength);
    let hours = Math.floor(audioLen / 3600);
    let minutes = Math.floor((audioLen % 3600) / 60);
    let seconds = audioLen % 60;

    // Add leading zeros if necessary
    let minutesStr = minutes.toString().padStart(2, '0');
    let secondsStr = seconds.toString().padStart(2, '0');

    if (hours <= 0) {
        return `${minutesStr}:${secondsStr}`;
    }

    let hoursStr = hours.toString().padStart(2, '0');
    return `${hoursStr}:${minutesStr}:${secondsStr}`;
};

const getIntegerpodcastLength = async (audio) => {
    let audioLength = Number.parseInt(audio.duration);
    return audioLength;
}

const playEvent = async () => {
    Array.from(document.getElementsByClassName("plays")).forEach((element) => {
        element.addEventListener("click", async () => {
            resetplay();
            index = Number.parseInt(element.id.split("y")[1]);
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
            scrollLeftBtn.click();
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

const masterPlayerFunc = async () => {
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
}

const prevNextbtnRunner = async (index) => {
    a = await resetplay();
    document.getElementById(`play${index}`).src = pause;
    masterPlay.src = pause;
    audio.src = podcasts[index].path ? podcasts[index].path : defaultPath;
    a = await alwaysRun(index);
    myProgressBar.value=0;
    audio.play();
}

listing();
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

isReplay.addEventListener('click',()=>{
    isReplay.innerHTML=isReplay.innerHTML==replayOff?replayOn:replayOff
})
// podcastBanner.addEventListener('click', coverStyleChange)

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

});

podcastPrevious.addEventListener('click', async () => {
    if (index <= 0) {
        index = lastIndex;
    }
    else {
        index -= 1;
    }
    prevNextbtnRunner(index);
});

// Listen to Events
audio.addEventListener('timeupdate', async () => {
    // Update Seekbar
    progress = Number.parseInt((audio.currentTime / podcasts[index].integerLength) * maxValueRange);
    currentTimeDur.innerText = getPodcastLength(audio.currentTime);
    myProgressBar.value = progress;
    if(isReplay.innerHTML==replayOn && audio.ended){
        masterPlay.click();
        return
    }
    if (audio.ended) {
        podcastNext.click();
        // masterPlay.src = play;
        // resetplay();
    }
});

audio.addEventListener('timeupdate',async()=>{
    podcasts[index].captions.forEach((element,i) => {
        if (podcasts[index].captions[i]["startTime"] == currentTimeDur.innerText) {
            captionsDisplayer.innerText = podcasts[index].captions[i]["captionIs"]
            return;
        }
    });
})


myProgressBar.addEventListener('click', (event) => {
    const progressPercentage = event.offsetX / myProgressBar.clientWidth;
    audio.currentTime = progressPercentage * audio.duration;
    currentTimeDur.innerText = getPodcastLength(audio.currentTime);
    if(isReplay.innerHTML==replayOn && audio.ended){
        masterPlay.click();
        return
    }
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