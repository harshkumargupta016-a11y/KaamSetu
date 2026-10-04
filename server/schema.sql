CREATE TABLE IF NOT EXISTS submissions (
  id CHAR(36) NOT NULL PRIMARY KEY,
  type VARCHAR(32) NOT NULL,
  payload JSON NOT NULL,
  verification JSON NOT NULL,
  status ENUM('awaiting_admin_review', 'approved', 'rejected') NOT NULL DEFAULT 'awaiting_admin_review',
  decision JSON NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  reviewed_at TIMESTAMP(3) NULL,
  INDEX submissions_type_created (type, created_at),
  INDEX submissions_status_created (status, created_at)
);
