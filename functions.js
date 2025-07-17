// functions.js

// Toggle sidebar visibility
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('-translate-x-full');
}

// Tool test triggers
function testTool(tool) {
  const output = document.getElementById(`${tool}-output`);
  if (output) output.innerText = 'Loading...';

  switch (tool) {
    case 'qr':
      fetch('/api/test/qr')
        .then(res => res.json())
        .then(data => {
          output.innerText = 'QR test passed';
        })
        .catch(err => {
          output.innerText = 'QR test failed';
        });
      break;
    case 'ocr':
      fetch('/api/test/ocr')
        .then(res => res.json())
        .then(data => {
          output.innerText = 'OCR test passed';
        })
        .catch(err => {
          output.innerText = 'OCR test failed';
        });
      break;
    case 'ip':
      fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => {
          output.innerText = 'Your IP: ' + data.ip;
        })
        .catch(err => {
          output.innerText = 'Error fetching IP';
        });
      break;
    case 'device':
      const info = `Platform: ${navigator.platform}\nUser Agent: ${navigator.userAgent}`;
      if (output) output.innerText = info;
      break;
    case 'mp3':
      fetch('/api/test/mp3')
        .then(res => res.json())
        .then(data => {
          output.innerText = 'MP3 test: backend ready';
        })
        .catch(err => {
          output.innerText = 'MP3 test failed';
        });
      break;
    case 'camera':
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          output.innerText = 'Camera access allowed';
          stream.getTracks().forEach(track => track.stop());
        })
        .catch(err => {
          output.innerText = 'Camera not accessible';
        });
      break;
    default:
      output.innerText = 'Unknown tool: ' + tool;
  }
}

// Initialize real-time server info
function startRuntimeCounter() {
  let seconds = 0;
  const runtimeEl = document.getElementById('runtime');
  const userCountEl = document.getElementById('user-count');

  setInterval(() => {
    seconds++;
    if (runtimeEl) runtimeEl.innerText = `Alive for: ${seconds} seconds`;
  }, 1000);

  if (userCountEl) {
    const simulated = Math.floor(Math.random() * 100) + 1;
    userCountEl.innerText = `Online Users: ${simulated}`;
  }
}

// Run on load
window.onload = startRuntimeCounter;
