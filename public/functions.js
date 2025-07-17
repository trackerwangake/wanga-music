// public/functions.js

document.addEventListener("DOMContentLoaded", () => {
  initMainTools();
  initSidebarTools();
});

function initMainTools() {
  const main = document.getElementById("mainCards");
  const tools = [
    { name: "Battery %", action: showBatteryStatus },
    { name: "Network Info", action: showNetworkInfo },
    { name: "WiFi Scanner", action: scanWifi },
    { name: "Bluetooth Status", action: checkBluetooth },
    { name: "Device Info", action: getDeviceInfo },
    { name: "IP Address", action: getIPAddress },
    { name: "YouTube Player", action: showYouTubePlayer },
    { name: "Online Counter", action: showOnlineCount },
    { name: "Uptime", action: showUptime },
  ];

  tools.forEach(({ name, action }) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerText = name;
    card.onclick = () => openModal(name, action);
    main.appendChild(card);
  });
}

function initSidebarTools() {
  const sidebar = document.getElementById("sidebarTools");
  const tools = ["Gemini API Test", "ChatGPT API Test", "YouTube API Test"];

  tools.forEach(name => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerText = name;
    card.onclick = () => openModal(name, () => `<p>Test your ${name} key here.</p>`);
    sidebar.appendChild(card);
  });
}

function openModal(title, contentFunc) {
  document.getElementById("modalTitle").innerText = title;
  const content = contentFunc();
  if (typeof content === "string") {
    document.getElementById("modalContent").innerHTML = content;
  } else {
    const modalContent = document.getElementById("modalContent");
    modalContent.innerHTML = "";
    modalContent.appendChild(content);
  }
  document.getElementById("toolModal").classList.remove("hidden");
  document.getElementById("toolModal").classList.add("flex");
}

function closeModal() {
  document.getElementById("toolModal").classList.add("hidden");
  document.getElementById("toolModal").classList.remove("flex");
}

// === TOOL FUNCTIONS ===

function showBatteryStatus() {
  if (!navigator.getBattery) return "Battery API not supported.";
  navigator.getBattery().then(battery => {
    document.getElementById("modalContent").innerHTML =
      `<p>Battery Level: ${(battery.level * 100).toFixed(0)}%</p>`;
  });
  return "<p>Loading battery info...</p>";
}

function showNetworkInfo() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!conn) return "<p>Network info not available.</p>";
  return `<p>Type: ${conn.effectiveType}<br>Downlink: ${conn.downlink}Mb/s<br>RTT: ${conn.rtt}ms</p>`;
}

function scanWifi() {
  return `<p>WiFi scan requires secure permissions.<br>Use native apps or PWA for advanced WiFi access.</p>`;
}

function checkBluetooth() {
  return navigator.bluetooth ?
    `<p>Bluetooth API is supported. Click to scan devices (future).</p>` :
    `<p>Bluetooth not supported on this browser.</p>`;
}

function getDeviceInfo() {
  return `<p>User Agent: ${navigator.userAgent}<br>Platform: ${navigator.platform}<br>Language: ${navigator.language}</p>`;
}

function getIPAddress() {
  fetch("https://api.ipify.org?format=json")
    .then(res => res.json())
    .then(data => {
      document.getElementById("modalContent").innerHTML = `<p>Your IP Address: ${data.ip}</p>`;
    })
    .catch(() => {
      document.getElementById("modalContent").innerHTML = `<p>Unable to fetch IP address.</p>`;
    });
  return "<p>Fetching IP address...</p>";
}

function showYouTubePlayer() {
  return `
    <div>
      <iframe id="ytAudio" width="100%" height="100" src="https://www.youtube.com/embed?listType=playlist&list=PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI&enablejsapi=1" allow="autoplay"></iframe>
      <div class="mt-4">
        <button onclick="document.getElementById('ytAudio').contentWindow.postMessage('{\"event\":\"command\",\"func\":\"playVideo\",\"args\":[]}', '*')" class="bg-green-500 text-white px-3 py-1 rounded">Play</button>
        <button onclick="document.getElementById('ytAudio').contentWindow.postMessage('{\"event\":\"command\",\"func\":\"pauseVideo\",\"args\":[]}', '*')" class="bg-red-500 text-white px-3 py-1 rounded">Stop</button>
      </div>
    </div>
  `;
}

function showOnlineCount() {
  fetch("/api/online")
    .then(res => res.json())
    .then(data => {
      document.getElementById("modalContent").innerHTML = `<p>Online Users: ${data.count}</p>`;
    })
    .catch(() => {
      document.getElementById("modalContent").innerHTML = `<p>Unable to fetch online users.</p>`;
    });
  return "<p>Checking online count...</p>";
}

function showUptime() {
  fetch("/api/uptime")
    .then(res => res.json())
    .then(data => {
      document.getElementById("modalContent").innerHTML = `<p>Uptime: ${data.seconds} seconds</p>`;
    })
    .catch(() => {
      document.getElementById("modalContent").innerHTML = `<p>Unable to fetch uptime.</p>`;
    });
  return "<p>Checking uptime...</p>";
}
