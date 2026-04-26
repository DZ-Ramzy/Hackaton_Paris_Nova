"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, ChevronLeft, ChevronRight, ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MascotBubble } from "@/components/onboarding/MascotBubble";
import { useJourneyStore } from "@/lib/store/journey-store";

const DEMO_PRM = "07386541234022";

function formatPrm(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, 14);
  const parts: string[] = [];
  if (d.length > 0) parts.push(d.slice(0, 2));
  if (d.length > 2) parts.push(d.slice(2, 6));
  if (d.length > 6) parts.push(d.slice(6, 10));
  if (d.length > 10) parts.push(d.slice(10, 14));
  return parts.join(" ");
}

export default function ScanPrmPage() {
  const router = useRouter();
  const setPendingSource = useJourneyStore((s) => s.setPendingSource);
  const setPendingFile = useJourneyStore((s) => s.setPendingFile);
  const setPendingPrm = useJourneyStore((s) => s.setPendingPrm);
  const setComparison = useJourneyStore((s) => s.setComparison);
  const setSwitchState = useJourneyStore((s) => s.setSwitchState);

  const [manualValue, setManualValue] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const inputCameraRef = useRef<HTMLInputElement>(null);
  const inputUploadRef = useRef<HTMLInputElement>(null);

  const display = useMemo(() => formatPrm(manualValue), [manualValue]);
  const count = manualValue.length;
  const isManualValid = count === 14;

  const launchAnalysis = (prm: string) => {
    setComparison(null);
    setSwitchState(null);
    setPendingFile(null);
    setPendingSource("enedis");
    setPendingPrm(prm);
    router.push("/analyzing");
  };

  const handleManualSubmit = () => {
    if (isManualValid) launchAnalysis(manualValue);
  };

  const handlePhotoSelected = async (file: File) => {
    if (isUploading) return;
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const response = await fetch("/api/ocr-prm", {
        method: "POST",
        body: form,
      });
      const payload = await response.json();
      if (!response.ok) {
        const message =
          typeof payload?.error === "string"
            ? payload.error
            : typeof payload?.detail === "string"
            ? payload.detail
            : "Le PRM n'a pas pu être lu sur la photo.";
        throw new Error(message);
      }
      const prm = String(payload?.prm ?? "");
      if (!/^\d{14}$/.test(prm)) {
        throw new Error("Le service OCR n'a pas renvoyé un PRM valide.");
      }
      // Pré-remplit le champ pour que l'utilisateur puisse vérifier / corriger
      // avant de lancer (l'OCR peut se tromper d'un chiffre sur les écrans
      // LCD à reflets — vérification humaine cheap insurance).
      setManualValue(prm);
      toast.success("PRM détecté — vérifie le numéro avant de lancer.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Échec de la lecture du PRM.";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // permettre re-upload du même fichier
    if (file) void handlePhotoSelected(file);
  };

  return (
    <main className="min-h-screen w-full bg-white">
      <header className="sticky top-0 z-20 w-full bg-white pt-safe">
        <div className="mx-auto flex w-full max-w-[430px] items-center gap-3 px-6 py-4">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Retour"
            className="-ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#0a1628] transition-colors hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
          </button>
          <span className="flex-1 text-center text-sm font-medium text-[#5a6b80]">
            Connexion compteur
          </span>
          <span className="-mr-2 h-10 w-10 shrink-0" aria-hidden />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[430px] flex-col px-6 pb-10">
        <div className="mt-4">
          <MascotBubble
            gecko="/mascot/Scan-PRM.svg"
            size={72}
            message="Photographie ton compteur Linky (écran avec « N° PRM ») ou ta facture EDF — je lis les 14 chiffres pour toi. Tu peux aussi les saisir à la main."
          />
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-[#0a1628]">
          Connecte ton compteur
        </h1>

        <div className="mt-6 flex flex-col gap-3">
          <ActionCard
            icon={<Camera className="h-6 w-6 text-[#1e40af]" strokeWidth={2} />}
            title="Prendre en photo"
            subtitle="Ouvre l'appareil photo de ton téléphone"
            disabled={isUploading}
            onClick={() => inputCameraRef.current?.click()}
          />
          <ActionCard
            icon={<ImagePlus className="h-6 w-6 text-[#1e40af]" strokeWidth={2} />}
            title="Importer une photo"
            subtitle="Choisis depuis ta galerie ou tes fichiers"
            disabled={isUploading}
            onClick={() => inputUploadRef.current?.click()}
          />
        </div>

        {isUploading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#1e40af]">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Lecture du numéro PRM en cours…</span>
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[rgba(10,22,40,0.08)]" />
          <span className="text-xs text-[#5a6b80]">ou saisie manuelle</span>
          <div className="h-px flex-1 bg-[rgba(10,22,40,0.08)]" />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="prm" className="text-sm font-medium text-[#0a1628]">
              Numéro PRM
            </label>
            <span
              className="text-xs font-medium tabular-nums transition-colors"
              style={{ color: count === 14 ? "#1e40af" : "#5a6b80" }}
            >
              {count}/14
            </span>
          </div>
          <Input
            id="prm"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Ex : 12345678901234"
            maxLength={17}
            value={display}
            disabled={isUploading}
            onChange={(e) =>
              setManualValue(e.target.value.replace(/\D/g, "").slice(0, 14))
            }
            className="h-14 rounded-2xl border-[rgba(10,22,40,0.08)] bg-white text-base tracking-wider"
          />

          <Button
            type="button"
            onClick={handleManualSubmit}
            disabled={!isManualValid || isUploading}
            className="mt-3 h-14 w-full rounded-2xl bg-[#1e40af] text-base font-medium text-white shadow-none hover:bg-[#1e3a8a] disabled:opacity-40"
          >
            Lancer l&apos;analyse
          </Button>

          <button
            type="button"
            onClick={() => !isUploading && launchAnalysis(DEMO_PRM)}
            disabled={isUploading}
            className="mt-2 self-center text-xs font-medium text-[#1e40af] hover:underline disabled:opacity-40"
          >
            Utiliser le PRM de démo
          </button>
        </div>

        <input
          ref={inputCameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={inputUploadRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </main>
  );
}

function ActionCard({
  icon,
  title,
  subtitle,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
      style={{
        border: "1px solid rgba(10, 22, 40, 0.08)",
        boxShadow: "0 1px 2px rgba(10,22,40,0.04)",
        minHeight: 80,
      }}
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
        style={{ background: "#dbeafe" }}
      >
        {icon}
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-base font-medium text-[#0a1628]">{title}</span>
        <span className="text-xs text-[#5a6b80]">{subtitle}</span>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-[#5a6b80]" />
    </button>
  );
}
