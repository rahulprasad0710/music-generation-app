CREATE EXTENSION IF NOT EXISTS pg_trgm;


--- Add tsvector Column
ALTER TABLE "Prompt"
ADD COLUMN prompt_tsv tsvector;

--- STORE PROCEDURE

CREATE OR REPLACE FUNCTION prompt_tsvector_update()
RETURNS trigger AS $$
BEGIN
  NEW.prompt_tsv :=
    to_tsvector('english', coalesce(NEW.prompt, ''));

  RETURN NEW;
END
$$ LANGUAGE plpgsql;

--- Trigger (Auto-run on insert/update)

CREATE TRIGGER prompt_tsv_update_trigger
BEFORE INSERT OR UPDATE ON "Prompt"
FOR EACH ROW
EXECUTE FUNCTION prompt_tsvector_update();

--- GIN INDEX (Full-text search) ---
CREATE INDEX prompt_tsv_idx
ON "Prompt"
USING GIN (prompt_tsv);

--- Trigram Index (Fuzzy Search)  For typo tolerance and partial matching, I used pg_trgm which breaks strings into trigrams and allows similarity-based matching

CREATE INDEX prompt_trgm_idx
ON "Prompt"
USING GIN (prompt gin_trgm_ops);

 --- SEARCH ---
 SELECT *,
  ts_rank(prompt_tsv, plainto_tsquery('english', 'dragon')) AS rank
FROM "Prompt"
WHERE
  prompt ILIKE '%dragon%'
  OR prompt_tsv @@ plainto_tsquery('english', 'dragon')
  OR prompt % 'dragon'
ORDER BY rank DESC;