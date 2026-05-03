import { useState } from "react";
import { DetailPanel } from "./components/DetailPanel";
import { QueuePanel } from "./components/QueuePanel";

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-background">
      {/* Left: queue */}
      <div className="w-80 shrink-0 flex flex-col">
        <header className="px-4 py-3 border-b border-border bg-card">
          <h1 className="text-base font-semibold">Reviewer Queue</h1>
          <p className="text-xs text-muted-foreground">Reviewing as <strong>alex</strong></p>
        </header>
        <div className="flex-1 overflow-hidden">
          <QueuePanel selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </div>

      {/* Right: detail */}
      <main className="flex-1 overflow-hidden border-l border-border">
        <DetailPanel selectedId={selectedId} />
      </main>
    </div>
  );
}
