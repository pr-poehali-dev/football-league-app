import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";

const SYNC_URL = "https://functions.poehali.dev/9ac10abe-a2aa-49ea-9f85-c0d89d2bb5a7";

interface SyncLog {
  id: number;
  tournament_id: number;
  sync_time: string;
  status: string;
  message: string;
  teams_updated: number;
}

interface WMFLSyncPanelProps {
  onSyncComplete?: () => void;
}

export const WMFLSyncPanel = ({ onSyncComplete }: WMFLSyncPanelProps) => {
  const [syncing, setSyncing] = useState(false);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      console.log("Fetching sync logs...");
      const response = await fetch(SYNC_URL);
      console.log("Logs response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to fetch logs:", errorData);
        throw new Error(errorData.message || "Failed to fetch logs");
      }
      
      const data = await response.json();
      console.log("Logs data:", data);
      setLogs(data.logs || []);
    } catch (error) {
      console.error("Error fetching sync logs:", error);
      toast.error("Не удалось загрузить историю синхронизации");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSync = async () => {
    try {
      setSyncing(true);
      console.log("Starting sync...");
      
      const response = await fetch(SYNC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      console.log("Sync response status:", response.status);
      const result = await response.json();
      console.log("Sync result:", result);

      if (!response.ok) {
        toast.error(`Ошибка ${response.status}: ${result.message || result.error || "Неизвестная ошибка"}`);
        return;
      }
      
      if (result.success) {
        toast.success(result.message || "Синхронизация завершена");
        fetchLogs();
        if (onSyncComplete) onSyncComplete();
      } else {
        toast.warning(result.message || "Синхронизация не выполнена");
      }
    } catch (error) {
      console.error("Sync error:", error);
      toast.error(`Ошибка синхронизации: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Icon name="RefreshCw" size={24} />
              Автоматическая синхронизация
            </CardTitle>
            <Button onClick={handleSync} disabled={syncing}>
              {syncing ? (
                <>
                  <Icon name="Loader2" className="animate-spin mr-2" size={16} />
                  Синхронизация...
                </>
              ) : (
                <>
                  <Icon name="RefreshCw" size={16} className="mr-2" />
                  Синхронизировать сейчас
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Обновляет позиции команд в турнирной таблице на основе текущей статистики.
            Пересчитывает очки и разницу мячей для всех активных турниров.
          </p>
        </CardContent>
      </Card>

      {!loading && logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="History" size={20} />
              История синхронизации
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {logs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      name={
                        log.status === "success"
                          ? "CheckCircle"
                          : log.status === "error"
                          ? "XCircle"
                          : "AlertCircle"
                      }
                      size={20}
                      className={
                        log.status === "success"
                          ? "text-green-600"
                          : log.status === "error"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }
                    />
                    <div>
                      <p className="text-sm font-medium">{log.message}</p>
                      <p className="text-xs text-muted-foreground">
                        Турнир #{log.tournament_id} •{" "}
                        {new Date(log.sync_time).toLocaleString("ru-RU")}
                      </p>
                    </div>
                  </div>
                  {log.teams_updated > 0 && (
                    <span className="text-sm font-semibold text-primary">
                      {log.teams_updated} команд
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};