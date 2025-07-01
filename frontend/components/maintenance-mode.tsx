import { ShieldOff } from 'lucide-react';

export default function MaintenanceMode() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-blue-100 to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-blue-950">
      <div className="flex flex-col items-center space-y-6 p-8 rounded-xl shadow-xl bg-white/90 dark:bg-slate-900/90 border border-gray-200 dark:border-slate-800">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2">
          <ShieldOff className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">We'll Be Back Soon!</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-md">
          Our site is currently undergoing scheduled maintenance.<br />
          We appreciate your patience and will be back online shortly.
        </p>
        <div className="mt-4">
          <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow">Maintenance Mode</span>
        </div>
      </div>
    </div>
  );
} 