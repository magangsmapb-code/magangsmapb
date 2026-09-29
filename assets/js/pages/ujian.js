(() => {
  const answerKey = "siakad-exam-answer-demo-v1";
  const deviceKey = "siakad-exam-device-demo-v1";
  const violationsKey = "siakad-exam-events-demo-v1";
  const officialGates = ["face", "liveness", "gps", "device", "time", "participant"];
  const gateLabels = { face: "Pengenalan wajah", liveness: "Liveness", gps: "Geofence", device: "Device binding", time: "Waktu server", participant: "Status peserta" };
  const gateState = Object.fromEntries(officialGates.map((key) => [key, false]));
  let running = false;
  let officialSession = false;
  let expiry = 0;
  let serverOffset = 0;
  let focusLosses = 0;
  let networkLosses = 0;
  let saveTimer;
  let cameraStream;
  let eventLog;
  let eventCount = 0;
  const byId = (id) => document.getElementById(id);

  function updateNavigation() { window.SiakadPages.renderNavigation("exam"); }
  function logEvent(message, severity = "normal") {
    const list = byId("eventLog");
    const item = document.createElement("li");
    item.textContent = `${new Date().toLocaleTimeString("id-ID")} · ${message}`;
    if (severity === "warning") item.className = "event-warning";
    list.prepend(item);
    while (list.children.length > 8) list.lastElementChild.remove();
    eventCount += 1;
    localStorage.setItem(violationsKey, JSON.stringify({ count: eventCount, lastEvent: message, clientTime: new Date().toISOString() }));
    if (officialSession && navigator.onLine) {
      fetch("/api/exams/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: message, clientTime: new Date().toISOString() }), keepalive: true }).catch(() => {});
    }
  }
  function setGate(key, passed, message) {
    gateState[key] = Boolean(passed);
    byId(`${key}Check`).textContent = message;
    byId(`${key}Indicator`).textContent = passed ? "✓" : "—";
    byId(`${key}Indicator`).classList.toggle("ok", Boolean(passed));
    const ready = officialGates.every((gate) => gateState[gate]);
    byId("startOfficialExam").disabled = !ready;
    byId("preflightSummary").textContent = ready ? "Semua gerbang lolos server" : "Sebagian pemeriksaan belum lolos";
  }
  async function verifyWithServer() {
    byId("preflightNote").textContent = "Mengirim permintaan verifikasi ke server sekolah…";
    byId("verifyExam").disabled = true;
    try {
      const response = await fetch("/api/exams/preflight", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deviceDemoId: localStorage.getItem(deviceKey), clientTime: new Date().toISOString() }) });
      if (!response.ok) throw new Error("Server menolak pemeriksaan atau belum tersedia.");
      const result = await response.json();
      for (const gate of officialGates) setGate(gate, result.checks?.[gate] === true, result.checks?.[gate] === true ? "Terverifikasi server" : "Belum lolos verifikasi server");
      if (result.serverTime) serverOffset = new Date(result.serverTime).getTime() - Date.now();
      if (result.participant?.name) { byId("participantIdentity").textContent = result.participant.name; }
      byId("preflightNote").textContent = result.ticket ? "Pemeriksaan diterima server. Sesi resmi dapat dimulai." : "Server belum menerbitkan tiket sesi ujian.";
      window.examTicket = result.ticket || null;
    } catch (error) {
      for (const gate of officialGates) setGate(gate, false, "Menunggu API sekolah");
      byId("preflightNote").textContent = `${error.message} Semua gerbang tetap terkunci; mode simulasi tersedia terpisah.`;
    } finally { byId("verifyExam").disabled = false; }
  }
  async function syncServerTime() {
    try {
      const response = await fetch("/api/exams/time", { cache: "no-store" });
      if (!response.ok) throw new Error("offline");
      const result = await response.json();
      serverOffset = new Date(result.serverTime).getTime() - Date.now();
      byId("timeCheck").textContent = "Tersinkron dari server";
      byId("examServerClock").textContent = new Date(Date.now() + serverOffset).toLocaleTimeString("id-ID");
    } catch { byId("timeCheck").textContent = "Server belum tersambung"; byId("examServerClock").textContent = "Waktu server belum tersambung"; }
  }
  async function startFacePreview() {
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      byId("faceCheck").textContent = "Kamera lokal aktif; identitas belum cocok";
      setGate("face", false, "Menunggu pencocokan server");
    } catch { byId("faceCheck").textContent = "Kamera tidak tersedia/izin ditolak"; }
  }
  async function checkGpsPreview() {
    if (!navigator.geolocation) { byId("gpsCheck").textContent = "GPS browser tidak tersedia"; return; }
    navigator.geolocation.getCurrentPosition((position) => {
      byId("gpsCheck").textContent = `Koordinat terbaca (akurasi ±${Math.round(position.coords.accuracy)} m), belum diverifikasi server`;
      setGate("gps", false, "Menunggu geofence server");
    }, () => { byId("gpsCheck").textContent = "Izin lokasi ditolak atau gagal"; });
  }
  function bindDemoDevice() {
    let id = localStorage.getItem(deviceKey);
    if (!id) { id = `DEMO-${crypto.randomUUID ? crypto.randomUUID().slice(0, 10) : Math.random().toString(36).slice(2, 12)}`; localStorage.setItem(deviceKey, id); }
    byId("deviceCheck").textContent = `${id} · ID demo lokal, belum terikat server`;
    setGate("device", false, "Menunggu registrasi server");
  }
  async function startOfficial() {
    if (!window.examTicket) return;
    try {
      const response = await fetch("/api/exams/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ticket: window.examTicket }) });
      if (!response.ok) throw new Error("Sesi resmi tidak dapat dibuat.");
      const session = await response.json();
      if (!session.sessionId || !session.expiresAt) throw new Error("Respons sesi server tidak lengkap.");
      officialSession = true;
      launchExam(new Date(session.expiresAt).getTime(), true);
      byId("examTitle").textContent = session.title || "Ujian aktif";
      byId("sessionMode").textContent = "SESI RESMI · SERVER";
    } catch (error) { byId("preflightNote").textContent = error.message; }
  }
  async function startSimulation() {
    officialSession = false;
    launchExam(Date.now() + 20 * 60 * 1000, false);
    if (document.documentElement.requestFullscreen) {
      try { await document.documentElement.requestFullscreen(); } catch { byId("fullscreenStatus").textContent = "Fullscreen ditolak browser"; }
    }
  }
  function launchExam(endTime, official) {
    running = true;
    expiry = endTime;
    byId("examSession").hidden = false;
    byId("examSession").classList.add("is-locked");
    byId("sessionMode").textContent = official ? "SESI RESMI · SERVER" : "SIMULASI · BUKAN UJIAN RESMI";
    byId("examTitle").textContent = official ? "Ujian aktif dari server" : "Latihan Biologi";
    byId("startSimulation").disabled = true;
    byId("saveStatus").textContent = "Jawaban tersimpan lokal";
    const stored = JSON.parse(localStorage.getItem(answerKey) || "{}");
    if (stored.choice) document.querySelector(`input[name="answer"][value="${stored.choice}"]`).checked = true;
    byId("essayAnswer").value = stored.essay || "";
    byId("examSession").scrollIntoView({ behavior: "smooth", block: "start" });
    logEvent(official ? "Sesi ujian resmi dimulai" : "Mode simulasi dimulai");
    renderTimer();
  }
  function renderTimer() {
    if (!running) return;
    const remaining = Math.max(0, Math.ceil((expiry - (Date.now() + serverOffset)) / 1000));
    byId("examTimer").textContent = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
    if (remaining === 0) finishExam(true);
  }
  function autosave() {
    const answer = { choice: document.querySelector('input[name="answer"]:checked')?.value || "", essay: byId("essayAnswer").value, savedAt: new Date().toISOString() };
    localStorage.setItem(answerKey, JSON.stringify(answer));
    byId("saveStatus").textContent = "Tersimpan lokal · " + new Date().toLocaleTimeString("id-ID");
    clearTimeout(saveTimer);
    if (officialSession) {
      saveTimer = setTimeout(() => fetch("/api/exams/answers", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(answer), keepalive: true }).then((response) => { if (!response.ok) throw new Error(); byId("saveStatus").textContent = "Tersimpan ke server"; }).catch(() => { byId("saveStatus").textContent = "Tersimpan lokal · server belum menerima"; }), 500);
    }
  }
  function updateConnection() {
    const online = navigator.onLine;
    byId("connectionStatus").textContent = online ? "Online · menunggu heartbeat" : "Offline";
    byId("connectionStatus").classList.toggle("offline", !online);
  }
  function markFocusLoss(reason) {
    if (!running) return;
    focusLosses += 1;
    byId("focusLossCount").textContent = focusLosses;
    byId("focusStatus").textContent = "Fokus berubah";
    logEvent(reason, "warning");
  }
  function markNetworkLoss() {
    if (!running) return;
    networkLosses += 1;
    byId("networkLossCount").textContent = networkLosses;
    logEvent("Koneksi internet terputus", "warning");
  }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { logEvent("Permintaan fullscreen ditolak browser", "warning"); }
  }
  async function finishExam(expired = false) {
    if (!running) return;
    autosave();
    running = false;
    byId("startSimulation").disabled = false;
    byId("sessionMode").textContent = expired ? "WAKTU SIMULASI HABIS" : "SIMULASI SELESAI · DRAF TERSIMPAN";
    byId("saveStatus").textContent = "Draf jawaban tersimpan di browser";
    logEvent(expired ? "Waktu simulasi habis" : "Simulasi diakhiri peserta");
    if (document.fullscreenElement) { try { await document.exitFullscreen(); } catch {} }
    if (officialSession && navigator.onLine) fetch("/api/exams/finish", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers: JSON.parse(localStorage.getItem(answerKey) || "{}") }), keepalive: true }).catch(() => {});
  }
  document.querySelector("#verifyExam").addEventListener("click", verifyWithServer);
  document.querySelector("#startOfficialExam").addEventListener("click", startOfficial);
  document.querySelector("#startSimulation").addEventListener("click", startSimulation);
  document.querySelector("#finishExam").addEventListener("click", () => finishExam());
  document.querySelector("#toggleFullscreen").addEventListener("click", toggleFullscreen);
  document.querySelector("#essayAnswer").addEventListener("input", autosave);
  document.querySelectorAll('input[name="answer"]').forEach((input) => input.addEventListener("change", autosave));
  window.addEventListener("blur", () => markFocusLoss("Jendela kehilangan fokus"));
  document.addEventListener("visibilitychange", () => { if (document.hidden) markFocusLoss("Tab/aplikasi berpindah atau tersembunyi"); else if (running) { byId("focusStatus").textContent = "Fokus aktif kembali"; logEvent("Fokus kembali ke halaman"); } });
  window.addEventListener("offline", () => { updateConnection(); markNetworkLoss(); });
  window.addEventListener("online", () => { updateConnection(); if (running) logEvent("Koneksi internet kembali"); });
  document.addEventListener("fullscreenchange", () => {
    const full = Boolean(document.fullscreenElement);
    byId("fullscreenStatus").textContent = full ? "Aktif" : running ? "Keluar · tercatat" : "Belum aktif";
    byId("toggleFullscreen").title = full ? "Keluar layar penuh" : "Masuk layar penuh";
    if (!full && running) markFocusLoss("Keluar dari fullscreen");
  });
  window.addEventListener("beforeunload", (event) => { if (running) { event.preventDefault(); event.returnValue = ""; } });
  document.addEventListener("keydown", (event) => { if (running && event.key === "Escape" && document.fullscreenElement) logEvent("Tombol Escape ditekan", "warning"); });
  document.addEventListener("pagehide", () => cameraStream?.getTracks().forEach((track) => track.stop()));
  window.SiakadPages.renderNavigation("exam");
  updateConnection();
  bindDemoDevice();
  checkGpsPreview();
  syncServerTime();
  byId("verifyExam").insertAdjacentHTML("beforebegin", '<button class="button button-light" id="demoCameraCheck" type="button">Cek kamera lokal</button>');
  byId("demoCameraCheck").addEventListener("click", startFacePreview);
  setInterval(renderTimer, 1000);
})();
