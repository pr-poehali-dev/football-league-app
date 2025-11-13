import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Player } from "@/types/football";
import Icon from "@/components/ui/icon";

interface PlayerCardProps {
  player: Player;
  onClick?: () => void;
}

export const PlayerCard = ({ player, onClick }: PlayerCardProps) => {
  return (
    <Card 
      className="hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={onClick}
    >
      <div className="h-2 bg-gradient-to-r from-accent via-primary to-secondary" />
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted group-hover:scale-105 transition-transform">
              <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
            </div>
            <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-bold">
              #{player.number}
            </Badge>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">{player.name}</h3>
            <p className="text-sm text-muted-foreground">{player.position}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {player.age} лет
              </Badge>
              <span className="text-xs text-muted-foreground">{player.nationality}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Icon name="Goal" size={16} className="text-primary" />
            </div>
            <div className="text-xl font-bold">{player.goals}</div>
            <div className="text-xs text-muted-foreground">Голы</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Icon name="Hand" size={16} className="text-secondary" />
            </div>
            <div className="text-xl font-bold">{player.assists}</div>
            <div className="text-xs text-muted-foreground">Передачи</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Icon name="Activity" size={16} className="text-accent" />
            </div>
            <div className="text-xl font-bold">{player.matches}</div>
            <div className="text-xs text-muted-foreground">Матчи</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
