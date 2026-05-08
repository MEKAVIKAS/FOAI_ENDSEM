import useAppStore from "../../store/appStore";

const Footer = () => {
  const lastSynced = useAppStore((state) => state.lastSynced);

  return (
    <footer className="mt-10 border-t border-slate-700/30 py-6 text-sm text-gray-500 dark:text-gray-400">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span>ISS + AI News Intelligence Dashboard</span>
        <span>
          Last synced:{" "}
          {lastSynced ? new Date(lastSynced).toLocaleString() : "Waiting for first update"}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
