CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  google_sub_id VARCHAR(255) UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin','moderator','jury') NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS submissions (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  synopsis VARCHAR(300) NOT NULL,
  country VARCHAR(100) NOT NULL,
  language VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  year INT NOT NULL,
  duration_seconds INT NOT NULL,
  ai_tools JSON,
  semantic_tags JSON,
  music_credits TEXT,
  rights_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  director_name VARCHAR(255) NOT NULL,
  director_email VARCHAR(255) NOT NULL,
  director_phone VARCHAR(50),
  director_street VARCHAR(255),
  director_zip VARCHAR(20),
  director_city VARCHAR(100),
  director_country VARCHAR(100),
  director_birthdate DATE,
  director_job VARCHAR(255),
  director_socials JSON,
  discovery_source VARCHAR(255),
  legal_ref_name VARCHAR(255),
  legal_ref_email VARCHAR(255),
  poster_url TEXT,
  video_url TEXT,
  subtitles_url TEXT,
  youtube_private_id VARCHAR(255),
  youtube_public_id VARCHAR(255),
  consent_rules BOOLEAN NOT NULL DEFAULT FALSE,
  consent_promo BOOLEAN NOT NULL DEFAULT FALSE,
  consent_newsletter BOOLEAN NOT NULL DEFAULT FALSE,
  consent_copyright BOOLEAN NOT NULL DEFAULT FALSE,
  status ENUM('pending','validated','refused','review','selected') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS jury_votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  submission_id CHAR(36) NOT NULL,
  jury_user_id INT NOT NULL,
  action ENUM('validate','refuse','review') NOT NULL,
  comment TEXT,
  voted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_jury_votes_submission FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  CONSTRAINT fk_jury_votes_user FOREIGN KEY (jury_user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_jury_vote (submission_id, jury_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_decisions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  submission_id CHAR(36) NOT NULL,
  admin_user_id INT NOT NULL,
  decision ENUM('validated','refused','review') NOT NULL,
  comment TEXT,
  email_sent BOOLEAN NOT NULL DEFAULT FALSE,
  badge VARCHAR(255),
  prize VARCHAR(255),
  decided_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_admin_decisions_submission FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  CONSTRAINT fk_admin_decisions_user FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS jury_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  jury_user_id INT NOT NULL,
  submission_id CHAR(36) NOT NULL,
  assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_jury_assignments_user FOREIGN KEY (jury_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_jury_assignments_submission FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  UNIQUE KEY uq_jury_assignment (jury_user_id, submission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_settings (
  `key` VARCHAR(255) PRIMARY KEY,
  value TEXT,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO site_settings (`key`, value)
VALUES
  ('phase1_close_iso', NULL),
  ('phase2_catalogue_iso', NULL),
  ('phase3_palmares_iso', NULL),
  ('site_logo', NULL),
  ('hero_image_url', NULL),
  ('partners', NULL),
  ('footer_text', NULL),
  ('festival_description', NULL),
  ('submission_categories', '["Fiction","Documentaire","Expérimental","Animation","Poétique","Contemplatif","Autre"]'),
  ('submission_languages', '["Français","Anglais","Espagnol","Japonais","Portugais","Allemand","Italien","Mandarin","Arabe","Coréen","Muet / Contemplatif","Autre"]'),
  ('submission_countries', '["France","États-Unis","Japon","Brésil","Espagne","Allemagne","Italie","Corée du Sud","Canada","Maroc","Argentine","Australie","Chine","Inde","Mexique","Portugal","Pays-Bas","Belgique","Suisse","Autre"]'),
  ('submission_jobs', '["Réalisateur·rice","Artiste numérique","Designer","Développeur·se","Étudiant·e","Photographe","Vidéaste","Musicien·ne","Autre"]'),
  ('submission_discovery_sources', '["Réseaux sociaux (Instagram, TikTok…)","Twitter / X","LinkedIn","Bouche à oreille","Presse / Médias","Newsletter","La Plateforme","Mobile Film Festival","Moteur de recherche","Autre"]'),
  ('submission_ai_tool_suggestions', '["Sora","MidJourney","RunwayML","Pika","Kling","DALL-E 3","Stable Diffusion","ElevenLabs","Suno","Udio","MusicGen","Luma AI","Runway Gen-3","HeyGen","D-ID","Synthesia","Autre"]'),
  ('submission_semantic_tags', '["Futur souhaitable","Écologie","Humanité & IA","Solidarité","Espoir","Résilience","Utopie","Nature","Paix","Innovation sociale","Diversité","Éducation","Santé","Liberté","Mémoire"]'),
  ('submission_social_networks', '[{"key":"instagram","label":"Instagram"},{"key":"youtube","label":"YouTube"},{"key":"linkedin","label":"LinkedIn"},{"key":"x","label":"X / Twitter"},{"key":"facebook","label":"Facebook"},{"key":"tumblr","label":"Tumblr"}]'),
  ('brevo_sender_email', NULL),
  ('email_submission_received_template', NULL),
  ('email_decision_templates', NULL)
ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = NOW();
