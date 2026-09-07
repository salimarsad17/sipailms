/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  FileText,
  Video,
  Download,
  Upload,
  Mic,
  Square,
  Play,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Info,
  Pause,
  Check,
  XCircle,
  Award,
  Zap,
  RotateCcw,
  Sliders,
  Settings,
  Send,
  Edit3,
  Copy,
  CheckCheck,
  MessageSquare,
  Clock
} from "lucide-react";
import { Siswa, TugasLms, PengumpulanTugas, BabPelajaran, RekapNilaiTotal } from "../../types";
import { generateAutomaticQuiz } from "../../lib/quizGenerator";

const getEmbedInfo = (url: string | undefined) => {
  if (!url || url === "#") return null;

  let cleanUrl = url.trim();
  
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = "https://" + cleanUrl;
  }

  let youtubeId: string | null = null;

  if (cleanUrl.includes("youtu.be/")) {
    const parts = cleanUrl.split("youtu.be/");
    if (parts[1]) {
      const idPart = parts[1].split(/[?#&]/)[0];
      if (idPart.length === 11) {
        youtubeId = idPart;
      }
    }
  } else if (cleanUrl.includes("youtube.com/shorts/")) {
    const parts = cleanUrl.split("youtube.com/shorts/");
    if (parts[1]) {
      const idPart = parts[1].split(/[?#&]/)[0];
      if (idPart.length === 11) {
        youtubeId = idPart;
      }
    }
  } else if (cleanUrl.includes("youtube.com/embed/")) {
    const parts = cleanUrl.split("youtube.com/embed/");
    if (parts[1]) {
      const idPart = parts[1].split(/[?#&]/)[0];
      if (idPart.length === 11) {
        youtubeId = idPart;
      }
    }
  } else if (cleanUrl.includes("v=")) {
    const match = cleanUrl.match(/[?&]v=([^&#\s]+)/);
    if (match && match[1] && match[1].substring(0, 11).length === 11) {
      youtubeId = match[1].substring(0, 11);
    }
  } else {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = cleanUrl.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      youtubeId = match[2];
    }
  }

  if (youtubeId) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`
    };
  }

  const gdIdMatch = cleanUrl.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
  if (gdIdMatch && gdIdMatch[1]) {
    return {
      type: "googledrive",
      embedUrl: `https://drive.google.com/file/d/${gdIdMatch[1]}/preview`
    };
  }

  if (/\.(mp4|webm|ogg|mov)(?:\?|$)/i.test(cleanUrl)) {
    return {
      type: "direct",
      embedUrl: cleanUrl
    };
  }

  return {
    type: "generic",
    embedUrl: cleanUrl
  };
};

interface LmsClassroomProps {
  siswa: Siswa;
  tasks: TugasLms[];
  submissions: PengumpulanTugas[];
  onAddSubmission: (newSub: PengumpulanTugas) => void;
  babPelajaran: BabPelajaran[];
  rekapNilai: RekapNilaiTotal[];
  onUpdateRekapNilai: (updatedRec: RekapNilaiTotal) => void;
  onUpdateBabPelajaran?: (updatedBabList: BabPelajaran[]) => void;
}

export default function LmsClassroom({
  siswa,
  tasks,
  submissions,
  onAddSubmission,
  babPelajaran = [],
  rekapNilai,
  onUpdateRekapNilai,
  onUpdateBabPelajaran
}: LmsClassroomProps) {
  const studentGrade = siswa.kelasId.split("-")[0] || "VII";
  const filteredBabPelajaran = babPelajaran.filter((b) => {
    if (!b.kelasId) return true; // fallback
    return b.kelasId === studentGrade;
  });

  // Use first chapter as active tab default, fallback to first in filtered
  const initialActiveBab = filteredBabPelajaran[0]?.id || "bab1";
  const [activeBab, setActiveBab] = useState<string>(initialActiveBab);
  const [activeTaskToSubmit, setActiveTaskToSubmit] = useState<string>("");
  const [isVideoPlayingInApp, setIsVideoPlayingInApp] = useState(false);

  // Sync activeBab when filteredBabPelajaran changes to guarantee it's always valid
  useEffect(() => {
    if (filteredBabPelajaran.length > 0) {
      const exists = filteredBabPelajaran.some((b) => b.id === activeBab);
      if (!exists) {
        setActiveBab(filteredBabPelajaran[0].id);
      }
    }
  }, [filteredBabPelajaran, activeBab]);

  interface QuizScoreRecord {
    babId: string;
    score: number;
    answers: Record<string, string>;
    submittedAt: string;
  }

  // Student Quiz States loaded persistently
  const [savedScores, setSavedScores] = useState<Record<string, QuizScoreRecord>>(() => {
    const stored = localStorage.getItem(`quiz_scores_${siswa.nisn}`);
    return stored ? JSON.parse(stored) : {};
  });

  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Sync quiz states when active chapter or savedScores changes
  useEffect(() => {
    const saved = savedScores[activeBab];
    if (saved) {
      setStudentAnswers(saved.answers || {});
      setQuizSubmitted(true);
      setQuizScore(saved.score);
    } else {
      setStudentAnswers({});
      setQuizSubmitted(false);
      setQuizScore(null);
    }
  }, [activeBab, savedScores]);

  // Pembuatan Soal Kuis Otomatis di LMS Siswa
  const [quizAutoCount, setQuizAutoCount] = useState<number>(10);
  const [quizAutoDifficulty, setQuizAutoDifficulty] = useState<"Mudah" | "Sedang" | "HOTS" | "Campuran">("HOTS");
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [generatorToast, setGeneratorToast] = useState<string | null>(null);
  const [showAutoQuizPanel, setShowAutoQuizPanel] = useState<boolean>(false);

  const handleGenerateStudentAutoQuiz = (overrideCount?: number, overrideDiff?: "Mudah" | "Sedang" | "HOTS" | "Campuran") => {
    if (!currentBabData) return;
    const targetCount = overrideCount || quizAutoCount;
    const targetDiff = overrideDiff || quizAutoDifficulty;

    setIsGeneratingQuiz(true);
    setTimeout(() => {
      const generated = generateAutomaticQuiz(currentBabData, {
        count: targetCount,
        difficulty: targetDiff
      });

      // Update the active Bab in babPelajaran state so all students and views see it
      const updatedList = babPelajaran.map((b) => {
        if (b.id === currentBabData.id) {
          return {
            ...b,
            soalList: generated
          };
        }
        return b;
      });

      if (onUpdateBabPelajaran) {
        onUpdateBabPelajaran(updatedList);
      }

      // Reset student quiz answers for this bab to let them answer new questions
      setStudentAnswers({});
      setQuizSubmitted(false);
      setQuizScore(null);
      const updatedSaved = { ...savedScores };
      delete updatedSaved[currentBabData.id];
      setSavedScores(updatedSaved);
      localStorage.setItem(`quiz_scores_${siswa.nisn}`, JSON.stringify(updatedSaved));

      setIsGeneratingQuiz(false);
      setGeneratorToast(`⚡ Alhamdulillah! ${generated.length} Soal Kuis (${targetDiff}) berhasil dibuat dan siap dikerjakan.`);
      setTimeout(() => setGeneratorToast(null), 5000);
    }, 400);
  };

  const handleQuizSubmit = () => {
    const listSoal = currentBabData?.soalList || [];
    if (listSoal.length === 0) return;

    // Check if all questions are answered
    const totalSoal = listSoal.length;
    const answeredCount = Object.keys(studentAnswers).filter(k => studentAnswers[k]).length;
    if (answeredCount < totalSoal) {
      if (!confirm("Beberapa pertanyaan belum dijawab. Apakah Anda yakin ingin mengumpulkan kuis sekarang?")) {
        return;
      }
    }

    // Calculate score
    let correctCount = 0;
    listSoal.forEach((soal) => {
      if (studentAnswers[soal.id] === soal.jawabanBenar) {
        correctCount += 1;
      }
    });

    const finalScore = Math.round((correctCount / totalSoal) * 100);
    setQuizScore(finalScore);
    setQuizSubmitted(true);

    const newRecord: QuizScoreRecord = {
      babId: currentBabData.id,
      score: finalScore,
      answers: studentAnswers,
      submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    const updated = {
      ...savedScores,
      [currentBabData.id]: newRecord
    };
    setSavedScores(updated);
    localStorage.setItem(`quiz_scores_${siswa.nisn}`, JSON.stringify(updated));

    // Recalculate average quiz score across all chapters with quizzes and update centralized gradebook
    const quizzesWithQuestions = filteredBabPelajaran.filter((b) => b.soalList && b.soalList.length > 0);
    const updatedQuizScoresList = quizzesWithQuestions
      .map((b) => (b.id === currentBabData.id ? finalScore : updated[b.id]?.score))
      .filter((score) => score !== undefined && score !== null) as number[];
    const newAverage = updatedQuizScoresList.length > 0
      ? Math.round(updatedQuizScoresList.reduce((sum, score) => sum + score, 0) / updatedQuizScoresList.length)
      : 80;

    const studentRekap = rekapNilai.find((r) => r.siswaNisn === siswa.nisn);
    if (studentRekap && onUpdateRekapNilai) {
      onUpdateRekapNilai({
        ...studentRekap,
        formatifKuis: newAverage
      });
    }

    alert(`Kuis selesai! Nilai Anda: ${finalScore} / 100 (${correctCount} jawaban benar dari ${totalSoal} soal).`);
  };

  const handleResetQuiz = () => {
    if (confirm("Apakah Anda yakin ingin mengulang kuis ini? Nilai kuis sebelumnya akan direset.")) {
      const updated = { ...savedScores };
      delete updated[currentBabData.id];
      setSavedScores(updated);
      localStorage.setItem(`quiz_scores_${siswa.nisn}`, JSON.stringify(updated));

      // Recalculate average quiz score across all chapters with quizzes and update centralized gradebook
      const quizzesWithQuestions = filteredBabPelajaran.filter((b) => b.soalList && b.soalList.length > 0);
      const updatedQuizScoresList = quizzesWithQuestions
        .map((b) => updated[b.id]?.score)
        .filter((score) => score !== undefined && score !== null) as number[];
      const newAverage = updatedQuizScoresList.length > 0
        ? Math.round(updatedQuizScoresList.reduce((sum, score) => sum + score, 0) / updatedQuizScoresList.length)
        : 80;

      const studentRekap = rekapNilai.find((r) => r.siswaNisn === siswa.nisn);
      if (studentRekap && onUpdateRekapNilai) {
        onUpdateRekapNilai({
          ...studentRekap,
          formatifKuis: newAverage
        });
      }

      setStudentAnswers({});
      setQuizSubmitted(false);
      setQuizScore(null);
    }
  };

  // Submission Form states
  const [submissionType, setSubmissionType] = useState<"Teks" | "File" | "Audio">("Teks");
  const [textAnswer, setTextAnswer] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [fileSize, setFileSize] = useState("");

  // Voice Recorder Simulator states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioFile, setRecordedAudioFile] = useState<string | null>(null);
  const [recordingIntervalId, setRecordingIntervalId] = useState<any>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);

  // Tasks for student's class
  const classTasks = tasks.filter((t) => t.kelasId === siswa.kelasId);

  // Filter tasks based on selected bab for viewing materials
  const getBabLabelForTask = (babId: string) => {
    const bab = babPelajaran.find(b => b.id === babId);
    if (!bab) return "Thaharah";
    const parts = bab.judul.split(":");
    return parts[1] ? parts[1].trim() : bab.judul;
  };

  const tasksForActiveBab = classTasks.filter((t) => {
    const label = getBabLabelForTask(activeBab).toLowerCase();
    return t.bab.toLowerCase().includes(label) || t.bab.toLowerCase().includes(activeBab.toLowerCase());
  });

  // Simulator: File selection
  const handleFileChoose = () => {
    const fileNames = ["lembar_folio_jawaban.png", "tugas_wudhu_foto.jpg", "jawaban_soal_bab1.pdf"];
    const randomName = fileNames[Math.floor(Math.random() * fileNames.length)];
    setSelectedFileName(randomName);
    setFileSize("1.4 MB");
  };

  // Simulator: Voice Recorder start
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setRecordedAudioFile(null);

    const interval = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    setRecordingIntervalId(interval);
  };

  // Simulator: Voice Recorder stop
  const handleStopRecording = () => {
    if (recordingIntervalId) {
      clearInterval(recordingIntervalId);
    }
    setIsRecording(false);
    setRecordingIntervalId(null);

    // Formulate final duration e.g. "01:24"
    const min = String(Math.floor(recordingSeconds / 60)).padStart(2, "0");
    const sec = String(recordingSeconds % 60).padStart(2, "0");
    setRecordedAudioFile(`${min}:${sec}`);
  };

  const handlePlayPreviewToggle = () => {
    setIsPlayingPreview(!isPlayingPreview);
    if (!isPlayingPreview) {
      const interval = setInterval(() => {
        setPreviewProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlayingPreview(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  // Submit Handler
  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTaskToSubmit) return;

    const taskObj = tasks.find((t) => t.id === activeTaskToSubmit);
    if (!taskObj) return;

    let submissionContent = textAnswer;
    let fileNameArg = undefined;
    let fileSizeArg = undefined;
    let audioDurArg = undefined;

    if (submissionType === "File") {
      if (!selectedFileName) {
        alert("Harap unggah/pilih berkas lembar kerja Anda!");
        return;
      }
      submissionContent = `Telah melampirkan lembar kerja dalam format berkas gambar/PDF.`;
      fileNameArg = selectedFileName;
      fileSizeArg = fileSize;
    } else if (submissionType === "Audio") {
      if (!recordedAudioFile) {
        alert("Harap rekam setoran suara Anda terlebih dahulu!");
        return;
      }
      submissionContent = `Assalamualaikum Wr Wb pak guru, saya mengirimkan rekaman suara setoran hafalan Juz Amma PAI saya. Mohon dinilai nggih pak.`;
      fileNameArg = `setoran_hafalan_${siswa.nama.toLowerCase().replace(/\s+/g, "_")}.mp3`;
      fileSizeArg = "2.3 MB";
      audioDurArg = recordedAudioFile;
    } else {
      if (!textAnswer.trim()) {
        alert("Harap ketik jawaban teks Anda!");
        return;
      }
    }

    const sub: PengumpulanTugas = {
      id: "p-" + Date.now(),
      tugasId: activeTaskToSubmit,
      tugasJudul: taskObj.judul,
      siswaNisn: siswa.nisn,
      siswaNama: siswa.nama,
      kelasId: siswa.kelasId,
      tanggalKumpul: new Date().toISOString().replace("T", " ").substring(0, 16),
      tipePengumpulan: submissionType,
      kontenTeks: submissionContent,
      fileName: fileNameArg,
      fileSize: fileSizeArg,
      audioDuration: audioDurArg
    };

    onAddSubmission(sub);
    alert("Tugas PAI Anda berhasil dikumpulkan! Terima kasih.");

    // Reset Form
    setActiveTaskToSubmit("");
    setTextAnswer("");
    setSelectedFileName("");
    setRecordedAudioFile(null);
  };

  const getSubmissionForTask = (taskId: string) => {
    return submissions.find((s) => s.tugasId === taskId && s.siswaNisn === siswa.nisn);
  };

  const currentBabData = filteredBabPelajaran.find((b) => b.id === activeBab) || filteredBabPelajaran[0];

  if (!currentBabData) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm text-center">
        <p className="text-sm font-bold text-slate-500">Belum ada bab pelajaran yang diunggah oleh guru untuk kelas Anda.</p>
      </div>
    );
  }

  const quizzesWithQuestions = filteredBabPelajaran.filter((b) => b.soalList && b.soalList.length > 0);
  const totalQuizzes = quizzesWithQuestions.length;
  const completedQuizzes = quizzesWithQuestions.filter((b) => savedScores[b.id]).length;

  const quizScoresList = quizzesWithQuestions
    .map((b) => savedScores[b.id]?.score)
    .filter((score) => score !== undefined && score !== null) as number[];
  const averageQuizScore = quizScoresList.length > 0
    ? Math.round(quizScoresList.reduce((sum, score) => sum + score, 0) / quizScoresList.length)
    : 0;

  const embedInfo = getEmbedInfo(currentBabData.video.source);

  // Video Summary Task States & Handlers
  const videoSummaryTaskId = `ringkasan-video-${currentBabData.id}`;
  const existingVideoSummary = submissions.find(
    (s) =>
      (s.tugasId === videoSummaryTaskId || s.tugasId === `video-${currentBabData.id}`) &&
      s.siswaNisn === siswa.nisn
  );

  const [videoSummaryDraft, setVideoSummaryDraft] = useState<string>("");
  const [isEditingVideoSummary, setIsEditingVideoSummary] = useState<boolean>(false);
  const [summaryToast, setSummaryToast] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Sync draft and editing state when active bab or existing submission changes
  useEffect(() => {
    if (existingVideoSummary) {
      setVideoSummaryDraft(existingVideoSummary.kontenTeks);
      setIsEditingVideoSummary(false);
    } else {
      const savedDraft = localStorage.getItem(`draft_summary_${siswa.nisn}_${currentBabData.id}`) || "";
      setVideoSummaryDraft(savedDraft);
      setIsEditingVideoSummary(true);
    }
  }, [activeBab, existingVideoSummary?.id, existingVideoSummary?.kontenTeks, siswa.nisn, currentBabData.id]);

  const handleSaveSummaryDraft = (text: string) => {
    setVideoSummaryDraft(text);
    localStorage.setItem(`draft_summary_${siswa.nisn}_${currentBabData.id}`, text);
  };

  const handleApplySummaryTemplate = () => {
    const template = `📌 [1. RANGKUMAN INTISARI VIDEO]:\n- Video ini menjelaskan tentang ...\n- Poin pokok materi yang dipelajari adalah ...\n\n💡 [2. HIKMAH & PELAJARAN YANG DIPETIK]:\n- Hikmah dan nilai akhlak yang saya peroleh adalah ...\n\n🎯 [3. KOMITMEN PENERAPAN DALAM KEHIDUPAN SEHARI-HARI]:\n- Saya akan mengamalkan nilai ini dengan cara ...`;
    if (!videoSummaryDraft.trim()) {
      handleSaveSummaryDraft(template);
    } else {
      if (confirm("Apakah Anda ingin mengganti teks dengan format rangka ringkasan terstruktur?")) {
        handleSaveSummaryDraft(template);
      }
    }
  };

  const handleSubmitVideoSummary = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanText = videoSummaryDraft.trim();
    if (!cleanText || cleanText.length < 15) {
      alert("Harap tuliskan ringkasan atau kesimpulan video terlebih dahulu (minimal 15 karakter)!");
      return;
    }

    const newSub: PengumpulanTugas = {
      id: existingVideoSummary ? existingVideoSummary.id : ("sub-vsum-" + currentBabData.id + "-" + Date.now()),
      tugasId: videoSummaryTaskId,
      tugasJudul: `Ringkasan Video: ${currentBabData.video.judul} (${currentBabData.judul.split(":")[0] || currentBabData.judul})`,
      siswaNisn: siswa.nisn,
      siswaNama: siswa.nama,
      kelasId: siswa.kelasId,
      tanggalKumpul: new Date().toISOString().replace("T", " ").substring(0, 16),
      tipePengumpulan: "Teks",
      kontenTeks: cleanText,
      nilai: existingVideoSummary?.nilai,
      komentarGuru: existingVideoSummary?.komentarGuru
    };

    onAddSubmission(newSub);
    localStorage.removeItem(`draft_summary_${siswa.nisn}_${currentBabData.id}`);
    setIsEditingVideoSummary(false);
    setSummaryToast("Alhamdulillah! Ringkasan video Anda berhasil dikirim ke Guru PAI untuk dinilai.");
    setTimeout(() => setSummaryToast(null), 5000);
  };

  const handleCopySummary = () => {
    if (existingVideoSummary?.kontenTeks) {
      navigator.clipboard.writeText(existingVideoSummary.kontenTeks);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    }
  };

  const handleCancelEditSummary = () => {
    if (existingVideoSummary) {
      setVideoSummaryDraft(existingVideoSummary.kontenTeks);
      setIsEditingVideoSummary(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Chapter selections (Left pane) */}
      <div className="lg:col-span-1 space-y-4">
        {/* Papan Skor Kuis PAI Widget */}
        {totalQuizzes > 0 && (
          <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-2xl p-4 text-white shadow-md space-y-3 relative overflow-hidden text-left animate-fadeIn">
            <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-10">
              <Award className="w-16 h-16" />
            </div>
            
            <div className="relative z-10 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-extrabold uppercase bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full inline-block">
                  Papan Nilai Kuis
                </span>
              </div>
              <h4 className="text-xs font-black tracking-tight leading-normal text-white">
                Hasil Latihan Soal PAI
              </h4>
              <p className="text-[9px] text-emerald-200/95 font-medium leading-relaxed">
                Nilai kuis pilihan ganda yang Anda peroleh secara akumulatif.
              </p>
              
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                  <span className="block text-[8px] text-emerald-300 font-bold uppercase">Kuis Selesai</span>
                  <span className="block text-sm font-black text-white mt-0.5">
                    {completedQuizzes} <span className="text-[10px] font-normal text-emerald-200">/ {totalQuizzes}</span>
                  </span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                  <span className="block text-[8px] text-emerald-300 font-bold uppercase">Rerata Nilai</span>
                  <span className="block text-sm font-black text-amber-300 mt-0.5">
                    {completedQuizzes > 0 ? averageQuizScore : "-"} <span className="text-[10px] font-normal text-amber-200">/ 100</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider text-left">
            Daftar Bab Pembelajaran PAI
          </span>

          <div className="space-y-2">
            {filteredBabPelajaran.map((bab) => {
              const quizRecord = savedScores[bab.id];
              const hasQuiz = bab.soalList && bab.soalList.length > 0;

              return (
                <button
                  key={bab.id}
                  onClick={() => {
                    setActiveBab(bab.id);
                    setIsVideoPlayingInApp(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition flex flex-col gap-1.5 ${
                    activeBab === bab.id
                      ? "bg-emerald-700 text-white border-emerald-700 shadow-md shadow-emerald-800/10"
                      : "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2 w-full min-w-0">
                    <BookOpen className={`w-4 h-4 shrink-0 ${activeBab === bab.id ? "text-emerald-100" : "text-emerald-700"}`} />
                    <span className="truncate font-bold text-xs">{bab.judul.split(":")[0] || bab.judul}</span>
                  </div>

                  {hasQuiz && (
                    <div className="flex items-center gap-1.5">
                      {quizRecord ? (
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold border flex items-center gap-1 shrink-0 ${
                          activeBab === bab.id
                            ? "bg-emerald-800/60 border-emerald-600 text-emerald-100"
                            : "bg-emerald-50 border-emerald-100 text-emerald-800"
                        }`}>
                          ✓ Skor: {quizRecord.score}/100
                        </span>
                      ) : (
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold border flex items-center gap-1 shrink-0 ${
                          activeBab === bab.id
                            ? "bg-amber-600/50 border-amber-500 text-amber-100"
                            : "bg-amber-50 border-amber-100 text-amber-800"
                        }`}>
                          📝 Ada Kuis ({bab.soalList.length} Soal)
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Informative widget */}
        <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-100/50 text-[11px] text-amber-800 space-y-1">
          <span className="font-extrabold block">Tip Setoran Hafalan:</span>
          <p className="leading-relaxed font-semibold">
            Gunakan perekam suara interaktif di sebelah kanan untuk menyetor tugas juz amma Anda langsung ke pak guru Sadiqul Alim.
          </p>
        </div>
      </div>

      {/* Materials & Tasks (Right pane) */}
      <div className="lg:col-span-3 space-y-6">
        {/* Active lesson materials block */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {currentBabData.judul}
            </h3>
            <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Materi Terarsip
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-semibold">
            {currentBabData.deskripsi}
          </p>

          {/* Reading Materials list */}
          <div className="space-y-2">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              Bahan Bacaan & Dokumen Pendukung (PDF):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentBabData.dokumen && currentBabData.dokumen.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 transition"
                >
                  <span className="truncate max-w-[180px]">📄 {doc.judul}</span>
                  <button
                    onClick={() => alert(`Mengunduh modul: ${doc.judul}... Selesai!`)}
                    className="p-1.5 text-emerald-800 hover:bg-emerald-50 rounded"
                    title="Unduh PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Video Lesson with Real YouTube Embed fallback */}
          <div className="space-y-2.5 pt-2">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              Media Pembelajaran Video:
            </span>
            {isVideoPlayingInApp && embedInfo ? (
              <div className="rounded-xl border border-slate-100 overflow-hidden bg-black text-white relative aspect-video shadow-lg">
                <iframe
                  src={embedInfo.embedUrl}
                  className="w-full h-full"
                  title={currentBabData.video.judul}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
                <button
                  onClick={() => setIsVideoPlayingInApp(false)}
                  className="absolute top-2 right-2 px-2.5 py-1 bg-slate-900/80 hover:bg-slate-950 text-white text-[10px] font-bold rounded shadow-md z-10 transition border border-slate-700/50"
                >
                  Tutup Video
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-900 text-white relative aspect-video flex flex-col justify-between p-4 group shadow-sm">
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-slate-950/45 flex items-center justify-center transition group-hover:bg-slate-950/50">
                  <button
                    onClick={() => {
                      if (embedInfo) {
                        setIsVideoPlayingInApp(true);
                      } else {
                        alert(`Memutar video: ${currentBabData.video.judul}`);
                      }
                    }}
                    className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg transform active:scale-95 transition"
                  >
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </button>
                </div>

                <span className="self-end bg-slate-950/60 px-2 py-0.5 rounded text-[10px] font-mono">
                  {currentBabData.video.duration || "Bebas"}
                </span>

                <div className="relative z-10 text-left">
                  <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">
                    Video Penjelasan Guru PAI
                  </span>
                  <h4 className="text-xs font-bold font-sans">
                    {currentBabData.video.judul}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    <span className="text-[9px] opacity-75">
                      Sumber: {currentBabData.video.source}
                    </span>
                    {embedInfo && (
                      <a
                        href={currentBabData.video.source}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[9px] text-amber-300 font-bold hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        (Tonton di YouTube ↗)
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* KOTAK RINGKASAN & KESIMPULAN VIDEO PEMBELAJARAN SISWA */}
            <div id="kotak-ringkasan-video" className="mt-5 pt-4 border-t border-slate-100 space-y-3.5 text-left">
              {/* Box Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs">
                    <FileText className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      Kotak Ringkasan & Kesimpulan Video
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        Tugas Terintegrasi Guru
                      </span>
                    </h4>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Tuliskan intisari materi dan kesimpulan dari video di atas agar dapat dikirim dan dinilai oleh Guru PAI.
                    </span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="self-start sm:self-center flex items-center gap-1.5 shrink-0">
                  {existingVideoSummary ? (
                    existingVideoSummary.nilai !== undefined && existingVideoSummary.nilai !== null ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300 px-3 py-1 rounded-full shadow-xs">
                        <Award className="w-3.5 h-3.5 text-emerald-700" />
                        Sudah Dinilai: {existingVideoSummary.nilai}/100
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Menunggu Penilaian Guru
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full">
                      Belum Mengirim Ringkasan
                    </span>
                  )}
                </div>
              </div>

              {/* Toast Feedback */}
              {summaryToast && (
                <div className="p-3 bg-emerald-800 text-white text-xs rounded-xl shadow-md flex items-center justify-between gap-2 animate-fadeIn border border-emerald-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-200 shrink-0" />
                    <span className="font-semibold">{summaryToast}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSummaryToast(null)}
                    className="text-emerald-200 hover:text-white text-xs font-bold px-1.5"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Teacher Evaluation Result Card (When Graded) */}
              {existingVideoSummary && existingVideoSummary.nilai !== undefined && existingVideoSummary.nilai !== null && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 via-teal-50/70 to-emerald-50/40 border border-emerald-200/90 shadow-xs space-y-2.5 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase bg-emerald-700 text-white px-2.5 py-0.5 rounded-full">
                        Hasil Penilaian Guru
                      </span>
                      <span className="text-xs font-bold text-emerald-950 font-sans">
                        Pemeriksaan Ringkasan Video Materi
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-emerald-200 shadow-xs">
                      <span className="text-[10px] font-bold text-slate-500">Nilai Anda:</span>
                      <span className="text-sm font-black text-emerald-800">{existingVideoSummary.nilai}</span>
                      <span className="text-[10px] font-bold text-slate-400">/ 100</span>
                    </div>
                  </div>

                  {existingVideoSummary.komentarGuru && (
                    <div className="bg-white/95 p-3 rounded-lg border border-emerald-100 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[10px] uppercase tracking-wide">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        Catatan & Masukan Pembinaan Guru PAI:
                      </div>
                      <p className="text-slate-700 font-medium italic leading-relaxed pl-5">
                        "{existingVideoSummary.komentarGuru}"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* View Mode (Already Submitted & not in edit mode) */}
              {existingVideoSummary && !isEditingVideoSummary ? (
                <div className="bg-slate-50/70 rounded-xl border border-slate-200/80 p-4 space-y-3 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 border-b border-slate-200/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700">Teks Kesimpulan Siswa:</span>
                      <span>Dikumpulkan: {existingVideoSummary.tanggalKumpul}</span>
                    </div>
                    <span className="bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded font-mono text-[9px]">
                      {existingVideoSummary.kontenTeks.split(/\s+/).filter(Boolean).length} kata
                    </span>
                  </div>

                  <div className="text-xs text-slate-800 font-medium leading-relaxed whitespace-pre-line bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                    {existingVideoSummary.kontenTeks}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition"
                    >
                      {copiedSummary ? (
                        <>
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Ringkasan Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Salin Catatan Ringkasan</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsEditingVideoSummary(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Perbarui / Edit Ringkasan
                    </button>
                  </div>
                </div>
              ) : (
                /* Form / Writing Mode (Empty or Edit Mode) */
                <form onSubmit={handleSubmitVideoSummary} className="space-y-3 animate-fadeIn">
                  {/* Guideline bar with prompt buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">
                        Panduan Ringkasan:
                      </span>
                      <span className="text-[10px] font-medium bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                        1. Intisari Materi
                      </span>
                      <span className="text-[10px] font-medium bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                        2. Hikmah Akhlak
                      </span>
                      <span className="text-[10px] font-medium bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                        3. Pengamalan Sehari-hari
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleApplySummaryTemplate}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      Gunakan Format Rangka
                    </button>
                  </div>

                  {/* Textarea */}
                  <div className="space-y-1">
                    <textarea
                      rows={6}
                      value={videoSummaryDraft}
                      onChange={(e) => handleSaveSummaryDraft(e.target.value)}
                      placeholder="Tonton tayangan video di atas, kemudian tuliskan intisari materi pokok, hikmah yang dipetik, dan kesimpulan penerapannya dalam kehidupan sehari-hari di sini..."
                      className="w-full p-3.5 text-xs text-slate-800 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition leading-relaxed font-medium placeholder:text-slate-400"
                    />
                    
                    <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[10px] text-slate-400 font-mono">
                      <span>
                        {videoSummaryDraft.trim().split(/\s+/).filter(Boolean).length} kata • {videoSummaryDraft.length} karakter
                        {videoSummaryDraft.trim().split(/\s+/).filter(Boolean).length < 10 && (
                          <span className="text-amber-600 font-sans ml-2 font-semibold">
                            (Disarankan minimal 10 kata agar ringkasan berbobot)
                          </span>
                        )}
                      </span>
                      <span className="text-slate-400 font-sans italic">
                        Draft otomatis tersimpan di peramban Anda
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    {isEditingVideoSummary && existingVideoSummary && (
                      <button
                        type="button"
                        onClick={handleCancelEditSummary}
                        className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
                      >
                        Batal
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={!videoSummaryDraft.trim() || videoSummaryDraft.trim().length < 15}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition shadow-sm ${
                        !videoSummaryDraft.trim() || videoSummaryDraft.trim().length < 15
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200"
                          : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-800/10 active:scale-98"
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      {existingVideoSummary ? "Simpan & Kirim Pembaruan Ringkasan ke Guru" : "Kirim Ringkasan ke Guru PAI"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Kuis Pilihan Ganda Interaktif Section (Siswa) */}
        <div className="bg-gradient-to-br from-indigo-50/60 via-white to-emerald-50/30 rounded-2xl border border-indigo-100/90 p-6 shadow-sm space-y-6 animate-fadeIn">
          {/* Generator Toast Alert */}
          {generatorToast && (
            <div className="p-3.5 bg-slate-900 text-white text-xs rounded-xl shadow-xl flex items-center justify-between gap-3 border border-emerald-500/40 animate-slideDown">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-bold">{generatorToast}</span>
              </div>
              <button
                type="button"
                onClick={() => setGeneratorToast(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-0.5"
              >
                ✕
              </button>
            </div>
          )}

          {/* Section Header */}
          <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-700 text-white rounded-xl shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Kuis LMS Interaktif Bab {currentBabData.judul.split(":")[1]?.trim() || currentBabData.judul}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-200 uppercase">
                    Kurikulum Merdeka
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium leading-normal mt-0.5">
                  Kerjakan latihan kuis pilihan ganda yang telah disiapkan oleh Guru PAI atau buat soal kuis otomatis sesuai kebutuhan belajar Anda.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setShowAutoQuizPanel(!showAutoQuizPanel)}
                className={`text-[11px] font-bold px-3.5 py-1.5 rounded-full border shadow-sm flex items-center gap-1.5 transition ${
                  showAutoQuizPanel
                    ? "bg-slate-900 text-white border-slate-800"
                    : "bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{showAutoQuizPanel ? "Tutup Pembuat Kuis" : "⚡ Pembuat Kuis Otomatis"}</span>
              </button>

              {quizSubmitted ? (
                <span className={`text-[11px] font-black px-4 py-1.5 rounded-full border shadow-sm flex items-center gap-1.5 ${
                  quizScore !== null && quizScore >= 75
                    ? "bg-emerald-100 border-emerald-300 text-emerald-900"
                    : "bg-amber-100 border-amber-300 text-amber-900"
                }`}>
                  Nilai Anda: {quizScore} / 100
                </span>
              ) : (
                <span className="text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-800 px-3.5 py-1.5 rounded-full border border-indigo-200">
                  {currentBabData.soalList && currentBabData.soalList.length > 0
                    ? `${currentBabData.soalList.length} Soal Ditampilkan`
                    : "Belum Ada Soal"}
                </span>
              )}
            </div>
          </div>

          {/* Panel Pembuatan Soal Kuis Otomatis (LMS Siswa) */}
          {(showAutoQuizPanel || !currentBabData.soalList || currentBabData.soalList.length === 0) && (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-lg space-y-4 text-left border border-indigo-500/30 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-600/30 rounded-lg border border-emerald-400/30 text-emerald-300">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Pembuatan Soal Kuis Otomatis (LMS Siswa)</span>
                      <span className="bg-amber-400/20 text-amber-300 text-[9px] font-black px-2 py-0.5 rounded border border-amber-400/30 uppercase">
                        AI Generator
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Tentukan jumlah soal yang dihasilkan (misal 10 soal) dan tingkat kesulitan untuk latihan mandiri materi bab ini.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    Aktif: Bab {currentBabData.judul.split(":")[1]?.trim() || currentBabData.judul}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                {/* Opsi Jumlah Soal */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] text-slate-300 font-bold">
                    Jumlah Soal Kuis Dihasilkan:
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[5, 8, 10, 15, 20].map((countVal) => (
                      <button
                        key={countVal}
                        type="button"
                        onClick={() => setQuizAutoCount(countVal)}
                        className={`py-2 px-1 text-xs font-bold rounded-lg border text-center transition ${
                          quizAutoCount === countVal
                            ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black ring-2 ring-emerald-300/40"
                            : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700"
                        }`}
                      >
                        {countVal} {countVal === 10 ? "⭐" : ""}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {quizAutoCount === 10
                      ? "⭐ Rekomendasi: 10 Soal Asesmen Lengkap PAI"
                      : `${quizAutoCount} Soal akan disusun`}
                  </p>
                </div>

                {/* Opsi Tingkat Kesulitan */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] text-slate-300 font-bold">
                    Tingkat Kesulitan Soal:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setQuizAutoDifficulty("Mudah")}
                      className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border text-left flex items-center gap-1.5 transition ${
                        quizAutoDifficulty === "Mudah"
                          ? "bg-emerald-950 text-emerald-200 border-emerald-400 ring-2 ring-emerald-400/40 font-black"
                          : "bg-slate-800/70 text-slate-300 border-slate-700 hover:bg-slate-700/70"
                      }`}
                    >
                      <span>🟢</span>
                      <span>Mudah (C1-C2)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuizAutoDifficulty("Sedang")}
                      className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border text-left flex items-center gap-1.5 transition ${
                        quizAutoDifficulty === "Sedang"
                          ? "bg-amber-950 text-amber-200 border-amber-400 ring-2 ring-amber-400/40 font-black"
                          : "bg-slate-800/70 text-slate-300 border-slate-700 hover:bg-slate-700/70"
                      }`}
                    >
                      <span>🟡</span>
                      <span>Sedang (C3)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuizAutoDifficulty("HOTS")}
                      className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border text-left flex items-center gap-1.5 transition ${
                        quizAutoDifficulty === "HOTS"
                          ? "bg-rose-950 text-rose-200 border-rose-400 ring-2 ring-rose-400/40 font-black"
                          : "bg-slate-800/70 text-slate-300 border-slate-700 hover:bg-slate-700/70"
                      }`}
                    >
                      <span>🔴</span>
                      <span>HOTS (C4-C6)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuizAutoDifficulty("Campuran")}
                      className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border text-left flex items-center gap-1.5 transition ${
                        quizAutoDifficulty === "Campuran"
                          ? "bg-indigo-950 text-indigo-200 border-indigo-400 ring-2 ring-indigo-400/40 font-black"
                          : "bg-slate-800/70 text-slate-300 border-slate-700 hover:bg-slate-700/70"
                      }`}
                    >
                      <span>🔀</span>
                      <span>Campuran</span>
                    </button>
                  </div>
                </div>

                {/* Tombol Eksekusi Generator */}
                <div>
                  <button
                    type="button"
                    disabled={isGeneratingQuiz}
                    onClick={() => handleGenerateStudentAutoQuiz()}
                    className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 text-xs font-black py-2.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 border border-emerald-400"
                  >
                    {isGeneratingQuiz ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Menyusun {quizAutoCount} Soal...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>Hasilkan {quizAutoCount} Soal ({quizAutoDifficulty})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty state if no questions yet */}
          {(!currentBabData.soalList || currentBabData.soalList.length === 0) && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-6 text-center space-y-3">
              <HelpCircle className="w-8 h-8 text-amber-600 mx-auto" />
              <h4 className="text-xs font-bold text-slate-800">
                Belum Ada Soal Kuis Terlampir pada Bab Ini
              </h4>
              <p className="text-[11px] text-slate-600 max-w-md mx-auto">
                Anda dapat langsung menggunakan Pembuat Kuis Otomatis di atas untuk menghasilkan 10 soal latihan sesuai tingkat kesulitan pilihan Anda.
              </p>
              <button
                type="button"
                onClick={() => handleGenerateStudentAutoQuiz(10, "HOTS")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow transition"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Buat 10 Soal Kuis (HOTS) Sekarang</span>
              </button>
            </div>
          )}

          {/* Score Message celebration */}
          {quizSubmitted && quizScore !== null && (
            <div className={`p-4 rounded-xl border flex items-start gap-3 text-left ${
              quizScore >= 75
                ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                : "bg-amber-50/80 border-amber-200 text-amber-900"
            }`}>
              <Sparkles className={`w-5 h-5 shrink-0 ${quizScore >= 75 ? "text-emerald-700" : "text-amber-700"}`} />
              <div className="space-y-1">
                <span className="text-xs font-black">
                  {quizScore >= 75 ? "Maa Sha Allah! Luar Biasa!" : "Belajar Lagi Yuk!"}
                </span>
                <p className="text-[11px] font-semibold leading-relaxed opacity-90">
                  {quizScore >= 75
                    ? "Anda telah memahami materi bab ini dengan sangat baik. Pelajari pembahasan kunci jawaban di bawah untuk memperdalam ilmu!"
                    : "Jangan berkecil hati. Periksa pembahasan tiap soal di bawah untuk mempelajari letak kesalahanmu, lalu coba lagi!"}
                </p>
              </div>
            </div>
          )}

          {/* Questions List */}
          {currentBabData.soalList && currentBabData.soalList.length > 0 && (
            <div className="space-y-5 text-left">
              {currentBabData.soalList.map((soal, sIdx) => {
                const selectedAns = studentAnswers[soal.id];
                const isCorrect = selectedAns === soal.jawabanBenar;

                return (
                  <div key={soal.id} className="p-4.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-100 w-6 h-6 rounded-lg flex items-center justify-center shrink-0">
                          {sIdx + 1}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">
                          Soal {sIdx + 1} dari {currentBabData.soalList.length}
                        </span>
                      </div>

                      {/* Difficulty Level Tag */}
                      {soal.tingkatKesulitan && (
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 w-fit ${
                          soal.tingkatKesulitan === "HOTS"
                            ? "bg-rose-50 text-rose-800 border-rose-200"
                            : soal.tingkatKesulitan === "Sedang"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-emerald-50 text-emerald-800 border-emerald-200"
                        }`}>
                          {soal.tingkatKesulitan === "HOTS" ? "🔴 HOTS (Analisis & Kasus)" : soal.tingkatKesulitan === "Sedang" ? "🟡 Standar Penerapan" : "🟢 Tingkat Dasar"}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 leading-relaxed">
                      {soal.pertanyaan}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {["A", "B", "C", "D"].map((optLetter, optIdx) => {
                        const optText = soal.pilihan[optIdx] || "";
                        const isThisSelected = selectedAns === optLetter;
                        const isThisCorrectOption = soal.jawabanBenar === optLetter;

                        let btnStyle = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/80";
                        if (quizSubmitted) {
                          if (isThisCorrectOption) {
                            btnStyle = "bg-emerald-100/80 border-emerald-400 text-emerald-950 font-bold shadow-sm";
                          } else if (isThisSelected && !isCorrect) {
                            btnStyle = "bg-rose-50 border-rose-300 text-rose-900";
                          } else {
                            btnStyle = "bg-slate-50/60 border-slate-100 text-slate-400 opacity-60";
                          }
                        } else if (isThisSelected) {
                          btnStyle = "bg-indigo-600 border-indigo-600 text-white font-bold shadow-sm";
                        }

                        return (
                          <button
                            key={optLetter}
                            type="button"
                            disabled={quizSubmitted}
                            onClick={() => setStudentAnswers({ ...studentAnswers, [soal.id]: optLetter })}
                            className={`p-3 text-xs rounded-xl border flex items-center justify-between text-left transition ${btnStyle}`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                                isThisSelected && !quizSubmitted
                                  ? "bg-white text-indigo-800"
                                  : isThisCorrectOption && quizSubmitted
                                  ? "bg-emerald-700 text-white"
                                  : isThisSelected && quizSubmitted && !isCorrect
                                  ? "bg-rose-600 text-white"
                                  : "bg-slate-200 text-slate-600"
                              }`}>
                                {optLetter}
                              </span>
                              <span className="truncate">{optText}</span>
                            </div>

                            {quizSubmitted && (
                              <div className="shrink-0">
                                {isThisCorrectOption && (
                                  <Check className="w-4 h-4 text-emerald-800 stroke-[3]" />
                                )}
                                {isThisSelected && !isCorrect && isThisCorrectOption === false && (
                                  <XCircle className="w-4 h-4 text-rose-600" />
                                )}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Pembahasan & Penjelasan Kunci Jawaban when quiz is submitted */}
                    {quizSubmitted && (
                      <div className="mt-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-left">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                          <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>Pembahasan & Kunci Jawaban (Pilihan {soal.jawabanBenar}):</span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed pl-5">
                          {soal.pembahasan || `Jawaban yang tepat adalah opsi ${soal.jawabanBenar}.`}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Quiz submission button / restart button */}
          {currentBabData.soalList && currentBabData.soalList.length > 0 && (
            <div className="pt-2 flex items-center justify-end gap-3">
              {quizSubmitted ? (
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  Coba Kerjakan Ulang Kuis Ini
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleQuizSubmit}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Kirim & Koreksi Jawaban
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tasks and submission console */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Daftar Tugas LMS Bab Ini
          </h3>

          <div className="space-y-4">
            {/* Featured Video Summary Task Item */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/60 to-teal-50/40 border border-emerald-200/80 space-y-2 text-left shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-extrabold uppercase bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                      Tugas Video
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">
                      Ringkasan & Kesimpulan Video: {currentBabData.video.judul}
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Media Video Pembelajaran ({currentBabData.video.duration || "PAI"}) • Dikerjakan langsung di kotak ringkasan
                  </span>
                </div>

                <div className="self-start sm:self-center flex items-center gap-1.5">
                  {existingVideoSummary ? (
                    <>
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Sudah Dikumpul
                      </span>
                      {existingVideoSummary.nilai !== undefined && existingVideoSummary.nilai !== null ? (
                        <span className="text-[10px] font-extrabold bg-amber-400 text-emerald-950 px-2.5 py-1 rounded-full shadow-xs">
                          Nilai Guru: {existingVideoSummary.nilai}/100 ⭐
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                          Menunggu Penilaian Guru
                        </span>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById("kotak-ringkasan-video");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold rounded-lg transition shadow-xs"
                    >
                      Tulis Ringkasan ↑
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium pt-1 border-t border-emerald-100/60">
                <span>Tugas menuliskan intisari materi dan kesimpulan di bawah video pembelajaran.</span>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("kotak-ringkasan-video");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline shrink-0 ml-2"
                >
                  {existingVideoSummary ? "Lihat / Edit di Bawah Video ↑" : "Buka Kotak Ringkasan ↑"}
                </button>
              </div>
            </div>

            {tasksForActiveBab.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-xl">
                Tidak ada tugas dokumen/audio tambahan untuk Bab ini di LMS.
              </p>
            ) : (
              tasksForActiveBab.map((task) => {
                const subObj = getSubmissionForTask(task.id);
                const isSubmitting = activeTaskToSubmit === task.id;

                return (
                  <div key={task.id} className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 space-y-3 text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{task.judul}</h4>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Batas Pengumpulan: {task.deadline}</span>
                      </div>

                      {subObj ? (
                        <div className="self-start sm:self-center flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Sudah Dikumpul
                          </span>
                          {subObj.nilai !== undefined ? (
                            <span className="text-[10px] font-extrabold bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full">
                              Nilai: {subObj.nilai}
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                              Menunggu Penilaian
                            </span>
                          )}
                        </div>
                      ) : (
                        !isSubmitting && (
                          <button
                            onClick={() => {
                              setActiveTaskToSubmit(task.id);
                              setRecordedAudioFile(null);
                            }}
                            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold rounded-lg transition"
                          >
                            Kerjakan Tugas &rarr;
                          </button>
                        )
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                      {task.deskripsi}
                    </p>

                    {/* SUBMISSION FORM CONSOLE */}
                    {isSubmitting && (
                      <form onSubmit={handleTaskSubmit} className="pt-4 border-t border-slate-200/60 space-y-4 animate-fadeIn">
                        <div className="bg-emerald-50/30 p-3 rounded-xl border border-emerald-100/50 flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            Pilih Metode Pengumpulan:
                          </span>
                          <div className="flex gap-2">
                            {(["Teks", "File", "Audio"] as const).map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setSubmissionType(t)}
                                className={`px-3 py-1 text-[10px] font-bold rounded transition border ${
                                  submissionType === t
                                    ? "bg-emerald-700 text-white border-emerald-700"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                {t === "Teks" ? "Ketik Jawaban" : t === "File" ? "Unggah Lembar Kerja" : "Rekam Suara (Setoran Hafalan)"}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* SUBMISSION INTERACTIVE INTERFACES */}
                        {submissionType === "Teks" ? (
                          <div className="space-y-1">
                            <label className="block text-[10px] text-slate-400 font-bold uppercase">
                              Jawaban Teks Anda:
                            </label>
                            <textarea
                              required
                              placeholder="Ketikkan lembar jawaban tugas Anda secara terperinci di sini..."
                              value={textAnswer}
                              onChange={(e) => setTextAnswer(e.target.value)}
                              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none bg-white text-xs text-slate-800 min-h-[100px]"
                            />
                          </div>
                        ) : submissionType === "File" ? (
                          <div className="space-y-2">
                            <label className="block text-[10px] text-slate-400 font-bold uppercase">
                              Unggah Dokumen / Foto Folio:
                            </label>
                            <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500/40 rounded-xl p-6 bg-white text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2" onClick={handleFileChoose}>
                              <Upload className="w-8 h-8 text-slate-300" />
                              <span className="text-xs font-bold text-slate-700">
                                {selectedFileName ? `Terpilih: ${selectedFileName}` : "Seret berkas ke sini atau klik untuk memilih"}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {fileSize ? `Ukuran: ${fileSize}` : "Mendukung JPG, PNG, PDF maks 10MB"}
                              </span>
                            </div>
                          </div>
                        ) : (
                          /* EXTRAORDINARY VOICE RECORDER SIMULATOR */
                          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-4">
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                              <span className="text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full bg-red-600 ${isRecording ? "animate-pulse" : ""}`}></span>
                                Perekam Suara Hafalan PAI (Setoran Hafalan)
                              </span>
                              {isRecording && (
                                <span className="text-xs font-mono font-bold text-red-500">
                                  Recording: {String(Math.floor(recordingSeconds / 60)).padStart(2, "0")}:{String(recordingSeconds % 60).padStart(2, "0")}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-center gap-4 py-3">
                              {!isRecording && !recordedAudioFile ? (
                                <button
                                  type="button"
                                  onClick={handleStartRecording}
                                  className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 hover:scale-105 active:scale-95 transition"
                                  title="Mulai Rekam"
                                >
                                  <Mic className="w-6 h-6 fill-white" />
                                </button>
                              ) : isRecording ? (
                                <button
                                  type="button"
                                  onClick={handleStopRecording}
                                  className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 hover:scale-105 active:scale-95 transition"
                                  title="Berhenti & Simpan"
                                >
                                  <Square className="w-5 h-5 fill-white" />
                                </button>
                              ) : (
                                /* Audio Saved Preview controls */
                                <div className="w-full space-y-3">
                                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                    <button
                                      type="button"
                                      onClick={handlePlayPreviewToggle}
                                      className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center"
                                    >
                                      {isPlayingPreview ? (
                                        <Pause className="w-4 h-4 fill-white" />
                                      ) : (
                                        <Play className="w-4 h-4 fill-white ml-0.5" />
                                      )}
                                    </button>
                                    <div className="flex-1 space-y-1">
                                      <span className="block text-[10px] text-slate-300 font-bold">setoran_suara_ad_duha_simulated.mp3</span>
                                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-400" style={{ width: `${previewProgress}%` }}></div>
                                      </div>
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-slate-300">{recordedAudioFile}</span>
                                  </div>

                                  <div className="flex justify-center">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setRecordedAudioFile(null);
                                        setPreviewProgress(0);
                                      }}
                                      className="text-[10px] font-bold text-red-400 hover:text-red-500 underline"
                                    >
                                      Hapus & Rekam Ulang
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            <p className="text-[10px] text-slate-400 text-center leading-relaxed font-semibold">
                              Pelafalan Juz Amma terekam secara kompresi tinggi (.mp3) untuk menjaga kejernihan suara saat diulas pak guru.
                            </p>
                          </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setActiveTaskToSubmit("")}
                            className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition shadow-md"
                          >
                            Kirim Jawaban Ke LMS
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
