/**
 * ==============================================================================
 * KODE.GS - GOOGLE APPS SCRIPT BACKEND & DATABASE GOOGLE SHEETS
 * SISTEM INFORMASI PAI SMP & MANAJEMEN PEMBELAJARAN
 * UPT SMPN 2 REBANG TANGKAS
 * ==============================================================================
 * 
 * CARA MENGGUNAKAN / UPLOAD DI GOOGLE APPS SCRIPT:
 * ------------------------------------------------------------------------------
 * PILIHAN A (Paling Mudah - Terikat ke Spreadsheet):
 * 1. Buat Google Spreadsheet baru di Google Drive Anda (beri nama: "Database PAI SMP").
 * 2. Di Google Spreadsheet, klik menu: "Ekstensi" (Extensions) > "Apps Script".
 * 3. Hapus semua kode bawaan (myFunction) di editor Apps Script.
 * 4. Salin (Copy) seluruh isi file Kode.gs ini, lalu Tempel (Paste) ke editor Apps Script.
 * 5. Klik tombol "Simpan" (ikon disket) atau tekan Ctrl + S.
 * 6. Pilih fungsi 'runSetup' di dropdown menu atas, lalu klik tombol "Jalankan" (Run).
 *    (Beri izin / otorisasi jika muncul pop-up izin akses Google).
 * 7. Klik tombol "Deploy" (Terapkan) di kanan atas > "Deployment baru" (New deployment).
 *    - Pilih jenis roda gigi ⚙️ > "Aplikasi Web" (Web app).
 *    - Deskripsi: API PAI SMP
 *    - Jalankan sebagai (Execute as): "Saya" (Me)
 *    - Siapa yang memiliki akses (Who has access): "Siapa saja" (Anyone) -> WAJIB!
 * 8. Klik "Deploy", salin URL Aplikasi Web yang berakhiran '/exec'.
 * 
 * PILIHAN B (Mandiri / Standalone di script.google.com):
 * 1. Buka https://script.google.com lalu klik "Project Baru" (+ New Project).
 * 2. Tempel seluruh isi file Kode.gs ini.
 * 3. (PENTING) Isi variabel SPREADSHEET_ID_OR_URL di baris 42 di bawah dengan ID
 *    atau link Google Spreadsheet Anda, ATAU biarkan kosong dan jalankan fungsi
 *    'runSetup' (script akan otomatis membuat Google Spreadsheet baru di Drive Anda!).
 * 4. Deploy sebagai Web App dengan akses "Siapa saja" (Anyone).
 * ==============================================================================
 */

// ===================== KONFIGURASI SPREADSHEET =====================
// Jika script dibuka melalui menu Ekstensi Google Spreadsheet, biarkan kosong ("").
// Jika script dibuat standalone di script.google.com, Anda dapat memasukkan
// ID Spreadsheet (misal: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms") atau Link Lengkapnya:
var SPREADSHEET_ID_OR_URL = "";

// Nama default jika script harus membuat spreadsheet baru secara otomatis
var DEFAULT_SPREADSHEET_TITLE = "Database PAI SMP - UPT SMPN 2 Rebang Tangkas";

// ===================== DAFTAR NAMA SHEET (TABEL) =====================
var SHEET_NAMES = {
  SEKOLAH: "DataSekolah",
  GURU: "DataGuru",
  KELAS: "DataKelas",
  SISWA: "DataSiswa",
  JURNAL: "JurnalMengajar",
  CATATAN_SAKU: "CatatanSakuPAI",
  PENILAIAN: "DataPenilaian",
  PRESENSI: "DataPresensi",
  TUGAS_LMS: "TugasLMS",
  PENGUMPULAN: "PengumpulanTugas",
  IBADAH: "JurnalIbadahHarian",
  PENDAMPINGAN: "PendampinganMurid",
  NILAI_PARALEL: "NilaiParalelSemester"
};

// ===================== DEFINISI SKEMA & HEADER =====================
function getDatabaseSchemas() {
  return [
    {
      name: SHEET_NAMES.SEKOLAH,
      headers: ["namaSekolah", "npsn", "alamat", "akreditasi", "namaKepsek", "nipKepsek", "terakhirDiperbarui"]
    },
    {
      name: SHEET_NAMES.GURU,
      headers: ["nip", "nama", "sertifikasi", "kontak", "isWaliKelas", "waliKelasDi", "terakhirDiperbarui"]
    },
    {
      name: SHEET_NAMES.KELAS,
      headers: ["id", "nama", "waliKelasNip", "waliKelasNama", "kuota", "totalSiswa"]
    },
    {
      name: SHEET_NAMES.SISWA,
      headers: ["nisn", "nama", "gender", "agama", "statusKeaktifan", "kelasId", "kontakOrangTua", "catatanKhusus"]
    },
    {
      name: SHEET_NAMES.JURNAL,
      headers: ["id", "tanggal", "kelasId", "jamKe", "materiPokok", "kehadiranHadir", "kehadiranIzin", "kehadiranSakit", "kehadiranAlpa", "catatanKejadian"]
    },
    {
      name: SHEET_NAMES.CATATAN_SAKU,
      headers: ["id", "tanggal", "siswaNisn", "siswaNama", "kelasId", "kategoriSikap", "jenisSikap", "deskripsiKejadian", "tindakLanjut"]
    },
    {
      name: SHEET_NAMES.PENILAIAN,
      headers: ["id", "siswaNisn", "siswaNama", "kelasId", "materiId", "tpCode", "jenisAsesmen", "nilai", "keterangan"]
    },
    {
      name: SHEET_NAMES.PRESENSI,
      headers: ["id", "tanggal", "kelasId", "siswaNisn", "status", "keterangan"]
    },
    {
      name: SHEET_NAMES.TUGAS_LMS,
      headers: ["id", "kelasId", "judul", "bab", "deskripsi", "deadline", "filePendukung"]
    },
    {
      name: SHEET_NAMES.PENGUMPULAN,
      headers: ["id", "tugasId", "tugasJudul", "siswaNisn", "siswaNama", "kelasId", "tanggalKumpul", "tipePengumpulan", "kontenTeks", "fileName", "fileSize", "audioDuration", "nilai", "komentarGuru"]
    },
    {
      name: SHEET_NAMES.IBADAH,
      headers: ["siswaNisn", "tanggal", "sholatSubuh", "sholatDzuhur", "sholatAshar", "sholatMaghrib", "sholatIsya", "sholatDhuha", "membacaAlQuranSurah", "membacaAlQuranAyat", "membantuOrangTua", "catatanKebaikan"]
    },
    {
      name: SHEET_NAMES.PENDAMPINGAN,
      headers: ["id", "hariTanggal", "pertemuanKe", "siswaNisn", "siswaNama", "kelasId", "topikMasalah", "tindakLanjut", "keterangan"]
    },
    {
      name: SHEET_NAMES.NILAI_PARALEL,
      headers: ["id", "siswaNisn", "siswaNama", "kelasParalel", "semester", "mapel", "uhList", "pts", "pas", "kkm"]
    }
  ];
}

function getHeadersForSheet(sheetName) {
  var schemas = getDatabaseSchemas();
  for (var i = 0; i < schemas.length; i++) {
    if (schemas[i].name === sheetName) {
      return schemas[i].headers;
    }
  }
  return [];
}

/**
 * Mengambil Spreadsheet aktif secara aman (mendukung container-bound, standalone ID, maupun auto-create)
 */
function getDatabaseSpreadsheet() {
  // 1. Cek jika ID atau URL ditentukan secara manual di variabel
  if (typeof SPREADSHEET_ID_OR_URL === "string" && SPREADSHEET_ID_OR_URL.trim() !== "") {
    var rawInput = SPREADSHEET_ID_OR_URL.trim();
    var match = rawInput.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    var targetId = match ? match[1] : rawInput;
    try {
      return SpreadsheetApp.openById(targetId);
    } catch (openErr) {
      Logger.log("Gagal membuka spreadsheet dari SPREADSHEET_ID_OR_URL: " + openErr.message);
    }
  }

  // 2. Cek apakah script terikat langsung (container-bound) pada Google Sheets
  try {
    var boundSs = SpreadsheetApp.getActiveSpreadsheet();
    if (boundSs) {
      return boundSs;
    }
  } catch (boundErr) {}

  // 3. Cek Script Properties jika sebelumnya pernah tersimpan
  try {
    var savedId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
    if (savedId) {
      return SpreadsheetApp.openById(savedId);
    }
  } catch (propErr) {}

  // 4. Jika dijalankan mandiri (standalone) dan belum ada ID, buatkan Spreadsheet baru di Google Drive pengguna!
  try {
    var newSs = SpreadsheetApp.create(DEFAULT_SPREADSHEET_TITLE);
    var newId = newSs.getId();
    PropertiesService.getScriptProperties().setProperty("SPREADSHEET_ID", newId);
    Logger.log("Spreadsheet baru berhasil dibuat otomatis! ID: " + newId + " | URL: " + newSs.getUrl());
    return newSs;
  } catch (createErr) {
    throw new Error(
      "Spreadsheet tidak terdeteksi! Silakan buka Google Sheets Anda > menu Ekstensi > Apps Script, " +
      "atau tempelkan ID Google Spreadsheet Anda pada variabel SPREADSHEET_ID_OR_URL di baris 42 Kode.gs."
    );
  }
}

/**
 * ==============================================================================
 * ENDPOINT UTAMA: doGet (Permintaan HTTP GET)
 * ==============================================================================
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? String(e.parameter.action).trim() : "";
  var callback = (e && e.parameter && e.parameter.callback) ? String(e.parameter.callback).trim() : "";

  // Jika parameter action ada, proses sebagai API JSON
  if (action) {
    try {
      var responseData = {};

      switch (action) {
        case "ping":
          responseData = {
            status: "online",
            serverTime: new Date().toISOString(),
            message: "Google Apps Script Server PAI SMP Berjalan Normal"
          };
          break;

        case "getInfo":
        case "getSpreadsheetInfo":
          var ss = getDatabaseSpreadsheet();
          responseData = {
            spreadsheetName: ss.getName(),
            spreadsheetId: ss.getId(),
            spreadsheetUrl: ss.getUrl(),
            totalSheets: ss.getSheets().length
          };
          break;

        case "setup":
          responseData = setupDatabase();
          break;

        case "getAllData":
          responseData = getAllDatabaseData();
          break;

        case "getSekolah":
          responseData = getSheetDataAsJson(SHEET_NAMES.SEKOLAH);
          break;

        case "getGuru":
          responseData = getSheetDataAsJson(SHEET_NAMES.GURU);
          break;

        case "getKelas":
          responseData = getSheetDataAsJson(SHEET_NAMES.KELAS);
          break;

        case "getSiswa":
          responseData = getSheetDataAsJson(SHEET_NAMES.SISWA);
          break;

        case "getJurnal":
          responseData = getSheetDataAsJson(SHEET_NAMES.JURNAL);
          break;

        case "getCatatanSaku":
          responseData = getSheetDataAsJson(SHEET_NAMES.CATATAN_SAKU);
          break;

        case "getPenilaian":
          responseData = getSheetDataAsJson(SHEET_NAMES.PENILAIAN);
          break;

        case "getPresensi":
          responseData = getSheetDataAsJson(SHEET_NAMES.PRESENSI);
          break;

        case "getTugasLms":
          responseData = getSheetDataAsJson(SHEET_NAMES.TUGAS_LMS);
          break;

        case "getPengumpulan":
          responseData = getSheetDataAsJson(SHEET_NAMES.PENGUMPULAN);
          break;

        case "getIbadah":
          responseData = getSheetDataAsJson(SHEET_NAMES.IBADAH);
          break;

        case "getPendampingan":
          responseData = getSheetDataAsJson(SHEET_NAMES.PENDAMPINGAN);
          break;

        case "getNilaiParalel":
          responseData = getSheetDataAsJson(SHEET_NAMES.NILAI_PARALEL);
          break;

        default:
          return createJsonResponse({
            status: "error",
            message: "Action '" + action + "' tidak dikenali."
          }, callback);
      }

      return createJsonResponse({ status: "success", data: responseData }, callback);

    } catch (err) {
      return createJsonResponse({ status: "error", message: err.toString() }, callback);
    }
  }

  // Jika diakses langsung via browser tanpa action, tampilkan Dashboard Status Interaktif
  try {
    var dbSpreadsheet = getDatabaseSpreadsheet();
    var ssUrl = dbSpreadsheet.getUrl();
    var ssName = dbSpreadsheet.getName();
    var sheetList = dbSpreadsheet.getSheets();

    var tableRowsHtml = "";
    for (var i = 0; i < sheetList.length; i++) {
      var s = sheetList[i];
      var rowCount = Math.max(0, s.getLastRow() - 1);
      tableRowsHtml += "<tr>" +
        "<td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#0f766e;'>" + s.getName() + "</td>" +
        "<td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace;'>" + rowCount + " baris</td>" +
        "</tr>";
    }

    var html = "<!DOCTYPE html>" +
      "<html><head><meta charset='utf-8'>" +
      "<meta name='viewport' content='width=device-width, initial-scale=1'>" +
      "<title>API Server & Database PAI SMP</title>" +
      "<style>" +
      "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f0fdf4; color: #1e293b; padding: 24px 16px; margin: 0; }" +
      ".container { max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 32px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); border: 1px solid #bbf7d0; }" +
      ".badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #dcfce7; color: #15803d; font-weight: 700; font-size: 12px; border-radius: 9999px; border: 1px solid #86efac; }" +
      "h1 { color: #065f46; font-size: 22px; margin: 16px 0 8px 0; font-weight: 800; }" +
      "p { color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0; }" +
      ".card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 16px 0; }" +
      ".btn { display: inline-block; padding: 10px 20px; background: #059669; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 13px; transition: background 0.2s; border: none; cursor: pointer; }" +
      ".btn:hover { background: #047857; }" +
      ".btn-outline { background: #ffffff; color: #065f46; border: 1px solid #a7f3d0; margin-left: 8px; }" +
      ".btn-outline:hover { background: #ecfdf5; }" +
      "table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 10px; }" +
      "th { text-align: left; padding: 8px 12px; background: #f1f5f9; color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }" +
      "code { background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-family: monospace; color: #0f172a; }" +
      "</style></head><body>" +
      "<div class='container'>" +
      "<span class='badge'>● Google Apps Script Server Aktif</span>" +
      "<h1>Sistem Informasi & Manajemen PAI SMP</h1>" +
      "<p>Web Service Backend Google Apps Script telah berhasil dipasang dan terhubung langsung ke Google Sheets secara aman.</p>" +
      "<div class='card'>" +
      "<div style='font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;'>Database Terhubung:</div>" +
      "<div style='font-size:16px;font-weight:700;color:#0f172a;margin-top:4px;'>" + ssName + "</div>" +
      "<div style='margin-top:12px;'>" +
      "<a href='" + ssUrl + "' target='_blank' class='btn'>Buka Google Spreadsheet ↗</a>" +
      "<a href='?action=setup' class='btn btn-outline'>⚡ Inisialisasi Ulang Struktur Tabel</a>" +
      "</div>" +
      "</div>" +
      "<h3 style='font-size:14px;color:#0f172a;margin-top:24px;margin-bottom:8px;'>Daftar Tabel di Spreadsheet (" + sheetList.length + " Sheet):</h3>" +
      "<div style='border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;'>" +
      "<table>" +
      "<thead><tr><th>Nama Sheet</th><th style='text-align:right;'>Jumlah Data</th></tr></thead>" +
      "<tbody>" + tableRowsHtml + "</tbody>" +
      "</table>" +
      "</div>" +
      "<div style='margin-top:24px;padding-top:16px;border-top:1px solid #f1f5f9;font-size:12px;color:#64748b;'>" +
      "Contoh Uji Coba API: " +
      "<a href='?action=ping' target='_blank' style='color:#059669;font-weight:bold;'>?action=ping</a> | " +
      "<a href='?action=getAllData' target='_blank' style='color:#059669;font-weight:bold;'>?action=getAllData</a> | " +
      "<a href='?action=getSiswa' target='_blank' style='color:#059669;font-weight:bold;'>?action=getSiswa</a>" +
      "</div>" +
      "</div></body></html>";

    return HtmlService.createHtmlOutput(html)
      .setTitle("API Backend PAI SMP - Google Apps Script")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  } catch (uiErr) {
    return HtmlService.createHtmlOutput(
      "<div style='font-family:sans-serif;padding:24px;color:#991b1b;background:#fef2f2;border-radius:12px;border:1px solid #fecaca;'>" +
      "<h3>Konfigurasi Perlu Diperiksa:</h3>" +
      "<p>" + uiErr.message + "</p>" +
      "<p style='font-size:12px;color:#374151;'>Solusi: Pastikan script dibuka melalui Google Spreadsheet (menu Ekstensi > Apps Script) atau isi variabel SPREADSHEET_ID_OR_URL di Kode.gs.</p>" +
      "</div>"
    );
  }
}

/**
 * ==============================================================================
 * ENDPOINT UTAMA: doPost (Permintaan HTTP POST)
 * ==============================================================================
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Kunci proses maksimal 30 detik untuk menghindari konflik data simultan
    lock.waitLock(30000);

    var requestData = {};

    if (e && e.postData && e.postData.contents) {
      try {
        requestData = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        if (e.parameter && Object.keys(e.parameter).length > 0) {
          requestData = e.parameter;
        } else {
          requestData = { payload: e.postData.contents };
        }
      }
    } else if (e && e.parameter) {
      requestData = e.parameter;
    }

    var action = requestData.action || (e && e.parameter && e.parameter.action) || "";
    var payload = requestData.payload !== undefined ? requestData.payload : (requestData.data !== undefined ? requestData.data : requestData);

    // Jika payload berupa string JSON (misal dikirim dari form/fetch text), parse ke objek
    if (typeof payload === "string") {
      try {
        payload = JSON.parse(payload);
      } catch (strErr) {}
    }

    var result = {};

    switch (action) {
      case "saveSekolah":
        result = saveSingleRowObject(SHEET_NAMES.SEKOLAH, payload);
        break;

      case "saveGuru":
        result = saveSingleRowObject(SHEET_NAMES.GURU, payload);
        break;

      case "saveKelas":
        result = replaceOrUpdateSheetData(SHEET_NAMES.KELAS, payload, "id");
        break;

      case "saveSiswa":
        result = replaceOrUpdateSheetData(SHEET_NAMES.SISWA, payload, "nisn");
        break;

      case "saveJurnal":
        result = appendOrUpdateRow(SHEET_NAMES.JURNAL, payload, "id");
        break;

      case "saveCatatanSaku":
        result = appendOrUpdateRow(SHEET_NAMES.CATATAN_SAKU, payload, "id");
        break;

      case "savePenilaian":
        result = replaceOrUpdateSheetData(SHEET_NAMES.PENILAIAN, payload, "id");
        break;

      case "savePresensi":
        result = appendOrUpdateRow(SHEET_NAMES.PRESENSI, payload, "id");
        break;

      case "saveTugasLms":
        result = replaceOrUpdateSheetData(SHEET_NAMES.TUGAS_LMS, payload, "id");
        break;

      case "savePengumpulan":
        result = appendOrUpdateRow(SHEET_NAMES.PENGUMPULAN, payload, "id");
        break;

      case "saveIbadah":
        result = appendOrUpdateRow(SHEET_NAMES.IBADAH, payload, "tanggal");
        break;

      case "savePendampingan":
        result = replaceOrUpdateSheetData(SHEET_NAMES.PENDAMPINGAN, payload, "id");
        break;

      case "saveNilaiParalel":
        result = replaceOrUpdateSheetData(SHEET_NAMES.NILAI_PARALEL, payload, "id");
        break;

      case "saveAllData":
        result = syncAllData(payload);
        break;

      case "setup":
        result = setupDatabase();
        break;

      case "setSpreadsheetId":
        if (payload && payload.id) {
          PropertiesService.getScriptProperties().setProperty("SPREADSHEET_ID", payload.id.trim());
          result = { success: true, message: "ID Spreadsheet berhasil disimpan ke Script Properties." };
        } else {
          throw new Error("Payload 'id' diperlukan untuk setSpreadsheetId.");
        }
        break;

      default:
        throw new Error("Action POST '" + action + "' tidak dikenali.");
    }

    return createJsonResponse({
      status: "success",
      message: "Data berhasil diproses",
      result: result,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: err.toString()
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (lockErr) {}
  }
}

/**
 * ==============================================================================
 * FUNGSI SETUP DATABASE & STRUKTUR TABEL
 * ==============================================================================
 */
function setupDatabase() {
  var ss = getDatabaseSpreadsheet();
  var schemas = getDatabaseSchemas();
  var createdSheets = [];

  schemas.forEach(function(schema) {
    var sheet = ss.getSheetByName(schema.name);
    var isNew = false;
    if (!sheet) {
      sheet = ss.insertSheet(schema.name);
      isNew = true;
    }

    // Pasang header kolom jika sheet baru atau belum memiliki header
    if (sheet.getLastRow() === 0 || isNew) {
      sheet.appendRow(schema.headers);
      var headerRange = sheet.getRange(1, 1, 1, schema.headers.length);
      headerRange.setBackground("#0f766e")
                 .setFontColor("#ffffff")
                 .setFontWeight("bold")
                 .setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
      createdSheets.push(schema.name);
    }
  });

  // Hapus sheet default "Sheet1" jika kosong dan tabel lain sudah dibuat
  try {
    var defaultSheet = ss.getSheetByName("Sheet1") || ss.getSheetByName("Sheet 1");
    if (defaultSheet && ss.getSheets().length > 1 && defaultSheet.getLastRow() === 0) {
      ss.deleteSheet(defaultSheet);
    }
  } catch (delErr) {}

  var info = {
    message: "Inisialisasi database berhasil! Semua tabel & kolom siap digunakan.",
    spreadsheetName: ss.getName(),
    spreadsheetId: ss.getId(),
    spreadsheetUrl: ss.getUrl(),
    totalTabel: schemas.length,
    tabelBaru: createdSheets
  };

  Logger.log(JSON.stringify(info, null, 2));
  return info;
}

/**
 * ==============================================================================
 * FUNGSI-FUNGSI BANTUAN (DATABASE HELPERS)
 * ==============================================================================
 */

/**
 * Mengambil seluruh data dari semua tabel sheet sebagai objek tunggal
 */
function getAllDatabaseData() {
  var data = {};
  for (var key in SHEET_NAMES) {
    var sheetName = SHEET_NAMES[key];
    data[key.toLowerCase()] = getSheetDataAsJson(sheetName);
  }
  return data;
}

/**
 * Membaca data satu Sheet dan mengonversinya menjadi Array of Objects JSON
 */
function getSheetDataAsJson(sheetName) {
  var ss = getDatabaseSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];

  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow <= 1 || lastCol === 0) return [];

  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var rows = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  var result = [];
  for (var i = 0; i < rows.length; i++) {
    var rowObj = {};
    for (var j = 0; j < headers.length; j++) {
      var headerKey = headers[j];
      var cellVal = rows[i][j];

      // Format tipe data Tanggal
      if (cellVal instanceof Date) {
        cellVal = Utilities.formatDate(cellVal, Session.getScriptTimeZone(), "yyyy-MM-dd");
      }
      // Konversi string boolean
      else if (cellVal === "true") {
        cellVal = true;
      } else if (cellVal === "false") {
        cellVal = false;
      }
      // Coba parse string JSON untuk array (seperti uhList)
      else if (typeof cellVal === "string" && (cellVal.startsWith("[") || cellVal.startsWith("{"))) {
        try {
          cellVal = JSON.parse(cellVal);
        } catch (e) {}
      }

      rowObj[headerKey] = cellVal;
    }
    result.push(rowObj);
  }
  return result;
}

/**
 * Menyimpan data single-row (seperti DataSekolah atau DataGuru)
 */
function saveSingleRowObject(sheetName, obj) {
  if (!obj || typeof obj !== "object") return { updated: false, reason: "Objek kosong" };

  var ss = getDatabaseSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    setupDatabase();
    sheet = ss.getSheetByName(sheetName);
  }

  var lastCol = sheet.getLastColumn();
  var headers = [];

  if (lastCol > 0) {
    headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  } else {
    headers = getHeadersForSheet(sheetName);
    if (headers.length > 0) {
      sheet.appendRow(headers);
      var hr = sheet.getRange(1, 1, 1, headers.length);
      hr.setBackground("#0f766e").setFontColor("#ffffff").setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
  }

  var rowValues = [];
  obj.terakhirDiperbarui = new Date().toISOString();

  for (var i = 0; i < headers.length; i++) {
    var key = headers[i];
    var val = obj[key] !== undefined ? obj[key] : "";
    if (typeof val === "object" && val !== null) {
      val = JSON.stringify(val);
    }
    rowValues.push(val);
  }

  // Tulis pada baris ke-2 (timpa)
  sheet.getRange(2, 1, 1, headers.length).setValues([rowValues]);
  return { updated: true, sheet: sheetName };
}

/**
 * Mengganti atau memperbarui seluruh daftar data di sheet (Array of Objects)
 */
function replaceOrUpdateSheetData(sheetName, dataList, primaryKey) {
  if (!Array.isArray(dataList)) {
    dataList = (dataList && typeof dataList === "object") ? [dataList] : [];
  }

  var ss = getDatabaseSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    setupDatabase();
    sheet = ss.getSheetByName(sheetName);
  }

  var lastCol = sheet.getLastColumn();
  var headers = [];

  if (lastCol > 0) {
    headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  } else {
    headers = getHeadersForSheet(sheetName);
    if (headers.length > 0) {
      sheet.appendRow(headers);
      var hr = sheet.getRange(1, 1, 1, headers.length);
      hr.setBackground("#0f766e").setFontColor("#ffffff").setFontWeight("bold");
      sheet.setFrozenRows(1);
      lastCol = headers.length;
    }
  }

  // Bersihkan baris data lama mulai dari baris 2
  var lastRow = sheet.getLastRow();
  if (lastRow > 1 && lastCol > 0) {
    sheet.getRange(2, 1, lastRow - 1, lastCol).clearContent();
  }

  if (dataList.length === 0) {
    return { count: 0, sheet: sheetName };
  }

  var rowsToWrite = [];
  for (var i = 0; i < dataList.length; i++) {
    var item = dataList[i];
    var row = [];
    for (var j = 0; j < headers.length; j++) {
      var key = headers[j];
      var val = item[key] !== undefined ? item[key] : "";
      if (typeof val === "boolean") {
        val = val ? "true" : "false";
      } else if (typeof val === "object" && val !== null) {
        val = JSON.stringify(val);
      }
      row.push(val);
    }
    rowsToWrite.push(row);
  }

  if (rowsToWrite.length > 0 && headers.length > 0) {
    sheet.getRange(2, 1, rowsToWrite.length, headers.length).setValues(rowsToWrite);
  }

  return { count: rowsToWrite.length, sheet: sheetName };
}

/**
 * Menambahkan atau mengupdate satu baris berdasarkan kunci utama (primaryKey)
 */
function appendOrUpdateRow(sheetName, item, primaryKey) {
  if (!item || typeof item !== "object") return { action: "ignored", reason: "Item kosong" };

  var ss = getDatabaseSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    setupDatabase();
    sheet = ss.getSheetByName(sheetName);
  }

  var lastCol = sheet.getLastColumn();
  var headers = [];

  if (lastCol > 0) {
    headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  } else {
    headers = getHeadersForSheet(sheetName);
    if (headers.length > 0) {
      sheet.appendRow(headers);
      var hr = sheet.getRange(1, 1, 1, headers.length);
      hr.setBackground("#0f766e").setFontColor("#ffffff").setFontWeight("bold");
      sheet.setFrozenRows(1);
      lastCol = headers.length;
    }
  }

  var primaryColIdx = headers.indexOf(primaryKey);

  var rowValues = [];
  for (var j = 0; j < headers.length; j++) {
    var key = headers[j];
    var val = item[key] !== undefined ? item[key] : "";
    if (typeof val === "boolean") {
      val = val ? "true" : "false";
    } else if (typeof val === "object" && val !== null) {
      val = JSON.stringify(val);
    }
    rowValues.push(val);
  }

  // Cari apakah data sudah ada sebelumnya
  var lastRow = sheet.getLastRow();
  var foundRow = -1;

  if (primaryColIdx !== -1 && lastRow > 1 && item[primaryKey] !== undefined && item[primaryKey] !== "") {
    var colData = sheet.getRange(2, primaryColIdx + 1, lastRow - 1, 1).getValues();
    var targetVal = String(item[primaryKey]);
    for (var i = 0; i < colData.length; i++) {
      if (String(colData[i][0]) === targetVal) {
        foundRow = i + 2;
        break;
      }
    }
  }

  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, headers.length).setValues([rowValues]);
    return { action: "updated", row: foundRow, sheet: sheetName };
  } else {
    sheet.appendRow(rowValues);
    return { action: "appended", row: sheet.getLastRow(), sheet: sheetName };
  }
}

/**
 * Sinkronisasi seluruh dataset sekaligus
 */
function syncAllData(allData) {
  if (!allData || typeof allData !== "object") {
    return { status: "ignored", message: "Data sync kosong" };
  }

  if (allData.sekolah) saveSingleRowObject(SHEET_NAMES.SEKOLAH, allData.sekolah);
  if (allData.guru) saveSingleRowObject(SHEET_NAMES.GURU, allData.guru);
  if (allData.kelas) replaceOrUpdateSheetData(SHEET_NAMES.KELAS, allData.kelas, "id");
  if (allData.siswa) replaceOrUpdateSheetData(SHEET_NAMES.SISWA, allData.siswa, "nisn");
  if (allData.jurnal) replaceOrUpdateSheetData(SHEET_NAMES.JURNAL, allData.jurnal, "id");
  if (allData.catatanSaku) replaceOrUpdateSheetData(SHEET_NAMES.CATATAN_SAKU, allData.catatanSaku, "id");
  if (allData.penilaian) replaceOrUpdateSheetData(SHEET_NAMES.PENILAIAN, allData.penilaian, "id");
  if (allData.presensi) replaceOrUpdateSheetData(SHEET_NAMES.PRESENSI, allData.presensi, "id");
  if (allData.tugasLms) replaceOrUpdateSheetData(SHEET_NAMES.TUGAS_LMS, allData.tugasLms, "id");
  if (allData.pengumpulan) replaceOrUpdateSheetData(SHEET_NAMES.PENGUMPULAN, allData.pengumpulan, "id");
  if (allData.ibadah) replaceOrUpdateSheetData(SHEET_NAMES.IBADAH, allData.ibadah, "tanggal");
  if (allData.pendampingan) replaceOrUpdateSheetData(SHEET_NAMES.PENDAMPINGAN, allData.pendampingan, "id");
  if (allData.nilaiParalel) replaceOrUpdateSheetData(SHEET_NAMES.NILAI_PARALEL, allData.nilaiParalel, "id");

  return { status: "success", syncedAt: new Date().toISOString() };
}

/**
 * Format Response JSON dengan CORS Header agar dapat dipanggil dari Web/React
 */
function createJsonResponse(data, callback) {
  var jsonString = JSON.stringify(data);
  if (callback && typeof callback === "string" && callback.trim() !== "") {
    return ContentService.createTextOutput(callback + "(" + jsonString + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(jsonString)
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ==============================================================================
 * FUNGSI TESTING / UJI COBA (PILIH DI DROPDOWN RUN PADA GOOGLE APPS SCRIPT)
 * ==============================================================================
 */

/**
 * Jalankan fungsi ini pertama kali di editor Google Apps Script
 */
function runSetup() {
  Logger.log("Memulai setup database...");
  var res = setupDatabase();
  Logger.log("Hasil Setup: " + JSON.stringify(res, null, 2));
  return res;
}

/**
 * Uji koneksi ke Spreadsheet dan cetak URL
 */
function testKoneksi() {
  var ss = getDatabaseSpreadsheet();
  Logger.log("Koneksi berhasil!");
  Logger.log("Nama Spreadsheet: " + ss.getName());
  Logger.log("ID Spreadsheet: " + ss.getId());
  Logger.log("URL Spreadsheet: " + ss.getUrl());
}

/**
 * Uji pembacaan data siswa
 */
function testAmbilDataSiswa() {
  var siswa = getSheetDataAsJson(SHEET_NAMES.SISWA);
  Logger.log("Total siswa ditemukan: " + siswa.length);
  if (siswa.length > 0) {
    Logger.log("Contoh data siswa pertama: " + JSON.stringify(siswa[0]));
  }
}
