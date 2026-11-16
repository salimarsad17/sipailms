/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  Building2,
  Users,
  School,
  Calendar,
  BookOpen,
  Plus,
  Trash2,
  Upload,
  Download,
  IdCard,
  Database,
  Search,
  Check,
  X,
} from "lucide-react";
import {
  AcademicYear,
  CbtClass,
  CbtMaterial,
  CbtProfile,
  CbtStudent,
  CbtSubject,
  GradeLevel,
  SchoolSettings,
  SemesterType,
} from "../../types/cbt";
import { cbtSupabaseService } from "../../services/cbtSupabaseService";
import { cbtExportService } from "../../services/cbtExportService";

interface CbtMasterDataProps {
  school: SchoolSettings | null;
  teachers: CbtProfile[];
  classes: CbtClass[];
  students: CbtStudent[];
  academicYears: AcademicYear[];
  subjects: CbtSubject[];
  materials: CbtMaterial[];
  allDataBackup: Record<string, any>;
  onRefresh: () => Promise<void>;
}

export default function CbtMasterData({
  school,
  teachers,
  classes,
  students,
  academicYears,
  subjects,
  materials,
  allDataBackup,
  onRefresh,
}: CbtMasterDataProps) {
  const [subTab, setSubTab] = useState<
    "siswa" | "kelas" | "materi" | "tahun" | "guru" | "sekolah"
  >("siswa");
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const excelStudentRef = useRef<HTMLInputElement>(null);

  // School settings state
  const [schoolForm, setSchoolForm] = useState<SchoolSettings>({
    id: "main",
    school_name: school?.school_name || "UPT SMPN 2 Rebang Tangkas",
    npsn: school?.npsn || "",
    address: school?.address || "",
    district: school?.district || "Rebang Tangkas",
    regency: school?.regency || "Way Kanan",
    principal_name: school?.principal_name || "",
    principal_nip: school?.principal_nip || "",
    subject_name: school?.subject_name || "Pendidikan Agama Islam",
    running_text: school?.running_text || "Guru Kreatif, Siswa Aktif",
  });

  // Form states
  const [className, setClassName] = useState("");
  const [classGrade, setClassGrade] = useState<GradeLevel>("VII");
  const [classYear, setClassYear] = useState("2026/2027");
  const [classHomeroom, setClassHomeroom] = useState("");

  const [studentName, setStudentName] = useState("");
  const [studentNis, setStudentNis] = useState("");
  const [studentNisn, setStudentNisn] = useState("");
  const [studentPartNo, setStudentPartNo] = useState("");
  const [studentGender, setStudentGender] = useState<"L" | "P">("L");
  const [studentClassId, setStudentClassId] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [createAuthAcc, setCreateAuthAcc] = useState(true);

  const [yearName, setYearName] = useState("");
  const [yearSem, setYearSem] = useState<SemesterType>("Ganjil");

  const [subjectCode, setSubjectCode] = useState("PAI");
  const [subjectName, setSubjectName] = useState("Pendidikan Agama Islam");

  const [matSubjectId, setMatSubjectId] = useState("");
  const [matGrade, setMatGrade] = useState<GradeLevel>("VII");
  const [matSem, setMatSem] = useState<SemesterType>("Ganjil");
  const [matTitle, setMatTitle] = useState("");
  const [matSub, setMatSub] = useState("");

  const filteredStudents = useMemo(() => {
    if (!search.trim()) return students;
    const kw = search.toLowerCase();
    return students.filter(
      (s) =>
        s.full_name.toLowerCase().includes(kw) ||
        s.nisn.toLowerCase().includes(kw) ||
        s.nis.toLowerCase().includes(kw) ||
        (s.classes?.class_name || "").toLowerCase().includes(kw)
    );
  }, [students, search]);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentNisn.trim()) return;
    try {
      if (createAuthAcc && studentPassword.trim().length >= 6) {
        await cbtSupabaseService.provisionStudentAccount({
          email: `${studentNisn.trim()}@cbt.smpn2rt.sch.id`,
          password: studentPassword.trim(),
          fullName: studentName.trim(),
          username: studentNisn.trim(),
          nis: studentNis.trim() || studentNisn.trim(),
          nisn: studentNisn.trim(),
          participantNumber: studentPartNo.trim() || `CBT-${studentNisn.trim()}`,
          classId: studentClassId || null,
          gender: studentGender,
        });
      } else {
        await cbtSupabaseService.upsertStudent({
          nis: studentNis.trim() || studentNisn.trim(),
          nisn: studentNisn.trim(),
          participant_number: studentPartNo.trim() || `CBT-${studentNisn.trim()}`,
          full_name: studentName.trim(),
          gender: studentGender,
          class_id: studentClassId || null,
          is_active: true,
        });
      }
      setStudentName("");
      setStudentNis("");
      setStudentNisn("");
      setStudentPartNo("");
      setStudentPassword("");
      await onRefresh();
      setMsg({ type: "ok", text: "Data siswa berhasil disimpan." });
    } catch (err: any) {
      setMsg({ type: "err", text: err?.message || "Gagal menyimpan siswa." });
    }
  };

  const handleImportStudentsExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      let count = 0;
      for (const r of rows) {
        const nama = String(r["Nama Lengkap"] || r["Nama"] || "").trim();
        const nisn = String(r["NISN"] || "").trim();
        if (!nama || !nisn) continue;
        const clsMatch = classes.find(
          (c) => c.class_name.toLowerCase() === String(r["Kelas"] || "").trim().toLowerCase()
        );
        await cbtSupabaseService.upsertStudent({
          nis: String(r["NIS"] || nisn),
          nisn,
          participant_number: String(r["Nomor Peserta"] || `CBT-${nisn}`),
          full_name: nama,
          gender: String(r["Jenis Kelamin"] || "L").toUpperCase().startsWith("P") ? "P" : "L",
          class_id: clsMatch?.id || null,
          is_active: true,
        });
        count++;
      }
      await onRefresh();
      setMsg({ type: "ok", text: `${count} data siswa berhasil diimpor dari Excel.` });
    } catch (err: any) {
      setMsg({ type: "err", text: err?.message || "Gagal mengimpor Excel siswa." });
    } finally {
      if (excelStudentRef.current) excelStudentRef.current.value = "";
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#0B1B3B] dark:text-white">
            Manajemen Data Master & Administrasi CBT
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola data sekolah, guru, kelas, siswa, tahun pelajaran, materi PAI, kartu peserta, & backup data.
          </p>
        </div>

        <button
          type="button"
          onClick={() => cbtExportService.exportBackupJson(allDataBackup)}
          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-2 cursor-pointer self-start lg:self-auto"
        >
          <Database className="w-4 h-4" />
          <span>Backup & Ekspor Data (JSON)</span>
        </button>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "siswa", label: "Data Siswa", icon: Users },
          { id: "kelas", label: "Data Kelas", icon: School },
          { id: "materi", label: "Mapel & Materi PAI", icon: BookOpen },
          { id: "tahun", label: "Tahun Pelajaran", icon: Calendar },
          { id: "guru", label: "Data Guru", icon: Users },
          { id: "sekolah", label: "Identitas Sekolah", icon: Building2 },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSubTab(t.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border cursor-pointer cbt-transition ${
                subTab === t.id
                  ? "bg-[#0B1B3B] dark:bg-sky-600 text-white border-transparent"
                  : "bg-white dark:bg-[#0B1B3B] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {msg && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between border ${
            msg.type === "ok"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-200"
              : "bg-red-50 dark:bg-red-950/40 border-red-200 text-red-700 dark:text-red-300"
          }`}
        >
          <span>{msg.text}</span>
          <button type="button" onClick={() => setMsg(null)} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: DATA SISWA */}
      {subTab === "siswa" && (
        <div className="space-y-4">
          <form
            onSubmit={handleAddStudent}
            className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 space-y-3"
          >
            <h3 className="font-display text-sm font-extrabold">Tambah Data & Akun Siswa</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Nama Lengkap Siswa *"
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              />
              <input
                type="text"
                required
                value={studentNisn}
                onChange={(e) => setStudentNisn(e.target.value)}
                placeholder="NISN (Username) *"
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              />
              <input
                type="text"
                value={studentNis}
                onChange={(e) => setStudentNis(e.target.value)}
                placeholder="NIS"
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              />
              <input
                type="text"
                value={studentPartNo}
                onChange={(e) => setStudentPartNo(e.target.value)}
                placeholder="Nomor Peserta"
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              />
              <select
                value={studentClassId}
                onChange={(e) => setStudentClassId(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              >
                <option value="">-- Pilih Kelas --</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.class_name}
                  </option>
                ))}
              </select>
              <select
                value={studentGender}
                onChange={(e) => setStudentGender(e.target.value as "L" | "P")}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createAuthAcc}
                    onChange={(e) => setCreateAuthAcc(e.target.checked)}
                  />
                  <span>Sekaligus Buat Akun Login Supabase Auth</span>
                </label>
                {createAuthAcc && (
                  <input
                    type="password"
                    minLength={6}
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="Password Siswa (min 6 char)"
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  />
                )}
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0B1B3B] dark:bg-sky-600 text-white font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Simpan Siswa</span>
              </button>
            </div>
          </form>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama, NISN, atau kelas..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => excelStudentRef.current?.click()}
                  className="px-3 py-2 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Impor Excel</span>
                </button>
                <input
                  ref={excelStudentRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImportStudentsExcel}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={students.length === 0}
                  onClick={() => cbtExportService.exportStudentsToExcel(filteredStudents)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ekspor Excel</span>
                </button>
                <button
                  type="button"
                  disabled={students.length === 0}
                  onClick={() => cbtExportService.exportParticipantCardsPdf(filteredStudents, school)}
                  className="px-3 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <IdCard className="w-3.5 h-3.5" />
                  <span>Cetak Kartu Peserta PDF</span>
                </button>
              </div>
            </div>

            {filteredStudents.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-8">
                Belum ada data siswa. Tambahkan atau impor siswa dari Excel.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-2.5">No. Peserta</th>
                      <th className="p-2.5">Nama Lengkap</th>
                      <th className="p-2.5">NIS / NISN</th>
                      <th className="p-2.5">Kelas</th>
                      <th className="p-2.5">L/P</th>
                      <th className="p-2.5 text-right">Hapus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredStudents.map((st) => (
                      <tr key={st.id}>
                        <td className="p-2.5 font-mono-code font-bold text-sky-600 dark:text-sky-300">
                          {st.participant_number || `CBT-${st.nisn}`}
                        </td>
                        <td className="p-2.5 font-bold">{st.full_name}</td>
                        <td className="p-2.5 font-mono-code">
                          {st.nis} / {st.nisn}
                        </td>
                        <td className="p-2.5">{st.classes?.class_name || "-"}</td>
                        <td className="p-2.5">{st.gender || "L"}</td>
                        <td className="p-2.5 text-right">
                          <button
                            type="button"
                            onClick={async () => {
                              await cbtSupabaseService.deleteStudent(st.id);
                              await onRefresh();
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DATA KELAS */}
      {subTab === "kelas" && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 space-y-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!className.trim()) return;
              await cbtSupabaseService.upsertClass({
                class_name: className.trim(),
                grade_level: classGrade,
                academic_year: classYear,
                homeroom_teacher: classHomeroom.trim() || null,
              });
              setClassName("");
              setClassHomeroom("");
              await onRefresh();
            }}
            className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs"
          >
            <input
              type="text"
              required
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Nama Kelas (cth: VII-A) *"
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            />
            <select
              value={classGrade}
              onChange={(e) => setClassGrade(e.target.value as GradeLevel)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            >
              <option value="VII">Kelas VII</option>
              <option value="VIII">Kelas VIII</option>
              <option value="IX">Kelas IX</option>
            </select>
            <input
              type="text"
              value={classYear}
              onChange={(e) => setClassYear(e.target.value)}
              placeholder="Tahun Pelajaran"
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            />
            <input
              type="text"
              value={classHomeroom}
              onChange={(e) => setClassHomeroom(e.target.value)}
              placeholder="Wali Kelas"
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#0B1B3B] dark:bg-sky-600 text-white font-bold cursor-pointer"
            >
              + Tambah Kelas
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {classes.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between"
              >
                <div>
                  <div className="font-display font-extrabold text-sm">{c.class_name}</div>
                  <div className="text-[11px] text-slate-500">
                    Tingkat {c.grade_level} • {c.academic_year}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await cbtSupabaseService.deleteClass(c.id);
                    await onRefresh();
                  }}
                  className="p-1.5 text-red-500 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MAPEL & MATERI PAI */}
      {subTab === "materi" && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h3 className="font-display text-sm font-extrabold">Mata Pelajaran</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await cbtSupabaseService.upsertSubject({
                  subject_code: subjectCode.trim() || "PAI",
                  subject_name: subjectName.trim(),
                });
                await onRefresh();
              }}
              className="flex flex-wrap gap-2 text-xs"
            >
              <input
                type="text"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                placeholder="Kode"
                className="w-28 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              />
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="Nama Mata Pelajaran"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0B1B3B] dark:bg-sky-600 text-white font-bold cursor-pointer"
              >
                + Simpan Mapel
              </button>
            </form>
            <div className="flex flex-wrap gap-2">
              {subjects.map((s) => (
                <div
                  key={s.id}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-xs font-bold flex items-center gap-2"
                >
                  <span>
                    {s.subject_code} — {s.subject_name}
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      await cbtSupabaseService.deleteSubject(s.id);
                      await onRefresh();
                    }}
                    className="text-red-500 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h3 className="font-display text-sm font-extrabold">Materi Pembelajaran PAI</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const sid = matSubjectId || subjects[0]?.id;
                if (!sid || !matTitle.trim()) {
                  setMsg({ type: "err", text: "Tambahkan mata pelajaran terlebih dahulu lalu isi judul materi." });
                  return;
                }
                await cbtSupabaseService.upsertMaterial({
                  subject_id: sid,
                  grade_level: matGrade,
                  semester: matSem,
                  title: matTitle.trim(),
                  sub_material: matSub.trim() || null,
                });
                setMatTitle("");
                setMatSub("");
                await onRefresh();
              }}
              className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs"
            >
              <select
                value={matSubjectId}
                onChange={(e) => setMatSubjectId(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              >
                <option value="">-- Pilih Mapel --</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.subject_name}
                  </option>
                ))}
              </select>
              <select
                value={matGrade}
                onChange={(e) => setMatGrade(e.target.value as GradeLevel)}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              >
                <option value="VII">Kelas VII</option>
                <option value="VIII">Kelas VIII</option>
                <option value="IX">Kelas IX</option>
              </select>
              <select
                value={matSem}
                onChange={(e) => setMatSem(e.target.value as SemesterType)}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
              <input
                type="text"
                required
                value={matTitle}
                onChange={(e) => setMatTitle(e.target.value)}
                placeholder="Bab / Judul Materi"
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0B1B3B] dark:bg-sky-600 text-white font-bold cursor-pointer"
              >
                + Tambah Materi
              </button>
            </form>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {materials.map((m) => (
                <div key={m.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <strong>{m.title}</strong>{" "}
                    <span className="text-slate-500">
                      • Kelas {m.grade_level} ({m.semester})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      await cbtSupabaseService.deleteMaterial(m.id);
                      await onRefresh();
                    }}
                    className="text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TAHUN PELAJARAN & SEMESTER */}
      {subTab === "tahun" && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 space-y-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!yearName.trim()) return;
              await cbtSupabaseService.upsertAcademicYear({
                year_name: yearName.trim(),
                semester: yearSem,
                is_active: true,
              });
              setYearName("");
              await onRefresh();
            }}
            className="flex flex-wrap gap-2 text-xs"
          >
            <input
              type="text"
              required
              value={yearName}
              onChange={(e) => setYearName(e.target.value)}
              placeholder="Contoh: 2026/2027"
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            />
            <select
              value={yearSem}
              onChange={(e) => setYearSem(e.target.value as SemesterType)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            >
              <option value="Ganjil">Semester Ganjil</option>
              <option value="Genap">Semester Genap</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#0B1B3B] dark:bg-sky-600 text-white font-bold cursor-pointer"
            >
              + Tambah Tahun Pelajaran
            </button>
          </form>

          <div className="space-y-2 text-xs">
            {academicYears.map((y) => (
              <div
                key={y.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <strong>{y.year_name}</strong> — Semester {y.semester}{" "}
                  {y.is_active && <span className="text-emerald-600 font-bold">(Aktif)</span>}
                </div>
                <div className="flex gap-2">
                  {!y.is_active && (
                    <button
                      type="button"
                      onClick={async () => {
                        await cbtSupabaseService.upsertAcademicYear({ ...y, is_active: true });
                        await onRefresh();
                      }}
                      className="px-2.5 py-1 rounded bg-sky-600 text-white font-bold cursor-pointer"
                    >
                      Aktifkan
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      await cbtSupabaseService.deleteAcademicYear(y.id);
                      await onRefresh();
                    }}
                    className="p-1 text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: DATA GURU */}
      {subTab === "guru" && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h3 className="font-display text-sm font-extrabold">Daftar Akun Guru Terdaftar</h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {teachers.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between">
                <div>
                  <strong className="text-sm">{t.full_name}</strong>
                  <div className="text-slate-500">
                    Username: {t.username} {t.nip ? `• NIP: ${t.nip}` : ""}
                  </div>
                </div>
                <span className="text-sky-600 dark:text-sky-300 font-bold uppercase">{t.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: IDENTITAS SEKOLAH */}
      {subTab === "sekolah" && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await cbtSupabaseService.saveSchoolSettings(schoolForm);
            await onRefresh();
            setMsg({ type: "ok", text: "Pengaturan identitas sekolah berhasil disimpan." });
          }}
          className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
        >
          <div>
            <label className="block font-bold mb-1">Nama Sekolah</label>
            <input
              type="text"
              value={schoolForm.school_name}
              onChange={(e) => setSchoolForm({ ...schoolForm, school_name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">NPSN</label>
            <input
              type="text"
              value={schoolForm.npsn || ""}
              onChange={(e) => setSchoolForm({ ...schoolForm, npsn: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Kepala Sekolah</label>
            <input
              type="text"
              value={schoolForm.principal_name || ""}
              onChange={(e) => setSchoolForm({ ...schoolForm, principal_name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">NIP Kepala Sekolah</label>
            <input
              type="text"
              value={schoolForm.principal_nip || ""}
              onChange={(e) => setSchoolForm({ ...schoolForm, principal_nip: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block font-bold mb-1">Tulisan Berjalan Header</label>
            <input
              type="text"
              value={schoolForm.running_text}
              onChange={(e) => setSchoolForm({ ...schoolForm, running_text: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0B1B3B] dark:bg-sky-600 text-white font-extrabold flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 text-amber-400" />
              <span>Simpan Identitas Sekolah</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
