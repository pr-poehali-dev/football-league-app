import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Team } from "@/types/football";
import Icon from "@/components/ui/icon";

interface StandingsTableProps {
  teams: Team[];
}

export const StandingsTable = ({ teams }: StandingsTableProps) => {
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const goalDiffA = a.goalsFor - a.goalsAgainst;
    const goalDiffB = b.goalsFor - b.goalsAgainst;
    if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
    return b.goalsFor - a.goalsFor;
  });

  const getPositionColor = (index: number) => {
    if (index < 3) return "bg-primary/10 border-l-4 border-l-primary";
    if (index >= sortedTeams.length - 3) return "bg-destructive/10 border-l-4 border-l-destructive";
    return "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Trophy" size={24} className="text-primary" />
          Турнирная таблица
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Команда</TableHead>
              <TableHead className="text-center">И</TableHead>
              <TableHead className="text-center">В</TableHead>
              <TableHead className="text-center">Н</TableHead>
              <TableHead className="text-center">П</TableHead>
              <TableHead className="text-center">Мячи</TableHead>
              <TableHead className="text-center">РМ</TableHead>
              <TableHead className="text-center font-bold">Очки</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTeams.map((team, index) => {
              const goalDiff = team.goalsFor - team.goalsAgainst;
              const totalMatches = team.wins + team.draws + team.losses;
              
              return (
                <TableRow key={team.id} className={getPositionColor(index)}>
                  <TableCell className="font-semibold">
                    {index < 3 ? (
                      <Badge className="bg-primary">{index + 1}</Badge>
                    ) : index >= sortedTeams.length - 3 ? (
                      <Badge variant="destructive">{index + 1}</Badge>
                    ) : (
                      <span className="px-2">{index + 1}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={team.logo} 
                        alt={team.name} 
                        className="w-8 h-8 object-contain"
                      />
                      <span className="font-semibold">{team.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{totalMatches}</TableCell>
                  <TableCell className="text-center text-primary font-semibold">{team.wins}</TableCell>
                  <TableCell className="text-center text-secondary">{team.draws}</TableCell>
                  <TableCell className="text-center text-destructive">{team.losses}</TableCell>
                  <TableCell className="text-center text-sm">
                    {team.goalsFor}:{team.goalsAgainst}
                  </TableCell>
                  <TableCell className={`text-center font-semibold ${
                    goalDiff > 0 ? 'text-primary' : goalDiff < 0 ? 'text-destructive' : ''
                  }`}>
                    {goalDiff > 0 ? '+' : ''}{goalDiff}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-primary font-bold text-base px-3">
                      {team.points}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded" />
            <span>Зона Лиги Чемпионов</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-destructive rounded" />
            <span>Зона вылета</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
