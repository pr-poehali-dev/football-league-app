import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Team } from "@/types/football";
import Icon from "@/components/ui/icon";

interface PlayerRegistrationFormProps {
  teams: Team[];
  onSubmit: (player: {
    name: string;
    position: string;
    number: number;
    age: number;
    nationality: string;
    teamId: string;
  }) => void;
}

const positions = [
  "Вратарь",
  "Защитник",
  "Полузащитник",
  "Нападающий"
];

export const PlayerRegistrationForm = ({ teams, onSubmit }: PlayerRegistrationFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    number: "",
    age: "",
    nationality: "",
    teamId: ""
  });

  const handleSubmit = () => {
    if (formData.name && formData.position && formData.number && formData.age && formData.nationality && formData.teamId) {
      onSubmit({
        name: formData.name,
        position: formData.position,
        number: parseInt(formData.number),
        age: parseInt(formData.age),
        nationality: formData.nationality,
        teamId: formData.teamId
      });
      setOpen(false);
      setFormData({
        name: "",
        position: "",
        number: "",
        age: "",
        nationality: "",
        teamId: ""
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" variant="secondary">
          <Icon name="UserPlus" size={18} />
          Дозаявка игрока
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Дозаявка игрока</DialogTitle>
          <DialogDescription>
            Заполните данные для регистрации нового игрока в команде
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>ФИО игрока</Label>
            <Input
              placeholder="Введите полное имя"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Позиция</Label>
              <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Номер</Label>
              <Input
                type="number"
                placeholder="1-99"
                min="1"
                max="99"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Возраст</Label>
              <Input
                type="number"
                placeholder="Лет"
                min="16"
                max="50"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Гражданство</Label>
              <Input
                placeholder="Страна"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Команда</Label>
            <Select value={formData.teamId} onValueChange={(value) => setFormData({ ...formData, teamId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите команду" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    <div className="flex items-center gap-2">
                      <img 
                        src={team.logo} 
                        alt={team.name}
                        className="w-5 h-5 object-contain"
                      />
                      <span>{team.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.name || !formData.position || !formData.number || !formData.age || !formData.nationality || !formData.teamId}
          >
            Зарегистрировать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
