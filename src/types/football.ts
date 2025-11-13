export interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  age: number;
  nationality: string;
  photo: string;
  teamId: string;
  goals: number;
  assists: number;
  matches: number;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  founded: number;
  stadium: string;
  coach: string;
  players: Player[];
  wins: number;
  draws: number;
  losses: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface Transfer {
  id: string;
  playerId: string;
  playerName: string;
  playerPhoto: string;
  fromTeamId: string;
  fromTeamName: string;
  fromTeamLogo: string;
  toTeamId: string;
  toTeamName: string;
  toTeamLogo: string;
  date: string;
  fee: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  time: string;
  stadium: string;
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'live' | 'finished';
}

export interface News {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  category: 'transfer' | 'match' | 'team' | 'player';
}

export interface Notification {
  id: string;
  type: 'transfer' | 'registration' | 'match' | 'news';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
}
