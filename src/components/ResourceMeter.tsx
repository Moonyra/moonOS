export default function ResourceMeter({ label, value }: { label: string; value: number }) {
  return (
    <div className="hidden w-20 sm:block">
    <div className="mb-1 flex justify-between font-mono text-sm">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-black/10">
        <div className="h-full rounded-full bg-[#8b5fbf] transition-[width] duration-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
