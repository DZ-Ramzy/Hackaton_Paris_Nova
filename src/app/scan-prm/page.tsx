"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
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

  const display = useMemo(() => formatPrm(manualValue), [manualValue]);
  const count = manualValue.length;
  const isValid = count === 14;

  const submit = (prm: string) => {
    setComparison(null);
    setSwitchState(null);
    setPendingFile(null);
    setPendingSource("enedis");
    setPendingPrm(prm);
    router.push("/analyzing");
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
            message="Sur ton compteur Linky : appuie sur le bouton + pour faire défiler les écrans, cherche « N° PRM » suivi de 14 chiffres. Tu peux aussi le retrouver sur ta facture EDF, en haut à droite."
          />
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-[#0a1628]">
          Renseigne ton numéro PRM
        </h1>
        <p className="mt-2 text-sm text-[#5a6b80]">
          14 chiffres uniques qui identifient ton compteur Linky.
        </p>

        <div className="mt-6 flex flex-col gap-2">
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
            onChange={(e) =>
              setManualValue(e.target.value.replace(/\D/g, "").slice(0, 14))
            }
            className="h-14 rounded-2xl border-[rgba(10,22,40,0.08)] bg-white text-base tracking-wider"
          />

          <Button
            type="button"
            onClick={() => isValid && submit(manualValue)}
            disabled={!isValid}
            className="mt-3 h-14 w-full rounded-2xl bg-[#1e40af] text-base font-medium text-white shadow-none hover:bg-[#1e3a8a] disabled:opacity-40"
          >
            Lancer l&apos;analyse
          </Button>

          <button
            type="button"
            onClick={() => submit(DEMO_PRM)}
            className="mt-2 self-center text-xs font-medium text-[#1e40af] hover:underline"
          >
            Utiliser le PRM de démo
          </button>
        </div>
      </div>
    </main>
  );
}
