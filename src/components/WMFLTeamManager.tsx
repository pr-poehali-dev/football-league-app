import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";

const API_URL = "https://functions.poehali.dev/96772adf-c6d7-4f02-ad46-dabfba5927f6";

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

export const WMFLTeamManager = () => {
  const [teams, setTeams] = useState<WMFLTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<WMFLTeam | null>(null);

  const [formData, setFormData] = useState({
    team_name: "",
    city: "",
    stadium: "",
    wins: 0,
    draws: 0,
    losses: 0,
    goals_for: 0,
    goals_against: 0,
    rating: 1500,
    form: "",
  });

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch teams");
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      toast.error("Ошибка загрузки команд");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = editingTeam ? "PUT" : "POST";
      const body = editingTeam
        ? { ...formData, team_id: editingTeam.team_id }
        : formData;

      const response = await fetch(API_URL, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to save team");

      toast.success(editingTeam ? "Команда обновлена" : "Команда добавлена");
      setIsDialogOpen(false);
      resetForm();
      fetchTeams();
    } catch (error) {
      toast.error("Ошибка сохранения команды");
      console.error(error);
    }
  };

  const handleDelete = async (teamId: number) => {
    if (!confirm("Удалить команду?")) return;

    try {
      const response = await fetch(`${API_URL}?team_id=${teamId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete team");

      toast.success("Команда удалена");
      fetchTeams();
    } catch (error) {
      toast.error("Ошибка удаления команды");
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      team_name: "",
      city: "",
      stadium: "",
      wins: 0,
      draws: 0,
      losses: 0,
      goals_for: 0,
      goals_against: 0,
      rating: 1500,
      form: "",
    });
    setEditingTeam(null);
  };

  const openEditDialog = (team: WMFLTeam) => {
    setEditingTeam(team);
    setFormData({
      team_name: team.team_name,
      city: team.city || "",
      stadium: team.stadium || "",
      wins: team.wins,
      draws: team.draws,
      losses: team.losses,
      goals_for: team.goals_for,
      goals_against: team.goals_against,
      rating: team.rating,
      form: team.form || "",
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Icon name="Loader2" className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Рейтинг команд WMFL</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить команду
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTeam ? "Редактировать команду" : "Добавить команду"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  {editingTeam ? "Обновить" : "Добавить"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {teams.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <Icon name="Trophy" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Команды не найдены. Добавьте первую команду.</p>
            </CardContent>
          </Card>
        ) : (
          teams.map((team, index) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
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
                      onClick={() => openEditDialog(team)}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(team.team_id || team.id)}
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
          ))
        )}
      </div>
    </div>
  );
};
