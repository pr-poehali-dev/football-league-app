import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamCard } from "@/components/TeamCard";
import { PlayerCard } from "@/components/PlayerCard";
import { TransferCard } from "@/components/TransferCard";
import { StandingsTable } from "@/components/StandingsTable";
import { MatchCard } from "@/components/MatchCard";
import { NewsCard } from "@/components/NewsCard";
import { NotificationBell } from "@/components/NotificationBell";
import { TransferForm } from "@/components/TransferForm";
import { PlayerRegistrationForm } from "@/components/PlayerRegistrationForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";
import {
  mockTeams,
  mockPlayers,
  mockTransfers,
  mockMatches,
  mockNews,
  mockNotifications
} from "@/data/mockData";
import { Notification, Player } from "@/types/football";

const Index = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [transfers, setTransfers] = useState(mockTransfers);
  const [players, setPlayers] = useState<Player[]>(mockPlayers);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success("Все уведомления удалены");
  };

  const handleTransferSubmit = (transferData: { playerId: string; toTeamId: string; fee: string }) => {
    const player = players.find(p => p.id === transferData.playerId);
    const fromTeam = mockTeams.find(t => t.id === player?.teamId);
    const toTeam = mockTeams.find(t => t.id === transferData.toTeamId);

    if (player && fromTeam && toTeam) {
      const newTransfer = {
        id: String(transfers.length + 1),
        playerId: player.id,
        playerName: player.name,
        playerPhoto: player.photo,
        fromTeamId: fromTeam.id,
        fromTeamName: fromTeam.name,
        fromTeamLogo: fromTeam.logo,
        toTeamId: toTeam.id,
        toTeamName: toTeam.name,
        toTeamLogo: toTeam.logo,
        date: new Date().toISOString().split('T')[0],
        fee: transferData.fee,
        status: 'pending' as const
      };

      setTransfers(prev => [newTransfer, ...prev]);

      const newNotification: Notification = {
        id: String(notifications.length + 1),
        type: 'transfer',
        title: 'Новый трансфер',
        message: `${player.name} переходит из ${fromTeam.name} в ${toTeam.name}`,
        timestamp: new Date().toISOString(),
        read: false
      };

      setNotifications(prev => [newNotification, ...prev]);
      toast.success("Трансфер успешно оформлен!");
    }
  };

  const handlePlayerRegistration = (playerData: {
    name: string;
    position: string;
    number: number;
    age: number;
    nationality: string;
    teamId: string;
  }) => {
    const newPlayer: Player = {
      id: String(players.length + 1),
      ...playerData,
      photo: "https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/97c5a67b-f9fa-4f50-bd48-a98809099cf8.jpg",
      goals: 0,
      assists: 0,
      matches: 0
    };

    setPlayers(prev => [...prev, newPlayer]);

    const team = mockTeams.find(t => t.id === playerData.teamId);
    if (team) {
      const newNotification: Notification = {
        id: String(notifications.length + 1),
        type: 'registration',
        title: 'Дозаявка игрока',
        message: `${playerData.name} зарегистрирован в команде ${team.name}`,
        timestamp: new Date().toISOString(),
        read: false
      };

      setNotifications(prev => [newNotification, ...prev]);
      toast.success("Игрок успешно зарегистрирован!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="relative bg-cover bg-center h-64 flex items-center justify-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/b3f1ce52-6bf1-4576-95c8-fc49eca08b5d.jpg)`
        }}
      >
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Icon name="Trophy" size={48} />
            Футбольная Лига
          </h1>
          <p className="text-xl text-gray-200">Управление командами, игроками и трансферами</p>
        </div>
        <div className="absolute top-4 right-4">
          <NotificationBell
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onClearAll={handleClearAll}
          />
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <Tabs defaultValue="teams" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto">
            <TabsTrigger value="teams" className="gap-2">
              <Icon name="Shield" size={16} />
              Команды
            </TabsTrigger>
            <TabsTrigger value="players" className="gap-2">
              <Icon name="Users" size={16} />
              Игроки
            </TabsTrigger>
            <TabsTrigger value="transfers" className="gap-2">
              <Icon name="MoveRight" size={16} />
              Трансферы
            </TabsTrigger>
            <TabsTrigger value="standings" className="gap-2">
              <Icon name="Trophy" size={16} />
              Турнир
            </TabsTrigger>
            <TabsTrigger value="statistics" className="gap-2">
              <Icon name="BarChart" size={16} />
              Статистика
            </TabsTrigger>
            <TabsTrigger value="matches" className="gap-2">
              <Icon name="Calendar" size={16} />
              Календарь
            </TabsTrigger>
            <TabsTrigger value="news" className="gap-2">
              <Icon name="Newspaper" size={16} />
              Новости
            </TabsTrigger>
          </TabsList>

          <TabsContent value="teams" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Команды лиги</h2>
              <Button variant="outline">
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить команду
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTeams.map(team => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="players" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Все игроки</h2>
              <PlayerRegistrationForm teams={mockTeams} onSubmit={handlePlayerRegistration} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {players.map(player => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transfers" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">История трансферов</h2>
              <TransferForm 
                players={players} 
                teams={mockTeams} 
                onSubmit={handleTransferSubmit}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {transfers.map(transfer => (
                <TransferCard key={transfer.id} transfer={transfer} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="standings" className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Турнирная таблица</h2>
            <StandingsTable teams={mockTeams} />
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Статистика</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg border">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Goal" size={24} className="text-primary" />
                  <h3 className="text-lg font-semibold">Лучший бомбардир</h3>
                </div>
                <p className="text-3xl font-bold">{mockPlayers[0].name}</p>
                <p className="text-muted-foreground">{mockPlayers[0].goals} голов</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Hand" size={24} className="text-secondary" />
                  <h3 className="text-lg font-semibold">Лучший ассистент</h3>
                </div>
                <p className="text-3xl font-bold">{mockPlayers[2].name}</p>
                <p className="text-muted-foreground">{mockPlayers[2].assists} передач</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Trophy" size={24} className="text-accent" />
                  <h3 className="text-lg font-semibold">Лидер лиги</h3>
                </div>
                <p className="text-3xl font-bold">{mockTeams[2].name}</p>
                <p className="text-muted-foreground">{mockTeams[2].points} очков</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Календарь матчей</h2>
            <div className="space-y-4">
              {mockMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Последние новости</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockNews.map(news => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
