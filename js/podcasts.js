const listing = async () => {
    playList.innerHTML = ""
    podcasts.forEach(async (element, i) => {
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
                  <span class="timeDur">${element.podcastLength}</span>
              </span>
              <span class="podcastList flex f-center">
                  <span class="playnPause"><img src="assets\\appImgs\\play-solid.svg" class="control-imgs plays" id="play${i}" alt="play"></img>
                  </span>
              </span>
          </div>
          </div>`;
    });
    podcasts.forEach(async (element, i) => {
        let audio = new Audio(element.path);
        loadertoggle(true);
        audio.addEventListener('loadedmetadata', async () => {
            element.podcastLength = await getPodcastLength(audio.duration);
            element.integerLength = await getIntegerpodcastLength(audio);
            document.querySelector(`#time${i} .timeDur`).innerText = `${element.podcastLength}`;
            loadertoggle(false);
            setData(index);
        });
    });
    playEvent();
}

const fetchResponsesFromFolder = async (url, splicingNum) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlText = await response.text(); // This line assumes the response is HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const anchors = Array.from(doc.querySelectorAll('a'));
        const hrefs = anchors.map(a => a.href);

        // Remove the first splicingNum URLs
        if (hrefs.length > splicingNum) {
            hrefs.splice(0, splicingNum);
        }
        return hrefs;
    } catch (error) {
        console.error(`There was a problem with the fetch operation: ${error.message}`);
        return 1;
    }
}

let podcastsList = {}

const makePodcastsList = async () => {
    try {
        const resp = await fetchResponsesFromFolder('/media/sounds', 4);
        if (resp == 1) {
            podcastsList = JSON.parse(localStorage.getItem('podcastsList'))
            listChannels()
            return 1;
        }
        let podcasts = {};

        for (const e of resp) {
            const channelsName = e.split('/').pop().replace(/%20/g, ' ');
            const fetchFromFolder = await fetchResponsesFromFolder(e, 5);

            const podcastsForChannel = fetchFromFolder.map(efol => {
                const [fullTitle, fullCreatorsName] = efol.split('.BY.').map(name => name.replace(/%20/g, ' '));
                const titlesName = fullTitle.split('/').pop().replace(/%20/g, ' '); // Extract only relevant title
                const creatorsName = fullCreatorsName.split('.').slice(0, -1).join('.'); // Remove file extension

                const coverFileName = efol.split('/').pop().split('.').slice(0, -1).join('.').replace(/%20/g, ' '); // Remove file extension and %20 from cover
                const coverPath = 'media/covers/' + channelsName + '/' + coverFileName + '.jpg'; // Add ".jpg" to the cover filename
                const pathFileName = efol.split('/').pop().replace(/%20/g, ' '); // Extract only the filename from the path and remove %20
                const path = 'media/sounds/' + channelsName + '/' + pathFileName;

                return {
                    title: titlesName,
                    path: path,
                    cover: coverPath,
                    creator: creatorsName,
                    channel: channelsName,
                    captions: [],
                    podcastLength: "00:00",
                    integerLength: 0,
                    bg: "rgb(201, 255, 131)"
                };
            });

            podcasts[channelsName] = podcastsForChannel;
        }

        podcastsList = { "channels": podcasts };
        listChannels()
    } catch (error) {
        console.error('Error occurred:', error);
    }
    localStorage.setItem('podcastsList', JSON.stringify(podcastsList))
}

const listChannels = async () => {
    playList.innerHTML += `<div class="flex f-center f-left margin-2 padding-1 bg min-w-0 border-1 border-radius" id="allChannelsContent">
          <div class="flex f-center">
              <span class="channels min-w-0">
              <span class="channel">View All Channels Content</span>
              </span>
              </span>
          </div>
          </div>`;

    Object.keys(podcastsList['channels']).forEach(async (element, i) => {
        playList.innerHTML += `<div class="channelItem flex f-center f-left margin-2 padding-1 bg min-w-0 border-1 border-radius">
          <div class="flex f-center">
              <span class="channels min-w-0" id="channelList${i}">
              <span class="channel">${element}</span>
              </span>
              </span>
          </div>
          </div>`;
    });

    Array.from(document.getElementsByClassName('channelItem')).forEach((element, i) => {
        element.addEventListener('click', () => {
            podcasts = podcastsList['channels'][element.innerText];
            index = 0;
            lastIndex = (podcasts.length - 1);
            audio.src = podcasts[index].path;
            listing();
        })
    })
    document.getElementById('allChannelsContent').addEventListener('click', () => {
        Object.keys(podcastsList['channels']).forEach(async (element, i) => {
            podcastsList['channels'][element].forEach(async (e, j)=>{
                podcasts.push(e);
            })
        });
        index = 0;
        lastIndex = (podcasts.length - 1);
        audio.src = podcasts[index].path;
        listing();
    })
}



let podcasts = []
a = makePodcastsList();