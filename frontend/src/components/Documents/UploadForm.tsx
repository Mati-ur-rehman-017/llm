export function UploadForm() {
  return (
    <div className="relative rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-500">Coming Soon</p>
          <p className="mt-1 text-sm text-gray-400">
            Document upload will be available in a future update.
          </p>
        </div>
      </div>

      <div className="pointer-events-none opacity-40">
        <p className="text-4xl">📁</p>
        <p className="mt-2 text-sm font-medium text-gray-600">
          Drag & drop files here, or click to browse
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Supports JSON, CSV, XLSX, and text files
        </p>
      </div>
    </div>
  );
}
