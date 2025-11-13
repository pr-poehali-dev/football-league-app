CREATE TABLE IF NOT EXISTS t_p5773343_football_league_app.wmfl_sync_log (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER NOT NULL,
    sync_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    message TEXT,
    teams_updated INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wmfl_sync_log_tournament ON t_p5773343_football_league_app.wmfl_sync_log(tournament_id);
CREATE INDEX idx_wmfl_sync_log_time ON t_p5773343_football_league_app.wmfl_sync_log(sync_time DESC);

COMMENT ON TABLE t_p5773343_football_league_app.wmfl_sync_log IS 'Лог синхронизации данных турниров WMFL';
COMMENT ON COLUMN t_p5773343_football_league_app.wmfl_sync_log.status IS 'Статус синхронизации: success, error, warning';
