CREATE TABLE IF NOT EXISTS t_p5773343_football_league_app.team_ratings (
    id SERIAL PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL,
    team_logo TEXT,
    rating INTEGER NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0,
    draws INTEGER NOT NULL DEFAULT 0,
    losses INTEGER NOT NULL DEFAULT 0,
    goals_for INTEGER NOT NULL DEFAULT 0,
    goals_against INTEGER NOT NULL DEFAULT 0,
    goal_difference INTEGER GENERATED ALWAYS AS (goals_for - goals_against) STORED,
    points INTEGER GENERATED ALWAYS AS (wins * 3 + draws) STORED,
    matches_played INTEGER GENERATED ALWAYS AS (wins + draws + losses) STORED,
    form VARCHAR(50),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_team_ratings_points ON t_p5773343_football_league_app.team_ratings(points DESC);
CREATE INDEX idx_team_ratings_rating ON t_p5773343_football_league_app.team_ratings(rating DESC);

INSERT INTO t_p5773343_football_league_app.team_ratings (team_name, team_logo, rating, wins, draws, losses, goals_for, goals_against, form) VALUES
('Зенит', 'https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/82bae98c-2edc-4dd1-a8b2-7502bfa6cf7a.jpg', 1850, 18, 6, 6, 55, 28, 'ВВДВВ'),
('Спартак', 'https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/82bae98c-2edc-4dd1-a8b2-7502bfa6cf7a.jpg', 1780, 15, 8, 7, 48, 32, 'ВДВВД'),
('ЦСКА', 'https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/82bae98c-2edc-4dd1-a8b2-7502bfa6cf7a.jpg', 1720, 14, 9, 7, 45, 30, 'ДВДВВ'),
('Динамо', 'https://cdn.poehali.dev/projects/778dac1f-adb0-4dcf-8a18-be5777eb102d/files/82bae98c-2edc-4dd1-a8b2-7502bfa6cf7a.jpg', 1650, 12, 10, 8, 42, 35, 'ДДДВП');