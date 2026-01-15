
-- Add sender_id and target_id to support_messages
alter table support_messages 
add column if not exists sender_id integer,
add column if not exists target_id integer;

-- Make mobile and email nullable as they might be inferred from sender_id
alter table support_messages 
alter column mobile drop not null,
alter column email drop not null;
