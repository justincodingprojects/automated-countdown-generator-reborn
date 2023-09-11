var blocks = []; // Store the blocks data from JSON
var currentBlockIndex = 0; // Index of the currently selected block

// Load JSON data and create dropdowns
blocks = data

function formatTime(time) {
    return String(time).padStart(2, "0");
}

function formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return `${formatTime(days)}d ${formatTime(hours % 24)}h ${formatTime(minutes % 60)}m ${formatTime(seconds % 60)}s`;
}

function formatUnixTime(unixTime) {
    const date = new Date(unixTime);
  
    const formattedDate = date.toLocaleString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    }).replace(" at ", " @ ");
  
    return `Timer until ${formattedDate}`;
  }

function updateCountdown() {
    if (blocks.length > 0) {
        var now = ServerDate.now();
        var schoolStartDate = new Date(blocks[currentBlockIndex].start_date).getTime();
        var timeRemaining = schoolStartDate - now

        // Check if the current countdown has ended
        if (timeRemaining <= 0) {
            // Move to the next block (if available)
            currentBlockIndex++;
            if (currentBlockIndex >= blocks.length) {
                document.getElementById("title").innerHTML = blocks[blocks.length - 1].block;
                document.getElementById("demo").innerText = ((blocks.length > 1) ? "Schedule Ended" : "Countdown Ended");
                clearInterval(countdownInterval);
                /*if ("wakeLock" in navigator) {
                    wakeLock.release().then(() => { wakeLock = null })
                };*/
                return; // No more blocks, stop countdown
            }
            schoolStartDate = new Date(blocks[currentBlockIndex].start_date).getTime();
            timeRemaining = schoolStartDate - now

            // Show "Loading..." while transitioning to the next block
            document.getElementById("title").innerHTML = ((data.length == 1) ? "Countdown" : "Schedule");
            document.getElementById("demo").innerText = "Loading...";
            return;
        }

        // Update countdown display
        document.getElementById("title").innerHTML = blocks[currentBlockIndex].block;
        document.getElementById("demo").innerText = formatDuration(timeRemaining);
        document.getElementById("footera").innerHTML = formatUnixTime(new Date(blocks[currentBlockIndex].start_date).getTime());
    } else {
        // Update countdown display
        document.getElementById("title").innerHTML = "Undefined " + ((data.length == 1) ? "Countdown" : "Schedule");
        document.getElementById("demo").innerText = ((data.length == 1) ? "Countdown" : "Schedule") + " Ended";
        document.getElementById("footera").innerHTML = "Timer until you can't no more";
        clearInterval(countdownInterval);
        return;
    }
}


// Initial countdown update
var countdownInterval = setInterval(updateCountdown, 50);

let wakeLock = null;
if ("wakeLock" in navigator) {
    const requestWakeLock = async () => {
        wakeLock = await navigator.wakeLock.request('screen');
    };

    document.addEventListener('visibilitychange', async () => {
        if (wakeLock !== null && document.visibilityState === 'visible') {
            await requestWakeLock();
        }
    });

    requestWakeLock();
}

let zoomed = false;
let locked = false;
new Egg("m", function () {
    if (!zoomed && !locked) {
        locked = true;
        zoomed = true;
        $(".topnav").animate({ top: "-10%" });
        $(".footer").animate({ top: "110%" });
        $("#title").animate({ fontSize: "750%", top: "40%" });
        $("#demo").animate({ fontSize: "750%", top: "65%" }, "", () => locked = false);
    } else if (!locked) {
        locked = true;
        zoomed = false;
        $(".topnav").animate({ top: "1.3%" });
        $(".footer").animate({ top: "93.3%" });
        $("#title").animate({ fontSize: "375%", top: "45%" });
        $("#demo").animate({ fontSize: "375%", top: "58%" }, "", () => locked = false);
    }
}).listen();
