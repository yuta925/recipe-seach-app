/*
  # Update recipes table schema

  1. Changes
    - Safely create or update recipes table with enhanced fields
    - Add RLS policies if they don't exist

  2. Security
    - Enable RLS on recipes table
    - Add policies for CRUD operations
*/

DO $$ BEGIN
  -- Create the table if it doesn't exist
  CREATE TABLE IF NOT EXISTS recipes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    name text NOT NULL,
    prep_time integer,
    cook_time integer,
    servings integer,
    ingredients jsonb NOT NULL,
    instructions text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- Enable RLS
  ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

  -- Create policies if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'recipes' AND policyname = 'Users can create their own recipes'
  ) THEN
    CREATE POLICY "Users can create their own recipes"
      ON recipes
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'recipes' AND policyname = 'Users can view their own recipes'
  ) THEN
    CREATE POLICY "Users can view their own recipes"
      ON recipes
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'recipes' AND policyname = 'Users can update their own recipes'
  ) THEN
    CREATE POLICY "Users can update their own recipes"
      ON recipes
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'recipes' AND policyname = 'Users can delete their own recipes'
  ) THEN
    CREATE POLICY "Users can delete their own recipes"
      ON recipes
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;