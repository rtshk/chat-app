import { Conversation, Message, UserProfile } from "./types"

export const CURRENT_USER_ID = "user-1"
export const AI_ASSISTANT_ID = "ai-assistant"

export const ALL_USERS = [
  { id: "user-2", name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", phone: "+1 (555) 234-5678" },
  { id: "user-3", name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", phone: "+1 (555) 345-6789" },
  { id: "user-4", name: "Emma Wilson", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", phone: "+1 (555) 456-7890" },
  { id: "user-5", name: "Marcus Johnson", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", phone: "+1 (555) 567-8901" },
  { id: "user-6", name: "Olivia Martinez", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face", phone: "+1 (555) 678-9012" },
  { id: "user-7", name: "David Kim", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face", phone: "+1 (555) 789-0123" },
  { id: "user-8", name: "Sophie Turner", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", phone: "+1 (555) 890-1234" },
  { id: "user-9", name: "James Wilson", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", phone: "+1 (555) 901-2345" },
  { id: "user-10", name: "Mia Anderson", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face", phone: "+1 (555) 012-3456" },
  { id: "user-11", name: "Liam Brown", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face", phone: "+1 (555) 123-4560" },
  { id: "user-12", name: "Isabella Garcia", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face", phone: "+1 (555) 234-5670" },
  { id: "user-13", name: "Noah Davis", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face", phone: "+1 (555) 345-6780" },
  { id: "user-14", name: "Ava Thompson", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face", phone: "+1 (555) 456-7891" },
  { id: "user-15", name: "Ethan White", avatar: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=100&h=100&fit=crop&crop=face", phone: "+1 (555) 567-8902" },
]

export const GROUP_MEMBERS: Record<string, Record<string, { name: string; avatar?: string }>> = {
  "g1": {
    "user-2": { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
    "user-3": { name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    "user-4": { name: "Emma Wilson", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  },
  "g2": {
    "user-5": { name: "Marcus Johnson", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
    "user-6": { name: "Olivia Martinez", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
    "user-7": { name: "David Kim", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face" },
    "user-8": { name: "Sophie Turner", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face" },
  },
  "g3": {
    "user-9": { name: "James Wilson", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
    "user-10": { name: "Mia Anderson", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face" },
  },
}

export const initialConversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Great work on the slides! Love it!",
    time: "2m",
    unread: 2,
    online: true,
    isGroup: false,
  },
  {
    id: "2",
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Can we schedule a call for tomorrow?",
    time: "15m",
    online: true,
    isGroup: false,
  },
  {
    id: "3",
    name: "Emma Wilson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    lastMessage: "The project looks amazing!",
    time: "1h",
    online: false,
    isGroup: false,
  },
  {
    id: "4",
    name: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Let me know when you are free",
    time: "2h",
    online: false,
    isGroup: false,
  },
  {
    id: "5",
    name: "Olivia Martinez",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Thanks for the quick response!",
    time: "3h",
    online: true,
    isGroup: false,
  },
  {
    id: "6",
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    lastMessage: "I'll send the files over tonight",
    time: "4h",
    unread: 1,
    online: false,
    isGroup: false,
  },
  {
    id: "7",
    name: "Sophie Turner",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    lastMessage: "See you at the meeting!",
    time: "5h",
    online: true,
    isGroup: false,
  },
  {
    id: "8",
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    lastMessage: "That sounds like a great plan",
    time: "6h",
    online: false,
    isGroup: false,
  },
  {
    id: "9",
    name: "Mia Anderson",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Can you review my PR?",
    time: "Yesterday",
    online: false,
    isGroup: false,
  },
  {
    id: "10",
    name: "Liam Brown",
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
    lastMessage: "The deployment was successful!",
    time: "Yesterday",
    unread: 3,
    online: true,
    isGroup: false,
  },
  {
    id: "g1",
    name: "Design Team",
    lastMessage: "Sarah: New designs are ready for review",
    time: "30m",
    unread: 5,
    online: true,
    isGroup: true,
    members: [
      { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
      { name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
      { name: "Emma Wilson", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
    ],
  },
  {
    id: "g2",
    name: "Project Alpha",
    lastMessage: "Marcus: Sprint planning at 2pm",
    time: "1h",
    unread: 0,
    online: false,
    isGroup: true,
    members: [
      { name: "Marcus Johnson", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
      { name: "Olivia Martinez", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
      { name: "David Kim", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face" },
      { name: "Sophie Turner", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face" },
    ],
  },
  {
    id: "g3",
    name: "Weekend Plans",
    lastMessage: "James: Who's up for hiking?",
    time: "2h",
    online: true,
    isGroup: true,
    members: [
      { name: "James Wilson", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
      { name: "Mia Anderson", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face" },
    ],
  },
]

export const initialMessages: Record<string, Message[]> = {
  "1": [
    { id: "m1", content: "Hey! Are you there?", senderId: "user-2", timestamp: new Date(Date.now() - 300000).toISOString() },
    { id: "m2", content: "Yeah, what's up?", senderId: CURRENT_USER_ID, timestamp: new Date(Date.now() - 280000).toISOString() },
    { id: "m3", content: "I wanted to show you the new presentation slides I've been working on. It's for the quarterly review meeting.", senderId: "user-2", timestamp: new Date(Date.now() - 260000).toISOString() },
    { id: "m4", content: "Oh nice! I'd love to see them. Can you share them with me?", senderId: CURRENT_USER_ID, timestamp: new Date(Date.now() - 240000).toISOString() },
    { id: "m5", content: "Just sent them to your email! Let me know what you think.", senderId: "user-2", timestamp: new Date(Date.now() - 220000).toISOString() },
    { id: "m6", content: "Got them! Looking through now...", senderId: CURRENT_USER_ID, timestamp: new Date(Date.now() - 180000).toISOString() },
    { id: "m7", content: "Great work on the slides! Love it! The visualizations are really clear and the data storytelling is on point.", senderId: "user-2", timestamp: new Date(Date.now() - 120000).toISOString() },
  ],
}

export const defaultUser: UserProfile = {
  id: "user-1",
  name: "John Doe",
  email: "john.doe@email.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  about: "Hey there! I am using Chat App",
  phone: "+1 (555) 123-4567"
}
