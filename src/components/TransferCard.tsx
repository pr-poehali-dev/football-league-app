import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Transfer } from "@/types/football";
import Icon from "@/components/ui/icon";

interface TransferCardProps {
  transfer: Transfer;
}

const statusColors = {
  pending: "bg-yellow-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500"
};

const statusLabels = {
  pending: "В процессе",
  completed: "Завершён",
  cancelled: "Отменён"
};

export const TransferCard = ({ transfer }: TransferCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-accent to-primary" />
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-xs">
            {new Date(transfer.date).toLocaleDateString('ru-RU')}
          </Badge>
          <Badge className={statusColors[transfer.status]}>
            {statusLabels[transfer.status]}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-2 mb-2">
              <span className="font-semibold">{transfer.fromTeamName}</span>
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <img src={transfer.fromTeamLogo} alt={transfer.fromTeamName} className="w-8 h-8 object-contain" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 px-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-muted border-2 border-primary">
              <img src={transfer.playerPhoto} alt={transfer.playerName} className="w-full h-full object-cover" />
            </div>
            <Icon name="MoveRight" size={24} className="text-primary" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <img src={transfer.toTeamLogo} alt={transfer.toTeamName} className="w-8 h-8 object-contain" />
              </div>
              <span className="font-semibold">{transfer.toTeamName}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="font-bold text-lg">{transfer.playerName}</p>
          {transfer.fee && (
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
              <Icon name="DollarSign" size={14} />
              {transfer.fee}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
