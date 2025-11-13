import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TeamFormData {
  team_name: string;
  city: string;
  stadium: string;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  rating: number;
  form: string;
}

interface WMFLTeamFormProps {
  formData: TeamFormData;
  setFormData: (data: TeamFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export const WMFLTeamForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEditing,
}: WMFLTeamFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="team_name">Название команды *</Label>
          <Input
            id="team_name"
            value={formData.team_name}
            onChange={(e) =>
              setFormData({ ...formData, team_name: e.target.value })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="city">Город</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="stadium">Стадион</Label>
          <Input
            id="stadium"
            value={formData.stadium}
            onChange={(e) =>
              setFormData({ ...formData, stadium: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="rating">Рейтинг</Label>
          <Input
            id="rating"
            type="number"
            value={formData.rating}
            onChange={(e) =>
              setFormData({ ...formData, rating: parseInt(e.target.value) })
            }
          />
        </div>
        <div>
          <Label htmlFor="wins">Победы</Label>
          <Input
            id="wins"
            type="number"
            value={formData.wins}
            onChange={(e) =>
              setFormData({ ...formData, wins: parseInt(e.target.value) })
            }
          />
        </div>
        <div>
          <Label htmlFor="draws">Ничьи</Label>
          <Input
            id="draws"
            type="number"
            value={formData.draws}
            onChange={(e) =>
              setFormData({ ...formData, draws: parseInt(e.target.value) })
            }
          />
        </div>
        <div>
          <Label htmlFor="losses">Поражения</Label>
          <Input
            id="losses"
            type="number"
            value={formData.losses}
            onChange={(e) =>
              setFormData({ ...formData, losses: parseInt(e.target.value) })
            }
          />
        </div>
        <div>
          <Label htmlFor="goals_for">Забито голов</Label>
          <Input
            id="goals_for"
            type="number"
            value={formData.goals_for}
            onChange={(e) =>
              setFormData({
                ...formData,
                goals_for: parseInt(e.target.value),
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="goals_against">Пропущено голов</Label>
          <Input
            id="goals_against"
            type="number"
            value={formData.goals_against}
            onChange={(e) =>
              setFormData({
                ...formData,
                goals_against: parseInt(e.target.value),
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="form">Форма (напр: ВВВДП)</Label>
          <Input
            id="form"
            value={formData.form}
            onChange={(e) =>
              setFormData({ ...formData, form: e.target.value })
            }
            maxLength={20}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {isEditing ? "Обновить" : "Добавить"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
};
