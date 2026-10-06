/**
 * ==============================================================================
 * KODE.GS / CODE.GS - BACKEND GOOGLE APPS SCRIPT & DATABASE GOOGLE SHEETS
 * SISTEM INFORMASI & LMS PEMBELAJARAN PAI SMP (PAILMS)
 * UPT SMPN 2 REBANG TANGKAS
 * ==============================================================================
 * 
 * PANDUAN LENGKAP PENGGUNAAN (DEPLOYMENT):
 * ------------------------------------------------------------------------------
 * METODE 1: Terikat Langsung ke Google Spreadsheet (PALING DISARANKAN & MUDAH)
 * 1. Buat Google Spreadsheet baru di Google Drive Anda (misal: "Database PAILMS 2026").
 * 2. Di Spreadsheet tersebut, klik menu: "Ekstensi" (Extensions) > "Apps Script".
 * 3. Hapus seluruh isi kode bawaan, lalu salin dan tempelkan SELURUH isi file ini.
 * 4. Jika Anda ingin aplikasi React dapat dibuka langsung dari URL Apps Script:
 *    - Di editor Apps Script, klik tombol (+) di samping 'File' > pilih 'HTML'.
 *    - Beri nama: "Index" (atau "index").
 *    - Salin seluruh isi file 'dist/index.html' proyek ini ke dalam file 'Index.html' tersebut.
 * 5. Klik tombol "Simpan" (ikon disket / Ctrl + S).
 * 6. Di dropdown fungsi bagian atas, pilih 'runSetup' lalu klik tombol "Jalankan" (Run).
 *    -> Berikan izin otorisasi akses Google Spreadsheet & Google Drive saat diminta.
 * 7. Klik tombol "Deploy" (Terapkan) di pojok kanan atas > "Deployment baru" (New deployment).
 *    - Jenis: Pilih "Aplikasi Web" (Web app) melalui ikon roda gigi ⚙️.
 *    - Deskripsi: API & Database PAILMS
 *    - Jalankan sebagai (Execute as): "Saya" (Me)
 *    - Siapa yang memiliki akses (Who has access): "Siapa saja" (Anyone) -> WAJIB!
 * 8. Klik "Deploy", lalu salin "URL Aplikasi Web" (berakhiran '/exec').
 * 9. Tempelkan URL tersebut ke dalam aplikasi PAILMS pada menu:
 *    "Sinkronisasi Google Sheets" > "Database Berjalan" > "Hubungkan dengan Apps Script".
 * 
 * METODE 2: Standalone di script.google.com
 * 1. Buka https://script.google.com > Klik "+ Project Baru".
 * 2. Tempel seluruh kode ini ke 'Kode.gs'.
 * 3. Isi variabel SPREADSHEET_ID_OR_URL di baris 46 di bawah dengan ID spreadsheet Anda.
 * 4. Jalankan fungsi 'runSetup' lalu deploy sebagai Web App (Akses: Siapa saja).
 * ==============================================================================
 */

// ===================== KONFIGURASI SPREADSHEET & DRIVE =====================
// Jika script dibuka melalui menu Ekstensi Google Spreadsheet, biarkan kosong ("").
// Jika standalone, Anda dapat memasukkan ID Google Sheet Anda di sini:
var SPREADSHEET_ID_OR_URL = "";

// Judul default jika script harus otomatis membuat spreadsheet baru di Drive Anda:
var DEFAULT_SPREADSHEET_TITLE = "Database PAILMS - UPT SMPN 2 Rebang Tangkas";

// Nama folder penyimpanan berkas arsip dan dokumen di Google Drive:
var PAILMS_DRIVE_FOLDER_NAME = "PAILMS - Berkas & Database (UPT SMPN 2 Rebang Tangkas)";

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

// ===================== DEFINISI SKEMA & HEADER TABEL =====================
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
  // 1. Cek jika ID atau URL ditentukan secara manual
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
    if (boundSs) return boundSs;
  } catch (boundErr) {}

  // 3. Cek Script Properties jika sebelumnya pernah tersimpan
  try {
    var savedId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
    if (savedId) {
      return SpreadsheetApp.openById(savedId);
    }
  } catch (propErr) {}

  // 4. Jika dijalankan mandiri dan belum ada ID, buatkan Spreadsheet baru di Google Drive pengguna
  try {
    var newSs = SpreadsheetApp.create(DEFAULT_SPREADSHEET_TITLE);
    var newId = newSs.getId();
    PropertiesService.getScriptProperties().setProperty("SPREADSHEET_ID", newId);
    Logger.log("Spreadsheet baru berhasil dibuat otomatis! ID: " + newId + " | URL: " + newSs.getUrl());
    return newSs;
  } catch (createErr) {
    throw new Error(
      "Spreadsheet tidak terdeteksi! Silakan buka Google Sheets Anda > menu Ekstensi > Apps Script, " +
      "atau tempelkan ID Google Spreadsheet Anda pada variabel SPREADSHEET_ID_OR_URL di Kode.gs."
    );
  }
}

/**
 * Mengambil atau membuat folder penyimpanan Google Drive untuk berkas PAILMS
 */
function getOrCreatePailmsDriveFolder() {
  try {
    var folders = DriveApp.getFoldersByName(PAILMS_DRIVE_FOLDER_NAME);
    if (folders.hasNext()) {
      return folders.next();
    }
    var newFolder = DriveApp.createFolder(PAILMS_DRIVE_FOLDER_NAME);
    newFolder.setDescription("Folder penyimpanan berkas perangkat ajar, materi, LKPD, dan arsip database PAILMS");
    return newFolder;
  } catch (err) {
    Logger.log("Folder PAILMS dibuat di root Drive: " + err.message);
    return DriveApp.getRootFolder();
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

  // 1. Jika ada parameter action, layani sebagai API JSON/JSONP
  if (action) {
    try {
      var responseData = {};

      switch (action) {
        case "ping":
          responseData = {
            status: "online",
            serverTime: new Date().toISOString(),
            app: "PAILMS Backend Engine",
            school: "UPT SMPN 2 Rebang Tangkas",
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

        case "listDriveFiles":
          var category = (e && e.parameter && e.parameter.category) ? String(e.parameter.category).trim() : "all";
          responseData = listDriveFilesInternal(category);
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

  // 2. Jika diakses langsung tanpa action, coba tampilkan file 'Index.html' atau 'index.html' jika ada
  try {
    return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('PAILMS - UPT SMPN 2 Rebang Tangkas')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (errIndex) {
    try {
      return HtmlService.createHtmlOutputFromFile('index')
        .setTitle('PAILMS - UPT SMPN 2 Rebang Tangkas')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    } catch (errIndexLower) {
      // 3. Jika tidak ada file Index.html di project Apps Script, tampilkan Dashboard Status Interaktif
      return renderInteractiveDashboard();
    }
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

    // Parse string JSON jika payload berformat string
    if (typeof payload === "string") {
      try {
        payload = JSON.parse(payload);
      } catch (strErr) {}
    }

    var result = {};

    switch (action) {
      case "getAllData":
      case "getData":
      case "fetchDatabase":
        result = getAllDatabaseData();
        break;

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
      case "syncAllData":
        result = syncAllData(payload);
        break;

      case "uploadDriveFile":
      case "saveDriveFile":
        result = saveFileToGoogleDriveInternal(payload);
        break;

      case "deleteDriveFile":
        result = deleteFileFromGoogleDriveInternal(payload && payload.id ? payload.id : payload);
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
      message: "Data berhasil diproses ke Google Sheets / Google Drive",
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
 * Handle HTTP OPTIONS untuk CORS Preflight Request
 */
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * ==============================================================================
 * PENYIMPANAN BERKAS KE GOOGLE DRIVE
 * ==============================================================================
 */

/**
 * Menyimpan berkas (base64 atau text) ke Google Drive di folder PAILMS
 */
function saveFileToGoogleDriveInternal(fileObj) {
  if (!fileObj || typeof fileObj !== "object") {
    throw new Error("Objek berkas tidak valid.");
  }

  var fileName = fileObj.name || ("Berkas_PAILMS_" + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd_HHmmss"));
  var mimeType = fileObj.mimeType || "application/octet-stream";
  var folder = getOrCreatePailmsDriveFolder();
  var blob = null;

  if (fileObj.contentBase64) {
    var rawBase64 = String(fileObj.contentBase64).replace(/^data:[^;]+;base64,/, "");
    var decodedBytes = Utilities.base64Decode(rawBase64);
    blob = Utilities.newBlob(decodedBytes, mimeType, fileName);
  } else if (fileObj.textContent) {
    blob = Utilities.newBlob(fileObj.textContent, mimeType, fileName);
  } else {
    throw new Error("Konten berkas (contentBase64 atau textContent) diperlukan.");
  }

  var createdFile = folder.createFile(blob);
  if (fileObj.description) {
    createdFile.setDescription(fileObj.description);
  }

  // Berikan hak akses siapa saja dengan tautan agar dapat diunduh/dilihat
  try {
    createdFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (shareErr) {
    Logger.log("Sharing permission warning: " + shareErr.message);
  }

  return {
    id: createdFile.getId(),
    name: createdFile.getName(),
    mimeType: createdFile.getMimeType(),
    size: createdFile.getSize(),
    webViewLink: createdFile.getUrl(),
    downloadUrl: createdFile.getDownloadUrl() || createdFile.getUrl(),
    category: fileObj.category || "document",
    description: fileObj.description || "",
    modifiedTime: new Date().toISOString()
  };
}

/**
 * Menampilkan daftar berkas yang tersimpan di Google Drive folder PAILMS
 */
function listDriveFilesInternal(category) {
  var folder = getOrCreatePailmsDriveFolder();
  var filesIter = folder.getFiles();
  var filesList = [];

  while (filesIter.hasNext()) {
    var f = filesIter.next();
    var mime = f.getMimeType();
    var name = f.getName();

    var cat = "document";
    if (mime.indexOf("spreadsheet") !== -1 || name.indexOf(".xlsx") !== -1 || name.indexOf(".csv") !== -1) {
      cat = "spreadsheet";
    } else if (name.indexOf("Backup") !== -1 || name.indexOf("Cadangan") !== -1 || mime.indexOf("json") !== -1) {
      cat = "backup";
    }

    if (category === "all" || category === cat || (category === "spreadsheets" && cat === "spreadsheet") || (category === "documents" && cat === "document") || (category === "backups" && cat === "backup")) {
      filesList.push({
        id: f.getId(),
        name: f.getName(),
        mimeType: mime,
        size: f.getSize(),
        webViewLink: f.getUrl(),
        downloadUrl: f.getDownloadUrl() || f.getUrl(),
        category: cat,
        description: f.getDescription() || "",
        modifiedTime: f.getLastUpdated().toISOString(),
        isLocal: false
      });
    }
  }

  return filesList;
}

/**
 * Menghapus berkas dari Google Drive
 */
function deleteFileFromGoogleDriveInternal(fileId) {
  if (!fileId) throw new Error("ID berkas diperlukan.");
  var f = DriveApp.getFileById(String(fileId).trim());
  f.setTrashed(true);
  return { success: true, message: "Berkas berhasil dipindahkan ke tempat sampah Google Drive." };
}

/**
 * ==============================================================================
 * FUNGSI SETUP DATABASE & STRUKTUR TABEL GOOGLE SHEETS
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
 * OPERASI BACA & TULIS DATA SPREADSHEET
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
 * Mencari Sheet di Spreadsheet secara fleksibel (mendukung spasi, underscore, maupun variasi nama)
 */
function findSheetByNameFuzzy(ss, sheetName) {
  if (!ss) return null;
  var sheet = ss.getSheetByName(sheetName);
  if (sheet) return sheet;
  var all = ss.getSheets();
  var target = String(sheetName || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  for (var i = 0; i < all.length; i++) {
    var cur = all[i].getName().toLowerCase().replace(/[^a-z0-9]/g, "");
    if (cur === target || cur.indexOf(target) >= 0 || target.indexOf(cur) >= 0) {
      return all[i];
    }
  }
  return null;
}

/**
 * Membaca data satu Sheet dan mengonversinya menjadi Array of Objects JSON
 */
function getSheetDataAsJson(sheetName) {
  var ss = getDatabaseSpreadsheet();
  var sheet = findSheetByNameFuzzy(ss, sheetName);
  if (!sheet) return [];

  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow <= 1 || lastCol === 0) return [];

  // Cari baris header sebenarnya (mendukung sheet yang memiliki banner judul di baris 1-3)
  var maxSearch = Math.min(6, lastRow);
  var sampleRows = sheet.getRange(1, 1, maxSearch, lastCol).getValues();
  var headerRowIdx = 0;

  for (var r = 0; r < sampleRows.length; r++) {
    var line = sampleRows[r].join(" ").toLowerCase();
    if (
      line.indexOf("nisn") >= 0 ||
      line.indexOf("nama lengkap") >= 0 ||
      line.indexOf("kode rombel") >= 0 ||
      line.indexOf("materi") >= 0 ||
      line.indexOf("tanggal") >= 0 ||
      line.indexOf("kuis") >= 0 ||
      line.indexOf("uh 1") >= 0 ||
      line.indexOf("subuh") >= 0 ||
      line.indexOf("npsn") >= 0 ||
      line.indexOf("nip") >= 0
    ) {
      headerRowIdx = r;
      break;
    }
  }

  var rawHeaders = sampleRows[headerRowIdx];
  var headers = [];
  for (var h = 0; h < rawHeaders.length; h++) {
    var key = String(rawHeaders[h] || "").trim();
    if (!key) key = "col_" + (h + 1);
    headers.push(key);
  }

  var dataStartRow = headerRowIdx + 2; // 1-based row number
  var dataRowCount = lastRow - headerRowIdx - 1;
  if (dataRowCount <= 0) return [];

  var rows = sheet.getRange(dataStartRow, 1, dataRowCount, lastCol).getValues();
  var result = [];

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var firstCell = String(row[0] || "").trim().toLowerCase();
    if (
      firstCell.indexOf("rekapitulasi") >= 0 ||
      firstCell.indexOf("rata-rata") >= 0 ||
      firstCell.indexOf("total") >= 0 ||
      firstCell.indexOf("mengetahui") >= 0
    ) {
      continue;
    }

    var rowObj = {};
    var hasContent = false;
    for (var j = 0; j < headers.length; j++) {
      var headerKey = headers[j];
      var cellVal = row[j];

      if (cellVal instanceof Date) {
        cellVal = Utilities.formatDate(cellVal, Session.getScriptTimeZone(), "yyyy-MM-dd");
      } else if (cellVal === "true") {
        cellVal = true;
      } else if (cellVal === "false") {
        cellVal = false;
      } else if (typeof cellVal === "string" && (cellVal.startsWith("[") || cellVal.startsWith("{"))) {
        try {
          cellVal = JSON.parse(cellVal);
        } catch (e) {}
      }

      rowObj[headerKey] = cellVal;
      if (cellVal !== "" && cellVal !== null && cellVal !== undefined) {
        hasContent = true;
      }
    }
    if (hasContent) {
      result.push(rowObj);
    }
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
 * Menambahkan atau mengupdate satu baris berdasarkan kunci utama
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
 * Sinkronisasi seluruh dataset PAILMS secara komprehensif
 */
function syncAllData(allData) {
  if (!allData || typeof allData !== "object") {
    return { status: "ignored", message: "Data sync kosong" };
  }

  var updatedCount = 0;
  if (allData.sekolah) { saveSingleRowObject(SHEET_NAMES.SEKOLAH, allData.sekolah); updatedCount++; }
  if (allData.guru) { saveSingleRowObject(SHEET_NAMES.GURU, allData.guru); updatedCount++; }
  if (allData.classes || allData.kelas) { replaceOrUpdateSheetData(SHEET_NAMES.KELAS, allData.classes || allData.kelas, "id"); updatedCount++; }
  if (allData.students || allData.siswa) { replaceOrUpdateSheetData(SHEET_NAMES.SISWA, allData.students || allData.siswa, "nisn"); updatedCount++; }
  if (allData.jurnalMengajar || allData.jurnal) { replaceOrUpdateSheetData(SHEET_NAMES.JURNAL, allData.jurnalMengajar || allData.jurnal, "id"); updatedCount++; }
  if (allData.catatanSaku) { replaceOrUpdateSheetData(SHEET_NAMES.CATATAN_SAKU, allData.catatanSaku, "id"); updatedCount++; }
  if (allData.rekapNilai || allData.penilaian) { replaceOrUpdateSheetData(SHEET_NAMES.PENILAIAN, allData.rekapNilai || allData.penilaian, "id"); updatedCount++; }
  if (allData.presensi) { replaceOrUpdateSheetData(SHEET_NAMES.PRESENSI, allData.presensi, "id"); updatedCount++; }
  if (allData.tugasLms) { replaceOrUpdateSheetData(SHEET_NAMES.TUGAS_LMS, allData.tugasLms, "id"); updatedCount++; }
  if (allData.pengumpulan) { replaceOrUpdateSheetData(SHEET_NAMES.PENGUMPULAN, allData.pengumpulan, "id"); updatedCount++; }
  if (allData.jurnalIbadah || allData.ibadah) { replaceOrUpdateSheetData(SHEET_NAMES.IBADAH, allData.jurnalIbadah || allData.ibadah, "tanggal"); updatedCount++; }
  if (allData.pendampingan) { replaceOrUpdateSheetData(SHEET_NAMES.PENDAMPINGAN, allData.pendampingan, "id"); updatedCount++; }
  if (allData.nilaiParalel || allData.nilaiParalelList) { replaceOrUpdateSheetData(SHEET_NAMES.NILAI_PARALEL, allData.nilaiParalel || allData.nilaiParalelList, "id"); updatedCount++; }

  return {
    status: "success",
    syncedAt: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss"),
    updatedTables: updatedCount,
    message: "Sinkronisasi " + updatedCount + " tabel database ke Google Sheets berhasil."
  };
}

/**
 * ==============================================================================
 * FUNGSI NATIVE UNTUK google.script.run (Dipanggil Langsung dari Web App)
 * ==============================================================================
 */
function apiGetAllData() {
  return JSON.stringify(getAllDatabaseData());
}

function apiSaveAllData(payloadJson) {
  var data = typeof payloadJson === "string" ? JSON.parse(payloadJson) : payloadJson;
  return JSON.stringify(syncAllData(data));
}

function apiUploadDriveFile(fileJson) {
  var fileObj = typeof fileJson === "string" ? JSON.parse(fileJson) : fileJson;
  return JSON.stringify(saveFileToGoogleDriveInternal(fileObj));
}

function apiListDriveFiles(category) {
  return JSON.stringify(listDriveFilesInternal(category || "all"));
}

function apiDeleteDriveFile(fileId) {
  return JSON.stringify(deleteFileFromGoogleDriveInternal(fileId));
}

function apiPing() {
  return JSON.stringify({
    status: "online",
    time: new Date().toISOString(),
    message: "PAILMS Apps Script Engine Online"
  });
}

function apiSetupDatabase() {
  return JSON.stringify(setupDatabase());
}

/**
 * Format Response JSON/JSONP dengan CORS Header
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
 * Render Dashboard Status & API Helper jika diakses langsung di browser
 */
function renderInteractiveDashboard() {
  try {
    var dbSpreadsheet = getDatabaseSpreadsheet();
    var ssUrl = dbSpreadsheet.getUrl();
    var ssName = dbSpreadsheet.getName();
    var sheetList = dbSpreadsheet.getSheets();
    var driveFolder = getOrCreatePailmsDriveFolder();

    var tableRowsHtml = "";
    for (var i = 0; i < sheetList.length; i++) {
      var s = sheetList[i];
      var rowCount = Math.max(0, s.getLastRow() - 1);
      tableRowsHtml += "<tr>" +
        "<td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:700;color:#0f766e;'>" + s.getName() + "</td>" +
        "<td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace;'>" + rowCount + " baris</td>" +
        "</tr>";
    }

    var html = "<!DOCTYPE html>" +
      "<html><head><meta charset='utf-8'>" +
      "<meta name='viewport' content='width=device-width, initial-scale=1'>" +
      "<title>API Server & Database PAILMS</title>" +
      "<style>" +
      "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f0fdf4; color: #1e293b; padding: 24px 16px; margin: 0; }" +
      ".container { max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 32px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); border: 1px solid #bbf7d0; }" +
      ".badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #dcfce7; color: #15803d; font-weight: 700; font-size: 12px; border-radius: 9999px; border: 1px solid #86efac; }" +
      "h1 { color: #065f46; font-size: 22px; margin: 16px 0 8px 0; font-weight: 800; }" +
      "p { color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0; }" +
      ".card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 16px 0; }" +
      ".btn { display: inline-block; padding: 10px 18px; background: #059669; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 13px; transition: background 0.2s; border: none; cursor: pointer; }" +
      ".btn:hover { background: #047857; }" +
      ".btn-outline { background: #ffffff; color: #065f46; border: 1px solid #a7f3d0; margin-left: 8px; }" +
      ".btn-outline:hover { background: #ecfdf5; }" +
      "table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 10px; }" +
      "th { text-align: left; padding: 8px 12px; background: #f1f5f9; color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }" +
      "code { background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-family: monospace; color: #0f172a; }" +
      "</style></head><body>" +
      "<div class='container'>" +
      "<span class='badge'>● Google Apps Script & Sheets Online</span>" +
      "<h1>Sistem Informasi & Manajemen PAI SMP</h1>" +
      "<p>Web Service Backend Google Apps Script telah berhasil dipasang dan terhubung langsung ke Google Sheets & Google Drive secara aman.</p>" +
      "<div class='card'>" +
      "<div style='font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;'>Database Terhubung:</div>" +
      "<div style='font-size:16px;font-weight:700;color:#0f172a;margin-top:4px;'>" + ssName + "</div>" +
      "<div style='font-size:12px;color:#0f766e;margin-top:2px;'>📁 Folder Drive: " + driveFolder.getName() + "</div>" +
      "<div style='margin-top:12px;'>" +
      "<a href='" + ssUrl + "' target='_blank' class='btn'>Buka Google Spreadsheet ↗</a>" +
      "<a href='" + driveFolder.getUrl() + "' target='_blank' class='btn btn-outline'>Buka Folder Drive ↗</a>" +
      "<a href='?action=setup' class='btn btn-outline'>⚡ Inisialisasi Tabel</a>" +
      "</div>" +
      "</div>" +
      "<h3 style='font-size:14px;color:#334155;margin:20px 0 8px 0;'>Daftar Tabel Database Berjalan:</h3>" +
      "<table><thead><tr><th>Nama Lembar Kerja (Sheet)</th><th style='text-align:right;'>Data Terdata</th></tr></thead>" +
      "<tbody>" + tableRowsHtml + "</tbody></table>" +
      "<div style='margin-top:24px;font-size:12px;color:#64748b;border-top:1px solid #e2e8f0;padding-top:16px;'>" +
      "UPT SMPN 2 Rebang Tangkas • Modul Inovasi Pendidikan Agama Islam & Budi Pekerti" +
      "</div></div></body></html>";

    return HtmlService.createHtmlOutput(html)
      .setTitle("PAILMS - Server Status")
      .addMetaTag("viewport", "width=device-width, initial-scale=1");

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
 * Utilitas untuk menyertakan file parsial HTML jika diperlukan
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * ==============================================================================
 * FUNGSI TESTING / UJI COBA
 * ==============================================================================
 */
function runSetup() {
  Logger.log("Memulai setup database...");
  var res = setupDatabase();
  Logger.log("Hasil Setup: " + JSON.stringify(res, null, 2));
  return res;
}

function testKoneksi() {
  var ss = getDatabaseSpreadsheet();
  var folder = getOrCreatePailmsDriveFolder();
  Logger.log("Koneksi berhasil!");
  Logger.log("Nama Spreadsheet: " + ss.getName());
  Logger.log("ID Spreadsheet: " + ss.getId());
  Logger.log("Folder Drive: " + folder.getName() + " | " + folder.getUrl());
}
