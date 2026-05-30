type CardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
};

const Card = ({ title, value, subtitle }: CardProps) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <p className="text-sm text-zinc-400">{title}</p>

      <h2 className="text-3xl font-semibold mt-2 text-white">
        {value}
      </h2>

      {subtitle && (
        <p className="text-xs text-zinc-500 mt-2">{subtitle}</p>
      )}
    </div>
  );
};

export default Card;