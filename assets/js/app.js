const modules = {
  students: {
    label: "Data siswa", singular: "siswa", icon: "♙", code: "SISWA",
    fields: [
      { key: "nis", label: "NIS", required: true }, { key: "name", label: "Nama lengkap", required: true },
      { key: "class", label: "Kelas", type: "select", options: ["X IPA 1", "X IPS 1", "XI IPA 1", "XI IPS 1", "XII IPA 1", "XII IPS 1"] },
      { key: "gender", label: "Jenis kelamin", type: "select", options: ["Laki-laki", "Perempuan"] },
      { key: "status", label: "Status", type: "select", options: ["Aktif", "Alumni", "Pindah"] },
      { key: "phone", label: "Nomor telepon", type: "tel" }
    ],
    seed: [
      { nis: "2025001", name: "Ahmad Fauzan", class: "X IPA 1", gender: "Laki-laki", status: "Aktif", phone: "081234567801" },
      { nis: "2025002", name: "Aisyah Putri", class: "X IPA 1", gender: "Perempuan", status: "Aktif", phone: "081234567802" },
      { nis: "2024007", name: "Bagas Pratama", class: "XI IPS 1", gender: "Laki-laki", status: "Aktif", phone: "081234567803" },
      { nis: "2023012", name: "Dewi Lestari", class: "XII IPA 1", gender: "Perempuan", status: "Aktif", phone: "081234567804" },
      { nis: "2024015", name: "Fajar Ramadhan", class: "XI IPA 1", gender: "Laki-laki", status: "Aktif", phone: "081234567805" }
    ]
  },
  teachers: {
    label: "Data guru", singular: "guru", icon: "♧", code: "GURU",
    fields: [
      { key: "nip", label: "NIP", required: true }, { key: "name", label: "Nama lengkap", required: true },
      { key: "subject", label: "Mata pelajaran", required: true }, { key: "phone", label: "Nomor telepon", type: "tel" },
      { key: "email", label: "Email", type: "email" }, { key: "status", label: "Status", type: "select", options: ["Aktif", "Nonaktif"] }
    ],
    seed: [
      { nip: "198504102010011004", name: "Siti Rahayu, S.Pd.", subject: "Bahasa Indonesia", phone: "081234560101", email: "siti@sekolah.sch.id", status: "Aktif" },
      { nip: "198709152012011002", name: "Budi Santoso, S.Pd.", subject: "Matematika", phone: "081234560102", email: "budi@sekolah.sch.id", status: "Aktif" },
      { nip: "199001202015032001", name: "Dian Kusuma, S.Pd.", subject: "Biologi", phone: "081234560103", email: "dian@sekolah.sch.id", status: "Aktif" }
    ]
  },
  classes: {
    label: "Data kelas", singular: "kelas", icon: "▦", code: "KELAS",
    fields: [
      { key: "code", label: "Kode kelas", required: true }, { key: "name", label: "Nama kelas", required: true },
      { key: "homeroom", label: "Wali kelas", required: true }, { key: "capacity", label: "Kapasitas siswa", type: "number", required: true },
      { key: "room", label: "Ruang kelas" }
    ],
    seed: [
      { code: "X-IPA-1", name: "X IPA 1", homeroom: "Dian Kusuma, S.Pd.", capacity: "32", room: "Ruang 1" },
      { code: "X-IPS-1", name: "X IPS 1", homeroom: "Siti Rahayu, S.Pd.", capacity: "30", room: "Ruang 2" },
      { code: "XI-IPA-1", name: "XI IPA 1", homeroom: "Budi Santoso, S.Pd.", capacity: "30", room: "Ruang 3" },
      { code: "XII-IPA-1", name: "XII IPA 1", homeroom: "Dian Kusuma, S.Pd.", capacity: "28", room: "Ruang 4" }
    ]
  },
  subjects: {
    label: "Mata pelajaran", singular: "mata pelajaran", icon: "▤", code: "MAPEL",
    fields: [
      { key: "code", label: "Kode mapel", required: true }, { key: "name", label: "Nama mata pelajaran", required: true },
      { key: "teacher", label: "Guru pengampu", required: true }, { key: "hours", label: "Jam per minggu", type: "number", required: true },
      { key: "group", label: "Kelompok", type: "select", options: ["Wajib", "Peminatan", "Muatan lokal"] }
    ],
    seed: [
      { code: "BIN-01", name: "Bahasa Indonesia", teacher: "Siti Rahayu, S.Pd.", hours: "4", group: "Wajib" },
      { code: "MTK-01", name: "Matematika", teacher: "Budi Santoso, S.Pd.", hours: "4", group: "Wajib" },
      { code: "BIO-01", name: "Biologi", teacher: "Dian Kusuma, S.Pd.", hours: "3", group: "Peminatan" },
      { code: "PPKN-01", name: "Pendidikan Pancasila", teacher: "Siti Rahayu, S.Pd.", hours: "2", group: "Wajib" }
    ]
  },
  schedules: {
    label: "Jadwal pelajaran", singular: "jadwal", icon: "◷", code: "JADWAL",
    fields: [
      { key: "day", label: "Hari", type: "select", options: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"] },
      { key: "time", label: "Waktu", required: true }, { key: "class", label: "Kelas", required: true },
      { key: "subject", label: "Mata pelajaran", required: true }, { key: "teacher", label: "Guru", required: true }, { key: "room", label: "Ruang" }
    ],
    seed: [
      { day: "Senin", time: "07.30–09.00", class: "X IPA 1", subject: "Matematika", teacher: "Budi Santoso", room: "Ruang 1" },
      { day: "Senin", time: "09.30–11.00", class: "XI IPA 1", subject: "Biologi", teacher: "Dian Kusuma", room: "Ruang 3" },
      { day: "Selasa", time: "07.30–09.00", class: "X IPS 1", subject: "Bahasa Indonesia", teacher: "Siti Rahayu", room: "Ruang 2" },
      { day: "Rabu", time: "10.00–11.30", class: "XII IPA 1", subject: "Matematika", teacher: "Budi Santoso", room: "Ruang 4" }
    ]
  },
  grades: {
    label: "Data nilai", singular: "nilai", icon: "▥", code: "NILAI",
    fields: [
      { key: "nis", label: "NIS siswa", required: true }, { key: "student", label: "Nama siswa", required: true },
      { key: "class", label: "Kelas", required: true }, { key: "subject", label: "Mata pelajaran", required: true },
      { key: "semester", label: "Semester", type: "select", options: ["Ganjil 2025/2026", "Genap 2025/2026"] },
      { key: "score", label: "Nilai", type: "number", required: true }
    ],
    seed: [
      { nis: "2025001", student: "Ahmad Fauzan", class: "X IPA 1", subject: "Matematika", semester: "Ganjil 2025/2026", score: "88" },
      { nis: "2025002", student: "Aisyah Putri", class: "X IPA 1", subject: "Bahasa Indonesia", semester: "Ganjil 2025/2026", score: "92" },
      { nis: "2024007", student: "Bagas Pratama", class: "XI IPS 1", subject: "Bahasa Indonesia", semester: "Ganjil 2025/2026", score: "84" },
      { nis: "2023012", student: "Dewi Lestari", class: "XII IPA 1", subject: "Biologi", semester: "Ganjil 2025/2026", score: "90" }
    ]
  }
};

const storageKey = "siakad-pemberdayaan-bangsa-v1";
const navItems = [{ key: "overview", label: "Ringkasan", icon: "⌂" }, ...Object.entries(modules).map(([key, module]) => ({ key, label: module.label, icon: module.icon }))];
const landingView = document.querySelector("#landingView");
const dashboardView = document.querySelector("#dashboardView");
const dashboardContent = document.querySelector("#dashboardContent");
const sideNav = document.querySelector("#sideNav");
const dialog = document.querySelector("#recordDialog");
const form = document.querySelector("#recordForm");
let activePage = "overview";
let editingIndex = null;
let data = loadData();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadData() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (stored && typeof stored === "object" && !Array.isArray(stored)) {
      return {
        ...stored,
        ...Object.fromEntries(Object.entries(modules).map(([key, module]) => [
          key,
          Array.isArray(stored[key]) ? stored[key] : clone(module.seed)
        ]))
      };
    }
  } catch (error) {
    console.warn("Data lokal SIAKAD tidak dapat dibaca.", error);
  }
  return Object.fromEntries(Object.entries(modules).map(([key, module]) => [key, clone(module.seed)]));
}

function saveData() {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function showDashboard(page = "overview", updateHistory = true) {
  landingView.hidden = true;
  dashboardView.hidden = false;
  document.body.classList.add("in-dashboard");
  renderPage(page);
  if (updateHistory) {
    history.pushState({ view: "dashboard", page }, "", "#dashboard");
  }
  window.scrollTo(0, 0);
}

function showLanding(updateHistory = true) {
  dashboardView.hidden = true;
  landingView.hidden = false;
  document.body.classList.remove("in-dashboard");
  if (updateHistory) {
    history.pushState({ view: "landing" }, "", "#beranda");
  }
  window.scrollTo(0, 0);
}

function handleStateFromLocation() {
  const currentHash = window.location.hash.replace("#", "");
  const view = currentHash === "dashboard" ? "dashboard" : "beranda";
  if (view === "dashboard") {
    showDashboard("overview", false);
  } else {
    showLanding(false);
  }
}

window.addEventListener("popstate", handleStateFromLocation);

if (window.location.hash === "#dashboard") {
  showDashboard("overview", false);
} else {
  showLanding(false);
}

function renderNav() {
  sideNav.innerHTML = navItems.map((item) => `<button class="side-link ${activePage === item.key ? "active" : ""}" data-page="${item.key}"><span class="side-icon">${item.icon}</span><span>${item.label}</span></button>`).join("");
}

function heading(kicker, title, description, action = "") {
  return `<div class="page-heading"><div><div class="section-kicker"><span>${kicker}</span><span>PORTAL AKADEMIK</span></div><h1>${title}</h1><p>${description}</p></div>${action}</div>`;
}

function renderOverview() {
  const studentCount = data.students.filter((student) => student.status === "Aktif").length;
  const gradeAverage = data.grades.length ? Math.round(data.grades.reduce((sum, grade) => sum + Number(grade.score || 0), 0) / data.grades.length) : 0;
  const metrics = [
    ["Siswa aktif", studentCount, "Terdaftar di tahun ajaran ini", "♙"],
    ["Tenaga pendidik", data.teachers.length, "Guru dan staf pengajar", "♧"],
    ["Rombongan belajar", data.classes.length, "Kelas aktif", "▦"],
    ["Rata-rata nilai", gradeAverage, "Dari data nilai tersimpan", "↗"]
  ];
  const latestStudents = data.students.slice(-4).reverse();
  return `${heading("01", "Ringkasan akademik", "Gambaran umum aktivitas SMA Pemberdayaan Bangsa.")}
    <div class="metric-grid">${metrics.map(([label, value, note, icon]) => `<article class="metric-card"><div class="metric-top"><span>${label}</span><span class="metric-icon">${icon}</span></div><strong class="metric-value">${value}</strong><div class="metric-foot">${note}</div></article>`).join("")}</div>
    <div class="overview-grid"><section class="panel"><div class="panel-heading"><h2>Siswa terbaru</h2><span>${data.students.length} data siswa</span></div><div class="activity-list">${latestStudents.length ? latestStudents.map((student) => `<div class="activity-item"><span class="activity-mark">${escapeHTML(student.name.slice(0, 1))}</span><div class="activity-copy"><strong>${escapeHTML(student.name)}</strong> · ${escapeHTML(student.class)}</div><time>${escapeHTML(student.status)}</time></div>`).join("") : `<div class="activity-item"><div class="activity-copy">Belum ada data siswa.</div></div>`}</div></section>
    <section class="panel"><div class="panel-heading"><h2>Akses cepat</h2><span>Kelola data</span></div><div class="quick-grid">${Object.entries(modules).slice(0, 4).map(([key, module]) => `<button class="quick-link" data-page="${key}"><span>${module.icon}</span><strong>${module.label} ↗</strong></button>`).join("")}</div></section></div>`;
}

function renderTable(moduleKey, query = "") {
  const module = modules[moduleKey];
  const rows = data[moduleKey].map((record, index) => ({ record, index })).filter(({ record }) => Object.values(record).some((value) => String(value).toLowerCase().includes(query.toLowerCase())));
  const columns = module.fields.slice(0, 5);
  const action = `<button class="button button-dark button-small" data-create="${moduleKey}"><span aria-hidden="true">＋</span> Tambah ${module.singular}</button>`;
  return `${heading(module.code, module.label, `Kelola informasi ${module.label.toLowerCase()} sekolah.`, action)}
    <section class="panel data-panel"><div class="table-toolbar"><span class="table-count">Menampilkan ${rows.length} dari ${data[moduleKey].length} data</span><div class="toolbar-actions"><label class="search-wrap"><span aria-hidden="true">⌕</span><input class="search-input" type="search" placeholder="Cari ${module.singular}..." aria-label="Cari ${module.singular}" data-search="${moduleKey}" value="${escapeHTML(query)}"></label></div></div>
    <div class="table-scroll"><table class="data-table"><thead><tr>${columns.map((field) => `<th>${field.label.toUpperCase()}</th>`).join("")}<th style="text-align:right">AKSI</th></tr></thead><tbody>${rows.length ? rows.map(({ record, index }) => `<tr>${columns.map((field) => `<td>${escapeHTML(record[field.key]) || "—"}</td>`).join("")}<td><div class="row-actions"><button class="icon-button" data-edit="${moduleKey}" data-index="${index}" aria-label="Edit data" title="Edit">✎</button><button class="icon-button danger" data-delete="${moduleKey}" data-index="${index}" aria-label="Hapus data" title="Hapus">×</button></div></td></tr>`).join("") : `<tr><td class="empty-state" colspan="${columns.length + 1}">Tidak ada data yang cocok.</td></tr>`}</tbody></table></div></section>`;
}

function renderPage(page, query = "") {
  activePage = page in modules || page === "overview" ? page : "overview";
  renderNav();
  const current = navItems.find((item) => item.key === activePage);
  document.querySelector("#breadcrumbCurrent").textContent = current.label;
  document.querySelector("#todayLabel").textContent = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());
  dashboardContent.innerHTML = activePage === "overview" ? renderOverview() : renderTable(activePage, query);
}

function openForm(moduleKey, index = null) {
  const module = modules[moduleKey];
  editingIndex = index;
  const record = index === null ? {} : data[moduleKey][index];
  document.querySelector("#dialogKicker").textContent = module.code;
  document.querySelector("#dialogTitle").textContent = `${index === null ? "Tambah" : "Edit"} ${module.singular}`;
  document.querySelector("#formFields").innerHTML = module.fields.map((field) => {
    const required = field.required ? "required" : "";
    const value = escapeHTML(record[field.key] ?? "");
    const control = field.type === "select"
      ? `<select class="field-control" name="${field.key}" ${required}>${field.options.map((option) => `<option value="${escapeHTML(option)}" ${record[field.key] === option ? "selected" : ""}>${escapeHTML(option)}</option>`).join("")}</select>`
      : `<input class="field-control" name="${field.key}" type="${field.type || "text"}" value="${value}" ${required} ${field.type === "number" ? 'min="0"' : ""} placeholder="Masukkan ${field.label.toLowerCase()}">`;
    return `<div class="form-field"><label for="field-${field.key}">${field.label}${field.required ? " *" : ""}</label>${control.replace(`name="${field.key}"`, `id="field-${field.key}" name="${field.key}"`)}</div>`;
  }).join("");
  form.dataset.module = moduleKey;
  dialog.showModal();
  form.querySelector("input, select")?.focus();
}

document.addEventListener("click", (event) => {
  const dashboardButton = event.target.closest("[data-open-dashboard]");
  if (dashboardButton) {
    event.preventDefault();
    return showDashboard();
  }
  const homeButton = event.target.closest("[data-home]");
  if (homeButton) {
    event.preventDefault();
    return showLanding();
  }
  const pageButton = event.target.closest("[data-page]");
  if (pageButton) return renderPage(pageButton.dataset.page);
  const createButton = event.target.closest("[data-create]");
  if (createButton) return openForm(createButton.dataset.create);
  const editButton = event.target.closest("[data-edit]");
  if (editButton) return openForm(editButton.dataset.edit, Number(editButton.dataset.index));
  const deleteButton = event.target.closest("[data-delete]");
  if (deleteButton) {
    const moduleKey = deleteButton.dataset.delete;
    const record = data[moduleKey][Number(deleteButton.dataset.index)];
    if (window.confirm(`Hapus data "${record.name || record.student || record.code || record.nis || record.nip || "ini"}"?`)) {
      data[moduleKey].splice(Number(deleteButton.dataset.index), 1);
      saveData();
      renderPage(moduleKey);
    }
    return;
  }
  if (event.target.closest("[data-close-dialog]")) dialog.close();
});

dashboardContent.addEventListener("input", (event) => {
  const search = event.target.closest("[data-search]");
  if (!search) return;
  const cursor = search.selectionStart;
  renderPage(search.dataset.search, search.value);
  const replacement = dashboardContent.querySelector("[data-search]");
  replacement.focus();
  replacement.setSelectionRange(cursor, cursor);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const moduleKey = form.dataset.module;
  const record = Object.fromEntries(new FormData(form).entries());
  if (editingIndex === null) data[moduleKey].push(record);
  else data[moduleKey][editingIndex] = record;
  saveData();
  dialog.close();
  renderPage(moduleKey);
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelectorAll("[data-home]").forEach((link) => link.addEventListener("click", (event) => {
  if (link.tagName === "A") event.preventDefault();
}));