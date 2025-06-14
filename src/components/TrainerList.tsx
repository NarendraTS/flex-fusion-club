
// Trainer roster (React + Tailwind)
import React from "react";
export default function TrainerList({ trainers }: { trainers: any[] }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Trainers</h2>
      <ul>
        {trainers.map((t) => (
          <li key={t.id} className="border-b p-2">{t.name} — {t.email}</li>
        ))}
      </ul>
    </div>
  );
}
