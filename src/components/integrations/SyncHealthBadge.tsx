import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface SyncHealthBadgeProps {
  lastSyncAt: string | null;
  lastSyncStatus: string | null;
  lastSyncError: string | null;
  onReauthClick?: () => void;
}

const SyncHealthBadge = ({ lastSyncAt, lastSyncStatus, lastSyncError, onReauthClick }: SyncHealthBadgeProps) => {
  const { t, i18n } = useTranslation();
  const isFr = i18n.language === "fr";

  if (!lastSyncAt || lastSyncStatus === "never" || lastSyncStatus === "pending") {
    return (
      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 inline-block" />
        {t('integrations.health.notSynced', 'Not yet synced')}
      </span>
    );
  }

  const syncDate = new Date(lastSyncAt);
  const minutesAgo = Math.floor((Date.now() - syncDate.getTime()) / 60000);
  const timeLabel = formatDistanceToNow(syncDate, { addSuffix: true, locale: isFr ? fr : undefined });

  if (lastSyncStatus === "error") {
    return (
      <button
        type="button"
        onClick={onReauthClick}
        className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 underline underline-offset-2"
        title={lastSyncError ?? "Sync error"}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
        {t('integrations.health.error', 'Sync error — Re-authenticate')}
      </button>
    );
  }

  if (minutesAgo > 60) {
    return (
      <span className="text-[10px] text-yellow-400 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />
        {t('integrations.health.synced', 'Synced')} {timeLabel}
      </span>
    );
  }

  return (
    <span className="text-[10px] text-green-400 flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
      {t('integrations.health.synced', 'Synced')} {timeLabel}
    </span>
  );
};

export default SyncHealthBadge;
