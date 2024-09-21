import React from "react";

interface ResultCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const ResultCard: React.FC<ResultCardProps> = React.memo(
  ({ title, value, icon, color }) => (
    <div className="p-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl shadow hover:shadow-lg transition-shadow">
      <div className={`text-xl font-bold text-gray-800 mb-2`}>
        {icon} {title}
      </div>
      <div className={`text-2xl ${color}`}>{value}</div>
    </div>
  )
);

export default ResultCard;
