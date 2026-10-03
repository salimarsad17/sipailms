/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Sparkles,
  LayoutDashboard,
  Layers,
  GraduationCap,
  Award,
  Database,
  Plus,
  BookOpen
} from "lucide-react";
import { BahanAjarAiCompleteBundle } from "../../../types/bahanAjarAiModern";
import { BahanAjarAiStorage } from "../../../services/bahanAjarAiStorage";
import BahanAjarAiDashboard from "./BahanAjarAiDashboard";
import BahanAjarAiGenerator from "./BahanAjarAiGenerator";
import BahanAjarAiResultView from "./BahanAjarAiResultView";
import BankBahanAjarView from "./BankBahanAjarView";
import DataKurikulumPaiView from "./DataKurikulumPaiView";
import HasilSiswaView from "./HasilSiswaView";
import GoogleAppsScriptModal from "./GoogleAppsScriptModal";
import { BabPelajaran } from "../../../types";

interface BahanAjarAiViewProps {
  babPelajaran?: BabPelajaran[];
  onUpdateBabPelajaran?: (updated: BabPelajaran[]) => void;
}

export default function BahanAjarAiView({
  babPelajaran,
  onUpdateBabPelajaran
}: BahanAjarAiViewProps) {
  // Navigation mode inside Bahan Ajar AI:
  // "dashboard" | "generator" | "result" | "bank" | "kurikulum" | "hasil"
  const [currentNav, setCurrentNav] = useState<
    "dashboard" | "generator" | "result" | "bank" | "kurikulum" | "hasil"
  >("dashboard");

  // Bank Bundles state
  const [bundles, setBundles] = useState<BahanAjarAiCompleteBundle[]>(() =>
    BahanAjarAiStorage.getBundles()
  );

  // Active / selected bundle
  const [activeBundle, setActiveBundle] = useState<BahanAjarAiCompleteBundle | null>(null);

  // Google Apps Script Modal
  const [isAppsScriptModalOpen, setIsAppsScriptModalOpen] = useState(false);

  // Bank filter helper
  const [bankInitialFilter, setBankInitialFilter] = useState<string | undefined>(undefined);

  // When AI finishes generation
  const handleGenerated = (newBundle: BahanAjarAiCompleteBundle) => {
    const updated = BahanAjarAiStorage.saveBundle(newBundle);
    setBundles(updated);
    setActiveBundle(newBundle);
    setCurrentNav("result");
  };

  // Duplicate handler
  const handleDuplicate = (id: string) => {
    const dup = BahanAjarAiStorage.duplicateBundle(id);
    if (dup) {
      setBundles(BahanAjarAiStorage.getBundles());
      setActiveBundle(dup);
      setCurrentNav("result");
    }
  };

  // Delete handler
  const handleDelete = (id: string) => {
    const updated = BahanAjarAiStorage.deleteBundle(id);
    setBundles(updated);
    if (activeBundle?.id === id) {
      setActiveBundle(null);
      setCurrentNav("bank");
    }
  };

  return (
    <div className="space-y-6">
      {/* SUB MENU HEADER NAV */}
      <div className="p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
          <button
            onClick={() => setCurrentNav("dashboard")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
              currentNav === "dashboard"
                ? "bg-blue-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </button>

          <button
            onClick={() => setCurrentNav("generator")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
              currentNav === "generator"
                ? "bg-blue-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Generator AI</span>
          </button>

          <button
            onClick={() => {
              setBankInitialFilter(undefined);
              setCurrentNav("bank");
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
              currentNav === "bank"
                ? "bg-blue-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Bank Bahan Ajar ({bundles.length})</span>
          </button>

          <button
            onClick={() => setCurrentNav("kurikulum")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
              currentNav === "kurikulum"
                ? "bg-blue-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Data PAI (7, 8, 9)</span>
          </button>

          <button
            onClick={() => setCurrentNav("hasil")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
              currentNav === "hasil"
                ? "bg-blue-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Hasil Siswa</span>
          </button>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setIsAppsScriptModalOpen(true)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            title="Pengaturan Google Sheets & Apps Script"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Google Sheets</span>
          </button>

          {currentNav !== "generator" && (
            <button
              onClick={() => setCurrentNav("generator")}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs border border-amber-300 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ Buat Bahan Ajar</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW ROUTING */}
      {currentNav === "dashboard" && (
        <BahanAjarAiDashboard
          bundles={bundles}
          onOpenGenerator={() => setCurrentNav("generator")}
          onOpenBank={(filter) => {
            setBankInitialFilter(filter);
            setCurrentNav("bank");
          }}
          onOpenKurikulum={() => setCurrentNav("kurikulum")}
          onOpenHasil={() => setCurrentNav("hasil")}
          onSelectBundle={(bundle) => {
            setActiveBundle(bundle);
            setCurrentNav("result");
          }}
          onOpenAppsScript={() => setIsAppsScriptModalOpen(true)}
        />
      )}

      {currentNav === "generator" && (
        <BahanAjarAiGenerator
          onGenerated={handleGenerated}
          onCancel={() => setCurrentNav("dashboard")}
        />
      )}

      {currentNav === "result" && activeBundle && (
        <BahanAjarAiResultView
          bundle={activeBundle}
          onUpdateBundle={(updated) => {
            setActiveBundle(updated);
            setBundles(BahanAjarAiStorage.getBundles());
          }}
          onBack={() => setCurrentNav("dashboard")}
        />
      )}

      {currentNav === "bank" && (
        <BankBahanAjarView
          bundles={bundles}
          onSelectBundle={(b) => {
            setActiveBundle(b);
            setCurrentNav("result");
          }}
          onDuplicateBundle={handleDuplicate}
          onDeleteBundle={handleDelete}
          initialTypeFilter={bankInitialFilter}
        />
      )}

      {currentNav === "kurikulum" && <DataKurikulumPaiView />}

      {currentNav === "hasil" && <HasilSiswaView />}

      {/* Modal Google Apps Script */}
      <GoogleAppsScriptModal
        isOpen={isAppsScriptModalOpen}
        onClose={() => setIsAppsScriptModalOpen(false)}
      />
    </div>
  );
}
