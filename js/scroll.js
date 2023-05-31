// Get references to the buttons and content element
const scrollLeftBtn = document.getElementById('scrollLeftBtn');
const scrollRightBtn = document.getElementById('scrollRightBtn');
const content = document.querySelector('#mainContent');
let deviceWidth = window.innerWidth;
// Set the scroll distance for each button click
const scrollDistance = 100;

// Add click event listeners to the buttons
scrollLeftBtn.addEventListener('click', () => {
    deviceWidth = window.innerWidth;
    window.scrollBy((-1*deviceWidth), 0);
});

scrollRightBtn.addEventListener('click', () => {
    deviceWidth = window.innerWidth;
    window.scrollBy(deviceWidth, 0);
});
scrollRightBtn.click();

