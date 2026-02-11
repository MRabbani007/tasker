import { cn } from "@/lib/utils";

export function AppPreferences() {
  return (
    <div className="flex-1 space-y-8">
      <div>
        <h3 className="text-lg font-bold text-slate-800">App Preferences</h3>
        <p className="text-sm text-slate-500">
          Customize how your task manager behaves.
        </p>
      </div>

      <div className="space-y-6">
        {/* Toggle Example */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">Compact Mode</p>
            <p className="text-xs text-slate-500">
              Show more tasks on the screen at once.
            </p>
          </div>
          <button className="w-11 h-6 bg-slate-200 rounded-full relative transition-colors hover:bg-slate-300">
            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
          </button>
        </div>

        {/* Note Color Default */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Default Note Color
          </label>
          <div className="flex gap-3">
            {[
              "bg-amber-100",
              "bg-rose-100",
              "bg-indigo-100",
              "bg-emerald-100",
            ].map((color) => (
              <button
                key={color}
                className={cn(
                  "w-8 h-8 rounded-full border-2 border-white ring-2 ring-transparent hover:ring-slate-200 transition-all",
                  color,
                )}
              />
            ))}
          </div>
        </div>

        {/* Keyboard Shortcuts Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Keyboard Shortcuts
            </p>
            <p className="text-xs text-slate-500">
              Enable &quot;CMD + K&quot; for quick capture.
            </p>
          </div>
          <button className="w-11 h-6 bg-indigo-600 rounded-full relative">
            <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
          </button>
        </div>
      </div>
    </div>
  );
}
