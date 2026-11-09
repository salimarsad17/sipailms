/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  User,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Lock,
  MessageSquare,
  School,
  IdCard,
  Printer,
  Calendar,
  Phone,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronRight,
  Pencil,
  Trash2,
  Camera,
  Upload,
  X,
  RotateCcw,
  Sparkles,
  MapPin,
  QrCode,
  Layers,
  Award
} from "lucide-react";
import { Siswa, DataSekolah, UserAccount, Kelas, KartuPelajarData } from "../../types";
import { DataService } from "../../data/initialData";
import { LOGO_WAY_KANAN } from "../../assets/logoWayKananBase64";
import { compressImageFile } from "../../lib/imageCompression";

interface AkunSiswaViewProps {
  siswa: Siswa;
  sekolah: DataSekolah;
  classes?: Kelas[];
  onUpdateSiswa?: (updatedSiswa: Siswa) => void;
  onNavigateToPesan: () => void;
  onNavigateToDashboard?: () => void;
}

export default function AkunSiswaView({
  siswa,
  sekolah,
  classes = [],
  onUpdateSiswa,
  onNavigateToPesan,
  onNavigateToDashboard
}: AkunSiswaViewProps) {
  const [subTab, setSubTab] = useState<"kartu" | "akun">("kartu");
  const [accounts, setAccounts] = useState<UserAccount[]>(() => DataService.getAccounts());
  const [showPassword, setShowPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [copiedNisn, setCopiedNisn] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "info" } | null>(null);

  // Card view state: 'depan' | 'belakang' | 'keduanya'
  const [cardSide, setCardSide] = useState<"depan" | "belakang" | "keduanya">("depan");

  // Derive official school & headmaster identity directly from Data Sekolah
  const activeSekolah = sekolah || DataService.getSekolah();
  const currentNamaKepsek = (sekolah?.namaKepsek || activeSekolah?.namaKepsek || "Drs. H. Mulyadi, M.M.").trim();
  const currentNipKepsek = (sekolah?.nipKepsek || activeSekolah?.nipKepsek || "19700318 199503 1 002").trim();
  const currentNamaSekolah = (sekolah?.namaSekolah || activeSekolah?.namaSekolah || "UPT SMPN 2 REBANG TANGKAS").trim();

  // Load Kartu Pelajar Data from localStorage or Siswa defaults
  const storageKey = `sipailms_kartu_pelajar_${siswa.nisn}`;
  const getInitialKartuData = (): KartuPelajarData => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          nisn: siswa.nisn,
          nis: parsed.nis || siswa.nis || `2026${siswa.nisn.slice(-4) || "001"}`,
          nama: parsed.nama || siswa.nama,
          kelasId: parsed.kelasId || siswa.kelasId,
          gender: parsed.gender || siswa.gender,
          alamat: parsed.alamat || siswa.alamat || "Kp. Simpang Tiga, Kec. Rebang Tangkas, Kab. Way Kanan",
          tempatTanggalLahir: parsed.tempatTanggalLahir || siswa.tempatTanggalLahir || "Way Kanan, 12 Mei 2012",
          foto: parsed.foto || siswa.foto || "",
          namaSekolah: currentNamaSekolah || "UPT SMPN 2 REBANG TANGKAS",
          kecamatanSekolah: "KECAMATAN REBANG TANGKAS",
          kabupatenSekolah: "KABUPATEN WAY KANAN",
          berlakuSampai: parsed.berlakuSampai || "2024 - 2027",
          kepalaSekolah: currentNamaKepsek,
          nipKepalaSekolah: currentNipKepsek
        };
      }
    } catch {
      // Fallback
    }

    return {
      nisn: siswa.nisn,
      nis: siswa.nis || `2026${siswa.nisn.slice(-4) || "001"}`,
      nama: siswa.nama,
      kelasId: siswa.kelasId,
      gender: siswa.gender,
      alamat: siswa.alamat || "Kp. Simpang Tiga, Kec. Rebang Tangkas, Kab. Way Kanan",
      tempatTanggalLahir: siswa.tempatTanggalLahir || "Way Kanan, 12 Mei 2012",
      foto: siswa.foto || "",
      namaSekolah: currentNamaSekolah || "UPT SMPN 2 REBANG TANGKAS",
      kecamatanSekolah: "KECAMATAN REBANG TANGKAS",
      kabupatenSekolah: "KABUPATEN WAY KANAN",
      berlakuSampai: "2024 - 2027",
      kepalaSekolah: currentNamaKepsek,
      nipKepalaSekolah: currentNipKepsek
    };
  };

  const [kartuData, setKartuData] = useState<KartuPelajarData>(getInitialKartuData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit form state
  const [editForm, setEditForm] = useState<KartuPelajarData>(kartuData);

  useEffect(() => {
    setAccounts(DataService.getAccounts());
  }, []);

  // Synchronize school headmaster name & NIP automatically from Data Sekolah
  useEffect(() => {
    setKartuData((prev) => ({
      ...prev,
      namaSekolah: currentNamaSekolah || prev.namaSekolah,
      kepalaSekolah: currentNamaKepsek,
      nipKepalaSekolah: currentNipKepsek
    }));
    setEditForm((prev) => ({
      ...prev,
      namaSekolah: currentNamaSekolah || prev.namaSekolah,
      kepalaSekolah: currentNamaKepsek,
      nipKepalaSekolah: currentNipKepsek
    }));
  }, [currentNamaKepsek, currentNipKepsek, currentNamaSekolah]);

  const showToast = (text: string, type: "success" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Find student login credentials
  const studentAccount = accounts.find(
    (a) =>
      a.role === "siswa" &&
      a.identifier.trim().toLowerCase() === siswa.nisn.trim().toLowerCase()
  ) || {
    id: `acc-siswa-${siswa.nisn}`,
    role: "siswa" as const,
    identifier: siswa.nisn,
    password: "123",
    nama: siswa.nama,
    kelasId: siswa.kelasId,
    gender: siswa.gender,
    kontak: siswa.kontakOrangTua,
    registeredAt: "2026-01-01T00:00:00.000Z"
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(studentAccount.password);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  const handleCopyNisn = () => {
    navigator.clipboard.writeText(siswa.nisn);
    setCopiedNisn(true);
    setTimeout(() => setCopiedNisn(false), 2000);
  };

  // Open Edit Modal
  const handleOpenEditModal = () => {
    setEditForm({
      ...kartuData,
      namaSekolah: currentNamaSekolah || "UPT SMPN 2 REBANG TANGKAS",
      kepalaSekolah: currentNamaKepsek,
      nipKepalaSekolah: currentNipKepsek
    });
    setIsEditModalOpen(true);
  };

  // Handle Photo File Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      const compressedDataUrl = await compressImageFile(file, 400, 0.85);
      setEditForm((prev) => ({ ...prev, foto: compressedDataUrl }));
      showToast("Foto kartu pelajar berhasil diunggah!", "success");
    } catch {
      alert("Gagal memproses berkas foto. Pastikan format gambar berupa JPG, PNG, atau WEBP.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Save Card Data (Input & Edit)
  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.nama.trim()) {
      alert("Harap isi nama lengkap siswa!");
      return;
    }

    const updated: KartuPelajarData = {
      ...editForm,
      nama: editForm.nama.trim(),
      nis: editForm.nis.trim() || `2026${siswa.nisn.slice(-4) || "001"}`,
      alamat: editForm.alamat.trim() || "Kp. Simpang Tiga, Kec. Rebang Tangkas, Kab. Way Kanan",
      namaSekolah: currentNamaSekolah || "UPT SMPN 2 REBANG TANGKAS",
      kepalaSekolah: currentNamaKepsek,
      nipKepalaSekolah: currentNipKepsek
    };

    setKartuData(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // Storage safety
    }

    // Propagate changes to Siswa model if available
    if (onUpdateSiswa) {
      onUpdateSiswa({
        ...siswa,
        nama: updated.nama,
        kelasId: updated.kelasId,
        nis: updated.nis,
        alamat: updated.alamat,
        foto: updated.foto,
        tempatTanggalLahir: updated.tempatTanggalLahir
      });
    }

    setIsEditModalOpen(false);
    showToast("Data Kartu Pelajar berhasil disimpan!", "success");
  };

  // Delete / Reset Card Data
  const handleDeleteCard = () => {
    const resetData: KartuPelajarData = {
      nisn: siswa.nisn,
      nis: `2026${siswa.nisn.slice(-4) || "001"}`,
      nama: siswa.nama,
      kelasId: siswa.kelasId,
      gender: siswa.gender,
      alamat: "Kp. Simpang Tiga, Kec. Rebang Tangkas, Kab. Way Kanan",
      tempatTanggalLahir: "Way Kanan, 12 Mei 2012",
      foto: "",
      namaSekolah: currentNamaSekolah || "UPT SMPN 2 REBANG TANGKAS",
      kecamatanSekolah: "KECAMATAN REBANG TANGKAS",
      kabupatenSekolah: "KABUPATEN WAY KANAN",
      berlakuSampai: "2024 - 2027",
      kepalaSekolah: currentNamaKepsek,
      nipKepalaSekolah: currentNipKepsek
    };

    setKartuData(resetData);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Storage safety
    }

    if (onUpdateSiswa) {
      onUpdateSiswa({
        ...siswa,
        nis: resetData.nis,
        alamat: resetData.alamat,
        foto: "",
        tempatTanggalLahir: resetData.tempatTanggalLahir
      });
    }

    setIsDeleteModalOpen(false);
    showToast("Data Kartu Pelajar berhasil direset ke pengaturan default.", "info");
  };

  // Handle Print Kartu Pelajar (High-Definition Layout)
  const handlePrintKartuPelajar = () => {
    const printWindow = window.open("", "_blank", "width=900,height=750");
    if (!printWindow) {
      window.print();
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Cetak Kartu Tanda Pelajar - ${kartuData.nama}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: Arial, Helvetica, sans-serif;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 20px;
            font-size: 10pt;
          }
          .print-header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 2px dashed #94a3b8;
            padding-bottom: 12px;
          }
          .print-header h2 {
            margin: 0;
            font-size: 14pt;
            font-weight: 900;
            color: #064e3b;
            text-transform: uppercase;
          }
          .print-header p {
            margin: 4px 0 0 0;
            font-size: 9pt;
            color: #475569;
          }
          .cards-container {
            display: flex;
            flex-direction: column;
            gap: 24px;
            align-items: center;
            justify-content: center;
          }
          @media (min-width: 650px) {
            .cards-container {
              flex-direction: row;
              flex-wrap: wrap;
              gap: 20px;
            }
          }
          /* CR80 Standard ISO Card: 85.6mm x 53.98mm (~ 340px x 215px on screen, scaled crisp for print) */
          .card-frame {
            width: 85.6mm;
            height: 53.98mm;
            border-radius: 4.5mm;
            border: 1.5pt solid #d97706;
            background: linear-gradient(135deg, #064e3b 0%, #065f46 45%, #022c22 100%);
            color: #ffffff;
            position: relative;
            overflow: hidden;
            padding: 3mm 3.5mm;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            page-break-inside: avoid;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .card-back-frame {
            width: 85.6mm;
            height: 53.98mm;
            border-radius: 4.5mm;
            border: 1.5pt solid #047857;
            background: linear-gradient(135deg, #0f172a 0%, #064e3b 60%, #022c22 100%);
            color: #ffffff;
            position: relative;
            overflow: hidden;
            padding: 3.5mm 4mm;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            page-break-inside: avoid;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .watermark-logo {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40mm;
            opacity: 0.08;
            pointer-events: none;
            z-index: 1;
          }
          .header-box {
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            gap: 2.5mm;
            border-bottom: 1.2pt double #f59e0b;
            padding-bottom: 1.5mm;
          }
          .header-logo {
            width: 8mm;
            height: auto;
            max-height: 10mm;
            object-fit: contain;
          }
          .header-texts {
            flex: 1;
            text-align: center;
            line-height: 1.15;
          }
          .header-texts .gov {
            font-size: 5pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.3pt;
            color: #fef3c7;
          }
          .header-texts .school {
            font-size: 6.8pt;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.2pt;
            color: #ffffff;
            margin: 0.5pt 0;
          }
          .header-texts .kec {
            font-size: 5.5pt;
            font-weight: 800;
            text-transform: uppercase;
            color: #fde047;
          }
          .header-texts .addr {
            font-size: 4.2pt;
            color: #cbd5e1;
            font-style: italic;
          }
          .title-ribbon {
            position: relative;
            z-index: 2;
            text-align: center;
            margin: 1mm 0 1.5mm 0;
          }
          .title-ribbon span {
            background: linear-gradient(90deg, #d97706, #fbbf24, #d97706);
            color: #022c22;
            font-size: 5.5pt;
            font-weight: 900;
            padding: 0.5mm 3.5mm;
            border-radius: 2mm;
            letter-spacing: 0.8pt;
            text-transform: uppercase;
            display: inline-block;
          }
          .body-box {
            position: relative;
            z-index: 2;
            display: flex;
            gap: 2.5mm;
            flex: 1;
          }
          .photo-box {
            width: 17mm;
            height: 22mm;
            border: 1pt solid #f59e0b;
            border-radius: 2mm;
            background: #1e293b;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
          }
          .photo-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .photo-placeholder {
            font-size: 7pt;
            font-weight: 900;
            color: #cbd5e1;
            text-align: center;
            line-height: 1.2;
          }
          .info-table {
            flex: 1;
            border-collapse: collapse;
            font-size: 5pt;
            line-height: 1.25;
          }
          .info-table td {
            vertical-align: top;
            padding: 0.3mm 0;
          }
          .info-label {
            width: 17mm;
            color: #cbd5e1;
            font-weight: 600;
          }
          .info-sep {
            width: 2mm;
            color: #fde047;
            font-weight: bold;
          }
          .info-val {
            color: #ffffff;
            font-weight: bold;
          }
          .info-val.highlight {
            color: #fef08a;
            font-weight: 900;
          }
          .footer-box {
            position: relative;
            z-index: 2;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-top: 0.8pt solid rgba(245, 158, 11, 0.4);
            padding-top: 1mm;
            margin-top: 1mm;
          }
          .barcode-area {
            font-family: 'Courier New', Courier, monospace;
            font-size: 4.5pt;
            font-weight: bold;
            color: #fde047;
            letter-spacing: 0.5pt;
          }
          .barcode-lines {
            display: inline-block;
            height: 4mm;
            letter-spacing: -1px;
            font-size: 7pt;
            color: #ffffff;
            line-height: 1;
          }
          .signature-area {
            text-align: center;
            font-size: 4.2pt;
            line-height: 1.15;
            color: #ffffff;
          }
          .sig-title {
            color: #e2e8f0;
          }
          .sig-stamp {
            height: 6mm;
            display: flex;
            align-items: center;
            justify-content: center;
            font-style: italic;
            color: #93c5fd;
            font-size: 4.5pt;
            font-weight: bold;
          }
          .sig-name {
            font-weight: bold;
            text-decoration: underline;
            color: #fef08a;
          }
          .back-title {
            font-size: 6.5pt;
            font-weight: 900;
            text-align: center;
            color: #fde047;
            text-transform: uppercase;
            border-bottom: 1pt solid #f59e0b;
            padding-bottom: 1mm;
            margin-bottom: 1.5mm;
            letter-spacing: 0.3pt;
          }
          .back-list {
            font-size: 4.8pt;
            line-height: 1.35;
            color: #e2e8f0;
            padding-left: 3.5mm;
            margin: 0;
          }
          .back-list li {
            margin-bottom: 0.8mm;
          }
          .back-footer {
            border-top: 0.8pt dashed #64748b;
            padding-top: 1mm;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 4.2pt;
            color: #94a3b8;
          }
          .print-guide {
            text-align: center;
            margin-top: 25px;
            font-size: 8.5pt;
            color: #64748b;
            font-style: italic;
          }
          @media print {
            body { padding: 0; }
            .print-guide { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h2>KARTU TANDA PELAJAR RESMI</h2>
          <p>UPT SMPN 2 REBANG TANGKAS • KECAMATAN REBANG TANGKAS • KABUPATEN WAY KANAN</p>
        </div>

        <div class="cards-container">
          <!-- KARTU TAMPAK DEPAN -->
          <div class="card-frame">
            <img src="${LOGO_WAY_KANAN}" alt="Watermark" class="watermark-logo" />

            <!-- Kop Sekolah -->
            <div class="header-box">
              <img src="${LOGO_WAY_KANAN}" alt="Logo Way Kanan" class="header-logo" />
              <div class="header-texts">
                <div class="gov">PEMERINTAH KABUPATEN WAY KANAN</div>
                <div class="gov">DINAS PENDIDIKAN DAN KEBUDAYAAN</div>
                <div class="school">UPT SMPN 2 REBANG TANGKAS</div>
                <div class="kec">KECAMATAN REBANG TANGKAS</div>
                <div class="addr">Jl. Lintas Rebang Tangkas, Way Kanan • NPSN: 10806497</div>
              </div>
            </div>

            <!-- Pita Judul -->
            <div class="title-ribbon">
              <span>KARTU TANDA PELAJAR</span>
            </div>

            <!-- Isi Kartu: Foto + Data -->
            <div class="body-box">
              <div class="photo-box">
                ${
                  kartuData.foto
                    ? `<img src="${kartuData.foto}" alt="Foto ${kartuData.nama}" />`
                    : `<div class="photo-placeholder"><br/>FOTO<br/>SISWA<br/>3 x 4</div>`
                }
              </div>

              <table class="info-table">
                <tr>
                  <td class="info-label">Nama Lengkap</td>
                  <td class="info-sep">:</td>
                  <td class="info-val highlight">${kartuData.nama.toUpperCase()}</td>
                </tr>
                <tr>
                  <td class="info-label">Kelas / Rombel</td>
                  <td class="info-sep">:</td>
                  <td class="info-val">Kelas ${kartuData.kelasId}</td>
                </tr>
                <tr>
                  <td class="info-label">NIS / NISN</td>
                  <td class="info-sep">:</td>
                  <td class="info-val">${kartuData.nis} / ${kartuData.nisn}</td>
                </tr>
                <tr>
                  <td class="info-label">Tempat, Tgl Lahir</td>
                  <td class="info-sep">:</td>
                  <td class="info-val">${kartuData.tempatTanggalLahir || "-"}</td>
                </tr>
                <tr>
                  <td class="info-label">Jenis Kelamin</td>
                  <td class="info-sep">:</td>
                  <td class="info-val">${kartuData.gender}</td>
                </tr>
                <tr>
                  <td class="info-label">Alamat Siswa</td>
                  <td class="info-sep">:</td>
                  <td class="info-val">${kartuData.alamat}</td>
                </tr>
              </table>
            </div>

            <!-- Bagian Bawah Depan -->
            <div class="footer-box">
              <div class="barcode-area">
                <div class="barcode-lines">||||| | |||| ||| ||||| ||| |||</div>
                <div>NISN: ${kartuData.nisn}</div>
              </div>

              <div class="signature-area">
                <div class="sig-title">Rebang Tangkas, Mengetahui</div>
                <div class="sig-title">Kepala UPT SMPN 2 Rebang Tangkas</div>
                <div class="sig-stamp">★ STEMPEL RESMI ★</div>
                <div class="sig-name">${currentNamaKepsek}</div>
                <div>NIP. ${currentNipKepsek}</div>
              </div>
            </div>
          </div>

          <!-- KARTU TAMPAK BELAKANG -->
          <div class="card-back-frame">
            <img src="${LOGO_WAY_KANAN}" alt="Watermark" class="watermark-logo" />

            <div>
              <div class="back-title">TATA TERTIB PEMEGANG KARTU PELAJAR</div>
              <ol class="back-list">
                <li>Kartu ini adalah kartu identitas resmi peserta didik di <strong>UPT SMPN 2 Rebang Tangkas, Kecamatan Rebang Tangkas</strong>.</li>
                <li>Pemegang kartu wajib membawa kartu ini selama jam sekolah, ujian, praktikum, dan saat peminjaman buku di perpustakaan.</li>
                <li>Dilarang mencoret, menggandakan secara ilegal, atau meminjamkan kartu ini kepada orang lain.</li>
                <li>Apabila kartu ini hilang, rusak, atau menemukan kartu ini, harap segera melapor ke pihak tata usaha <strong>UPT SMPN 2 Rebang Tangkas</strong>.</li>
              </ol>
            </div>

            <div class="back-footer">
              <div>Masa Berlaku: <strong>${kartuData.berlakuSampai}</strong></div>
              <div>SIPAILMS Digital Card • Way Kanan</div>
            </div>
          </div>
        </div>

        <div class="print-guide">
          Tip Cetak: Gunakan kertas foto tebal / kertas PVC Card (ukuran A4 atau potong sesuai garis batas 85.6mm x 53.98mm) untuk hasil kartu pelajar yang awet dan elegan.
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-emerald-800/40 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-20 top-2 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50 border border-emerald-400/30 shrink-0">
              <IdCard className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  UPT SMPN 2 REBANG TANGKAS
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  KEC. REBANG TANGKAS
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Akun Saya & Kartu Tanda Pelajar
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl leading-relaxed">
                Portal identitas resmi siswa UPT SMPN 2 Rebang Tangkas. Dilengkapi fitur cetak kartu pelajar modern, informasi akun, dan kredensial login SIPAILMS.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handlePrintKartuPelajar}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-2 shadow-lg shadow-amber-950/20 border border-amber-300 cursor-pointer"
              id="btn-cetak-kartu-pelajar-banner"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>Cetak Kartu Pelajar</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToPesan}
              className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Hubungi Guru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub tabs: Kartu Pelajar Digital vs Informasi Akun */}
      <div className="flex flex-wrap items-center gap-2.5 p-2 bg-slate-100/90 rounded-2xl border border-slate-200 shadow-xs">
        <button
          type="button"
          onClick={() => setSubTab("kartu")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
            subTab === "kartu"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-white"
          }`}
          id="tab-kartu-pelajar"
        >
          <IdCard className="w-4 h-4" />
          <span>Kartu Tanda Pelajar (KTP Siswa)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-400 text-slate-950 font-black">
            Modern
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("akun")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
            subTab === "akun"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-white"
          }`}
          id="tab-informasi-akun"
        >
          <KeyRound className="w-4 h-4" />
          <span>Informasi Akun & Kata Sandi</span>
        </button>
      </div>

      {/* TAB 1: KARTU PELAJAR DIGITAL (MODERN & KEREN) */}
      {subTab === "kartu" && (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Tampilan Sisi:</span>
              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setCardSide("depan")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    cardSide === "depan"
                      ? "bg-white text-emerald-800 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Tampak Depan
                </button>
                <button
                  type="button"
                  onClick={() => setCardSide("belakang")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    cardSide === "belakang"
                      ? "bg-white text-emerald-800 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Tampak Belakang
                </button>
                <button
                  type="button"
                  onClick={() => setCardSide("keduanya")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    cardSide === "keduanya"
                      ? "bg-white text-emerald-800 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Keduanya (2 Sisi)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenEditModal}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                id="btn-edit-kartu-pelajar"
                title="Edit Data Kartu Pelajar"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Kartu</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-rose-200 cursor-pointer"
                id="btn-delete-kartu-pelajar"
                title="Hapus / Reset Kartu Pelajar"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus / Reset</span>
              </button>

              <button
                type="button"
                onClick={handlePrintKartuPelajar}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                id="btn-cetak-kartu-pelajar-toolbar"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>Cetak Kartu</span>
              </button>
            </div>
          </div>

          {/* CARD PREVIEW SHOWCASE */}
          <div className="bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50/30 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-inner flex flex-wrap items-center justify-center gap-8">
            {/* TAMPAK DEPAN KARTU */}
            {(cardSide === "depan" || cardSide === "keduanya") && (
              <div className="flex flex-col items-center gap-2 animate-fadeIn">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
                  Sisi Depan (Front)
                </span>

                <div
                  id="kartu-pelajar-depan"
                  className="w-full max-w-[460px] sm:w-[460px] aspect-[85.6/53.98] rounded-2xl bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 text-white p-3.5 sm:p-4.5 border-2 border-amber-400 shadow-2xl relative overflow-hidden flex flex-col justify-between select-none"
                >
                  {/* Watermark logo */}
                  <img
                    src={LOGO_WAY_KANAN}
                    alt="Watermark"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 opacity-8 pointer-events-none"
                  />

                  {/* Top Holographic Tag */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-[8px] font-black text-amber-300 tracking-wider">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>OFFICIAL STUDENT ID</span>
                  </div>

                  {/* KOP RESMI SEKOLAH */}
                  <div className="relative z-10 flex items-center gap-2.5 border-b border-amber-400/70 pb-2">
                    <img
                      src={LOGO_WAY_KANAN}
                      alt="Logo Way Kanan"
                      className="w-9 h-11 object-contain drop-shadow shrink-0"
                    />
                    <div className="flex-1 text-center pr-4">
                      <div className="text-[8px] font-bold text-amber-300 uppercase tracking-wider leading-tight">
                        PEMERINTAH KABUPATEN WAY KANAN
                      </div>
                      <div className="text-[7.5px] font-extrabold text-slate-200 uppercase tracking-wide leading-tight">
                        DINAS PENDIDIKAN DAN KEBUDAYAAN
                      </div>
                      <div className="text-[12px] sm:text-[13px] font-black text-white uppercase tracking-tight leading-tight drop-shadow-sm mt-0.5">
                        UPT SMPN 2 REBANG TANGKAS
                      </div>
                      <div className="text-[9px] font-black text-amber-400 uppercase tracking-wider leading-tight">
                        KECAMATAN REBANG TANGKAS
                      </div>
                      <div className="text-[6.5px] text-slate-300 leading-tight italic mt-0.5">
                        Jl. Lintas Rebang Tangkas, Way Kanan • NPSN: 10806497
                      </div>
                    </div>
                  </div>

                  {/* PITA JUDUL KARTU */}
                  <div className="relative z-10 text-center my-1">
                    <span className="inline-block bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 font-black text-[9px] tracking-widest uppercase px-3 py-0.5 rounded-full shadow-xs">
                      KARTU TANDA PELAJAR
                    </span>
                  </div>

                  {/* KONTEN UTAMA: FOTO + IDENTITAS */}
                  <div className="relative z-10 flex gap-3 items-center flex-1 my-0.5">
                    {/* Sisi Kiri: Foto Siswa + Smart Chip */}
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <div className="w-[72px] h-[92px] rounded-xl border-2 border-amber-400 overflow-hidden bg-slate-900 shadow-md relative group">
                        {kartuData.foto ? (
                          <img
                            src={kartuData.foto}
                            alt={kartuData.nama}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-[9px] font-bold bg-slate-800 p-1 text-center">
                            <User className="w-7 h-7 text-amber-300 mb-0.5" />
                            <span>FOTO 3x4</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-slate-950/70 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition text-[9px] font-bold cursor-pointer"
                          title="Ganti Foto"
                        >
                          <Camera className="w-4 h-4 text-amber-300 mb-0.5" />
                          <span>Ganti</span>
                        </button>
                      </div>

                      {/* Gold Chip Accent */}
                      <div className="w-7 h-5 rounded bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-500/80 shadow-xs flex items-center justify-center relative overflow-hidden">
                        <div className="w-full h-[1px] bg-amber-700/60 absolute top-1.5"></div>
                        <div className="w-full h-[1px] bg-amber-700/60 absolute bottom-1.5"></div>
                        <div className="h-full w-[1px] bg-amber-700/60 absolute left-2"></div>
                      </div>
                    </div>

                    {/* Sisi Kanan: Data Identitas Siswa */}
                    <div className="flex-1 min-w-0 text-[9px] leading-snug space-y-0.5">
                      <div className="flex items-baseline gap-1">
                        <span className="w-16 text-slate-300 shrink-0 font-medium">Nama</span>
                        <span className="text-amber-400 font-bold">:</span>
                        <span className="font-black text-amber-300 text-[10.5px] uppercase truncate">
                          {kartuData.nama}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="w-16 text-slate-300 shrink-0 font-medium">Kelas</span>
                        <span className="text-amber-400 font-bold">:</span>
                        <span className="font-extrabold text-white">
                          Kelas {kartuData.kelasId}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="w-16 text-slate-300 shrink-0 font-medium">NIS / NISN</span>
                        <span className="text-amber-400 font-bold">:</span>
                        <span className="font-mono font-bold text-white">
                          {kartuData.nis} / {kartuData.nisn}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="w-16 text-slate-300 shrink-0 font-medium">TTL</span>
                        <span className="text-amber-400 font-bold">:</span>
                        <span className="text-slate-100 font-medium truncate">
                          {kartuData.tempatTanggalLahir || "-"}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="w-16 text-slate-300 shrink-0 font-medium">Kelamin</span>
                        <span className="text-amber-400 font-bold">:</span>
                        <span className="text-slate-100 font-medium">{kartuData.gender}</span>
                      </div>

                      <div className="flex items-start gap-1">
                        <span className="w-16 text-slate-300 shrink-0 font-medium">Alamat</span>
                        <span className="text-amber-400 font-bold">:</span>
                        <span className="text-slate-100 font-medium line-clamp-2 leading-tight">
                          {kartuData.alamat}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BAGIAN BAWAH KARTU (BARCODE & TANDA TANGAN) */}
                  <div className="relative z-10 flex items-end justify-between border-t border-amber-400/50 pt-1 mt-0.5">
                    <div className="space-y-0.5">
                      <div className="font-mono text-[9px] tracking-tighter text-white font-bold">
                        |||||||| ||| ||||||| |||||||| ||||
                      </div>
                      <div className="text-[7.5px] font-mono font-bold text-amber-300">
                        NISN: {kartuData.nisn}
                      </div>
                    </div>

                    <div className="text-center text-[7.5px] leading-tight text-white">
                      <div className="text-slate-300">Rebang Tangkas, Mengetahui</div>
                      <div className="text-slate-200">Kepala UPT SMPN 2 Rebang Tangkas</div>
                      <div className="h-5 flex items-center justify-center font-serif text-[8.5px] font-bold text-amber-300 tracking-wider">
                        ★ STEMPEL & TTD RESMI ★
                      </div>
                      <div className="font-black text-amber-300 underline leading-none">
                        {currentNamaKepsek}
                      </div>
                      <div className="text-[6.5px] text-slate-400">
                        NIP. {currentNipKepsek}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAMPAK BELAKANG KARTU */}
            {(cardSide === "belakang" || cardSide === "keduanya") && (
              <div className="flex flex-col items-center gap-2 animate-fadeIn">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
                  Sisi Belakang (Back)
                </span>

                <div
                  id="kartu-pelajar-belakang"
                  className="w-full max-w-[460px] sm:w-[460px] aspect-[85.6/53.98] rounded-2xl bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white p-4 border-2 border-emerald-500/80 shadow-2xl relative overflow-hidden flex flex-col justify-between select-none"
                >
                  {/* Watermark logo */}
                  <img
                    src={LOGO_WAY_KANAN}
                    alt="Watermark"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 opacity-8 pointer-events-none"
                  />

                  {/* Header Belakang */}
                  <div className="relative z-10 border-b border-amber-400/50 pb-1.5 text-center">
                    <h4 className="text-[10px] font-black text-amber-300 uppercase tracking-wider">
                      TATA TERTIB & KETENTUAN PEMEGANG KARTU
                    </h4>
                    <p className="text-[7.5px] text-slate-300">
                      UPT SMPN 2 REBANG TANGKAS • KECAMATAN REBANG TANGKAS
                    </p>
                  </div>

                  {/* Poin-Poin Ketentuan */}
                  <div className="relative z-10 text-[8.5px] leading-relaxed text-slate-200 space-y-1 my-1">
                    <div className="flex items-start gap-1.5">
                      <span className="font-bold text-amber-400">1.</span>
                      <p>
                        Kartu ini adalah identitas resmi peserta didik di <strong>UPT SMPN 2 Rebang Tangkas, Kecamatan Rebang Tangkas</strong>.
                      </p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="font-bold text-amber-400">2.</span>
                      <p>
                        Wajib dibawa setiap hari sekolah untuk absensi, KBM, ujian, dan layanan perpustakaan digital SIPAILMS.
                      </p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="font-bold text-amber-400">3.</span>
                      <p>
                        Dilarang mencoret, merusak, atau memindahtangankan kartu ini kepada orang lain.
                      </p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="font-bold text-amber-400">4.</span>
                      <p>
                        Apabila kartu ini hilang atau ditemukan di jalan, mohon diserahkan ke kantor tata usaha UPT SMPN 2 Rebang Tangkas.
                      </p>
                    </div>
                  </div>

                  {/* Footer Belakang */}
                  <div className="relative z-10 border-t border-slate-700 pt-1.5 flex items-center justify-between text-[7.5px] text-slate-400">
                    <div>
                      Masa Berlaku: <strong className="text-amber-300">{kartuData.berlakuSampai}</strong>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-emerald-400 font-bold">
                      <QrCode className="w-3 h-3" />
                      <span>SIPAILMS VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Info & Action Prompts */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  Status Kartu Pelajar: Terverifikasi Aktif
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kartu atas nama <strong>{kartuData.nama}</strong> (Kelas {kartuData.kelasId}) terdaftar di database UPT SMPN 2 Rebang Tangkas.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenEditModal}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Ubah Data / Foto</span>
              </button>
              <button
                type="button"
                onClick={handlePrintKartuPelajar}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Lembar Kartu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INFORMASI AKUN & KATA SANDI */}
      {subTab === "akun" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Data Akun Siswa Lengkap (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg border border-emerald-200">
                    {kartuData.foto ? (
                      <img src={kartuData.foto} alt={siswa.nama} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      siswa.nama.charAt(0)
                    )}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      {siswa.nama}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Kelas {siswa.kelasId} • {siswa.gender}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Akun Aktif</span>
                </div>
              </div>

              {/* Profile Grid Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Nama Lengkap
                  </span>
                  <p className="text-sm font-extrabold text-slate-900">{siswa.nama}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      NISN (Username Login)
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyNisn}
                      className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedNisn ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedNisn ? "Tersalin" : "Salin"}</span>
                    </button>
                  </div>
                  <p className="text-sm font-black font-mono text-emerald-800">{siswa.nisn}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Rombel / Kelas Belajar
                  </span>
                  <p className="text-sm font-extrabold text-slate-800">Kelas {siswa.kelasId}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    NIS (Nomor Induk Siswa)
                  </span>
                  <p className="text-sm font-extrabold text-slate-800">{kartuData.nis}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Tempat, Tanggal Lahir
                  </span>
                  <p className="text-sm font-extrabold text-slate-800">{kartuData.tempatTanggalLahir}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Alamat Lengkap
                  </span>
                  <p className="text-xs font-bold text-slate-800 leading-snug">{kartuData.alamat}</p>
                </div>
              </div>

              {/* School affiliation */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/70 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <School className="w-5 h-5" />
                </div>
                <div className="text-xs space-y-0.5">
                  <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
                    Satuan Pendidikan Terdaftar
                  </span>
                  <p className="font-extrabold text-slate-900">
                    UPT SMPN 2 REBANG TANGKAS
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Kecamatan Rebang Tangkas • Kabupaten Way Kanan • NPSN: 10806497 • Akreditasi: A
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Kredensial Password & Kebijakan Reset Password Guru (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Kata Sandi Akun</h3>
                    <p className="text-[11px] text-slate-500">Kredensial login portal siswa</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-slate-100 text-slate-600">
                  Tersimpan
                </span>
              </div>

              {/* Current Password Field */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-700" />
                    Password Saat Ini:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Sembunyikan</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Sandi</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 bg-white px-3.5 py-3 rounded-xl border border-amber-300 shadow-2xs">
                  <span className="font-mono text-base font-black tracking-wider text-slate-900">
                    {showPassword ? studentAccount.password : "••••••••"}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-amber-900 hover:bg-amber-100/60 rounded-lg transition flex items-center gap-1 cursor-pointer"
                    title="Salin Password"
                  >
                    {copiedPassword ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 text-[11px]">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[11px]">Salin</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-amber-800 font-medium">
                  Gunakan NISN <strong>{siswa.nisn}</strong> dan kata sandi di atas saat masuk kembali ke portal siswa.
                </p>
              </div>

              {/* Reset Password Note */}
              <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-red-200/90 space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-red-950 uppercase tracking-wide">
                      Kebijakan Reset Kata Sandi
                    </h4>
                    <p className="text-[11px] text-red-900/90 mt-1 leading-relaxed">
                      Untuk keamanan, reset kata sandi akun siswa dilakukan melalui Guru PAI / Wali Kelas.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-red-200/70">
                  <button
                    type="button"
                    onClick={onNavigateToPesan}
                    className="w-full py-2.5 px-3 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-amber-300" />
                    <span>Minta Guru Reset Password</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HIDDEN FILE INPUT FOR PHOTO UPLOAD */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* MODAL INPUT & EDIT DATA KARTU PELAJAR */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <IdCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Edit / Input Data Kartu Pelajar
                  </h3>
                  <p className="text-xs text-slate-500">
                    UPT SMPN 2 Rebang Tangkas, Kecamatan Rebang Tangkas
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCard} className="space-y-4 text-xs font-medium text-slate-700">
              {/* Photo Upload & Preview */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-20 h-24 rounded-xl border-2 border-amber-400 overflow-hidden bg-slate-900 shrink-0 shadow-md flex items-center justify-center">
                  {editForm.foto ? (
                    <img src={editForm.foto} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-slate-400 text-[10px] text-center font-bold">
                      <User className="w-8 h-8 text-amber-300 mx-auto mb-1" />
                      <span>Belum Ada Foto</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1 text-center sm:text-left">
                  <div>
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wide block">
                      Foto Pas Pelajar (3 x 4)
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Gunakan foto formal berseragam sekolah. Sistem otomatis mengompresi gambar untuk kualitas terbaik.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingPhoto ? "Memproses..." : "Pilih / Ganti Foto"}</span>
                    </button>

                    {editForm.foto && (
                      <button
                        type="button"
                        onClick={() => setEditForm((prev) => ({ ...prev, foto: "" }))}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Foto</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Nama Murid */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                    Nama Murid <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.nama}
                    onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-slate-800 font-bold"
                  />
                </div>

                {/* Kelas */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                    Kelas / Rombel
                  </label>
                  {classes.length > 0 ? (
                    <select
                      value={editForm.kelasId}
                      onChange={(e) => setEditForm({ ...editForm, kelasId: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-slate-800 font-semibold"
                    >
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          Kelas {cls.nama} ({cls.id})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={editForm.kelasId}
                      onChange={(e) => setEditForm({ ...editForm, kelasId: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white text-slate-800 font-semibold"
                    />
                  )}
                </div>

                {/* NIS */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                    NIS (Nomor Induk Siswa)
                  </label>
                  <input
                    type="text"
                    value={editForm.nis}
                    onChange={(e) => setEditForm({ ...editForm, nis: e.target.value })}
                    placeholder="Contoh: 2026001"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white text-slate-800 font-mono font-bold"
                  />
                </div>

                {/* NISN */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                    NISN (Nomor Induk Siswa Nasional)
                  </label>
                  <input
                    type="text"
                    value={editForm.nisn}
                    onChange={(e) => setEditForm({ ...editForm, nisn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white text-slate-800 font-mono font-bold"
                  />
                </div>

                {/* Tempat, Tanggal Lahir */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                    Tempat, Tanggal Lahir
                  </label>
                  <input
                    type="text"
                    value={editForm.tempatTanggalLahir || ""}
                    onChange={(e) => setEditForm({ ...editForm, tempatTanggalLahir: e.target.value })}
                    placeholder="Contoh: Way Kanan, 12 Mei 2012"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white text-slate-800 font-semibold"
                  />
                </div>

                {/* Jenis Kelamin */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value as "Laki-laki" | "Perempuan" })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white text-slate-800 font-semibold"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              {/* Alamat Lengkap */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                  Alamat Lengkap Siswa <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={editForm.alamat}
                  onChange={(e) => setEditForm({ ...editForm, alamat: e.target.value })}
                  placeholder="Contoh: Kp. Simpang Tiga, Kec. Rebang Tangkas, Kab. Way Kanan"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white text-slate-800"
                />
              </div>

              {/* Masa Berlaku */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                  Masa Berlaku Kartu
                </label>
                <input
                  type="text"
                  value={editForm.berlakuSampai}
                  onChange={(e) => setEditForm({ ...editForm, berlakuSampai: e.target.value })}
                  placeholder="Contoh: 2024 - 2027 atau Selama Menjadi Siswa"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white text-slate-800 font-semibold"
                />
              </div>

              {/* Data Pengesahan Kepala Sekolah - Otomatis dari Data Sekolah */}
              <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl border border-emerald-200/90 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-950 uppercase tracking-wide">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Pengesahan Kepala Sekolah</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-600 text-white shadow-2xs">
                    Otomatis dari Data Sekolah
                  </span>
                </div>
                <p className="text-[10.5px] text-emerald-800 leading-relaxed">
                  Nama dan NIP Kepala Sekolah diisi otomatis secara tersinkronisasi dari <strong>Data Administrasi &gt; Data Dasar &gt; Data Sekolah</strong>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 bg-white/90 rounded-xl border border-emerald-200/80 shadow-2xs">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                      Nama Kepala Sekolah
                    </span>
                    <span className="font-black text-slate-900 block truncate mt-0.5 text-xs">
                      {currentNamaKepsek}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white/90 rounded-xl border border-emerald-200/80 shadow-2xs">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                      NIP Kepala Sekolah
                    </span>
                    <span className="font-mono font-bold text-emerald-800 block truncate mt-0.5 text-xs">
                      {currentNipKepsek}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  id="btn-save-kartu-pelajar"
                >
                  <Check className="w-4 h-4" />
                  Simpan Perubahan Kartu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS / RESET KARTU PELAJAR */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Hapus / Reset Data Kartu Pelajar?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tindakan ini akan mereset foto pas pelajar dan pengaturan kustom alamat kembali ke profil bawaan awal.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div className="font-extrabold text-slate-900">{kartuData.nama}</div>
              <div className="text-slate-500 text-[11px]">
                Kelas {kartuData.kelasId} • NISN: {kartuData.nisn}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteCard}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                id="btn-confirm-delete-kartu"
              >
                <Trash2 className="w-4 h-4" />
                Ya, Hapus / Reset Kartu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST FEEDBACK NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
