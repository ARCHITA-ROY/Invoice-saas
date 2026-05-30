type Props = {
  title: string;
  description: string;
};

const EmptyState = ({ title, description }: Props) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="text-sm text-zinc-500 mt-2">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;