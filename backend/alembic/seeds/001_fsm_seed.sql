-- States
INSERT INTO states (name, is_terminal) VALUES ('unassigned', 0);
INSERT INTO states (name, is_terminal) VALUES ('in_review',  0);
INSERT INTO states (name, is_terminal) VALUES ('approved',   1);
INSERT INTO states (name, is_terminal) VALUES ('rejected',   1);
INSERT INTO states (name, is_terminal) VALUES ('escalated',  1);

-- Actions
INSERT INTO actions (name) VALUES ('claim');
INSERT INTO actions (name) VALUES ('approve');
INSERT INTO actions (name) VALUES ('reject');
INSERT INTO actions (name) VALUES ('escalate');

-- Transitions (resolved by name so order of inserts above doesn't matter)
INSERT INTO state_transitions (from_state_id, action_id, to_state_id)
VALUES (
    (SELECT id FROM states  WHERE name = 'unassigned'),
    (SELECT id FROM actions WHERE name = 'claim'),
    (SELECT id FROM states  WHERE name = 'in_review')
);
INSERT INTO state_transitions (from_state_id, action_id, to_state_id)
VALUES (
    (SELECT id FROM states  WHERE name = 'in_review'),
    (SELECT id FROM actions WHERE name = 'approve'),
    (SELECT id FROM states  WHERE name = 'approved')
);
INSERT INTO state_transitions (from_state_id, action_id, to_state_id)
VALUES (
    (SELECT id FROM states  WHERE name = 'in_review'),
    (SELECT id FROM actions WHERE name = 'reject'),
    (SELECT id FROM states  WHERE name = 'rejected')
);
INSERT INTO state_transitions (from_state_id, action_id, to_state_id)
VALUES (
    (SELECT id FROM states  WHERE name = 'in_review'),
    (SELECT id FROM actions WHERE name = 'escalate'),
    (SELECT id FROM states  WHERE name = 'escalated')
);
