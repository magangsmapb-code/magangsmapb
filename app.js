(() => {
  "use strict";

  const STORAGE_KEY = "siakad-control-center-v1";
  const nowISO = () => new Date().toISOString();
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const permissionActions = ["view", "create", "read", "update", "delete", "approve", "reject", "export", "import", "print", "download", "upload", "verify", "manage", "configure"];
  const roleRows = [
    ["Developer", "DEVELOPER", "Kontrol penuh dan pengelolaan platform", "ACTIVE"], ["Super Admin", "SUPER_ADMIN", "Administrasi sistem sekolah", "ACTIVE"], ["Admin", "ADMIN", "Administrasi operasional", "ACTIVE"], ["Kepala Sekolah", "PRINCIPAL", "Pimpinan satuan pendidikan", "ACTIVE"], ["Wakil Kepala Sekolah", "VICE_PRINCIPAL", "Koordinasi bidang sekolah", "ACTIVE"], ["Guru", "TEACHER", "Pendidik mata pelajaran", "ACTIVE"], ["Wali Kelas", "HOMEROOM", "Pengelolaan kelas dan siswa", "ACTIVE"], ["Bendahara", "TREASURER", "Pengelolaan administrasi keuangan", "ACTIVE"], ["Tata Usaha", "STAFF", "Administrasi tata usaha", "ACTIVE"], ["Operator", "OPERATOR", "Operasional data akademik", "ACTIVE"], ["Siswa", "STUDENT", "Akses akademik peserta didik", "ACTIVE"], ["Orang Tua/Wali", "PARENT", "Pemantauan akademik anak", "ACTIVE"], ["Pengawas Ujian", "EXAM_PROCTOR", "Pengawasan pelaksanaan ujian", "ACTIVE"], ["Auditor", "AUDITOR", "Tinjauan catatan dan kepatuhan", "ACTIVE"], ["Pustakawan", "LIBRARIAN", "Administrasi dokumen dan koleksi", "ACTIVE"]
  ];
  const moduleRows = [
    ["Academic", "academic", "Kurikulum, kelas, mata pelajaran", ["academic.manage"]], ["Attendance", "attendance", "Presensi dan koreksi kehadiran", ["attendance.verify"]], ["Exam", "exam", "Ujian, soal, dan pengawasan", ["exam.manage"]], ["Finance", "finance", "Tagihan, transaksi, dan laporan", ["finance.approve"]], ["Users", "users", "Akun dan penugasan role", ["user.manage"]], ["Documents", "documents", "Dokumen sekolah dan arsip", ["document.manage"]], ["Notifications", "notifications", "Pemberitahuan pengguna", ["notification.manage"]], ["Reports", "reports", "Laporan akademik dan operasional", ["report.export"]], ["Security", "security", "Keamanan aplikasi dan audit", ["security.manage"]], ["Integrations", "integrations", "Koneksi layanan eksternal", ["integration.configure"]]
  ];
  const roleNames = roleRows.map((row) => row[0]);
  const permissions = ["dashboard.view", ...["finance", "exam", "attendance", "user", "role", "permission", "feature", "module", "academic", "document", "notification", "report", "security", "route", "backup", "integration"].flatMap((domain) => permissionActions.filter((action) => ["view", "create", "read", "update", "delete", "manage", "configure", "approve", "verify", "monitor", "grade", "correct", "export"].includes(action)).map((action) => `${domain}.${action}`))].filter((item, index, all) => all.indexOf(item) === index);
  const featureNames = [
    ["School Dashboard", "dashboard.home", "Academic", "Dashboard ringkasan sekolah", "dashboard.view"], ["Student Records", "academic.students", "Academic", "Data siswa dan profil", "academic.view"], ["Teacher Records", "academic.teachers", "Academic", "Data guru dan penugasan", "academic.view"], ["Class Management", "academic.classes", "Academic", "Data kelas dan wali kelas", "academic.manage"], ["Subject Catalog", "academic.subjects", "Academic", "Katalog mata pelajaran", "academic.view"], ["Timetable", "academic.schedule", "Academic", "Jadwal pembelajaran", "academic.view"], ["Gradebook", "academic.grades", "Academic", "Input dan tinjau nilai", "academic.update"], ["Attendance Dashboard", "attendance.dashboard", "Attendance", "Ringkasan kehadiran", "attendance.view"], ["Face Scan Check-in", "attendance.face_scan", "Attendance", "Pemeriksaan wajah presensi", "attendance.verify"], ["Liveness Detection", "attendance.liveness", "Attendance", "Pemeriksaan keaktifan wajah", "attendance.verify"], ["Geofence Validation", "attendance.geofence", "Attendance", "Pemeriksaan radius lokasi", "attendance.verify"], ["Wi-Fi Validation", "attendance.wifi", "Attendance", "Pemeriksaan jaringan sekolah", "attendance.verify"], ["Device Binding", "attendance.device_binding", "Attendance", "Ikatan perangkat terdaftar", "attendance.manage"], ["Attendance Correction", "attendance.correction", "Attendance", "Koreksi catatan presensi", "attendance.correct"], ["Exam Management", "exam.manage", "Exam", "Jadwal dan konfigurasi ujian", "exam.manage"], ["Question Bank", "exam.question_bank", "Exam", "Bank soal dan materi ujian", "exam.update"], ["Randomized Questions", "exam.randomize", "Exam", "Pengacakan soal dan jawaban", "exam.configure"], ["Lock Exam Mode", "exam.lock_mode", "Exam", "Mode fokus dan layar penuh", "exam.monitor"], ["Periodic Face Check", "exam.face_check", "Exam", "Verifikasi berkala peserta", "exam.verify"], ["Exam Auto Save", "exam.autosave", "Exam", "Simpan jawaban berkala", "exam.update"], ["Exam Monitoring", "exam.monitor", "Exam", "Pemantauan sesi ujian", "exam.monitor"], ["Billing", "finance.billing", "Finance", "Tagihan sekolah", "finance.view"], ["Payment Recording", "finance.payments", "Finance", "Pencatatan pembayaran", "finance.create"], ["Finance Approval", "finance.approval", "Finance", "Persetujuan transaksi", "finance.approve"], ["Invoices & Receipts", "finance.documents", "Finance", "Invoice dan kuitansi", "finance.view"], ["Financial Reports", "finance.reports", "Finance", "Laporan keuangan", "finance.export"], ["User Administration", "users.admin", "Users", "Administrasi akun pengguna", "user.manage"], ["Role Assignment", "users.role_assignment", "Users", "Penetapan role pengguna", "role.manage"], ["Login History", "security.login_history", "Security", "Riwayat akses pengguna", "security.view"], ["Security Events", "security.events", "Security", "Tinjauan kejadian keamanan", "security.view"], ["Audit Log Viewer", "security.audit_log", "Security", "Riwayat perubahan sistem", "audit.view"], ["Document Archive", "documents.archive", "Documents", "Arsip dokumen sekolah", "document.view"], ["Notification Center", "notifications.center", "Notifications", "Notifikasi dan pengumuman", "notification.view"], ["Data Export", "reports.export", "Reports", "Ekspor laporan terkontrol", "report.export"], ["Backup Manager", "system.backup", "System", "Pencadangan data lokal", "backup.manage"], ["Route Registry", "system.routes", "System", "Pemetaan route dan akses", "route.manage"], ["Developer Tools", "system.devtools", "System", "Perkakas developer lokal", "developer.manage"]
  ];
  const routePaths = ["/dashboard", "/admin", "/teacher", "/student", "/parent", "/attendance", "/exam", "/finance", "/reports", "/users", "/roles", "/permissions", "/features", "/modules", "/documents", "/notifications", "/security", "/audit-log", "/settings", "/backup", "/developer-tools", "/academic", "/classes", "/grades"];
  const userNames = ["Siti Rahayu", "Budi Santoso", "Dian Kusuma", "Ahmad Fauzan", "Aisyah Putri", "Bagas Pratama", "Dewi Lestari", "Fajar Ramadhan", "Rina Wulandari", "Agus Setiawan", "Nadia Safitri", "Hendra Wijaya", "Maya Puspita", "Rizki Maulana", "Lina Kartika", "Dimas Prakoso", "Yuni Astuti", "Teguh Firmansyah", "Novi Anggraini", "Arif Nugroho", "Sari Handayani", "Eko Saputra", "Fitri Amalia", "Joko Susilo", "Intan Permata"];
  const userRoleCodes = ["TEACHER", "TEACHER", "TEACHER", "STUDENT", "STUDENT", "STUDENT", "STUDENT", "STUDENT", "HOMEROOM", "ADMIN", "STUDENT", "VICE_PRINCIPAL", "TREASURER", "STUDENT", "STAFF", "EXAM_PROCTOR", "PARENT", "OPERATOR", "STUDENT", "AUDITOR", "STUDENT", "STUDENT", "STUDENT", "SUPER_ADMIN", "DEVELOPER"];
  const seedFeatures = featureNames.map(([name, id, category, description, permission], index) => ({ id, name, category, description, icon: ["▦", "♙", "▤", "◷", "▣"][index % 5], route: `/${id.replaceAll(".", "/")}`, status: index < 34 ? "ACTIVE" : index < 36 ? "BETA" : "INACTIVE", version: "1.0.0", requiredPermission: permission, availableRoles: index === 0 ? roleNames.slice(0, 12) : defaultRolesFor(category), dependencies: [], developerOnly: index === 36, betaFeature: index === 34 || index === 35, maintenanceMode: false }));

  function defaultRolesFor(category) {
    if (category === "Finance") return ["Developer", "Super Admin", "Admin", "Bendahara", "Kepala Sekolah", "Auditor"];
    if (category === "Exam") return ["Developer", "Super Admin", "Admin", "Guru", "Siswa", "Pengawas Ujian"];
    if (category === "Attendance") return ["Developer", "Super Admin", "Admin", "Guru", "Siswa", "Wali Kelas", "Operator"];
    if (category === "System" || category === "Security") return ["Developer", "Super Admin", "Auditor"];
    return ["Developer", "Super Admin", "Admin", "Guru", "Wali Kelas", "Siswa", "Orang Tua/Wali", "Operator"];
  }
  const seed = {
    users: userNames.map((name, index) => ({ id: `USR-${String(index + 1).padStart(4, "0")}`, name, email: `${name.toLowerCase().replaceAll(" ", ".")}@siakad.sch.id`, role: userRoleCodes[index], status: index === 10 ? "DISABLED" : "ACTIVE", device: index % 4 === 0 ? "Android · terdaftar" : "Browser · sekolah", lastLogin: new Date(Date.now() - index * 5400000).toISOString(), loginFailures: index % 7 === 0 ? 1 : 0 })),
    roles: roleRows.map(([name, code, description, status], index) => ({ id: code, name, code, description, status, dashboard: `/${code.toLowerCase().replaceAll("_", "-")}`, modules: moduleRows.filter((item) => index < 3 || item[1] === "academic" || (index === 7 && item[1] === "finance")).map((item) => item[1]), features: [], permissions: index === 0 ? permissions.slice(0, 36) : code === "ADMIN" || code === "SUPER_ADMIN" ? ["dashboard.view", "academic.view", "academic.manage", "attendance.view", "attendance.verify", "exam.view", "exam.manage", "finance.view", "finance.approve", "user.manage"] : code === "STUDENT" ? ["dashboard.view", "academic.view", "attendance.view", "attendance.verify", "exam.view", "exam.update"] : code === "TEACHER" || code === "HOMEROOM" ? ["dashboard.view", "academic.view", "academic.update", "attendance.view", "attendance.verify", "exam.view", "exam.manage"] : code === "TREASURER" ? ["dashboard.view", "finance.view", "finance.create", "finance.approve", "finance.export"] : code === "PARENT" ? ["dashboard.view", "academic.view", "attendance.view"] : [`${index < 10 ? "academic" : "dashboard"}.view`], assignedUsers: userRoleCodes.filter((role) => role === code).length })),
    permissions: permissions.slice(0, 45).map((name, index) => ({ id: name, name, category: name.split(".")[0], action: name.split(".")[1], description: `Hak ${name.split(".")[1]} untuk modul ${name.split(".")[0]}.`, status: "ACTIVE", createdAt: new Date(Date.now() - index * 86400000).toISOString() })),
    features: seedFeatures,
    modules: moduleRows.map(([name, id, description, requiredPermissions], index) => ({ id, name, description, status: index === 9 ? "BETA" : "ACTIVE", dependencies: index === 1 || index === 2 ? ["users"] : [], availableRoles: defaultRolesFor(name), requiredPermissions, featureIds: seedFeatures.filter((feature) => feature.category.toLowerCase() === name.toLowerCase()).map((feature) => feature.id) })),
    routes: routePaths.map((path, index) => ({ id: `RTE-${String(index + 1).padStart(3, "0")}`, name: path.split("/").filter(Boolean).map((word) => word[0].toUpperCase() + word.slice(1)).join(" ") || "Dashboard", path, module: ["academic", "attendance", "exam", "finance", "users", "documents", "notifications", "security", "reports"][index % 9], requiredRole: index === 0 ? "ALL" : "Developer", requiredPermission: index === 0 ? "dashboard.view" : "route.manage", status: index < 12 ? "ACTIVE" : "DEVELOPMENT", fallback: "pages/under-development.html" })),
    attendance: [{ id: "ATT-2026-0929", student: "Ahmad Fauzan", class: "X IPA 1", date: "2026-09-29", checkIn: "07:12", method: "QR + lokasi", status: "HADIR", location: "Dalam geofence" }, { id: "ATT-2026-0928", student: "Aisyah Putri", class: "X IPA 1", date: "2026-09-29", checkIn: "07:24", method: "QR + lokasi", status: "TERLAMBAT", location: "Dalam geofence" }],
    exams: [{ id: "EXM-2026-01", name: "Penilaian Tengah Semester · Biologi", subject: "Biologi", class: "XI IPA 1", startAt: "2026-10-05T01:00:00.000Z", duration: 90, status: "SCHEDULED", participants: 28, securityProfile: "Face + device + fullscreen" }, { id: "EXM-2026-02", name: "Latihan Matematika", subject: "Matematika", class: "X IPA 1", startAt: "2026-10-07T02:00:00.000Z", duration: 60, status: "DRAFT", participants: 30, securityProfile: "Basic" }],
    finance: [{ id: "TRX-20260929-001", user: "Siti Rahayu", date: "2026-09-29", amount: 350000, type: "SPP", method: "Transfer", status: "PENDING", evidence: "bukti-spp-001.jpg", createdBy: "USR-0002", approvedBy: "-", updatedBy: "USR-0002" }, { id: "TRX-20260928-004", user: "Ahmad Fauzan", date: "2026-09-28", amount: 125000, type: "Kegiatan", method: "QRIS", status: "APPROVED", evidence: "bukti-kegiatan-004.jpg", createdBy: "USR-0004", approvedBy: "USR-0013", updatedBy: "USR-0013" }],
    notifications: [{ id: "NTF-001", title: "Jadwal ujian diperbarui", message: "Jadwal PTS Biologi tersedia di portal.", type: "INFO", targetRole: "Siswa", priority: "NORMAL", status: "SENT", scheduledAt: "2026-09-28T09:00:00.000Z" }, { id: "NTF-002", title: "Perlu persetujuan transaksi", message: "Ada transaksi menunggu verifikasi.", type: "WARNING", targetRole: "Bendahara", priority: "HIGH", status: "SCHEDULED", scheduledAt: "2026-09-29T02:00:00.000Z" }],
    securityEvents: Array.from({ length: 15 }, (_, index) => ({ id: `SEC-${String(index + 1).padStart(3, "0")}`, type: ["Failed Login", "Unknown Device", "Permission Violation", "Exam Violation", "Suspicious Login"][index % 5], user: userNames[index], severity: ["LOW", "MEDIUM", "HIGH", "CRITICAL"][index % 4], date: new Date(Date.now() - index * 3600000).toISOString(), status: index < 4 ? "OPEN" : "REVIEWED", detail: "Perlu tinjauan operator keamanan." })),
    auditLogs: Array.from({ length: 20 }, (_, index) => ({ id: `AUD-${String(index + 1).padStart(4, "0")}`, timestamp: new Date(Date.now() - index * 7200000).toISOString(), user: index === 0 ? "Developer" : userNames[index], role: index === 0 ? "Developer" : userRoleCodes[index], action: ["UPDATE", "CREATE", "VERIFY", "LOGIN", "CONFIGURE"][index % 5], module: ["Feature Management", "User Management", "Attendance System", "Finance System", "System Configuration"][index % 5], feature: seedFeatures[index % seedFeatures.length].id, target: seedFeatures[index % seedFeatures.length].name, before: index % 2 ? "ACTIVE" : "DRAFT", after: index % 2 ? "BETA" : "ACTIVE", ip: `10.10.0.${20 + index}`, device: "Chrome · Windows", status: "SUCCESS" })),
    systemConfig: { school: { name: "SMA Pemberdayaan Bangsa", address: "Ngrayun, Ponorogo", logo: "PB", timezone: "Asia/Jakarta", language: "id-ID", academicYear: "2025/2026", semester: "Ganjil", theme: "Forest Green" }, security: { sessionTimeout: 30, minPasswordLength: 10, requireTwoFactor: false, allowedLoginAttempts: 5 }, attendance: { latitude: "", longitude: "", radius: 100, allowedWifi: "", start: "06:30", end: "16:00", lateTolerance: 15, faceRecognition: true, liveness: true, antiSpoofing: true, mockGpsDetection: true, wifiValidation: true, deviceBinding: true, serverTimestamp: true, duplicateDetection: true, correctionApproval: true, auditTrail: true }, exam: { lockMode: true, fullscreen: true, appSwitchDetection: true, screenshotDetection: false, screenRecordingDetection: false, periodicFaceCheck: true, gpsVerification: true, deviceBinding: true, autoSave: true, autoSubmit: true, suspiciousActivityDetection: true, timerSource: "SERVER" }, finance: { invoiceApproval: true, receiptRequired: true, correctionApproval: true, createRoles: "Admin,Bendahara", receiveRoles: "Bendahara,Tata Usaha", approveRoles: "Kepala Sekolah,Auditor", reportRoles: "Kepala Sekolah,Bendahara,Auditor", correctionRoles: "Super Admin,Bendahara", exportRoles: "Auditor,Bendahara" }, notifications: { emailEnabled: false, inAppEnabled: true, defaultPriority: "NORMAL" }, backup: { automatic: false, frequency: "weekly", keepCount: 5 } },
    integration: [{ id: "INT-001", name: "Email sekolah", provider: "SMTP", status: "NOT_CONFIGURED", endpoint: "", lastSync: "-" }, { id: "INT-002", name: "QRIS Gateway", provider: "Payment API", status: "SANDBOX", endpoint: "Sandbox endpoint", lastSync: "-" }],
    backupHistory: []
  };

  const navigation = [
    { group: "Control Center", items: [["dashboard", "Dashboard", "⌂"], ["overview", "System Overview", "▦"]] },
    { group: "Access Control", items: [["roles", "Role Management", "♙"], ["permissions", "Permission Management", "⌑"], ["features", "Feature Management", "✳"], ["modules", "Module Management", "▤"], ["matrix", "Feature → Role Matrix", "▥"], ["users", "User Management", "◉"]] },
    { group: "School Systems", items: [["students", "Student Management", "♧"], ["teachers", "Teacher Management", "♧"], ["attendance", "Attendance System", "◷"], ["exams", "Exam System", "▣"], ["finance", "Finance System", "$"], ["academic", "Academic System", "▦"], ["notifications", "Notification System", "♢"], ["documents", "Document System", "▤"], ["integration", "Integration", "⤢"]] },
    { group: "Security & Platform", items: [["security", "Security Center", "⚑"], ["audit", "Audit Log", "≋"], ["configuration", "System Configuration", "⚙"], ["routes", "Route Management", "⌘"], ["development", "Under Development", "◷"], ["backup", "Backup & Restore", "⤓"], ["tools", "Developer Tools", "⌘"]] }
  ];
  const viewLabels = Object.fromEntries(navigation.flatMap((group) => group.items.map(([key, label]) => [key, label])));
  const field = (key, label, type = "text", extra = {}) => ({ key, label, type, ...extra });
  const schemas = {
    roles: [field("name", "Nama role", "text", { required: true }), field("code", "Kode role", "text", { required: true }), field("description", "Deskripsi", "textarea"), field("status", "Status", "select", { options: ["ACTIVE", "DISABLED"] }), field("dashboard", "Dashboard route"), field("modules", "Module access (pisahkan koma)", "tags"), field("permissions", "Permission (pisahkan koma)", "tags")],
    permissions: [field("name", "Permission ID", "text", { required: true }), field("category", "Kategori", "text", { required: true }), field("action", "Aksi", "select", { options: permissionActions.map((item) => item.toUpperCase()) }), field("description", "Deskripsi", "textarea"), field("status", "Status", "select", { options: ["ACTIVE", "DISABLED"] })],
    features: [field("name", "Feature name", "text", { required: true }), field("id", "Feature ID", "text", { required: true }), field("category", "Kategori", "text", { required: true }), field("description", "Deskripsi", "textarea"), field("icon", "Icon"), field("route", "Route"), field("status", "Status", "select", { options: ["ACTIVE", "INACTIVE", "BETA", "MAINTENANCE", "DEPRECATED"] }), field("version", "Version"), field("requiredPermission", "Required permission"), field("availableRoles", "Available roles (pisahkan koma)", "tags"), field("dependencies", "Dependencies (pisahkan koma)", "tags"), field("developerOnly", "Developer only", "checkbox"), field("betaFeature", "Beta feature", "checkbox"), field("maintenanceMode", "Maintenance mode", "checkbox")],
    modules: [field("name", "Nama module", "text", { required: true }), field("id", "Module ID", "text", { required: true }), field("description", "Deskripsi", "textarea"), field("status", "Status", "select", { options: ["ACTIVE", "INACTIVE", "MAINTENANCE"] }), field("dependencies", "Dependencies (pisahkan koma)", "tags"), field("availableRoles", "Roles (pisahkan koma)", "tags"), field("requiredPermissions", "Permissions (pisahkan koma)", "tags"), field("featureIds", "Feature IDs (pisahkan koma)", "tags")],
    users: [field("name", "Nama lengkap", "text", { required: true }), field("email", "Email", "email", { required: true }), field("role", "Role code", "select", { options: roleRows.map((row) => row[1]) }), field("status", "Status", "select", { options: ["ACTIVE", "DISABLED", "LOCKED"] }), field("device", "Perangkat"), field("loginFailures", "Failed login", "number")],
    students: [field("nis", "NIS", "text", { required: true }), field("name", "Nama siswa", "text", { required: true }), field("class", "Kelas"), field("gender", "Jenis kelamin", "select", { options: ["Laki-laki", "Perempuan"] }), field("status", "Status", "select", { options: ["ACTIVE", "DISABLED", "ALUMNI"] }), field("phone", "Nomor telepon", "tel")],
    teachers: [field("nip", "NIP", "text", { required: true }), field("name", "Nama guru", "text", { required: true }), field("subject", "Mata pelajaran"), field("email", "Email", "email"), field("status", "Status", "select", { options: ["ACTIVE", "DISABLED"] })],
    routes: [field("name", "Route name", "text", { required: true }), field("path", "Route path", "text", { required: true }), field("module", "Module"), field("requiredRole", "Required role"), field("requiredPermission", "Required permission"), field("status", "Status", "select", { options: ["ACTIVE", "INACTIVE", "DEVELOPMENT"] }), field("fallback", "Fallback page")],
    attendance: [field("student", "Siswa", "text", { required: true }), field("class", "Kelas"), field("date", "Tanggal", "date"), field("checkIn", "Waktu hadir"), field("method", "Metode"), field("status", "Status", "select", { options: ["HADIR", "TERLAMBAT", "IZIN", "SAKIT", "ALPHA"] }), field("location", "Status lokasi")],
    exams: [field("name", "Nama ujian", "text", { required: true }), field("subject", "Mata pelajaran"), field("class", "Kelas"), field("startAt", "Waktu mulai", "datetime-local"), field("duration", "Durasi menit", "number"), field("status", "Status", "select", { options: ["DRAFT", "SCHEDULED", "ACTIVE", "PAUSED", "FINISHED", "ARCHIVED"] }), field("participants", "Peserta", "number"), field("securityProfile", "Profil keamanan")],
    finance: [field("user", "Nama pengguna", "text", { required: true }), field("date", "Tanggal", "date"), field("amount", "Jumlah (Rp)", "number", { required: true }), field("type", "Jenis tagihan", "select", { options: ["SPP", "Ujian", "Kegiatan", "Seragam", "Praktik", "Administrasi", "Lainnya"] }), field("method", "Metode", "select", { options: ["Tunai", "Transfer", "QRIS", "Virtual Account"] }), field("status", "Status", "select", { options: ["PENDING", "APPROVED", "REJECTED"] }), field("evidence", "Bukti transaksi")],
    notifications: [field("title", "Judul", "text", { required: true }), field("message", "Pesan", "textarea", { required: true }), field("type", "Jenis", "select", { options: ["INFO", "SUCCESS", "WARNING", "ERROR", "SECURITY"] }), field("targetRole", "Role tujuan"), field("priority", "Prioritas", "select", { options: ["LOW", "NORMAL", "HIGH"] }), field("status", "Status", "select", { options: ["DRAFT", "SCHEDULED", "SENT", "CANCELLED"] }), field("scheduledAt", "Jadwal", "datetime-local")],
    securityEvents: [field("type", "Jenis kejadian", "text", { required: true }), field("user", "Pengguna"), field("severity", "Severity", "select", { options: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] }), field("date", "Waktu", "datetime-local"), field("status", "Status", "select", { options: ["OPEN", "REVIEWED", "RESOLVED"] }), field("detail", "Detail", "textarea")],
    auditLogs: [field("action", "Aksi", "text", { required: true }), field("module", "Module"), field("target", "Target"), field("before", "Before"), field("after", "After"), field("status", "Status")],
    integration: [field("name", "Nama integrasi", "text", { required: true }), field("provider", "Provider"), field("status", "Status", "select", { options: ["ACTIVE", "SANDBOX", "NOT_CONFIGURED", "DISABLED"] }), field("endpoint", "Endpoint"), field("lastSync", "Sinkronisasi terakhir")]
  };

  const contentArea = document.querySelector("#contentArea");
  const mainNav = document.querySelector("#mainNav");
  const toastRegion = document.querySelector("#toastRegion");
  const entityDialog = document.querySelector("#entityDialog");
  const entityForm = document.querySelector("#entityForm");
  const confirmDialog = document.querySelector("#confirmDialog");
  let state = loadState();
  let activeView = "dashboard";
  let activeTab = "all";
  let statusFilter = "all";
  let searchText = "";
  let confirmCallback = null;
  let editor = { key: "", index: null };

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && saved.roles && saved.features && saved.modules) {
        const restored = { ...clone(seed), ...saved };
        if (restored.systemConfig?.school?.theme === "Navy & Blue") restored.systemConfig.school.theme = "Forest Green";
        return restored;
      }
    } catch (error) { console.warn("Control Center memakai data awal lokal.", error); }
    return clone(seed);
  }
  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("siakad:configuration-changed", { detail: { updatedAt: nowISO() } }));
  }
  function audit(action, module, target, before, after, feature = "") {
    state.auditLogs.unshift({ id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, timestamp: nowISO(), user: "Developer", role: "DEVELOPER", action, module, feature, target, before: JSON.stringify(before ?? "-"), after: JSON.stringify(after ?? "-"), ip: "127.0.0.1 · lokal", device: navigator.userAgent.slice(0, 60), status: "SUCCESS" });
    persist();
  }
  function notify(message, type = "success") {
    const item = document.createElement("div");
    item.className = `toast ${type === "error" ? "error" : ""}`;
    item.textContent = message;
    toastRegion.append(item);
    setTimeout(() => item.remove(), 3200);
  }
  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  }
  function title(key) { return viewLabels[key] || "Fitur Dalam Pengembangan"; }
  function getSelectedRoleCode() { return state.rolePreview || "DEVELOPER"; }
  function getSelectedRole() {
    const code = getSelectedRoleCode();
    return state.roles.find((role) => role.code === code || role.name === code) || state.roles[0] || { name: "Developer", code: "DEVELOPER", permissions: ["dashboard.view"] };
  }
  function getViewPermissions(viewKey) {
    const map = {
      dashboard: ["dashboard.view"], overview: ["dashboard.view"],
      roles: ["role.manage", "role.view"], permissions: ["permission.manage", "permission.view"],
      features: ["feature.manage", "feature.view"], modules: ["module.manage", "module.view"],
      matrix: ["role.manage", "feature.manage"], users: ["user.manage", "user.view"],
      students: ["academic.manage", "academic.view"], teachers: ["academic.manage", "academic.view"],
      attendance: ["attendance.manage", "attendance.view", "attendance.verify"],
      exams: ["exam.manage", "exam.view"], finance: ["finance.manage", "finance.view", "finance.approve"],
      academic: ["academic.manage", "academic.view"], notifications: ["notification.manage", "notification.view"],
      documents: ["document.manage", "document.view"], integration: ["integration.configure", "integration.view"],
      security: ["security.manage", "security.view"], audit: ["audit.view", "security.manage"],
      configuration: ["dashboard.view", "security.manage"], routes: ["route.manage", "route.view"],
      development: ["route.manage", "dashboard.view"], backup: ["backup.manage", "security.manage"], tools: ["developer.manage", "security.manage"]
    };
    return map[viewKey] || ["dashboard.view"];
  }
  function canAccessView(viewKey) {
    const role = getSelectedRole();
    if (!role || role.status === "DISABLED") return false;
    if (role.code === "DEVELOPER" || role.name === "Developer") return true;
    const permissions = role.permissions || [];
    const required = getViewPermissions(viewKey);
    if (!required.length) return true;
    return required.some((permission) => permissions.includes(permission));
  }
  function renderNavigation() {
    const visibleGroups = navigation
      .map((group) => ({ ...group, items: group.items.filter(([key]) => canAccessView(key)) }))
      .filter((group) => group.items.length > 0);

    if (!visibleGroups.some((group) => group.items.some(([key]) => key === activeView))) {
      activeView = "dashboard";
    }

    mainNav.innerHTML = visibleGroups.map((group) => `<div class="nav-group-label">${group.group}</div>${group.items.map(([key, label, icon]) => `<button class="nav-item ${activeView === key ? "active" : ""}" type="button" data-view="${key}" data-search-label="${label.toLowerCase()}"><span class="nav-icon">${icon}</span><span>${label}</span>${["security", "audit"].includes(key) ? `<span class="nav-count">${key === "security" ? state.securityEvents.filter((item) => item.status === "OPEN").length : state.auditLogs.length}</span>` : ""}</button>`).join("")}`).join("");
    document.querySelector("#currentCrumb").textContent = title(activeView);
  }
  function setView(key) {
    const target = canAccessView(key) ? key : "dashboard";
    activeView = target;
    activeTab = "all";
    searchText = "";
    renderNavigation();
    renderView();
    contentArea.focus({ preventScroll: true });
  }
  function heading(key, description, actions = "") {
    return `<div class="view-heading"><div><div class="eyebrow">DEVELOPER CONTROL CENTER</div><h1>${title(key)}</h1><p>${description}</p></div><div class="heading-actions">${actions}</div></div>`;
  }
  function panel(name, body, meta = "") {
    return `<section class="panel"><header class="panel-header"><h2>${name}</h2><small>${meta}</small></header><div class="panel-body">${body}</div></section>`;
  }
  function statCard(label, value, icon, note = "Data tersimpan lokal") {
    return `<article class="stat-card"><div class="stat-top"><span>${label}</span><span class="stat-icon">${icon}</span></div><strong>${value}</strong><small>${note}</small></article>`;
  }
  function statusBadge(value) {
    const normalized = String(value || "UNKNOWN").toUpperCase();
    const css = ["ACTIVE", "APPROVED", "SUCCESS", "HADIR", "RESOLVED", "SENT"].includes(normalized) ? "active" : ["BETA", "PENDING", "SCHEDULED", "OPEN", "TERLAMBAT", "SANDBOX", "DEVELOPMENT"].includes(normalized) ? "warning" : ["CRITICAL", "HIGH", "DISABLED", "INACTIVE", "REJECTED", "LOCKED"].includes(normalized) ? "danger" : ["MAINTENANCE", "DRAFT"].includes(normalized) ? "info" : "";
    return `<span class="status ${css}">${escapeHTML(normalized.replaceAll("_", " "))}</span>`;
  }
  function chartBars(label, seedOffset = 1, accent = false) {
    const names = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const bars = names.map((name, index) => {
      const height = 22 + ((index * 19 + seedOffset * 13) % 70);
      const secondary = 15 + ((index * 11 + seedOffset * 7) % 62);
      return `<div class="chart-col"><span class="chart-bar ${accent ? "alt" : ""}" style="height:${height}%"></span><span class="chart-bar ${accent ? "" : "alt"}" style="height:${secondary}%"></span></div>`;
    }).join("");
    return `<div class="chart-bars" aria-label="Grafik ${label}">${bars}</div><div class="chart-labels">${names.map((name) => `<span>${name}</span>`).join("")}</div>`;
  }
  function renderDashboard() {
    const activeFeatures = state.features.filter((item) => item.status === "ACTIVE").length;
    const enabledModules = state.modules.filter((item) => item.status === "ACTIVE").length;
    const pending = state.finance.filter((item) => item.status === "PENDING").length + state.exams.filter((item) => item.status === "DRAFT").length;
    const role = getSelectedRole();
    const previewNote = `<div class="inline-note" style="margin-bottom: 12px;">Preview role aktif: <strong>${escapeHTML(role.name)}</strong> · menu dan aksi menyesuaikan izin yang sedang dipilih untuk demo.</div>`;
    const quickActions = `<div class="quick-actions"><button class="quick-action primary" data-go="students">＋ Siswa</button><button class="quick-action" data-go="teachers">＋ Guru</button><button class="quick-action" data-go="attendance">◎ Absensi</button><button class="quick-action" data-go="exams">▣ Ujian</button><button class="quick-action" data-go="finance">$ Keuangan</button><button class="quick-action" data-go="backup">⤓ Backup</button></div>`;
    const stats = `<div class="stat-grid">${statCard("Total user", state.users.length, "◉", "Akun terdaftar")}${statCard("Total role", state.roles.length, "♙")}${statCard("Permission", state.permissions.length, "⌑")}${statCard("Total feature", state.features.length, "✳")}${statCard("Feature active", activeFeatures, "●", "Dari seluruh fitur")}${statCard("Feature disabled", state.features.length - activeFeatures, "◌")}${statCard("Module active", enabledModules, "▤")}${statCard("Security events", state.securityEvents.filter((item) => item.status === "OPEN").length, "⚑", "Perlu ditinjau")}${statCard("Pending approval", pending, "◷")}${statCard("Audit records", state.auditLogs.length, "≋")}</div>`;
    const health = `<div class="health-list"><div class="health-row"><span><i class="health-dot"></i>Control Center</span>${statusBadge("ACTIVE")}</div><div class="health-row"><span><i class="health-dot warn"></i>API / service</span>${statusBadge("NOT CONNECTED")}</div><div class="health-row"><span><i class="health-dot warn"></i>Database</span>${statusBadge("LOCAL STORAGE")}</div><div class="health-row"><span><i class="health-dot"></i>Storage</span>${statusBadge("AVAILABLE")}</div><div class="health-row"><span><i class="health-dot warn"></i>Last backup</span><small>${escapeHTML(state.backupHistory[0]?.date || "Belum pernah")}</small></div></div>`;
    const recent = state.auditLogs.slice(0, 5).map((item) => `<div class="activity-row"><span class="activity-avatar">${escapeHTML((item.user || "D").slice(0, 1))}</span><span class="activity-copy"><strong>${escapeHTML(item.user)}</strong> ${escapeHTML(item.action.toLowerCase())} · ${escapeHTML(item.target)}</span><time>${new Date(item.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</time></div>`).join("");
    return `${heading("dashboard", "Ringkasan kendali sistem", "Satu tempat untuk mengatur modul, fitur, akses, keamanan, dan perubahan SIAKAD.", `<button class="btn btn-secondary" data-go="audit">Lihat audit log</button><button class="btn btn-primary" data-go="features">＋ Kelola fitur</button>`)}${previewNote}${quickActions}${stats}<div class="dashboard-grid">${panel("Aktivitas pengguna", `<div class="chart-legend"><span><i class="legend-dot"></i>Login</span><span><i class="legend-dot alt"></i>Aktivitas</span></div>${chartBars("pengguna", 2)}`, "7 hari terakhir")}${panel("System health", health, "Status lokal")}${panel("Penggunaan fitur", chartBars("fitur", 4, true), "Interaksi demo")}${panel("Aktivitas sistem", `<div class="activity-list">${recent}</div>`, `<button class="btn-link" data-go="audit">Buka audit →</button>`)}</div><div class="dashboard-grid chart-grid">${panel("Transaksi", chartBars("transaksi", 7), "7 hari")}${panel("Absensi", chartBars("absensi", 3, true), "7 hari")}${panel("Aktivitas ujian", chartBars("ujian", 5), "7 hari")}</div>`;
  }
  function tableColumns(key) {
    const fields = schemas[key] || [];
    return fields.slice(0, 5).map((item) => item.key);
  }
  function cellValue(record, key) {
    const value = record[key];
    if (Array.isArray(value)) return escapeHTML(value.slice(0, 3).join(", ")) + (value.length > 3 ? ` +${value.length - 3}` : "");
    if (typeof value === "boolean") return value ? statusBadge("ACTIVE") : statusBadge("DISABLED");
    if (key === "status") return statusBadge(value);
    if (key === "timestamp" || key === "lastLogin" || key === "date" || key === "createdAt") {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? escapeHTML(value) : escapeHTML(date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: key === "date" ? undefined : "short" }));
    }
    if (key === "amount") return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
    return escapeHTML(value ?? "—");
  }
  function toolbar(key, collection, extra = "", options = {}) {
    const addButton = schemas[key] && !options.readOnly ? `<button class="btn btn-primary" data-action="add" data-collection="${key}">＋ Tambah</button>` : "";
    return `<div class="table-toolbar"><label class="search-field"><span>⌕</span><input data-table-search placeholder="Cari data…" value="${escapeHTML(searchText)}" aria-label="Cari data"></label><div class="toolbar-actions"><select class="filter-select" data-status-filter><option value="all" ${statusFilter === "all" ? "selected" : ""}>Semua status</option><option ${statusFilter === "ACTIVE" ? "selected" : ""}>ACTIVE</option><option ${statusFilter === "INACTIVE" ? "selected" : ""}>INACTIVE</option><option ${statusFilter === "DISABLED" ? "selected" : ""}>DISABLED</option><option ${statusFilter === "OPEN" ? "selected" : ""}>OPEN</option><option ${statusFilter === "PENDING" ? "selected" : ""}>PENDING</option><option ${statusFilter === "APPROVED" ? "selected" : ""}>APPROVED</option><option ${statusFilter === "DEVELOPMENT" ? "selected" : ""}>DEVELOPMENT</option></select>${extra}<button class="btn btn-secondary btn-small" data-action="export-csv" data-collection="${key}">Ekspor CSV</button>${addButton}</div></div>`;
  }
  function renderTable(key, options = {}) {
    const records = state[key] || [];
    const fields = tableColumns(key);
    const filtered = records.map((item, index) => ({ item, index })).filter(({ item }) => {
      const searchMatch = !searchText || Object.values(item).some((value) => String(value).toLowerCase().includes(searchText.toLowerCase()));
      const statusMatch = statusFilter === "all" || String(item.status).toUpperCase() === statusFilter;
      const tabMatch = activeTab === "all" || String(item.status).toUpperCase() === activeTab;
      return searchMatch && statusMatch && tabMatch;
    });
    const columns = options.columns || fields;
    const rows = filtered.map(({ item, index }) => `<tr>${columns.map((column) => `<td>${cellValue(item, column)}</td>`).join("")}<td><div class="row-actions">${options.customAction ? options.customAction(item, index) : ""}${schemas[key] && !options.readOnly ? `<button class="icon-button" data-action="edit" data-collection="${key}" data-index="${index}" aria-label="Edit">✎</button><button class="icon-button" data-action="duplicate" data-collection="${key}" data-index="${index}" aria-label="Duplikat">⧉</button><button class="icon-button danger" data-action="delete" data-collection="${key}" data-index="${index}" aria-label="Hapus">×</button>` : ""}</div></td></tr>`).join("");
    const headers = columns.map((column) => `<th>${escapeHTML((options.labels?.[column] || column).replaceAll(/([A-Z])/g, " $1").toUpperCase())}</th>`).join("");
    const extra = options.extraToolbar || "";
    return `<section class="panel table-panel">${toolbar(key, records, extra, options)}<div class="table-scroll"><table class="data-table"><thead><tr>${headers}<th style="text-align:right">${options.readOnly ? "" : "AKSI"}</th></tr></thead><tbody>${rows || `<tr><td colspan="${columns.length + 1}" class="empty-state">Tidak ada data yang cocok.</td></tr>`}</tbody></table></div><footer class="table-footer"><span>${filtered.length} dari ${records.length} data</span><span>Perubahan dicatat di Audit Log</span></footer></section>`;
  }
  function renderGeneric(key, description, columns, extra = "", options = {}) {
    return `${heading(key, description, `<button class="btn btn-secondary" data-action="refresh">↻ Segarkan</button>`)}${renderTable(key, { columns, extraToolbar: extra, ...options })}`;
  }
  function renderRoles() {
    return `${heading("roles", "Role menentukan batas dashboard dan menu pengguna.", `<button class="btn btn-secondary" data-action="export-csv" data-collection="roles">Ekspor</button><button class="btn btn-primary" data-action="add" data-collection="roles">＋ Tambah role</button>`)}${renderTable("roles", { columns: ["name", "code", "description", "status", "dashboard", "assignedUsers"], labels: { assignedUsers: "user assignment" }, customAction: (item, index) => `<button class="btn btn-link" data-action="manage-role" data-index="${index}">Manage permission</button>` })}`;
  }
  function renderFeatures() {
    const counts = ["ACTIVE", "INACTIVE", "BETA", "MAINTENANCE", "DEPRECATED"].map((status) => `<div class="kpi-mini"><span>${status}</span><strong>${state.features.filter((item) => item.status === status).length}</strong></div>`).join("");
    const tabs = `<div class="tabs">${["all", "ACTIVE", "INACTIVE", "BETA", "MAINTENANCE", "DEPRECATED"].map((tab) => `<button class="tab-button ${activeTab === tab ? "active" : ""}" data-tab="${tab}">${tab === "all" ? "Semua" : tab}</button>`).join("")}</div>`;
    return `${heading("features", "Fitur hanya muncul saat status dan role mengizinkan.", `<button class="btn btn-secondary" data-action="export-csv" data-collection="features">Ekspor</button><button class="btn btn-primary" data-action="add" data-collection="features">＋ Buat feature</button>`)}<div class="kpi-strip">${counts}</div><section class="panel" style="margin-top:11px">${tabs}</section>${renderTable("features", { columns: ["name", "id", "category", "status", "requiredPermission", "availableRoles"], labels: { id: "feature id", requiredPermission: "permission", availableRoles: "available roles" }, customAction: (item, index) => `<label class="toggle" title="Aktif/nonaktif"><input type="checkbox" data-action="toggle-feature" data-index="${index}" ${item.status === "ACTIVE" ? "checked" : ""}><span class="toggle-track"></span></label>` })}`;
  }
  function renderModules() {
    return `${heading("modules", "Module mengatur kumpulan fitur dan akses lintas role.", `<button class="btn btn-primary" data-action="add" data-collection="modules">＋ Create module</button>`)}${renderTable("modules", { columns: ["name", "id", "description", "status", "dependencies", "availableRoles"], customAction: (item, index) => `<label class="toggle"><input type="checkbox" data-action="toggle-module" data-index="${index}" ${item.status === "ACTIVE" ? "checked" : ""}><span class="toggle-track"></span></label>` })}`;
  }
  function renderMatrix() {
    const roles = ["Developer", "Admin", "Guru", "Siswa", "Orang Tua/Wali", "Bendahara"];
    const rows = ["dashboard.home", "attendance.dashboard", "exam.manage", "finance.billing", "finance.reports", "academic.grades", "documents.archive"];
    const featureById = new Map(state.features.map((feature) => [feature.id, feature]));
    const matrix = rows.map((id) => {
      const feature = featureById.get(id) || { id, name: id, status: "INACTIVE", category: id.split(".")[0], availableRoles: [] };
      return `<tr><td><strong>${escapeHTML(feature.name)}</strong><br><small class="muted-cell">${escapeHTML(id)}</small>${feature.status !== "ACTIVE" ? ` ${statusBadge(feature.status)}` : ""}</td>${roles.map((role) => `<td><input type="checkbox" data-matrix-feature="${escapeHTML(id)}" data-matrix-role="${escapeHTML(role)}" ${feature.availableRoles.includes(role) ? "checked" : ""} ${feature.status !== "ACTIVE" ? "disabled" : ""} aria-label="${escapeHTML(role)} ${escapeHTML(id)}"></td>`).join("")}</tr>`;
    }).join("");
    return `${heading("matrix", "Kontrol akses feature per role sebelum menu diterbitkan.", `<button class="btn btn-secondary" data-action="matrix-all" data-value="off">Disable all</button><button class="btn btn-secondary" data-action="matrix-all" data-value="on">Enable all</button><button class="btn btn-primary" data-action="save-matrix">Simpan perubahan</button>`)}<p class="inline-note">Status module/feature nonaktif meniadakan akses meskipun checkbox role menyala. Perubahan matriks langsung disimpan dan diaudit.</p><section class="panel table-panel" style="margin-top:11px"><div class="table-scroll"><table class="data-table access-matrix"><thead><tr><th>Feature</th>${roles.map((role) => `<th>${escapeHTML(role)}</th>`).join("")}</tr></thead><tbody>${matrix}</tbody></table></div></section>`;
  }
  function renderSecurity() {
    const high = state.securityEvents.filter((item) => ["HIGH", "CRITICAL"].includes(item.severity)).length;
    const open = state.securityEvents.filter((item) => item.status === "OPEN").length;
    return `${heading("security", "Tinjau kejadian dan tindak lanjuti risiko keamanan.", `<button class="btn btn-secondary" data-action="export-csv" data-collection="securityEvents">Ekspor</button>`)}<div class="kpi-strip"><div class="kpi-mini"><span>Open events</span><strong>${open}</strong></div><div class="kpi-mini"><span>High / critical</span><strong>${high}</strong></div><div class="kpi-mini"><span>Failed login</span><strong>${state.securityEvents.filter((item) => item.type === "Failed Login").length}</strong></div><div class="kpi-mini"><span>Permission violation</span><strong>${state.securityEvents.filter((item) => item.type === "Permission Violation").length}</strong></div></div><div style="margin-top:11px">${renderTable("securityEvents", { columns: ["date", "type", "user", "severity", "status", "detail"], customAction: (item, index) => item.status === "OPEN" ? `<button class="btn btn-secondary btn-small" data-action="resolve-security" data-index="${index}">Tandai ditinjau</button>` : "" })}</div>`;
  }
  function renderAudit() {
    return `${heading("audit", "Catatan perubahan bersifat append-only pada antarmuka ini.", `<button class="btn btn-secondary" data-action="export-csv" data-collection="auditLogs">Ekspor audit</button>`)}<p class="inline-note">Audit log disimpan lokal untuk simulasi. Di produksi, log harus ditulis append-only di server dan tidak dapat dihapus role biasa.</p><div style="margin-top:10px">${renderTable("auditLogs", { columns: ["timestamp", "user", "role", "action", "module", "target", "before", "after", "ip", "device", "status"], readOnly: true })}</div>`;
  }
  function renderPermissions() {
    const extra = `<button class="btn btn-secondary btn-small" data-action="merge-permissions">Gabungkan terpilih</button>`;
    return `${heading("permissions", "Buat permission granular dan tautkan ke role.", `<button class="btn btn-primary" data-action="add" data-collection="permissions">＋ Tambah permission</button>`)}${renderTable("permissions", { columns: ["name", "category", "action", "description", "status"], extraToolbar: extra, customAction: (item, index) => `<input type="checkbox" data-permission-merge="${index}" aria-label="Pilih ${escapeHTML(item.name)} untuk merge">` })}`;
  }
  function configFields(group, items) {
    const values = state.systemConfig[group];
    return `<div class="form-grid">${items.map(([key, label, type]) => `<label class="form-field"><span>${label}</span>${type === "boolean" ? `<span class="toggle"><input type="checkbox" data-config-group="${group}" data-config-key="${key}" ${values[key] ? "checked" : ""}><span class="toggle-track"></span></span>` : type === "select" ? `<select class="control" data-config-group="${group}" data-config-key="${key}">${(key === "semester" ? ["Ganjil", "Genap"] : key === "theme" ? ["Forest Green", "High Contrast"] : key === "frequency" ? ["daily", "weekly", "monthly"] : key === "timerSource" ? ["SERVER", "LOCAL FALLBACK"] : [String(values[key]), "Disabled"]).map((option) => `<option ${String(values[key]) === option ? "selected" : ""}>${escapeHTML(option)}</option>`).join("")}</select>` : `<input class="control" data-config-group="${group}" data-config-key="${key}" type="${type || "text"}" value="${escapeHTML(values[key])}">`}</label>`).join("")}</div>`;
  }
  function renderConfiguration(group, description, items, panels) {
    const forms = panels.map(([label, fields]) => panel(label, `${configFields(group, fields)}<div class="dialog-actions"><button class="btn btn-primary" data-action="save-config" data-group="${group}">Simpan konfigurasi</button></div>`)).join("");
    return `${heading(group === "attendance" ? "attendance" : group === "exam" ? "exams" : "configuration", description, `<button class="btn btn-secondary" data-action="reset-config" data-group="${group}">Pulihkan default</button>`)}<div class="dashboard-grid config-grid">${forms}</div>`;
  }
  function renderSystemConfig() {
    const parts = [
      panel("Identitas sekolah", `${configFields("school", [["name", "Nama sekolah"], ["address", "Alamat"], ["logo", "Inisial/logo"], ["academicYear", "Tahun ajaran"], ["semester", "Semester", "select"], ["timezone", "Timezone"], ["language", "Bahasa"], ["theme", "Tema", "select"]])}<div class="dialog-actions"><button class="btn btn-primary" data-action="save-config" data-group="school">Simpan identitas</button></div>`),
      panel("Keamanan sesi", `${configFields("security", [["sessionTimeout", "Session timeout (menit)", "number"], ["minPasswordLength", "Panjang password minimum", "number"], ["requireTwoFactor", "Wajib 2FA", "boolean"], ["allowedLoginAttempts", "Batas login gagal", "number"]])}<div class="dialog-actions"><button class="btn btn-primary" data-action="save-config" data-group="security">Simpan kebijakan</button></div>`),
      panel("Tanggung jawab keuangan", `${configFields("finance", [["invoiceApproval", "Wajib approval invoice", "boolean"], ["receiptRequired", "Wajib bukti transaksi", "boolean"], ["correctionApproval", "Approval koreksi", "boolean"], ["createRoles", "Role pembuat tagihan"], ["receiveRoles", "Role penerima pembayaran"], ["approveRoles", "Role approver"], ["reportRoles", "Role pelihat laporan"], ["correctionRoles", "Role koreksi transaksi"], ["exportRoles", "Role ekspor laporan"]])}<div class="dialog-actions"><button class="btn btn-primary" data-action="save-config" data-group="finance">Simpan kebijakan</button></div>`)
    ];
    return `${heading("configuration", "Konfigurasi sekolah, keamanan, dan kebijakan platform.", `<button class="btn btn-secondary" data-action="export-config">Ekspor konfigurasi</button>`)}<div class="dashboard-grid config-grid">${parts.join("")}</div>`;
  }
  function renderBackup() {
    const list = state.backupHistory.map((item) => `<div class="health-row"><span>${escapeHTML(item.name)} · ${escapeHTML(item.date)}</span><span>${statusBadge(item.status)}</span></div>`).join("") || "Belum ada backup.";
    return `${heading("backup", "Buat, unduh, atau pulihkan snapshot konfigurasi lokal.", `<button class="btn btn-primary" data-action="create-backup">＋ Create backup</button>`)}<div class="dashboard-grid">${panel("Jadwal otomatis", `${configFields("backup", [["automatic", "Backup otomatis", "boolean"], ["frequency", "Frekuensi", "select"], ["keepCount", "Jumlah snapshot", "number"]])}<div class="dialog-actions"><button class="btn btn-primary" data-action="save-config" data-group="backup">Simpan jadwal</button></div>`, "Simulasi lokal")}${panel("Riwayat backup", list, `<button class="btn-link" data-action="restore-latest">Pulihkan terakhir</button>`)}</div><div class="panel" style="margin-top:11px"><div class="panel-header"><h2>Restore dari JSON</h2></div><div class="panel-body"><label class="form-field"><span>Pilih file backup</span><input id="backupFile" class="control" type="file" accept="application/json"></label><button class="btn btn-secondary" style="margin-top:10px" data-action="restore-file">Restore backup</button><p class="inline-note" style="margin-top:10px">Restore akan mengganti data demo di localStorage browser ini. Unduh backup sebelum melanjutkan.</p></div></div>`;
  }
  function renderDeveloperTools() {
    return `${heading("tools", "Generator entitas, inspeksi data lokal, dan debug event.", `<button class="btn btn-secondary" data-action="refresh-json">↻ Refresh JSON</button>`)}<div class="tabs">${["all", "storage", "events"].map((tab) => `<button class="tab-button ${activeTab === tab ? "active" : ""}" data-tab="${tab}">${tab === "all" ? "JSON store" : tab === "storage" ? "LocalStorage" : "Debug console"}</button>`).join("")}</div><section class="panel"><div class="panel-body"><div class="action-row"><button class="btn btn-secondary" data-action="generator" data-kind="role">Role Generator</button><button class="btn btn-secondary" data-action="generator" data-kind="permission">Permission Generator</button><button class="btn btn-secondary" data-action="generator" data-kind="feature">Feature Generator</button><button class="btn btn-secondary" data-action="generator" data-kind="module">Module Generator</button><button class="btn btn-secondary" data-action="generator" data-kind="route">Route Generator</button></div><pre id="jsonViewer" class="code-block">Memuat data…</pre><div class="form-grid"><label class="form-field"><span>Debug console · event</span><input class="control" id="debugInput" placeholder="Contoh: cek feature access"></label><button class="btn btn-primary" data-action="debug-log">Tulis debug event</button></div></div></section>`;
  }
  function renderDevelopment() {
    const route = state.routes.find((item) => item.status === "DEVELOPMENT") || state.routes[0];
    return `${heading("development", "Route belum selesai tetap memiliki fallback dan metadata.", `<button class="btn btn-primary" data-go="routes">Kelola route</button>`)}<section class="panel development-state"><div><span class="development-icon">◷</span><h2>Fitur Dalam Pengembangan</h2><p>Route <strong>${escapeHTML(route?.path || "/future-module")}</strong> masih terdaftar, tetapi belum dipublikasikan.</p><span class="status warning">${escapeHTML(route?.status || "DEVELOPMENT")}</span><p>Developer note: Implementasikan modul dan validasi permission sebelum mengaktifkan route.<br>Estimated version: 1.1.0</p></div></section>${renderGeneric("routes", "Daftar route dan fallback yang tercatat.", ["name", "path", "module", "requiredRole", "requiredPermission", "status", "fallback"])}`;
  }
  function renderView() {
    if (!canAccessView(activeView)) {
      activeView = "dashboard";
    }
    const simple = {
      overview: () => renderDashboard(),
      dashboard: () => renderDashboard(),
      roles: () => renderRoles(),
      permissions: () => renderPermissions(),
      features: () => renderFeatures(),
      modules: () => renderModules(),
      matrix: () => renderMatrix(),
      users: () => renderGeneric("users", "Akun, role, status, perangkat, dan jejak masuk.", ["id", "name", "email", "role", "status", "device", "lastLogin"], "<button class=\"btn btn-secondary btn-small\" data-action=\"login-history\">Login history</button>", { customAction: (item, index) => `<button class="btn btn-secondary btn-small" data-action="reset-device" data-index="${index}">Reset device</button><button class="btn btn-secondary btn-small" data-action="reset-password" data-index="${index}">Reset password</button><button class="btn btn-secondary btn-small" data-action="toggle-user" data-index="${index}">${item.status === "ACTIVE" ? "Disable" : "Enable"}</button>` }),
      students: () => renderGeneric("students", "Data induk siswa untuk akses akademik.", ["nis", "name", "class", "gender", "status", "phone"]),
      teachers: () => renderGeneric("teachers", "Data induk pendidik dan mata pelajaran.", ["nip", "name", "subject", "email", "status"]),
      attendance: () => renderConfiguration("attendance", "Kontrol presensi: Face, Liveness, GPS, Wi-Fi, device, timestamp, dan koreksi.", null, [
        ["Identitas & anti-spoofing", [["faceRecognition", "Face recognition", "boolean"], ["liveness", "Liveness detection", "boolean"], ["antiSpoofing", "Anti spoofing", "boolean"], ["mockGpsDetection", "Mock GPS detection", "boolean"], ["deviceBinding", "Device binding", "boolean"], ["serverTimestamp", "Server timestamp", "boolean"]]],
        ["Lokasi & jadwal", [["latitude", "School latitude", "number"], ["longitude", "School longitude", "number"], ["radius", "Geofence radius (meter)", "number"], ["allowedWifi", "Allowed Wi-Fi SSID"], ["start", "Attendance start", "time"], ["end", "Attendance end", "time"], ["lateTolerance", "Late tolerance (menit)", "number"]]],
        ["Policy & catatan", [["wifiValidation", "Wi-Fi validation", "boolean"], ["duplicateDetection", "Duplicate detection", "boolean"], ["correctionApproval", "Attendance correction approval", "boolean"], ["auditTrail", "Audit trail", "boolean"]]]
      ]),
      exams: () => renderConfiguration("exam", "Policy ujian; batasan screenshot/rekam layar perlu perangkat terkelola.", null, [
        ["Lock & proctoring", [["lockMode", "Lock exam mode (best effort)", "boolean"], ["fullscreen", "Require fullscreen", "boolean"], ["appSwitchDetection", "App switching detection", "boolean"], ["periodicFaceCheck", "Periodic face verification", "boolean"], ["gpsVerification", "GPS verification", "boolean"], ["deviceBinding", "Device binding", "boolean"]]],
        ["Timer & jawaban", [["timerSource", "Timer source", "select"], ["autoSave", "Auto save", "boolean"], ["autoSubmit", "Auto submit", "boolean"], ["suspiciousActivityDetection", "Suspicious activity detection", "boolean"]]],
        ["Screen capture", [["screenshotDetection", "Screenshot detection · platform dependent", "boolean"], ["screenRecordingDetection", "Screen recording detection · platform dependent", "boolean"]]]
      ]),
      finance: () => renderGeneric("finance", "Transaksi memiliki ID, pembuat, approver, bukti, dan status audit.", ["id", "user", "date", "amount", "type", "method", "status", "createdBy", "approvedBy", "updatedBy"], `<button class="btn btn-secondary btn-small" data-action="finance-approve">Proses approval</button>`),
      academic: () => renderGeneric("students", "Sistem akademik: siswa, jadwal, nilai, kelas, dan pengelolaan role.", ["nis", "name", "class", "status", "phone"], `<button class="btn btn-secondary btn-small" data-go="teachers">Data guru</button><button class="btn btn-secondary btn-small" data-go="modules">Konfigurasi akademik</button>`),
      notifications: () => renderGeneric("notifications", "Buat notifikasi INFO, SUCCESS, WARNING, ERROR, atau SECURITY.", ["id", "title", "type", "targetRole", "priority", "status", "scheduledAt"]),
      documents: () => renderDevelopment(),
      integration: () => renderGeneric("integration", "Pengaturan provider dan status koneksi layanan eksternal.", ["id", "name", "provider", "status", "endpoint", "lastSync"]),
      security: () => renderSecurity(),
      audit: () => renderAudit(),
      configuration: () => renderSystemConfig(),
      routes: () => renderGeneric("routes", "Route tersedia, role/permission wajib, status, dan fallback.", ["name", "path", "module", "requiredRole", "requiredPermission", "status", "fallback"]),
      development: () => renderDevelopment(),
      backup: () => renderBackup(),
      tools: () => renderDeveloperTools()
    };
    contentArea.innerHTML = (simple[activeView] || (() => renderDevelopment()))();
    if (activeView === "tools") refreshJsonViewer();
    renderNavigation();
  }
  function refreshJsonViewer() {
    const target = document.querySelector("#jsonViewer");
    if (!target) return;
    const view = activeTab === "storage" ? Object.fromEntries(Object.keys(state).map((key) => [key, { items: Array.isArray(state[key]) ? state[key].length : Object.keys(state[key]).length }])) : activeTab === "events" ? state.auditLogs.slice(0, 10) : state;
    target.textContent = JSON.stringify(view, null, 2);
  }
  function openEditor(key, index = null, initial = {}) {
    const schema = schemas[key];
    if (!schema) return;
    editor = { key, index };
    const current = index === null ? initial : state[key][index];
    document.querySelector("#dialogEyebrow").textContent = key.replaceAll(/([A-Z])/g, " $1").toUpperCase();
    document.querySelector("#dialogTitle").textContent = `${index === null ? "Tambah" : "Edit"} ${titleForKey(key)}`;
    document.querySelector("#dialogFields").innerHTML = schema.map((item) => {
      const value = current[item.key];
      const required = item.required ? "required" : "";
      let control;
      if (item.type === "select") control = `<select class="control" id="field-${item.key}" name="${item.key}" ${required}>${item.options.map((option) => `<option value="${escapeHTML(option)}" ${String(value ?? "") === option ? "selected" : ""}>${escapeHTML(option)}</option>`).join("")}</select>`;
      else if (item.type === "textarea") control = `<textarea class="control" id="field-${item.key}" name="${item.key}" ${required}>${escapeHTML(value || "")}</textarea>`;
      else if (item.type === "checkbox") control = `<input id="field-${item.key}" name="${item.key}" type="checkbox" ${value ? "checked" : ""}>`;
      else control = `<input class="control" id="field-${item.key}" name="${item.key}" type="${item.type || "text"}" value="${escapeHTML(Array.isArray(value) ? value.join(", ") : value ?? "")}" ${required} ${item.type === "number" ? 'min="0"' : ""} placeholder="${escapeHTML(item.placeholder || "")}">`;
      return `<label class="form-field ${item.type === "textarea" ? "full" : ""}" for="field-${item.key}"><span>${item.label}${item.required ? " *" : ""}</span>${control}</label>`;
    }).join("");
    entityDialog.showModal();
    entityForm.querySelector("input,select,textarea")?.focus();
  }
  function titleForKey(key) { return ({ roles: "role", permissions: "permission", features: "feature", modules: "module", users: "user", students: "siswa", teachers: "guru", routes: "route", attendance: "data absensi", exams: "ujian", finance: "transaksi", notifications: "notifikasi", securityEvents: "security event", integration: "integrasi", auditLogs: "audit log" })[key] || key; }
  function confirm(message, callback, headingText = "Konfirmasi perubahan") {
    document.querySelector("#confirmTitle").textContent = headingText;
    document.querySelector("#confirmMessage").textContent = message;
    confirmCallback = callback;
    confirmDialog.showModal();
  }
  function saveEntity(event) {
    event.preventDefault();
    const oldRecord = editor.index === null ? null : clone(state[editor.key][editor.index]);
    const record = {};
    for (const [key, value] of new FormData(entityForm).entries()) record[key] = value;
    for (const item of schemas[editor.key]) {
      if (item.type === "checkbox") record[item.key] = entityForm.elements.namedItem(item.key).checked;
      if (item.type === "tags") record[item.key] = String(record[item.key] || "").split(",").map((value) => value.trim()).filter(Boolean);
    }
    const key = editor.key;
    const editing = editor.index !== null;
    if (key === "roles" && !editing) { record.id = record.code; record.modules ||= []; record.permissions ||= []; record.features ||= []; record.assignedUsers = 0; }
    if (key === "features" && !editing) { record.availableRoles ||= []; record.dependencies ||= []; record.status ||= "INACTIVE"; record.version ||= "1.0.0"; record.route ||= `/${record.id}`; record.developerOnly = Boolean(record.developerOnly); record.betaFeature = Boolean(record.betaFeature); record.maintenanceMode = Boolean(record.maintenanceMode); }
    if (key === "modules" && !editing) { record.dependencies ||= []; record.availableRoles ||= []; record.requiredPermissions ||= []; record.featureIds ||= []; }
    if (key === "users" && !editing) { record.id = `USR-${Date.now()}`; record.lastLogin = "Belum pernah"; record.loginFailures = Number(record.loginFailures || 0); }
    if (["routes", "permissions", "students", "teachers", "attendance", "exams", "finance", "notifications", "integration"].includes(key) && !editing && !record.id) record.id = `${key.slice(0, 3).toUpperCase()}-${Date.now()}`;
    if (["exams", "notifications"].includes(key) && record.startAt) record.startAt = new Date(record.startAt).toISOString();
    if (key === "finance" && !editing) { record.createdBy = "Developer"; record.approvedBy = "-"; record.updatedBy = "Developer"; record.date ||= nowISO().slice(0, 10); }
    if (editing) state[key][editor.index] = { ...state[key][editor.index], ...record };
    else state[key].unshift(record);
    audit(editing ? "UPDATE" : "CREATE", title(key), record.name || record.title || record.id || record.code, oldRecord, record, record.id || "");
    entityDialog.close();
    renderView();
    notify(`${titleForKey(key)} berhasil ${editing ? "diperbarui" : "ditambahkan"}.`);
  }
  function deleteEntity(key, index) {
    const item = state[key][index];
    confirm(`Hapus ${titleForKey(key)} "${item.name || item.title || item.id || item.code}"? Tindakan akan dicatat.`, () => {
      state[key].splice(index, 1);
      audit("DELETE", title(key), item.name || item.title || item.id || item.code, item, null, item.id || "");
      renderView();
      notify("Data dihapus dan dicatat di Audit Log.");
    }, "Hapus data");
  }
  function toggleFeature(index, checked) {
    const item = state.features[index];
    const before = clone(item);
    item.status = checked ? "ACTIVE" : "INACTIVE";
    audit("UPDATE", "Feature Management", item.name, before, item, item.id);
    renderView();
    notify(`${item.name}: ${item.status}.`);
  }
  function toggleModule(index, checked) {
    const module = state.modules[index];
    const before = clone(module);
    module.status = checked ? "ACTIVE" : "INACTIVE";
    if (!checked) state.features.filter((item) => item.category.toLowerCase() === module.name.toLowerCase()).forEach((item) => { item.status = "INACTIVE"; });
    audit("UPDATE", "Module Management", module.name, before, module);
    renderView();
    notify(checked ? `${module.name} diaktifkan.` : `${module.name} dan fitur terkait dinonaktifkan.`);
  }
  function saveConfig(group) {
    const before = clone(state.systemConfig[group]);
    document.querySelectorAll(`[data-config-group="${group}"]`).forEach((control) => {
      state.systemConfig[group][control.dataset.configKey] = control.type === "checkbox" ? control.checked : control.type === "number" ? Number(control.value) : control.value;
    });
    audit("CONFIGURE", "System Configuration", group, before, state.systemConfig[group]);
    renderView();
    notify(`${group} berhasil disimpan dan diaudit.`);
  }
  function exportCsv(key) {
    const rows = state[key] || [];
    if (!rows.length) return notify("Tidak ada data untuk diekspor.", "error");
    const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
    const csv = [columns.join(","), ...rows.map((row) => columns.map((column) => `"${String(Array.isArray(row[column]) ? row[column].join("; ") : row[column] ?? "").replaceAll('"', '""')}"`).join(","))].join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
    link.download = `${key}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    audit("EXPORT", title(key), `${rows.length} rows`, null, "CSV download");
  }
  function addBackup() {
    const snapshot = clone(state);
    const name = `siakad-backup-${new Date().toISOString().replaceAll(/[:.]/g, "-")}.json`;
    state.backupHistory ||= [];
    state.backupHistory.unshift({ name, date: nowISO(), status: "READY", snapshot });
    audit("CREATE", "Backup & Restore", name, null, "Backup snapshot created");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" }));
    link.download = name;
    link.click();
    URL.revokeObjectURL(link.href);
    renderView();
    notify("Backup dibuat dan diunduh.");
  }
  function restoreState(snapshot) {
    const required = ["users", "roles", "permissions", "features", "modules", "routes", "attendance", "exams", "finance", "notifications", "auditLogs", "systemConfig", "securityEvents"];
    if (!snapshot || required.some((key) => snapshot[key] === undefined)) throw new Error("Format backup tidak sesuai skema.");
    const old = state;
    state = { ...clone(seed), ...snapshot };
    audit("RESTORE", "Backup & Restore", "System snapshot", { restored: false }, { restored: true, collections: required.length });
    persist();
    renderView();
    notify("Restore berhasil. Audit log baru ditambahkan.");
    return old;
  }
  function handleAction(action, element) {
    const key = element.dataset.collection;
    const index = Number(element.dataset.index);
    if (action === "add") return openEditor(key);
    if (action === "edit") return openEditor(key, index);
    if (action === "delete") return deleteEntity(key, index);
    if (action === "duplicate") {
      const record = clone(state[key][index]);
      record.id = `${record.id || record.code || key}-${Date.now()}`;
      if (record.code) record.code += "_COPY";
      state[key].unshift(record);
      audit("CREATE", title(key), record.name || record.id, null, record, record.id);
      renderView();
      notify("Data diduplikasi.");
    }
    if (action === "toggle-feature") toggleFeature(index, element.checked);
    if (action === "toggle-module") toggleModule(index, element.checked);
    if (action === "save-config") saveConfig(element.dataset.group);
    if (action === "reset-config") confirm("Pulihkan konfigurasi dari nilai demo awal?", () => { const group = element.dataset.group; const before = clone(state.systemConfig[group]); state.systemConfig[group] = clone(seed.systemConfig[group]); audit("CONFIGURE", "System Configuration", group, before, state.systemConfig[group]); renderView(); notify("Konfigurasi demo dipulihkan."); });
    if (action === "export-csv") exportCsv(key);
    if (action === "create-backup") addBackup();
    if (action === "export-config") { const blob = new Blob([JSON.stringify(state.systemConfig, null, 2)], { type: "application/json" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "siakad-system-config.json"; link.click(); URL.revokeObjectURL(link.href); audit("EXPORT", "System Configuration", "systemConfig", null, "JSON download"); }
    if (action === "restore-file") restoreFromFile();
    if (action === "restore-latest") { const backup = state.backupHistory?.[0]; if (!backup) return notify("Belum ada backup.", "error"); confirm(`Pulihkan snapshot ${backup.name}?`, () => restoreState(backup.snapshot)); }
    if (action === "refresh-json") refreshJsonViewer();
    if (action === "debug-log") { const value = document.querySelector("#debugInput").value.trim(); if (!value) return notify("Isi pesan debug terlebih dahulu.", "error"); audit("DEBUG", "Developer Tools", value, null, "Recorded"); renderView(); notify("Debug event dicatat."); }
    if (action === "generator") openGenerator(element.dataset.kind);
    if (action === "matrix-all") { document.querySelectorAll("[data-matrix-feature]:not(:disabled)").forEach((box) => { box.checked = element.dataset.value === "on"; }); }
    if (action === "save-matrix") saveMatrix();
    if (action === "resolve-security") resolveSecurity(index);
    if (action === "finance-approve") approveNextFinance();
    if (action === "manage-role") { const role = state.roles[index]; openEditor("roles", index); notify(`Mengelola permission untuk ${role.name}.`); }
    if (action === "merge-permissions") mergePermissions();
    if (action === "toggle-user") updateUser(index, (user) => { user.status = user.status === "ACTIVE" ? "DISABLED" : "ACTIVE"; }, "UPDATE", "User Management");
    if (action === "reset-device") updateUser(index, (user) => { user.device = "Reset requested · login ulang diperlukan"; }, "RESET_DEVICE", "User Management");
    if (action === "reset-password") updateUser(index, (user) => { user.passwordResetRequired = true; }, "RESET_PASSWORD", "User Management");
    if (action === "login-history") { setView("security"); searchText = "Login"; renderView(); }
    if (action === "refresh") { renderView(); notify("Data diperbarui dari localStorage."); }
  }
  function restoreFromFile() {
    const file = document.querySelector("#backupFile")?.files?.[0];
    if (!file) return notify("Pilih file JSON backup terlebih dahulu.", "error");
    const reader = new FileReader();
    reader.onload = () => {
      try { restoreState(JSON.parse(reader.result)); } catch (error) { notify(error.message, "error"); }
    };
    reader.readAsText(file);
  }
  function openGenerator(kind) {
    const config = {
      role: { key: "roles", initial: { name: "Role baru", code: `CUSTOM_${Date.now().toString().slice(-4)}`, description: "Role kustom dari Developer Tools", status: "DISABLED", dashboard: "/custom", modules: [], permissions: [], features: [], assignedUsers: 0 } },
      permission: { key: "permissions", initial: { name: "module.action", category: "module", action: "VIEW", description: "Permission kustom", status: "ACTIVE", createdAt: nowISO() } },
      feature: { key: "features", initial: { name: "Feature baru", id: `custom.feature_${Date.now().toString().slice(-4)}`, category: "Custom", description: "Fitur kustom", icon: "✳", route: "/custom/feature", status: "INACTIVE", version: "0.1.0", requiredPermission: "feature.view", availableRoles: ["Developer"], dependencies: [], developerOnly: false, betaFeature: true, maintenanceMode: false } },
      module: { key: "modules", initial: { name: "Custom Module", id: `custom-${Date.now().toString().slice(-4)}`, description: "Module kustom", status: "INACTIVE", dependencies: [], availableRoles: ["Developer"], requiredPermissions: [], featureIds: [] } },
      route: { key: "routes", initial: { name: "Custom route", path: "/custom/route", module: "custom", requiredRole: "Developer", requiredPermission: "route.manage", status: "DEVELOPMENT", fallback: "pages/under-development.html" } }
    }[kind];
    if (config) openEditor(config.key, null, config.initial);
  }
  function saveMatrix() {
    const before = clone(state.features.map((item) => ({ id: item.id, roles: item.availableRoles })));
    document.querySelectorAll("[data-matrix-feature]").forEach((checkbox) => {
      const feature = state.features.find((item) => item.id === checkbox.dataset.matrixFeature);
      if (!feature || feature.status !== "ACTIVE") return;
      feature.availableRoles ||= [];
      const role = checkbox.dataset.matrixRole;
      feature.availableRoles = checkbox.checked ? [...new Set([...feature.availableRoles, role])] : feature.availableRoles.filter((value) => value !== role);
    });
    audit("UPDATE", "Feature → Role Access Matrix", "Feature role assignments", before, state.features.map((item) => ({ id: item.id, roles: item.availableRoles })));
    renderView();
    notify("Matriks akses tersimpan dan masuk Audit Log.");
  }
  function mergePermissions() {
    const selected = [...document.querySelectorAll("[data-permission-merge]:checked")].map((input) => Number(input.dataset.permissionMerge)).sort((a, b) => a - b);
    if (selected.length < 2) return notify("Pilih minimal dua permission untuk digabungkan.", "error");
    const keepIndex = selected[0];
    const keep = state.permissions[keepIndex];
    const removed = selected.slice(1).map((index) => state.permissions[index]);
    confirm(`Gabungkan ${selected.length} permission menjadi ${keep.name}? Referensi role akan diperbarui.`, () => {
      const removedNames = new Set(removed.map((item) => item.name));
      const before = { permissionIds: [keep.name, ...removedNames], roles: clone(state.roles) };
      for (const role of state.roles) {
        if (role.permissions?.some((permission) => removedNames.has(permission))) {
          role.permissions = [...new Set(role.permissions.map((permission) => removedNames.has(permission) ? keep.name : permission))];
        }
      }
      for (const feature of state.features) if (removedNames.has(feature.requiredPermission)) feature.requiredPermission = keep.name;
      state.permissions = state.permissions.filter((item) => !removedNames.has(item.name));
      audit("MERGE", "Permission Management", keep.name, before, { retained: keep.name, removed: [...removedNames] });
      renderView();
      notify("Permission digabungkan dan referensi role diperbarui.");
    }, "Gabungkan permission");
  }
  function updateUser(index, update, action, moduleName) {
    const user = state.users[index];
    const before = clone(user);
    update(user);
    audit(action, moduleName, user.email, before, user);
    renderView();
    notify(`${action.replaceAll("_", " ")} dicatat ke Audit Log.`);
  }
  function resolveSecurity(index) {
    const item = state.securityEvents[index];
    const before = clone(item);
    item.status = "REVIEWED";
    audit("VERIFY", "Security Center", item.id, before, item);
    renderView();
    notify("Security event ditandai telah ditinjau.");
  }
  function approveNextFinance() {
    const index = state.finance.findIndex((item) => item.status === "PENDING");
    if (index < 0) return notify("Tidak ada transaksi menunggu approval.");
    const item = state.finance[index];
    const before = clone(item);
    item.status = "APPROVED";
    item.approvedBy = "Developer demo";
    item.updatedBy = "Developer demo";
    audit("APPROVE", "Finance System", item.id, before, item);
    renderView();
    notify("Transaksi disetujui dan diaudit.");
  }
  function onTableSearch(value) {
    searchText = value;
    const cursor = document.querySelector("[data-table-search]")?.selectionStart;
    renderView();
    const replacement = document.querySelector("[data-table-search]");
    if (replacement) { replacement.focus(); replacement.setSelectionRange(cursor, cursor); }
  }
  function globalSearch(value) {
    const query = value.trim().toLowerCase();
    document.querySelectorAll(".nav-item").forEach((item) => { item.hidden = Boolean(query) && !item.dataset.searchLabel.includes(query); });
  }

  document.addEventListener("click", (event) => {
    const navItem = event.target.closest("[data-view]");
    if (navItem) return setView(navItem.dataset.view);
    const go = event.target.closest("[data-go]");
    if (go) return setView(go.dataset.go);
    const tab = event.target.closest("[data-tab]");
    if (tab) { activeTab = tab.dataset.tab; return renderView(); }
    const action = event.target.closest("[data-action]");
    if (action && action.type !== "checkbox") handleAction(action.dataset.action, action);
    if (event.target.closest("[data-close-dialog]")) entityDialog.close();
    if (event.target.closest("[data-confirm-cancel]")) confirmDialog.close();
    if (event.target.closest("[data-confirm-accept]")) { confirmDialog.close(); confirmCallback?.(); confirmCallback = null; }
    if (event.target.closest("#mobileMenu")) document.querySelector("#sidebar").classList.toggle("open");
    if (event.target.closest("#notificationsButton")) setView("notifications");
  });
  document.addEventListener("change", (event) => {
    const target = event.target;
    if (target.matches("#rolePreview")) {
      const before = state.rolePreview || "DEVELOPER";
      state.rolePreview = target.value;
      audit("UPDATE", "Role Management", "Role preview", before, target.value);
      renderView();
      notify(`Pratinjau role diatur ke ${target.options[target.selectedIndex].text}.`);
    }
    if (target.matches("[data-action='toggle-feature']")) return toggleFeature(Number(target.dataset.index), target.checked);
    if (target.matches("[data-action='toggle-module']")) return toggleModule(Number(target.dataset.index), target.checked);
    if (target.matches("[data-config-group]")) { const before = state.systemConfig[target.dataset.configGroup][target.dataset.configKey]; const after = target.type === "checkbox" ? target.checked : target.type === "number" ? Number(target.value) : target.value; state.systemConfig[target.dataset.configGroup][target.dataset.configKey] = after; audit("CONFIGURE", "System Configuration", `${target.dataset.configGroup}.${target.dataset.configKey}`, before, after); notify("Konfigurasi diperbarui dan dicatat."); }
    if (target.matches("[data-status-filter]")) { statusFilter = target.value; renderView(); }
    if (target.matches("[data-matrix-feature]")) { /* Save Changes commits the matrix together. */ }
  });
  document.addEventListener("input", (event) => {
    if (event.target.matches("[data-table-search]")) onTableSearch(event.target.value);
    if (event.target.matches("#globalSearch")) globalSearch(event.target.value);
  });
  entityForm.addEventListener("submit", saveEntity);
  entityDialog.addEventListener("click", (event) => { if (event.target === entityDialog) entityDialog.close(); });
  confirmDialog.addEventListener("click", (event) => { if (event.target === confirmDialog) confirmDialog.close(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") document.querySelector("#sidebar").classList.remove("open"); });

  persist();
  document.querySelector("#rolePreview").value = state.rolePreview || "DEVELOPER";
  renderNavigation();
  renderView();
})();
