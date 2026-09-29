(() => {
  const storageKey = "siakad-pemberdayaan-bangsa-v1";
  const controlStorageKey = "siakad-control-center-v1";
  const definitions = {
    students: {
      label: "Data siswa", singular: "siswa", icon: "♙", code: "SISWA", file: "siswa.html",
      fields: [
        { key: "nis", label: "NIS", required: true }, { key: "name", label: "Nama lengkap", required: true },
        { key: "class", label: "Kelas", type: "select", options: ["X IPA 1", "X IPS 1", "XI IPA 1", "XI IPS 1", "XII IPA 1", "XII IPS 1"] },
        { key: "gender", label: "Jenis kelamin", type: "select", options: ["Laki-laki", "Perempuan"] },
        { key: "status", label: "Status", type: "select", options: ["Aktif", "Alumni", "Pindah"] }, { key: "phone", label: "Nomor telepon", type: "tel" }
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
      label: "Data guru", singular: "guru", icon: "♧", code: "GURU", file: "guru.html",
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
      label: "Data kelas", singular: "kelas", icon: "▦", code: "KELAS", file: "kelas.html",
      fields: [
        { key: "code", label: "Kode kelas", required: true }, { key: "name", label: "Nama kelas", required: true },
        { key: "homeroom", label: "Wali kelas", required: true }, { key: "capacity", label: "Kapasitas siswa", type: "number", required: true }, { key: "room", label: "Ruang kelas" }
      ],
      seed: [
        { code: "X-IPA-1", name: "X IPA 1", homeroom: "Dian Kusuma, S.Pd.", capacity: "32", room: "Ruang 1" },
        { code: "X-IPS-1", name: "X IPS 1", homeroom: "Siti Rahayu, S.Pd.", capacity: "30", room: "Ruang 2" },
        { code: "XI-IPA-1", name: "XI IPA 1", homeroom: "Budi Santoso, S.Pd.", capacity: "30", room: "Ruang 3" },
        { code: "XII-IPA-1", name: "XII IPA 1", homeroom: "Dian Kusuma, S.Pd.", capacity: "28", room: "Ruang 4" }
      ]
    },
    subjects: {
      label: "Mata pelajaran", singular: "mata pelajaran", icon: "▤", code: "MAPEL", file: "mapel.html",
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
      label: "Jadwal pelajaran", singular: "jadwal", icon: "◷", code: "JADWAL", file: "jadwal.html",
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
      label: "Data nilai", singular: "nilai", icon: "▥", code: "NILAI", file: "nilai.html",
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
    },
    registrations: {
      label: "Pendaftaran", singular: "pendaftar", icon: "＋", code: "PPDB", file: "pendaftaran.html",
      fields: [
        { key: "name", label: "Nama calon siswa", required: true }, { key: "nisn", label: "NISN", required: true },
        { key: "origin", label: "Asal sekolah", required: true }, { key: "phone", label: "Nomor wali", type: "tel", required: true },
        { key: "date", label: "Tanggal daftar", type: "date", required: true },
        { key: "status", label: "Status", type: "select", options: ["Baru", "Verifikasi", "Diterima", "Ditolak"] }
      ], seed: []
    },
    announcements: {
      label: "Pengumuman", singular: "pengumuman", icon: "▣", code: "INFO", file: "pengumuman.html",
      fields: [
        { key: "date", label: "Tanggal", type: "date", required: true }, { key: "title", label: "Judul pengumuman", required: true },
        { key: "category", label: "Kategori", type: "select", options: ["Akademik", "Kegiatan", "Pendaftaran", "Lainnya"] },
        { key: "content", label: "Isi pengumuman", type: "textarea", required: true },
        { key: "status", label: "Status", type: "select", options: ["Terbit", "Draf"] }
      ],
      seed: [
        { date: "2025-08-12", title: "Informasi tahun ajaran baru", category: "Akademik", content: "Kegiatan belajar mengajar semester ganjil dimulai sesuai kalender akademik.", status: "Terbit" },
        { date: "2025-07-28", title: "Penerimaan peserta didik baru", category: "Pendaftaran", content: "Pendaftaran siswa baru dibuka melalui sekretariat sekolah.", status: "Terbit" }
      ]
    }
  };

  const navItems = [{ key: "overview", label: "Ringkasan", icon: "⌂", file: "dashboard.html" }, ...Object.entries(definitions).map(([key, item]) => ({ key, label: item.label, icon: item.icon, file: item.file })), { key: "attendance", label: "Absensi", icon: "◉", file: "absensi.html" }, { key: "exam", label: "Ujian", icon: "▣", file: "ujian.html" }];
  const pageAccess = { students: ["academic.students", "academic"], teachers: ["academic.teachers", "academic"], classes: ["academic.classes", "academic"], subjects: ["academic.subjects", "academic"], schedules: ["academic.schedule", "academic"], grades: ["academic.grades", "academic"], attendance: ["attendance.dashboard", "attendance"], exam: ["exam.autosave", "exam"] };
  const copy = (value) => JSON.parse(JSON.stringify(value));
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

  function canAccessPage(key) {
    if (key === "overview") return true;
    let control;
    try { control = JSON.parse(localStorage.getItem(controlStorageKey) || "null"); } catch { return false; }
    if (!control) return true;
    const roleCode = control.rolePreview || "DEVELOPER";
    const role = control.roles?.find((item) => item.code === roleCode || item.id === roleCode);
    if (!role || role.status !== "ACTIVE") return false;
    if (role.code === "DEVELOPER") return true;
    const [featureId, moduleId] = pageAccess[key] || [];
    if (!featureId) return false;
    const feature = control.features?.find((item) => item.id === featureId);
    const module = control.modules?.find((item) => item.id === moduleId);
    if (!feature || !module || feature.status !== "ACTIVE" || module.status !== "ACTIVE") return false;
    if (!feature.availableRoles?.includes(role.name) || !module.availableRoles?.includes(role.name)) return false;
    const grants = role.permissions || [];
    return !feature.requiredPermission || grants.includes(feature.requiredPermission) || grants.includes(`${moduleId}.manage`) || grants.includes(`${moduleId}.view`);
  }

  function loadData() {
    let stored = {};
    try {
      stored = JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch (error) {
      console.warn("Data SIAKAD lokal tidak dapat dibaca.", error);
    }
    return {
      ...stored,
      ...Object.fromEntries(Object.entries(definitions).map(([key, item]) => [key, Array.isArray(stored[key]) ? stored[key] : copy(item.seed)]))
    };
  }

  let data = loadData();
  let activeKey = "overview";
  let editingIndex = null;
  let searchQuery = "";
  let pageContent;
  let dialog;
  let recordForm;

  function saveData() {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  function makeHeading(kicker, title, description, action = "") {
    return `<div class="page-heading"><div><div class="section-kicker"><span>${kicker}</span><span>PORTAL AKADEMIK</span></div><h1>${title}</h1><p>${description}</p></div>${action}</div>`;
  }

  function renderOverview() {
    const average = data.grades.length ? Math.round(data.grades.reduce((total, grade) => total + Number(grade.score || 0), 0) / data.grades.length) : 0;
    const metrics = [
      ["Siswa aktif", data.students.filter((item) => item.status === "Aktif").length, "Terdaftar di tahun ajaran ini", "♙"],
      ["Tenaga pendidik", data.teachers.length, "Guru dan staf pengajar", "♧"],
      ["Rombongan belajar", data.classes.length, "Kelas aktif", "▦"],
      ["Rata-rata nilai", average, "Dari data nilai tersimpan", "↗"]
    ];
    const recent = data.students.slice(-4).reverse();
    return `${makeHeading("01", "Ringkasan akademik", "Gambaran umum aktivitas SMA Pemberdayaan Bangsa.")}
      <div class="metric-grid">${metrics.map(([label, value, note, icon]) => `<article class="metric-card"><div class="metric-top"><span>${label}</span><span class="metric-icon">${icon}</span></div><strong class="metric-value">${value}</strong><div class="metric-foot">${note}</div></article>`).join("")}</div>
      <div class="overview-grid"><section class="panel"><div class="panel-heading"><h2>Siswa terbaru</h2><span>${data.students.length} data siswa</span></div><div class="activity-list">${recent.length ? recent.map((student) => `<div class="activity-item"><span class="activity-mark">${escapeHTML((student.name || "S").slice(0, 1))}</span><div class="activity-copy"><strong>${escapeHTML(student.name)}</strong> · ${escapeHTML(student.class)}</div><time>${escapeHTML(student.status)}</time></div>`).join("") : `<div class="activity-item"><div class="activity-copy">Belum ada data siswa.</div></div>`}</div></section>
      <section class="panel"><div class="panel-heading"><h2>Akses cepat</h2><span>Kelola data</span></div><div class="quick-grid">${Object.entries(definitions).slice(0, 4).map(([key, item]) => `<a class="quick-link" href="${item.file}"><span>${item.icon}</span><strong>${item.label} ↗</strong></a>`).join("")}</div></section></div>`;
  }

  function renderTable(query = "") {
    const item = definitions[activeKey];
    const rows = data[activeKey].map((record, index) => ({ record, index })).filter(({ record }) => Object.values(record).some((value) => String(value).toLowerCase().includes(query.toLowerCase())));
    const columns = item.fields.slice(0, 5);
    const addButton = `<button class="button button-dark button-small" data-create="${activeKey}"><span aria-hidden="true">＋</span> Tambah ${item.singular}</button>`;
    return `${makeHeading(item.code, item.label, `Kelola informasi ${item.label.toLowerCase()} sekolah.`, addButton)}
      <section class="panel data-panel"><div class="table-toolbar"><span class="table-count">Menampilkan ${rows.length} dari ${data[activeKey].length} data</span><div class="toolbar-actions"><label class="search-wrap"><span aria-hidden="true">⌕</span><input class="search-input" type="search" placeholder="Cari ${item.singular}..." aria-label="Cari ${item.singular}" data-search value="${escapeHTML(query)}"></label></div></div>
      <div class="table-scroll"><table class="data-table"><thead><tr>${columns.map((field) => `<th>${field.label.toUpperCase()}</th>`).join("")}<th style="text-align:right">AKSI</th></tr></thead><tbody>${rows.length ? rows.map(({ record, index }) => `<tr>${columns.map((field) => `<td>${escapeHTML(record[field.key]) || "—"}</td>`).join("")}<td><div class="row-actions"><button class="icon-button" data-edit="${index}" aria-label="Edit data" title="Edit">✎</button><button class="icon-button danger" data-delete="${index}" aria-label="Hapus data" title="Hapus">×</button></div></td></tr>`).join("") : `<tr><td class="empty-state" colspan="${columns.length + 1}">Tidak ada data yang cocok.</td></tr>`}</tbody></table></div></section>`;
  }

  function render() {
    pageContent.innerHTML = activeKey === "overview" ? renderOverview() : renderTable(searchQuery);
    document.querySelectorAll(".side-link").forEach((link) => {
      const active = link.dataset.key === activeKey;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function openForm(index = null) {
    const item = definitions[activeKey];
    const record = index === null ? {} : data[activeKey][index];
    editingIndex = index;
    document.querySelector("#dialogKicker").textContent = item.code;
    document.querySelector("#dialogTitle").textContent = `${index === null ? "Tambah" : "Edit"} ${item.singular}`;
    document.querySelector("#formFields").innerHTML = item.fields.map((field) => {
      const required = field.required ? "required" : "";
      const value = escapeHTML(record[field.key] ?? "");
      let control;
      if (field.type === "select") {
        control = `<select class="field-control" name="${field.key}" id="field-${field.key}" ${required}>${field.options.map((option) => `<option value="${escapeHTML(option)}" ${record[field.key] === option ? "selected" : ""}>${escapeHTML(option)}</option>`).join("")}</select>`;
      } else if (field.type === "textarea") {
        control = `<textarea class="field-control text-area-control" name="${field.key}" id="field-${field.key}" rows="4" ${required}>${value}</textarea>`;
      } else {
        control = `<input class="field-control" name="${field.key}" id="field-${field.key}" type="${field.type || "text"}" value="${value}" ${required} ${field.type === "number" ? 'min="0"' : ""} placeholder="Masukkan ${field.label.toLowerCase()}">`;
      }
      return `<div class="form-field"><label for="field-${field.key}">${field.label}${field.required ? " *" : ""}</label>${control}</div>`;
    }).join("");
    recordForm.dataset.module = activeKey;
    dialog.showModal();
    recordForm.querySelector("input, select, textarea")?.focus();
  }

  function initialize(key) {
    activeKey = key;
    pageContent = document.querySelector("#pageContent");
    dialog = document.querySelector("#recordDialog");
    recordForm = document.querySelector("#recordForm");
    const sideNav = document.querySelector("#sideNav");
    const current = navItems.find((item) => item.key === key) || navItems[0];
    renderNavigation(key);
    if (!canAccessPage(key)) {
      document.querySelector(".breadcrumb strong").textContent = "Akses ditolak";
      pageContent.innerHTML = `<section class="panel development-state"><div><span class="development-icon">!</span><h2>Akses belum diberikan</h2><p>Role aktif tidak memiliki permission atau feature untuk halaman ini. Ubah akses dari Developer Control Center.</p><a class="button button-dark" href="../index.html">Kembali ke Control Center</a></div></section>`;
      return;
    }
    document.querySelector(".breadcrumb strong").textContent = current.label;
    const today = document.querySelector("[data-today]");
    if (today) today.textContent = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());
    render();

    document.addEventListener("click", (event) => {
      const create = event.target.closest("[data-create]");
      if (create) return openForm();
      const edit = event.target.closest("[data-edit]");
      if (edit) return openForm(Number(edit.dataset.edit));
      const remove = event.target.closest("[data-delete]");
      if (remove) {
        const record = data[activeKey][Number(remove.dataset.delete)];
        const firstValue = record.name || record.title || record.student || record.code || record.nis || record.nip || "data ini";
        if (window.confirm(`Hapus "${firstValue}"?`)) {
          data[activeKey].splice(Number(remove.dataset.delete), 1);
          saveData();
          render();
        }
      }
      if (event.target.closest("[data-close-dialog]")) dialog.close();
    });

    pageContent.addEventListener("input", (event) => {
      if (!event.target.matches("[data-search]")) return;
      const cursor = event.target.selectionStart;
      searchQuery = event.target.value;
      render();
      const replacement = pageContent.querySelector("[data-search]");
      replacement.focus();
      replacement.setSelectionRange(cursor, cursor);
    });

    recordForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const moduleKey = recordForm.dataset.module;
      const record = Object.fromEntries(new FormData(recordForm).entries());
      if (editingIndex === null) data[moduleKey].push(record);
      else data[moduleKey][editingIndex] = record;
      saveData();
      dialog.close();
      render();
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  function renderNavigation(activeKey) {
    const sideNav = document.querySelector("#sideNav");
    if (!sideNav) return;
    sideNav.innerHTML = navItems.filter((item) => canAccessPage(item.key)).map((item) => `<a class="side-link ${item.key === activeKey ? "active" : ""}" data-key="${item.key}" href="${item.file}" ${item.key === activeKey ? 'aria-current="page"' : ""}><span class="side-icon">${item.icon}</span><span>${item.label}</span></a>`).join("");
  }

  window.SiakadPages = { init: initialize, renderNavigation };
})();