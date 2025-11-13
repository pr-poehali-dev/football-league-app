import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";

interface WMFLImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tournamentId: string;
  setTournamentId: (id: string) => void;
  onImport: () => void;
  importing: boolean;
}

export const WMFLImportDialog = ({
  isOpen,
  onOpenChange,
  tournamentId,
  setTournamentId,
  onImport,
  importing,
}: WMFLImportDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Icon name="Download" size={18} className="mr-2" />
          Импорт из WMFL
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Импорт команд из турнира WMFL</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="tournament_id">ID турнира</Label>
            <Input
              id="tournament_id"
              value={tournamentId}
              onChange={(e) => setTournamentId(e.target.value)}
              placeholder="1056456"
            />
            <p className="text-xs text-muted-foreground mt-1">
              ID можно найти в URL турнира: wmfl.ru/tournament/[ID]/...
            </p>
          </div>
          <Button
            onClick={onImport}
            disabled={importing || !tournamentId}
            className="w-full"
          >
            {importing ? (
              <>
                <Icon name="Loader2" className="animate-spin mr-2" size={16} />
                Импортирую...
              </>
            ) : (
              <>
                <Icon name="Download" size={16} className="mr-2" />
                Импортировать
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
