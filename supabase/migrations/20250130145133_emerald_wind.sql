/*
  # Initial Schema Setup for Patent and Trademark Search System

  1. New Tables
    - `patents`
      - `id` (uuid, primary key)
      - `title` (text)
      - `application_number` (text)
      - `filing_date` (date)
      - `status` (text)
      - `abstract` (text)
      - `inventors` (text[])
      - `assignee` (text)
      - `created_at` (timestamptz)
      
    - `trademarks`
      - `id` (uuid, primary key)
      - `name` (text)
      - `registration_number` (text)
      - `filing_date` (date)
      - `status` (text)
      - `description` (text)
      - `owner` (text)
      - `created_at` (timestamptz)
      
    - `user_searches`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `query` (text)
      - `type` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Patents table
CREATE TABLE patents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  application_number text UNIQUE NOT NULL,
  filing_date date NOT NULL,
  status text NOT NULL,
  abstract text,
  inventors text[],
  assignee text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE patents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patents are viewable by everyone"
  ON patents
  FOR SELECT
  TO public
  USING (true);

-- Trademarks table
CREATE TABLE trademarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  registration_number text UNIQUE NOT NULL,
  filing_date date NOT NULL,
  status text NOT NULL,
  description text,
  owner text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trademarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trademarks are viewable by everyone"
  ON trademarks
  FOR SELECT
  TO public
  USING (true);

-- User searches table
CREATE TABLE user_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  query text NOT NULL,
  type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own searches"
  ON user_searches
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own searches"
  ON user_searches
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);