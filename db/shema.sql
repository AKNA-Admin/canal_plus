-- FORMULES
ALTER TABLE formules ADD COLUMN IF NOT EXISTS prix_kit NUMERIC(10,2) DEFAULT 0;
ALTER TABLE formules ADD COLUMN IF NOT EXISTS prix_installation NUMERIC(10,2) DEFAULT 0;

UPDATE formules SET prix_kit = 5000, prix_installation = 0;
UPDATE formules SET prix_kit = 1000, prix_installation = 0 WHERE nom = 'Tout Canal';
UPDATE formules SET prix_kit = 15000, prix_installation = 5000 WHERE nom = 'Access';

-- OPTIONS
CREATE TABLE IF NOT EXISTS options (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    type_option VARCHAR(20) NOT NULL CHECK (type_option IN ('netflix', 'charme', 'autre')),
    prix NUMERIC(10,2) NOT NULL,
    duree_mois INT DEFAULT 1,
    formules_applicables VARCHAR[] DEFAULT '{Access,Evasion,Access+,Tout Canal}'
);

INSERT INTO options (nom, type_option, prix, duree_mois, formules_applicables) VALUES
('Netflix 1S', 'netflix', 3000, 1, '{Access,Evasion,Access+}'),
('Netflix 2S', 'netflix', 5500, 2, '{Access,Evasion,Access+}'),
('Netflix 4S', 'netflix', 7000, 4, '{Access,Evasion,Access+}'),
('Netflix 2S', 'netflix', 2500, 2, '{Tout Canal}'),
('Netflix 4S', 'netflix', 4000, 4, '{Tout Canal}'),
('CHARME', 'charme', 6000, 1, '{Access,Evasion,Access+}')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS operation_options (
    operation_id INT REFERENCES operations(id) ON DELETE CASCADE,
    option_id INT REFERENCES options(id),
    PRIMARY KEY (operation_id, option_id)
);

-- OPERATIONS
ALTER TABLE operations ADD COLUMN IF NOT EXISTS montant_kit NUMERIC(10,2) DEFAULT 0;
ALTER TABLE operations ADD COLUMN IF NOT EXISTS montant_installation NUMERIC(10,2) DEFAULT 0;
ALTER TABLE operations ADD COLUMN IF NOT EXISTS montant_options NUMERIC(10,2) DEFAULT 0;
