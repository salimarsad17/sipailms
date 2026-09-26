/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Camera, Upload, Check, RefreshCw } from "lucide-react";
import { getCustomGuruPhoto, saveCustomGuruPhoto, subscribeGuruPhoto } from "../../lib/guruPhotoStore";

interface GuruPhotoFrameProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showUploadTrigger?: boolean;
  name?: string;
}

export default function GuruPhotoFrame({
  size = "md",
  className = "",
  showUploadTrigger = true,
  name = "Sadiqul Alim, S.Pd.I., M.Pd."
}: GuruPhotoFrameProps) {
  const [photo, setPhoto] = useState<string | null>(() => getCustomGuruPhoto());
  const [isUploading, setIsUploading] = useState(false);
  const [justUploaded, setJustUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = subscribeGuruPhoto((newPhoto) => {
      setPhoto(newPhoto);
    });
    return unsub;
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const result = reader.result as string;
        await saveCustomGuruPhoto(result);
        setPhoto(result);
        setJustUploaded(true);
        setIsUploading(false);
        setTimeout(() => setJustUploaded(false), 3000);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Gagal membaca file foto:", err);
      setIsUploading(false);
    }
  };

  const triggerUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  // Dimension classes
  const sizeClasses = {
    sm: "w-7 h-8 text-[9px] rounded-lg",
    md: "w-11 h-13 text-xs rounded-xl",
    lg: "w-14 h-18 sm:w-16 sm:h-20 text-xs rounded-2xl",
    xl: "w-20 h-26 text-sm rounded-2xl"
  };

  return (
    <div className={`relative group shrink-0 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleFileChange}
        className="hidden"
        title="Pilih file foto resmi"
      />

      <div
        onClick={showUploadTrigger ? triggerUpload : undefined}
        className={`${sizeClasses[size]} relative overflow-hidden border-2 border-amber-400/90 shadow-md bg-gradient-to-b from-red-600 via-red-700 to-red-800 flex flex-col items-center justify-center text-white select-none ${
          showUploadTrigger ? "cursor-pointer transition-transform hover:scale-102 hover:shadow-lg" : ""
        }`}
        title={showUploadTrigger ? "Klik untuk memilih / mengganti foto resmi (FOTOKU.jpg)" : name}
      >
        {photo ? (
          <img
            src={photo}
            alt={name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top"
            onError={() => {
              // If image fails, revert to placeholder
              setPhoto(null);
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center bg-red-700">
            {size === "sm" ? (
              <span className="font-extrabold text-[10px] text-amber-200">SA</span>
            ) : size === "md" ? (
              <div className="flex flex-col items-center justify-center">
                <Camera className="w-4 h-4 text-amber-300 mb-0.5" />
                <span className="text-[8px] font-black uppercase text-white tracking-tighter leading-tight">Foto</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="p-1.5 rounded-full bg-white/20 border border-white/30 text-amber-300">
                  <Upload className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-extrabold text-white leading-tight">
                  Pilih Foto
                </span>
                <span className="text-[7px] text-amber-200 font-mono">FOTOKU.jpg</span>
              </div>
            )}
          </div>
        )}

        {/* Hover Upload Overlay */}
        {showUploadTrigger && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-[1px]">
            {isUploading ? (
              <RefreshCw className="w-4 h-4 text-amber-300 animate-spin" />
            ) : justUploaded ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <>
                <Camera className="w-4 h-4 text-amber-300" />
                <span className="text-[8px] font-extrabold mt-0.5 uppercase tracking-tighter">
                  {photo ? "Ganti" : "Unggah"}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Floating Camera Button on Large size */}
      {showUploadTrigger && (size === "lg" || size === "xl") && (
        <button
          type="button"
          onClick={triggerUpload}
          className="absolute -bottom-1 -right-1 p-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-full shadow-md border-2 border-white transition cursor-pointer"
          title="Klik untuk memilih file foto (FOTOKU.jpg)"
        >
          <Camera className="w-3 h-3 text-slate-950" />
        </button>
      )}
    </div>
  );
}
