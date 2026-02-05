import { acrylic } from "@/lib/shared";
import { DaySnapshot } from "@/lib/types";

interface Props {
  snapshot: DaySnapshot;
}

export function DailySnapshotCard({ snapshot }: Props) {
  return (
    <section className={`${acrylic} rounded-2xl p-4`}>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-semibold text-indigo-900">
            {snapshot.completedCount}
          </p>
          <p className="text-sm text-indigo-700/70">Completed</p>
        </div>

        <div>
          <p className="text-2xl font-semibold text-indigo-900">
            {"▮".repeat(snapshot.energy)}
            {"▯".repeat(5 - snapshot.energy)}
          </p>
          <p className="text-sm text-indigo-700/70">Energy</p>
        </div>

        <div>
          <p className="text-sm font-medium text-indigo-900">
            ⭐ {snapshot.highlight ?? "—"}
          </p>
          <p className="text-sm text-indigo-700/70">Highlight</p>
        </div>
      </div>
    </section>
  );
}
