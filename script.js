setInterval(() => {
  console.log("This message is from the setInterval function.");
}, 1000);

// function toggleSection() {
//     const urlModifierSection = document.getElementById("urlModifierSection");
//     const videoPlayerSection = document.getElementById("videoPlayerSection");
//     const privacyPolicySection = document.getElementById("privacyPolicySection");

//     if (urlModifierSection.style.display === "none") {
//         urlModifierSection.style.display = "block";
//         videoPlayerSection.style.display = "none";
//         privacyPolicySection.style.display = "none";
//     } else  {
//         urlModifierSection.style.display = "none";
//         videoPlayerSection.style.display = "block";
//         privacyPolicySection.style.display = "none";
//     }
// }
let activeSection = "urlModifier"; // Set the initial active section

function toggleSection() {
  const urlModifierSection = document.getElementById("urlModifierSection");
  const videoPlayerSection = document.getElementById("videoPlayerSection");
  const privacyPolicySection = document.getElementById("privacyPolicySection");

  if (activeSection === "urlModifier") {
    urlModifierSection.style.display = "none";
    videoPlayerSection.style.display = "block";
    privacyPolicySection.style.display = "none";
    activeSection = "videoPlayer";
  } else if (activeSection === "videoPlayer") {
    urlModifierSection.style.display = "none";
    videoPlayerSection.style.display = "none";
    privacyPolicySection.style.display = "block";
    activeSection = "privacyPolicy";
  } else {
    urlModifierSection.style.display = "block";
    videoPlayerSection.style.display = "none";
    privacyPolicySection.style.display = "none";
    activeSection = "urlModifier";
  }
}

function showSection(sectionId) {
  const urlModifierSection = document.getElementById("urlModifierSection");
  const videoPlayerSection = document.getElementById("videoPlayerSection");
  const privacyPolicySection = document.getElementById("privacyPolicySection");
  const urlModifierBtn = document.getElementById("urlModifierBtn");
  const videoPlayerBtn = document.getElementById("videoPlayerBtn");
  const privacyPolicyBtn = document.getElementById("privacyPolicyBtn");

  if (sectionId === "urlModifier") {
    urlModifierSection.style.display = "block";
    videoPlayerSection.style.display = "none";
    privacyPolicySection.style.display = "none";
    urlModifierBtn.classList.add("active");
    videoPlayerBtn.classList.remove("active");
    privacyPolicyBtn.classList.remove("active");
  } else if (sectionId === "videoPlayer") {
    urlModifierSection.style.display = "none";
    videoPlayerSection.style.display = "block";
    privacyPolicySection.style.display = "none";
    urlModifierBtn.classList.remove("active");
    videoPlayerBtn.classList.add("active");
    privacyPolicyBtn.classList.remove("active");
  } else if (sectionId === "privacyPolicy") {
    urlModifierSection.style.display = "none";
    videoPlayerSection.style.display = "none";
    privacyPolicySection.style.display = "block";
    urlModifierBtn.classList.remove("active");
    videoPlayerBtn.classList.remove("active");
    privacyPolicyBtn.classList.add("active");
  }
}

function generateQualityLinks() {
  const originalUrlInput = document.getElementById("originalUrl");
  const qualityLinksDiv = document.getElementById("qualityLinks");
  const originalUrl = originalUrlInput.value.trim(); // Trim to remove leading/trailing spaces

  // Check if the input is empty
  if (originalUrl === "") {
    alert("Please enter the original URL.");
    return;
  }

  // Clear previous output
  qualityLinksDiv.innerHTML = "";

  // Define an array of quality settings
  const qualitySettings = [240, 360, 480, 720];

  // Create links for each quality setting
  qualitySettings.forEach((quality) => {
    const modifiedUrl = generateModifiedUrl(originalUrl, quality);

    // Create quality header
    const qualityHeader = document.createElement("p");
    qualityHeader.textContent = `${quality}p Quality:`;
    qualityHeader.classList.add("quality-header");
    qualityLinksDiv.appendChild(qualityHeader);

    // Create link element as a clickable hyperlink
    const link = document.createElement("a");
    link.textContent = modifiedUrl;
    link.href = modifiedUrl;
    link.classList.add("quality-link");
    link.target = "_blank"; // Open links in a new tab
    qualityLinksDiv.appendChild(link);

    // Create a copy button for easy copying
    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy Link";
    copyButton.addEventListener("click", () => {
      copyLinkToClipboard(modifiedUrl, copyButton);
    });
    qualityLinksDiv.appendChild(copyButton);
  });
}

function clearInput() {
  const originalUrlInput = document.getElementById("originalUrl");
  originalUrlInput.value = "";
}

function loadVideo() {
  const videoUrlInput = document.getElementById("videoUrl");
  const video = document.getElementById("video");
  const url = videoUrlInput.value.trim();

  if (url) {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.addEventListener("loadedmetadata", function () {
        video.play();
      });
    } else {
      alert("HLS is not supported on this browser.");
    }
  } else {
    alert("Please enter a valid video URL.");
  }
}

function generateModifiedUrl(originalUrl, quality) {
  const extractedPart = extractPartFromUrl(originalUrl);

  if (extractedPart) {
    return `https://pwjarvis.vercel.app?v=${extractedPart}&quality=${quality}`;
  } else {
    return "Invalid URL format. Please enter a valid URL.";
  }
}

function extractPartFromUrl(url) {
  const parts = url.split("/");
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].match(/[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}/)) {
      return parts[i];
    }
  }
  return null;
}

function copyLinkToClipboard(link, copyButton) {
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = link;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextArea);

  const originalButtonText = copyButton.textContent;

  copyButton.textContent = "Copied";

  setTimeout(function () {
    copyButton.textContent = originalButtonText;
  }, 2000);
}
document.addEventListener("DOMContentLoaded", () => {
  const videoElement = document.getElementById("video");
  const player = new Plyr(videoElement, {
    // Additional Plyr customization options can be added here
    controls: [
      "play",
      "progress",
      "current-time",
      "mute",
      "volume",
      "settings",
      "fullscreen",
    ],
  });

  // If you want to play the video automatically when the page loads
  // player.play();
});
