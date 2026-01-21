-- Create tables for the Chat App

-- 1. Profiles Table (Extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  about TEXT DEFAULT 'Hey there! I am using Chat App',
  phone TEXT,
  email TEXT,
  online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Conversations Table
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT, -- Null for DMs, name of the group for groups
  is_group BOOLEAN DEFAULT false,
  deleted_by UUID[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Conversation Members (Links Users to Conversations)
CREATE TABLE conversation_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- 4. Messages Table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT,
  attachment_url TEXT,
  attachment_type TEXT,
  reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  deleted_by UUID[] NOT NULL DEFAULT '{}',
  status TEXT DEFAULT 'sent', -- sent, delivered, read
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view conversations they are part of" 
ON conversations FOR SELECT 
USING (
  (NOT (deleted_by @> ARRAY[auth.uid()])) AND
  EXISTS (
    SELECT 1 FROM conversation_members 
    WHERE conversation_members.conversation_id = conversations.id 
    AND conversation_members.user_id = auth.uid()
  )
);

-- Members
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view memberships" 
ON conversation_members FOR SELECT 
TO authenticated
USING (true);

-- Messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages in their conversations" 
ON messages FOR SELECT 
USING (
  (NOT (deleted_by @> ARRAY[auth.uid()])) AND
  EXISTS (
    SELECT 1 FROM conversation_members 
    WHERE conversation_members.conversation_id = messages.conversation_id 
    AND conversation_members.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert messages into their conversations" 
ON messages FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM conversation_members 
    WHERE conversation_members.conversation_id = messages.conversation_id 
    AND conversation_members.user_id = auth.uid()
  )
);

-- Realtime Setup
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;

-- 5. Auto-create Profiles on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Additional Policies for Creation
CREATE POLICY "Users can join conversations" 
ON conversation_members FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can create conversations" 
ON conversations FOR INSERT 
WITH CHECK (true);

-- 7. Storage Policies (Run these if you have a bucket named 'attachments')
-- INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', true);

-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'attachments');
-- CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'attachments' AND auth.role() = 'authenticated');

-- Functions for Deletion
CREATE OR REPLACE FUNCTION delete_message_for_user(msg_id UUID, u_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE messages 
  SET deleted_by = array_append(COALESCE(deleted_by, '{}'), u_id)
  WHERE id = msg_id AND NOT (COALESCE(deleted_by, '{}') @> ARRAY[u_id]);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION delete_conversation_for_user(conv_id UUID, u_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE conversations 
  SET deleted_by = array_append(COALESCE(deleted_by, '{}'), u_id)
  WHERE id = conv_id AND NOT (COALESCE(deleted_by, '{}') @> ARRAY[u_id]);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
