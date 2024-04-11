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

let isReplay = document.getElementById('isReplay');

const repeatTimeBegin = document.getElementById('repeatTimeBegin')
const repeatTimeEnd = document.getElementById('repeatTimeEnd')
const repeatTimeExitter = document.getElementById('repeatTimeExitter')

let isRepeaterOn = false
let repeatTimeBeginVar = 0
let repeatTimeEndVar = 0
let repeatPause = true;
let repeatPlay = true;


isReplay.innerHTML = `<abbr title="Replayer"><img src="assets\\appImgs\\not-rotate-solid.svg" class="control-imgs height-sm font-bolder" alt="Replayer"></abbr>`
let time = 5;
let index = 0;
let lastIndex = 0;

let audio = new Audio();
audioVolume.value = maxValueRange;
let pause = `assets\\appImgs\\pause-solid.svg`;
let play = `assets\\appImgs\\play-solid.svg`;

let replayOn = `<abbr title="Replayer"><img src="assets\\appImgs\\rotate-solid.svg" class="control-imgs height-sm font-bolder" alt="Replayer"></abbr>`;
let replayOff = `<abbr title="Replayer"><img src="assets\\appImgs\\not-rotate-solid.svg" class="control-imgs height-sm font-bolder" alt="Replayer"></abbr>`;


// Changing cover style
const coverStyleChange = () => {
    podcastBanner.classList.toggle(`posChange`);
    info.classList.toggle(`infoWidthChange`);
}

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
            audio.pause();
            resetplay();
            index = Number.parseInt(element.id.split("y")[1]);
            audio.src = podcasts[index].path ? podcasts[index].path : audio.src;
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
    audio.src = podcasts[index].path ? podcasts[index].path : audio.src;
    a = await alwaysRun(index);
    myProgressBar.value = 0;
    audio.play();
}