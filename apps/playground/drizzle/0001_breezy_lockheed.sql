ALTER TABLE "users" ADD COLUMN "created_at" bigint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" bigint DEFAULT 0 NOT NULL;