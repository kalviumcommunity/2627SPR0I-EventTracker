CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    picture TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Event boards
CREATE TABLE boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    date DATE,
    location TEXT DEFAULT '',
    invite_code VARCHAR(6) UNIQUE NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Board members
CREATE TABLE board_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL
        CHECK (role IN ('organiser', 'volunteer')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (board_id, user_id)
);

-- Duties
CREATE TABLE duties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    assigned_volunteer_id UUID NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    title VARCHAR(120) NOT NULL,
    description VARCHAR(3000) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending'
        CHECK (status IN ('Pending', 'In Progress', 'Completed')),
    priority VARCHAR(20) NOT NULL DEFAULT 'Medium'
        CHECK (priority IN ('Low', 'Medium', 'High')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    FOREIGN KEY (board_id, assigned_volunteer_id)
        REFERENCES board_members(board_id, user_id)
);

-- Indexes for common lookups
CREATE INDEX idx_board_members_user_id
    ON board_members(user_id);

CREATE INDEX idx_duties_board_id
    ON duties(board_id);

CREATE INDEX idx_duties_assigned_volunteer
    ON duties(assigned_volunteer_id);

CREATE INDEX idx_duties_created_at
    ON duties(created_at DESC);
