"use client";

type ProviderLogoProps = {
  name: string;
  size?: number;
};

const PROVIDER_PALETTE: Record<string, { bg: string; fg: string }> = {
  EDF: { bg: "#1a3a8a", fg: "#ffffff" },
  TotalEnergies: { bg: "#ed1c24", fg: "#ffffff" },
  "Total Energies": { bg: "#ed1c24", fg: "#ffffff" },
  Engie: { bg: "#0099cc", fg: "#ffffff" },
  "Primeo Energie": { bg: "#0a5cad", fg: "#ffffff" },
  "la bellenergie": { bg: "#10b981", fg: "#ffffff" },
  "La Bellenergie": { bg: "#10b981", fg: "#ffffff" },
  Enercoop: { bg: "#7cb342", fg: "#ffffff" },
  "Mint Energie": { bg: "#22c55e", fg: "#ffffff" },
  "Octopus Energy": { bg: "#290845", fg: "#ffffff" },
  "Vattenfall": { bg: "#ffd900", fg: "#0a1628" },
  "Eni": { bg: "#fcd116", fg: "#0a1628" },
  "Plüm Énergie": { bg: "#1e40af", fg: "#ffffff" },
  "Alpiq": { bg: "#e30613", fg: "#ffffff" },
  "Ohm Énergie": { bg: "#7c3aed", fg: "#ffffff" },
  "Ekwateur": { bg: "#0ea5e9", fg: "#ffffff" },
  "Ilek": { bg: "#16a34a", fg: "#ffffff" },
  "Wekiwi": { bg: "#f97316", fg: "#ffffff" },
  "Sowee": { bg: "#fbbf24", fg: "#0a1628" },
  "Happ-e": { bg: "#06b6d4", fg: "#ffffff" },
};

const DEFAULT_PALETTE = { bg: "#dbeafe", fg: "#1e40af" };

function getInitials(name: string): string {
  const cleaned = name.replace(/[()]/g, "").trim();
  if (/^[A-Z0-9]+$/.test(cleaned)) return cleaned.slice(0, 3);
  return (
    cleaned
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 3) || "?"
  );
}

export function ProviderLogo({ name, size = 40 }: ProviderLogoProps) {
  const palette = PROVIDER_PALETTE[name] ?? DEFAULT_PALETTE;
  const initials = getInitials(name);

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold tabular-nums"
      style={{
        width: size,
        height: size,
        backgroundColor: palette.bg,
        color: palette.fg,
        fontSize: Math.max(10, size * 0.32),
        letterSpacing: "0.02em",
      }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}

export default ProviderLogo;
