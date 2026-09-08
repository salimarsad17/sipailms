// =========================================================================
// KODE.GS - TEMPLATE GOOGLE APPS SCRIPT UNTUK PAILMS
// =========================================================================
// 
// CARA PENGGUNAAN (DEPLOY KE GOOGLE APPS SCRIPT):
// 1. Buka Google Sheets baru, klik Ekstensi > Apps Script.
// 2. Hapus kode default (myFunction), lalu salin seluruh isi file ini 
//    dan tempelkan ke file "Kode.gs" di editor Apps Script Anda.
// 3. Buat file baru di editor Apps Script bernama "Index.html" (Pilih HTML).
// 4. Salin seluruh isi dari file "dist/index.html" di proyek ini 
//    (setelah aplikasi di-build) dan tempelkan ke "Index.html" di Apps Script.
// 5. Klik "Terapkan" (Deploy) > "Deployment Baru" > Pilih jenis "Aplikasi Web".
// 6. Atur akses ke "Siapa saja" (Anyone) atau sesuai kebutuhan Anda.
// =========================================================================

// ID Spreadsheet yang akan digunakan sebagai Database
// Ganti dengan ID Spreadsheet Anda (ID dapat diambil dari URL Google Sheet Anda)
const SPREADSHEET_ID = 'GANTI_DENGAN_ID_SPREADSHEET_ANDA';

// Fungsi utama untuk melayani tampilan (Membaca file Index.html)
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('PAILMS - UPT SMPN 2 Rebang Tangkas')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// =========================================================================
// CONTOH FUNGSI CRUD UNTUK DATABASE GOOGLE SHEETS
// Fungsi-fungsi di bawah ini dapat dipanggil dari aplikasi React (Frontend)
// menggunakan google.script.run
// =========================================================================

/**
 * Contoh Fungsi: Mengambil data siswa dari Sheet "DataSiswa"
 */
function getStudents() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('DataSiswa');
    if (!sheet) return JSON.stringify({ error: 'Sheet DataSiswa tidak ditemukan' });
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const result = [];
    
    for (let i = 1; i < data.length; i++) {
      let row = data[i];
      let obj = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = row[j];
      }
      result.push(obj);
    }
    
    return JSON.stringify(result);
  } catch (error) {
    return JSON.stringify({ error: error.toString() });
  }
}

/**
 * Contoh Fungsi: Menyimpan data nilai tugas baru ke Sheet "NilaiTugas"
 */
function saveSubmission(submissionData) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('NilaiTugas');
    if (!sheet) return JSON.stringify({ success: false, error: 'Sheet NilaiTugas tidak ditemukan' });
    
    // Parse data dari frontend (diasumsikan format JSON string)
    const data = JSON.parse(submissionData);
    
    // Menambahkan baris baru ke Google Sheet
    sheet.appendRow([
      data.id,
      data.tugasId,
      data.tugasJudul,
      data.siswaNisn,
      data.siswaNama,
      data.kelasId,
      data.tanggalKumpul,
      data.tipePengumpulan,
      data.kontenTeks,
      data.nilai || "",
      data.komentarGuru || ""
    ]);
    
    return JSON.stringify({ success: true, message: 'Data berhasil disimpan ke Google Sheets' });
  } catch (error) {
    return JSON.stringify({ success: false, error: error.toString() });
  }
}

/**
 * Fungsi utilitas untuk menyertakan file pendukung jika diperlukan di masa mendatang
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
