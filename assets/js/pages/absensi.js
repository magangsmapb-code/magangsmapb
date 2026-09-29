(() => {
  const configKey = "siakad-attendance-config-v1";
  const deviceKey = "siakad-attendance-device-demo-v1";
  const challenges = ["Kedipkan mata", "Hadap perlahan ke kiri", "Hadap perlahan ke kanan"];
  let challengeIndex = 0;
  let cameraStream;
  let serverOffset = 0;
  let qrExpiry = Date.now() + 30000;
  let config = { latitude: "", longitude: "", radius: "100", ssid: "" };
  try { config = { ...config, ...JSON.parse(localStorage.getItem(configKey) || "{}") }; } catch { localStorage.removeItem(configKey); }
  const byId = (id) => document.getElementById(id);
  const setPill = (id, message, preview = false) => { const pill = byId(id); pill.textContent = message; pill.classList.toggle("state-preview", preview); };

  function loadConfig() {
    const form = byId("configForm");
    for (const [key, value] of Object.entries(config)) if (form.elements.namedItem(key)) form.elements.namedItem(key).value = value;
    if (config.latitude && config.longitude) byId("locationResult").textContent = "Lokasi sekolah tersimpan (pratinjau lokal)";
  }
  function saveConfig(event) {
    event.preventDefault();
    config = Object.fromEntries(new FormData(event.currentTarget).entries());
    localStorage.setItem(configKey, JSON.stringify(config));
    byId("locationResult").textContent = config.latitude && config.longitude ? "Lokasi sekolah tersimpan (pratinjau lokal)" : "Titik sekolah belum diatur";
  }
  function metersBetween(lat1, lon1, lat2, lon2) {
    const radians = (degrees) => degrees * Math.PI / 180;
    const deltaLat = radians(lat2 - lat1);
    const deltaLon = radians(lon2 - lon1);
    const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(deltaLon / 2) ** 2;
    return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  function checkLocation() {
    if (!navigator.geolocation) { setPill("locationStatus", "GPS tidak tersedia"); return; }
    byId("locationResult").textContent = "Meminta lokasi perangkat…";
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude, accuracy } = position.coords;
      byId("coordinates").textContent = `${latitude.toFixed(5)}, ${longitude.toFixed(5)} · akurasi ±${Math.round(accuracy)} m`;
      if (!config.latitude || !config.longitude) { byId("locationResult").textContent = "Isi koordinat sekolah terlebih dahulu"; setPill("locationStatus", "Geofence belum diatur"); return; }
      const distance = metersBetween(latitude, longitude, Number(config.latitude), Number(config.longitude));
      const inside = distance <= Number(config.radius || 100);
      byId("locationResult").textContent = `${Math.round(distance)} m dari titik sekolah · ${inside ? "dalam" : "di luar"} radius`;
      byId("fenceMeter").style.width = `${Math.max(0, Math.min(100, 100 - distance / (Number(config.radius || 100) * 3) * 100))}%`;
      setPill("locationStatus", inside ? "Dalam radius (demo)" : "Di luar radius (demo)", inside);
    }, (error) => { byId("locationResult").textContent = error.message; setPill("locationStatus", "Lokasi ditolak/gagal"); }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
  }
  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) { byId("faceNote").textContent = "Kamera memerlukan browser dan konteks aman (HTTPS/localhost)."; return; }
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      byId("faceVideo").srcObject = cameraStream;
      byId("cameraFrame").classList.add("is-live");
      byId("livenessPrompt").textContent = challenges[challengeIndex];
      byId("nextChallenge").disabled = false;
      byId("stopCamera").disabled = false;
      byId("startCamera").disabled = true;
      byId("faceNote").textContent = "Pratinjau aktif saja; identitas dan liveness belum diverifikasi.";
      setPill("faceStatus", "Kamera aktif · demo", true);
    } catch (error) { byId("faceNote").textContent = `Kamera tidak dapat dibuka: ${error.message}`; }
  }
  function stopCamera() {
    cameraStream?.getTracks().forEach((track) => track.stop());
    cameraStream = null;
    byId("faceVideo").srcObject = null;
    byId("cameraFrame").classList.remove("is-live");
    byId("nextChallenge").disabled = true;
    byId("stopCamera").disabled = true;
    byId("startCamera").disabled = false;
    byId("livenessPrompt").textContent = "Belum dimulai";
    setPill("faceStatus", "Menunggu kamera");
  }
  function bindDemoDevice() {
    let id = localStorage.getItem(deviceKey);
    if (!id) { id = `DEMO-${crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10)}`; localStorage.setItem(deviceKey, id); }
    byId("deviceId").textContent = id;
    setPill("deviceStatus", "ID lokal · demo", true);
  }
  async function syncServerTime() {
    try {
      const response = await fetch("/api/attendance/time", { cache: "no-store" });
      if (!response.ok) throw new Error("Endpoint waktu server tidak tersedia.");
      const payload = await response.json();
      serverOffset = new Date(payload.serverTime).getTime() - Date.now();
      setPill("serverTimeStatus", "Terhubung", true);
      byId("serverDate").textContent = "Waktu dari endpoint server.";
    } catch {
      serverOffset = 0;
      setPill("serverTimeStatus", "Server belum tersambung");
      byId("serverDate").textContent = "Waktu lokal perangkat, belum terverifikasi.";
    }
  }
  function issueDemoQr() {
    const token = `DEMO-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    byId("qrToken").textContent = token;
    byId("qrCode").replaceChildren();
    if (window.QRCode) {
      byId("qrFallback").style.display = "none";
      new QRCode(byId("qrCode"), { text: token, width: 116, height: 116, colorDark: "#18352c", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
    } else {
      byId("qrFallback").textContent = "QR library tidak tersedia";
      byId("qrFallback").style.display = "block";
    }
    qrExpiry = Date.now() + 30000;
  }
  function renderClock() {
    const now = new Date(Date.now() + serverOffset);
    byId("clientClock").textContent = now.toLocaleString("id-ID", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    byId("serverClock").textContent = now.toLocaleTimeString("id-ID", { hour12: false });
    const remaining = Math.max(0, Math.ceil((qrExpiry - Date.now()) / 1000));
    byId("qrCountdown").textContent = remaining;
    if (remaining === 0) issueDemoQr();
  }
  document.querySelector("#configForm").addEventListener("submit", saveConfig);
  document.querySelector("#startCamera").addEventListener("click", startCamera);
  document.querySelector("#stopCamera").addEventListener("click", stopCamera);
  document.querySelector("#nextChallenge").addEventListener("click", () => { challengeIndex = (challengeIndex + 1) % challenges.length; byId("livenessPrompt").textContent = challenges[challengeIndex]; });
  document.querySelector("#checkLocation").addEventListener("click", checkLocation);
  document.querySelector("#bindDevice").addEventListener("click", bindDemoDevice);
  document.querySelector("#syncServerTime").addEventListener("click", syncServerTime);
  window.addEventListener("pagehide", stopCamera);
  loadConfig();
  window.SiakadPages.renderNavigation("attendance");
  issueDemoQr();
  renderClock();
  syncServerTime();
  setInterval(renderClock, 1000);
})();
