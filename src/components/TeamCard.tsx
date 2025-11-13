import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Team } from "@/types/football";
import Icon from "@/components/ui/icon";

interface TeamCardProps {
  team: Team;
  onClick?: () => void;
}

export const TeamCard = ({ team, onClick }: TeamCardProps) => {
  const goalDiff = team.goalsFor - team.goalsAgainst;
  
  return (
    <Card 
      className="hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={onClick}
    >
      <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
              <img src={team.logo} alt={team.name} className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{team.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Icon name="Trophy" size={14} />
                {team.points} очков
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            #{team.id}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted/50 rounded-lg p-2">
            <div className="text-2xl font-bold text-primary">{team.wins}</div>
            <div className="text-xs text-muted-foreground">Победы</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-2">
            <div className="text-2xl font-bold text-secondary">{team.draws}</div>
            <div className="text-xs text-muted-foreground">Ничьи</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-2">
            <div className="text-2xl font-bold text-destructive">{team.losses}</div>
            <div className="text-xs text-muted-foreground">Поражения</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm pt-2 border-t">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Icon name="Target" size={16} />
            <span>{team.goalsFor}:{team.goalsAgainst}</span>
          </div>
          <div className={`font-semibold ${goalDiff > 0 ? 'text-primary' : goalDiff < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
            {goalDiff > 0 ? '+' : ''}{goalDiff}
          </div>
        </div>
        
        <div className="space-y-1 text-xs text-muted-foreground pt-2">
          <div className="flex items-center gap-2">
            <Icon name="User" size={14} />
            <span>Тренер: {team.coach}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Building" size={14} />
            <span>Стадион: {team.stadium}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
