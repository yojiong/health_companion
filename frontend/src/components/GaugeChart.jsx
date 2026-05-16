const GaugeChart = ({ value, max, min, label, unit, color }) => {
  const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const angle = percentage * 180;

  const getColor = () => {
    if (percentage < 0.3) return '#ef4444';
    if (percentage < 0.7) return '#eab308';
    return color || '#10b981';
  };

  return (
    <div className="glass rounded-2xl p-6 flex flex-col items-center">
      <div className="relative w-40 h-20 overflow-hidden">
        <svg className="w-40 h-40 -translate-y-10" viewBox="0 0 100 50">
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 126} 126`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">{value}</span>
          <span className="text-sm text-gray-400 ml-1">{unit}</span>
        </div>
      </div>
      <h3 className="text-gray-400 text-sm mt-2">{label}</h3>
    </div>
  );
};

export default GaugeChart;