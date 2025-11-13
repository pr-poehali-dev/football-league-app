import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface WMFLTeam {
  id: number;
  team_id?: number;
  team_name: string;
  team_short_name?: string;
  team_logo?: string;
  city?: string;
  stadium?: string;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  rating: number;
  position?: number;
  form?: string;
  streak?: string;
  home_wins: number;
  home_draws: number;
  home_losses: number;
  away_wins: number;
  away_draws: number;
  away_losses: number;
  yellow_cards: number;
  red_cards: number;
  season?: string;
  is_active: boolean;
}

interface WMFLTeamCardProps {
  team: WMFLTeam;
  index: number;
  onEdit: (team: WMFLTeam) => void;
  onDelete: (teamId: number) => void;
}

export const WMFLTeamCard = ({ team, index, onEdit, onDelete }: WMFLTeamCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full font-bold text-xl">
              {index + 1}
            </div>
            <div>
              <CardTitle className="text-xl">{team.team_name}</CardTitle>
              {team.city && (
                <p className="text-sm text-muted-foreground">{team.city}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(team)}
            >
              <Icon name="Edit" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(team.team_id || team.id)}
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Рейтинг</p>
            <p className="text-2xl font-bold text-primary">{team.rating}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Очки</p>
            <p className="text-2xl font-bold">{team.points}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Матчи</p>
            <p className="text-lg">
              {team.wins}-{team.draws}-{team.losses}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Голы</p>
            <p className="text-lg">
              {team.goals_for}:{team.goals_against}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Разница</p>
            <p
              className={`text-lg font-semibold ${
                team.goal_difference > 0
                  ? "text-green-600"
                  : team.goal_difference < 0
                  ? "text-red-600"
                  : ""
              }`}
            >
              {team.goal_difference > 0 ? "+" : ""}
              {team.goal_difference}
            </p>
          </div>
        </div>
        {team.form && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Форма:</span>
            <div className="flex gap-1">
              {team.form.split("").map((result, i) => (
                <span
                  key={i}
                  className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${
                    result === "В"
                      ? "bg-green-500 text-white"
                      : result === "Н"
                      ? "bg-gray-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {result}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
