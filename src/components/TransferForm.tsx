import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Player, Team } from "@/types/football";
import Icon from "@/components/ui/icon";

interface TransferFormProps {
  players: Player[];
  teams: Team[];
  onSubmit: (transfer: {
    playerId: string;
    toTeamId: string;
    fee: string;
  }) => void;
}

export const TransferForm = ({ players, teams, onSubmit }: TransferFormProps) => {
  const [open, setOpen] = useState(false);
  const [playerId, setPlayerId] = useState("");
  const [toTeamId, setToTeamId] = useState("");
  const [fee, setFee] = useState("");

  const handleSubmit = () => {
    if (playerId && toTeamId) {
      onSubmit({ playerId, toTeamId, fee });
      setOpen(false);
      setPlayerId("");
      setToTeamId("");
      setFee("");
    }
  };

  const selectedPlayer = players.find(p => p.id === playerId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Icon name="MoveRight" size={18} />
          Оформить трансфер
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Новый трансфер</DialogTitle>
          <DialogDescription>
            Выберите игрока и команду для оформления трансфера
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Игрок</Label>
            <Select value={playerId} onValueChange={setPlayerId}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите игрока" />
              </SelectTrigger>
              <SelectContent>
                {players.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">#{player.number}</span>
                      <span>{player.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({player.position})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPlayer && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedPlayer.photo} 
                  alt={selectedPlayer.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold">{selectedPlayer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Текущая команда: {teams.find(t => t.id === selectedPlayer.teamId)?.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Новая команда</Label>
            <Select value={toTeamId} onValueChange={setToTeamId}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите команду" />
              </SelectTrigger>
              <SelectContent>
                {teams
                  .filter(team => team.id !== selectedPlayer?.teamId)
                  .map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      <div className="flex items-center gap-2">
                        <img 
                          src={team.logo} 
                          alt={team.name}
                          className="w-5 h-5 object-contain"
                        />
                        <span>{team.name}</span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Сумма трансфера</Label>
            <Input
              placeholder="Например: 10 млн €"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={!playerId || !toTeamId}>
            Оформить трансфер
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
