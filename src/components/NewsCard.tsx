import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { News } from "@/types/football";
import Icon from "@/components/ui/icon";

interface NewsCardProps {
  news: News;
  onClick?: () => void;
}

const categoryLabels = {
  transfer: "Трансфер",
  match: "Матч",
  team: "Команда",
  player: "Игрок"
};

const categoryColors = {
  transfer: "bg-primary",
  match: "bg-secondary",
  team: "bg-accent",
  player: "bg-muted"
};

const categoryIcons = {
  transfer: "MoveRight",
  match: "Trophy",
  team: "Shield",
  player: "User"
} as const;

export const NewsCard = ({ news, onClick }: NewsCardProps) => {
  return (
    <Card 
      className="hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={news.image} 
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge className={categoryColors[news.category]}>
            <Icon name={categoryIcons[news.category]} size={14} className="mr-1" />
            {categoryLabels[news.category]}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-3">
        <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {news.title}
        </h3>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Icon name="Calendar" size={12} />
          {new Date(news.date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {news.content}
        </p>
      </CardContent>
    </Card>
  );
};
