CREATE TABLE IF NOT EXISTS t_p5773343_football_league_app.wmfl_tournament_teams (
    id SERIAL PRIMARY KEY,
    team_id INTEGER UNIQUE,
    team_name VARCHAR(255) NOT NULL,
    team_short_name VARCHAR(100),
    team_logo TEXT,
    city VARCHAR(255),
    stadium VARCHAR(255),
    
    matches_played INTEGER NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0,
    draws INTEGER NOT NULL DEFAULT 0,
    losses INTEGER NOT NULL DEFAULT 0,
    goals_for INTEGER NOT NULL DEFAULT 0,
    goals_against INTEGER NOT NULL DEFAULT 0,
    goal_difference INTEGER GENERATED ALWAYS AS (goals_for - goals_against) STORED,
    points INTEGER GENERATED ALWAYS AS (wins * 3 + draws) STORED,
    
    rating INTEGER NOT NULL DEFAULT 1500,
    position INTEGER,
    form VARCHAR(20),
    streak VARCHAR(50),
    
    home_wins INTEGER NOT NULL DEFAULT 0,
    home_draws INTEGER NOT NULL DEFAULT 0,
    home_losses INTEGER NOT NULL DEFAULT 0,
    away_wins INTEGER NOT NULL DEFAULT 0,
    away_draws INTEGER NOT NULL DEFAULT 0,
    away_losses INTEGER NOT NULL DEFAULT 0,
    
    yellow_cards INTEGER NOT NULL DEFAULT 0,
    red_cards INTEGER NOT NULL DEFAULT 0,
    
    tournament_id INTEGER DEFAULT 1056456,
    season VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wmfl_tournament_points ON t_p5773343_football_league_app.wmfl_tournament_teams(points DESC, goal_difference DESC);
CREATE INDEX idx_wmfl_tournament_rating ON t_p5773343_football_league_app.wmfl_tournament_teams(rating DESC);
CREATE INDEX idx_wmfl_tournament_position ON t_p5773343_football_league_app.wmfl_tournament_teams(position);
CREATE INDEX idx_wmfl_tournament_id ON t_p5773343_football_league_app.wmfl_tournament_teams(tournament_id);

COMMENT ON TABLE t_p5773343_football_league_app.wmfl_tournament_teams IS 'Рейтинг и статистика команд турнира WMFL';
COMMENT ON COLUMN t_p5773343_football_league_app.wmfl_tournament_teams.team_id IS 'ID команды из системы WMFL';
COMMENT ON COLUMN t_p5773343_football_league_app.wmfl_tournament_teams.rating IS 'Рейтинг команды (ELO-подобная система)';
COMMENT ON COLUMN t_p5773343_football_league_app.wmfl_tournament_teams.form IS 'Форма команды в последних матчах (В/Н/П)';
COMMENT ON COLUMN t_p5773343_football_league_app.wmfl_tournament_teams.streak IS 'Текущая серия результатов';