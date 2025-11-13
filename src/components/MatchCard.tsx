import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Match } from "@/types/football";
import Icon from "@/components/ui/icon";

interface MatchCardProps {
  match: Match;
}

const statusLabels = {
  scheduled: "Запланирован",
  live: "В прямом эфире",
  finished: "Завершён"
};

const statusColors = {
  scheduled: "bg-secondary",
  live: "bg-accent animate-pulse",
  finished: "bg-muted"
};

export const MatchCard = ({ match }: MatchCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-xs">
            {new Date(match.date).toLocaleDateString('ru-RU')} • {match.time}
          </Badge>
          <Badge className={statusColors[match.status]}>
            {match.status === 'live' && <Icon name="Radio" size={12} className="mr-1" />}
            {statusLabels[match.status]}
          </Badge>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-3">
              <div>
                <h3 className="font-bold text-lg">{match.homeTeam.name}</h3>
                <p className="text-xs text-muted-foreground">Хозяева</p>
              </div>
              <img 
                src={match.homeTeam.logo} 
                alt={match.homeTeam.name}
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 px-6">
            {match.status === 'finished' || match.status === 'live' ? (
              <div className="flex items-center gap-3 text-4xl font-bold">
                <span className={match.homeScore! > match.awayScore! ? 'text-primary' : ''}>
                  {match.homeScore}
                </span>
                <span className="text-muted-foreground">:</span>
                <span className={match.awayScore! > match.homeScore! ? 'text-primary' : ''}>
                  {match.awayScore}
                </span>
              </div>
            ) : (
              <div className="text-2xl font-bold text-muted-foreground">VS</div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <img 
                src={match.awayTeam.logo} 
                alt={match.awayTeam.name}
                className="w-16 h-16 object-contain"
              />
              <div>
                <h3 className="font-bold text-lg">{match.awayTeam.name}</h3>
                <p className="text-xs text-muted-foreground">Гости</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Icon name="Building" size={16} />
          <span>{match.stadium}</span>
        </div>
      </CardContent>
    </Card>
  );
};
