import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";
import { WMFLTeamCard } from "@/components/wmfl/WMFLTeamCard";
import { WMFLTeamForm } from "@/components/wmfl/WMFLTeamForm";
import { WMFLImportDialog } from "@/components/wmfl/WMFLImportDialog";

const API_URL = "https://functions.poehali.dev/96772adf-c6d7-4f02-ad46-dabfba5927f6";
const IMPORT_URL = "https://functions.poehali.dev/2d831230-a55e-458d-8be8-b879bb2d1090";

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
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [tournamentId, setTournamentId] = useState("1056456");
  const [importing, setImporting] = useState(false);

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

  const handleImport = async () => {
    try {
      setImporting(true);
      const response = await fetch(IMPORT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tournament_id: parseInt(tournamentId) }),
      });

      if (!response.ok) throw new Error("Import failed");

      const result = await response.json();
      
      if (result.success && result.imported_count > 0) {
        toast.success(`Импортировано команд: ${result.imported_count}`);
        setImportDialogOpen(false);
        fetchTeams();
      } else {
        toast.warning(result.message || "Не удалось импортировать команды");
      }
    } catch (error) {
      toast.error("Ошибка импорта. Проверьте ID турнира.");
      console.error(error);
    } finally {
      setImporting(false);
    }
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
        <div className="flex gap-2">
          <WMFLImportDialog
            isOpen={importDialogOpen}
            onOpenChange={setImportDialogOpen}
            tournamentId={tournamentId}
            setTournamentId={setTournamentId}
            onImport={handleImport}
            importing={importing}
          />
          
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
              <WMFLTeamForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
                isEditing={!!editingTeam}
              />
            </DialogContent>
          </Dialog>
        </div>
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
            <WMFLTeamCard
              key={team.id}
              team={team}
              index={index}
              onEdit={openEditDialog}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};
