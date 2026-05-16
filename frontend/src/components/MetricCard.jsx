import { Activity, Heart, Droplets, Footprints, Thermometer, Moon } from 'lucide-react';

const MetricCard = ({ title, value, unit, icon, color, trend }) => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'heart':
        return <Heart className="w-6 h-6" />;
      case 'droplet':
        return <Droplets className="w-6 h-6" />;
      case 'footprints':
        return <Footprints className="w-6 h-6" />;
      case 'thermometer':
        return <Thermometer className="w-6 h-6" />;
      case 'moon':
        return <Moon className="w-6 h-6" />;
      default:
        return <Activity className="w-6 h-6" />;
    }
  };

  const colorClasses = {
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
  };

  return (
    <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color] || colorClasses.blue}`}>
          {getIcon(icon)}
        </div>
        {trend && (
          <span className={`text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <div className="flex items-baseline space-x-1">
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className="text-gray-400 text-sm">{unit}</span>
      </div>
    </div>
  );
};

export default MetricCard;