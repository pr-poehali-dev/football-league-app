import { Team, Player, Transfer, Match, News, Notification } from "@/types/football";

export const mockTeams: Team[] = [
  {
    id: "1",
    name: "Спартак",
    logo: "https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/82bae98c-2edc-4dd1-a8b2-7502bfa6cf7a.jpg",
    founded: 1922,
    stadium: "Открытие Арена",
    coach: "Гиллермо Абаскаль",
    players: [],
    wins: 15,
    draws: 8,
    losses: 7,
    points: 53,
    goalsFor: 48,
    goalsAgainst: 32
  },
  {
    id: "2",
    name: "ЦСКА",
    logo: "https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/82bae98c-2edc-4dd1-a8b2-7502bfa6cf7a.jpg",
    founded: 1911,
    stadium: "ВЭБ Арена",
    coach: "Марко Николич",
    players: [],
    wins: 14,
    draws: 9,
    losses: 7,
    points: 51,
    goalsFor: 45,
    goalsAgainst: 30
  },
  {
    id: "3",
    name: "Зенит",
    logo: "https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/82bae98c-2edc-4dd1-a8b2-7502bfa6cf7a.jpg",
    founded: 1925,
    stadium: "Газпром Арена",
    coach: "Сергей Семак",
    players: [],
    wins: 18,
    draws: 6,
    losses: 6,
    points: 60,
    goalsFor: 55,
    goalsAgainst: 28
  },
  {
    id: "4",
    name: "Динамо",
    logo: "https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/82bae98c-2edc-4dd1-a8b2-7502bfa6cf7a.jpg",
    founded: 1923,
    stadium: "ВТБ Арена",
    coach: "Марсел Личка",
    players: [],
    wins: 12,
    draws: 10,
    losses: 8,
    points: 46,
    goalsFor: 42,
    goalsAgainst: 35
  }
];

export const mockPlayers: Player[] = [
  {
    id: "1",
    name: "Александр Соболев",
    position: "Нападающий",
    number: 9,
    age: 26,
    nationality: "Россия",
    photo: "https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/97c5a67b-f9fa-4f50-bd48-a98809099cf8.jpg",
    teamId: "1",
    goals: 18,
    assists: 7,
    matches: 28
  },
  {
    id: "2",
    name: "Федор Чалов",
    position: "Нападающий",
    number: 11,
    age: 25,
    nationality: "Россия",
    photo: "https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/97c5a67b-f9fa-4f50-bd48-a98809099cf8.jpg",
    teamId: "2",
    goals: 14,
    assists: 5,
    matches: 26
  },
  {
    id: "3",
    name: "Малколм",
    position: "Полузащитник",
    number: 7,
    age: 27,
    nationality: "Бразилия",
    photo: "https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/97c5a67b-f9fa-4f50-bd48-a98809099cf8.jpg",
    teamId: "3",
    goals: 12,
    assists: 15,
    matches: 29
  },
  {
    id: "4",
    name: "Константин Тюкавин",
    position: "Нападающий",
    number: 10,
    age: 22,
    nationality: "Россия",
    photo: "https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/97c5a67b-f9fa-4f50-bd48-a98809099cf8.jpg",
    teamId: "4",
    goals: 10,
    assists: 8,
    matches: 25
  }
];

export const mockTransfers: Transfer[] = [
  {
    id: "1",
    playerId: "1",
    playerName: "Александр Соболев",
    playerPhoto: "https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/97c5a67b-f9fa-4f50-bd48-a98809099cf8.jpg",
    fromTeamId: "2",
    fromTeamName: "ЦСКА",
    fromTeamLogo: "https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/82bae98c-2edc-4dd1-a8b2-7502bfa6cf7a.jpg",
    toTeamId: "1",
    toTeamName: "Спартак",
    toTeamLogo: "https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/82bae98c-2edc-4dd1-a8b2-7502bfa6cf7a.jpg",
    date: "2025-01-15",
    fee: "15 млн €",
    status: "completed"
  },
  {
    id: "2",
    playerId: "3",
    playerName: "Малколм",
    playerPhoto: "https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/97c5a67b-f9fa-4f50-bd48-a98809099cf8.jpg",
    fromTeamId: "4",
    fromTeamName: "Динамо",
    fromTeamLogo: "https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/82bae98c-2edc-4dd1-a8b2-7502bfa6cf7a.jpg",
    toTeamId: "3",
    toTeamName: "Зенит",
    toTeamLogo: "https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/82bae98c-2edc-4dd1-a8b2-7502bfa6cf7a.jpg",
    date: "2025-02-01",
    fee: "20 млн €",
    status: "pending"
  }
];

export const mockMatches: Match[] = [
  {
    id: "1",
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    date: "2025-03-15",
    time: "19:00",
    stadium: "Открытие Арена",
    homeScore: 2,
    awayScore: 1,
    status: "finished"
  },
  {
    id: "2",
    homeTeam: mockTeams[2],
    awayTeam: mockTeams[3],
    date: "2025-03-16",
    time: "16:00",
    stadium: "Газпром Арена",
    status: "scheduled"
  }
];

export const mockNews: News[] = [
  {
    id: "1",
    title: "Крупный трансфер: Соболев переходит в Спартак",
    content: "Нападающий Александр Соболев завершил переход из ЦСКА в Спартак за рекордную для российского футбола сумму. Игрок подписал контракт на 4 года.",
    image: "https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/b3f1ce52-6bf1-4576-95c8-fc49eca08b5d.jpg",
    date: "2025-01-15",
    category: "transfer"
  },
  {
    id: "2",
    title: "Зенит одержал уверенную победу",
    content: "В центральном матче тура Зенит разгромил Динамо со счётом 4:1. Хет-трик оформил Малколм.",
    image: "https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/b3f1ce52-6bf1-4576-95c8-fc49eca08b5d.jpg",
    date: "2025-03-10",
    category: "match"
  },
  {
    id: "3",
    title: "ЦСКА представил нового главного тренера",
    content: "Столичный клуб официально объявил о назначении Марко Николича на пост главного тренера. Специалист подписал контракт до 2027 года.",
    image: "https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/b3f1ce52-6bf1-4576-95c8-fc49eca08b5d.jpg",
    date: "2025-02-20",
    category: "team"
  }
];

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "transfer",
    title: "Новый трансфер",
    message: "Александр Соболев перешёл из ЦСКА в Спартак",
    timestamp: new Date().toISOString(),
    read: false
  },
  {
    id: "2",
    type: "registration",
    title: "Дозаявка игрока",
    message: "В команду Зенит зарегистрирован новый игрок Малколм",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false
  }
];
