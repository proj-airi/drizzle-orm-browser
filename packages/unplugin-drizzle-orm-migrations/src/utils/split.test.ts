import { describe, expect, it } from 'vitest'

import { splitSQL } from './split'

describe('splitSQL', () => {
  it('should split SQL into tokens with no statement-breakpoints', () => {
    const sql = `ALTER TABLE "chat_messages" ALTER COLUMN "jieba_tokens" SET DEFAULT '[]'::jsonb;`
    const tokens = splitSQL(sql)
    expect(tokens).toEqual([
      'ALTER TABLE "chat_messages" ALTER COLUMN "jieba_tokens" SET DEFAULT \'[]\'::jsonb;',
    ])
  })

  it('should split SQL into tokens with statement-breakpoints', () => {
    const sql = `ALTER TABLE "recent_sent_stickers" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP VIEW "public"."chat_message_stats";--> statement-breakpoint
DROP TABLE "recent_sent_stickers" CASCADE;--> statement-breakpoint
DROP INDEX "chat_messages_platform_platform_message_id_in_chat_id_unique_index";--> statement-breakpoint
ALTER TABLE "account_joined_chats" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD COLUMN "owner_account_id" uuid;--> statement-breakpoint
ALTER TABLE "account_joined_chats" ADD CONSTRAINT "account_joined_chats_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account_joined_chats" ADD CONSTRAINT "account_joined_chats_joined_chat_id_joined_chats_id_fk" FOREIGN KEY ("joined_chat_id") REFERENCES "public"."joined_chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_owner_account_id_accounts_id_fk" FOREIGN KEY ("owner_account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "chat_messages_platform_platform_message_id_in_chat_id_owner_account_id_unique_index" ON "chat_messages" USING btree ("platform","platform_message_id","in_chat_id","owner_account_id");
`
    const tokens = splitSQL(sql)
    expect(tokens).toEqual([
      'ALTER TABLE "recent_sent_stickers" DISABLE ROW LEVEL SECURITY;',
      'DROP VIEW "public"."chat_message_stats";',
      'DROP TABLE "recent_sent_stickers" CASCADE;',
      'DROP INDEX "chat_messages_platform_platform_message_id_in_chat_id_unique_index";',
      'ALTER TABLE "account_joined_chats" ALTER COLUMN "created_at" DROP DEFAULT;',
      'ALTER TABLE "accounts" ALTER COLUMN "created_at" DROP DEFAULT;',
      'ALTER TABLE "accounts" ALTER COLUMN "updated_at" DROP DEFAULT;',
      'ALTER TABLE "chat_messages" ADD COLUMN "owner_account_id" uuid;',
      'ALTER TABLE "account_joined_chats" ADD CONSTRAINT "account_joined_chats_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;',
      'ALTER TABLE "account_joined_chats" ADD CONSTRAINT "account_joined_chats_joined_chat_id_joined_chats_id_fk" FOREIGN KEY ("joined_chat_id") REFERENCES "public"."joined_chats"("id") ON DELETE cascade ON UPDATE no action;',
      'ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_owner_account_id_accounts_id_fk" FOREIGN KEY ("owner_account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;',
      'CREATE UNIQUE INDEX "chat_messages_platform_platform_message_id_in_chat_id_owner_account_id_unique_index" ON "chat_messages" USING btree ("platform","platform_message_id","in_chat_id","owner_account_id");',
    ])
  })

  it('should split SQL into tokens with comments', () => {
    const sql = `-- 1) Drop the old unique index.
DROP INDEX IF EXISTS "chat_messages_platform_platform_message_id_in_chat_id_owner_account_id_unique_index";--> statement-breakpoint
-- 2) Add the in_chat_type column, initially allowing NULLs for backfilling.
ALTER TABLE "chat_messages" ADD COLUMN IF NOT EXISTS "in_chat_type" text;--> statement-breakpoint
-- 3) Backfill in_chat_type from joined_chats.chat_type where possible.
UPDATE "chat_messages" AS m
SET "in_chat_type" = j."chat_type"
FROM "joined_chats" AS j
WHERE m."in_chat_id" = j."chat_id"
  AND m."in_chat_type" IS NULL;--> statement-breakpoint
-- 4) For any remaining rows, set a default fallback value ('group' as example).
UPDATE "chat_messages" AS m
SET "in_chat_type" = 'group'
WHERE m."in_chat_type" IS NULL;--> statement-breakpoint
-- 5) Remove duplicates with no owner: For rows where owner_account_id IS NULL,
--    keep the newest (by created_at), delete others with identical
--    platform/platform_message_id/in_chat_id/owner_account_id.
DELETE FROM "chat_messages" AS m
USING (
  SELECT
    ctid,
    row_number() OVER (
      PARTITION BY
        "platform",
        "platform_message_id",
        "in_chat_id",
        "owner_account_id"
      ORDER BY "created_at" DESC
    ) AS rn
  FROM "chat_messages"
  WHERE "owner_account_id" IS NULL
) AS d
WHERE m.ctid = d.ctid
  AND d.rn > 1;
-- 6) After backfill and deduplication, make in_chat_type NOT NULL.
ALTER TABLE "chat_messages"
  ALTER COLUMN "in_chat_type" SET NOT NULL;--> statement-breakpoint
-- 7) Add the new UNIQUE constraint, using NULLS NOT DISTINCT
--    so that rows with owner_account_id NULL in same group/channel still conflict.
ALTER TABLE "chat_messages"
  ADD CONSTRAINT "chat_messages_platform_platform_message_id_in_chat_id_owner_account_id_unique_index"
  UNIQUE NULLS NOT DISTINCT("platform","platform_message_id","in_chat_id","owner_account_id");--> statement-breakpoint
`
    const tokens = splitSQL(sql)
    expect(tokens).toEqual([
      'DROP INDEX IF EXISTS "chat_messages_platform_platform_message_id_in_chat_id_owner_account_id_unique_index";',
      'ALTER TABLE "chat_messages" ADD COLUMN IF NOT EXISTS "in_chat_type" text;',
      'UPDATE "chat_messages" AS m SET "in_chat_type" = j."chat_type" FROM "joined_chats" AS j WHERE m."in_chat_id" = j."chat_id" AND m."in_chat_type" IS NULL;',
      'UPDATE "chat_messages" AS m SET "in_chat_type" = \'group\' WHERE m."in_chat_type" IS NULL;',
      'DELETE FROM "chat_messages" AS m USING ( SELECT ctid, row_number() OVER ( PARTITION BY "platform", "platform_message_id", "in_chat_id", "owner_account_id" ORDER BY "created_at" DESC ) AS rn FROM "chat_messages" WHERE "owner_account_id" IS NULL ) AS d WHERE m.ctid = d.ctid AND d.rn > 1;',
      'ALTER TABLE "chat_messages" ALTER COLUMN "in_chat_type" SET NOT NULL;',
      'ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_platform_platform_message_id_in_chat_id_owner_account_id_unique_index" UNIQUE NULLS NOT DISTINCT("platform","platform_message_id","in_chat_id","owner_account_id");',
    ])
  })
})
