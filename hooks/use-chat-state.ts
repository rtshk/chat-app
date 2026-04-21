"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { 
  Conversation, 
  Message, 
  NavView, 
  ContactProfile, 
  GroupProfile 
} from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export function useChatState(userId: string | undefined) {
  const router = useRouter()
  
  // --- State Declarations ---
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [navView, setNavView] = useState<NavView>("dm")
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [showContactProfile, setShowContactProfile] = useState(false)
  const [showGroupProfile, setShowGroupProfile] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [replyingTo, setReplyingTo] = useState<{ message: Message; senderName: string } | null>(null)
  const [allUsers, setAllUsers] = useState<{ id: string; name: string; avatar?: string; phone: string; email?: string }[]>([])
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; avatar?: string } | null>(null)
  const [fuse, setFuse] = useState<any>(null)

  // --- Derived Values (Memoized) ---
  const selectedConversation = useMemo(() => 
    conversations.find(c => c.id === selectedId), 
  [conversations, selectedId])

  const filteredConversations = useMemo(() => {
    let list = searchQuery.trim() && fuse
      ? fuse.search(searchQuery).map((result: any) => result.item)
      : conversations.filter(c => navView === "dm" ? !c.isGroup : c.isGroup)

    return list.filter((conv: Conversation) => {
      if (conv.id === selectedId) return true
      if (!conv.lastClearedAt) return true
      if (!conv.lastMessageAt) return false
      return new Date(conv.lastMessageAt) > new Date(conv.lastClearedAt)
    })
  }, [conversations, selectedId, searchQuery, navView, fuse])

  // --- Data Fetching ---
  const fetchCurrentUser = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase.from('profiles').select('id, full_name, avatar_url').eq('id', userId).single()
    if (data) {
      setCurrentUser({
        id: data.id,
        name: data.full_name || "You",
        avatar: data.avatar_url || undefined
      })
    }
  }, [userId])

  const fetchConversations = useCallback(async () => {
    if (!userId) return
    const { data, error } = await supabase
      .from('conversations')
      .select(`*, members:conversation_members(user_id, last_cleared_at, profiles(full_name, avatar_url, email, phone, about))`)
      .order('updated_at', { ascending: false })

    if (error || !data) return

    const formatted = await Promise.all(data.map(async (conv: any) => {
      const isGroup = conv.is_group
      const { data: latestMsgData } = await supabase
        .from('messages')
        .select('content, created_at, attachment_url, attachment_type, deleted_by')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(10)

      const myMembership = conv.members.find((m: any) => m.user_id === userId)
      const lastClearedAt = myMembership?.last_cleared_at

      const lastMsg = latestMsgData?.find((msg: any) => {
        const isDeleted = msg.deleted_by && msg.deleted_by.includes(userId)
        const isBeforeClearance = lastClearedAt && new Date(msg.created_at) <= new Date(lastClearedAt)
        return !isDeleted && !isBeforeClearance
      })
      
      let name = conv.name, avatar = null, email = undefined, phone = undefined, about = "Hey there!"

      if (!isGroup) {
        const other = conv.members.find((m: any) => m.user_id !== userId)
        if (other) {
          name = other.profiles.full_name || "Unknown User"
          avatar = other.profiles.avatar_url
          email = other.profiles.email
          phone = other.profiles.phone
          about = other.profiles.about || about
        }
      }

      const { count } = await supabase.from('messages').select('*', { count: 'exact', head: true })
        .eq('conversation_id', conv.id).eq('is_read', false).neq('sender_id', userId)

      return {
        id: conv.id, name, avatar, email, phone, about, isGroup, online: false, unread: count || 0,
        lastMessage: lastMsg ? (lastMsg.content || "Attachment") : "No messages yet",
        time: lastMsg ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
        lastMessageAt: lastMsg?.created_at,
        lastClearedAt,
        members: conv.members.map((m: any) => ({ name: m.profiles.full_name, avatar: m.profiles.avatar_url }))
      }
    }))
    setConversations(formatted)
  }, [userId])

  const fetchMessages = useCallback(async (convId: string) => {
    if (!userId) return
    const { data: memberData } = await supabase.from('conversation_members').select('last_cleared_at')
      .eq('conversation_id', convId).eq('user_id', userId).maybeSingle()

    const lastClearedAt = memberData?.last_cleared_at
    const { data, error } = await supabase.from('messages').select(`*, sender:profiles(full_name, avatar_url), reply_to:messages!reply_to_id(id, content, sender_id, attachment_type, sender:profiles(full_name))`)
      .eq('conversation_id', convId).order('created_at', { ascending: true })

    if (error || !data) return
    const formatted = data.filter((msg: any) => {
      const isDeleted = msg.deleted_by && msg.deleted_by.includes(userId)
      const isBeforeClearance = lastClearedAt && new Date(msg.created_at) <= new Date(lastClearedAt)
      return !isDeleted && !isBeforeClearance
    }).map((msg: any) => {
      // Manual lookup for the replied message in the current batch
      const originalMsg = msg.reply_to_id ? data.find((m: any) => m.id === msg.reply_to_id) : null;
      
      return {
        id: msg.id, 
        content: msg.content, 
        senderId: msg.sender_id, 
        senderName: msg.sender?.full_name || "Unknown",
        timestamp: msg.created_at, 
        attachmentUrl: msg.attachment_url, 
        attachmentType: msg.attachment_type, 
        status: msg.status,
        replyTo: msg.reply_to_id ? { 
          id: msg.reply_to_id, 
          content: originalMsg ? (
            originalMsg.content || (
              originalMsg.attachment_type?.startsWith('image/') ? "📷 Photo" : 
              originalMsg.attachment_type?.startsWith('audio/') ? "🎤 Voice Note" : 
              originalMsg.attachment_type ? "📎 Attachment" : ""
            )
          ) : "Message not available", 
          senderName: originalMsg 
            ? (originalMsg.sender_id === userId ? "You" : originalMsg.sender?.full_name || "Unknown") 
            : "Message"
        } : undefined
      };
    })
    setMessages(prev => ({ ...prev, [convId]: formatted }))
  }, [userId])

  const fetchAllUsers = useCallback(async () => {
    const { data } = await supabase.from('profiles').select('id, full_name, avatar_url, phone, email')
    if (data) setAllUsers(data.map((u: any) => ({ id: u.id, name: u.full_name || "Unknown", avatar: u.avatar_url, phone: u.phone, email: u.email })))
  }, [])

  // --- Effects ---
  useEffect(() => { 
    fetchCurrentUser(); fetchConversations(); fetchAllUsers(); 
  }, [userId, fetchCurrentUser, fetchConversations, fetchAllUsers])

  useEffect(() => { 
    if (selectedId) fetchMessages(selectedId) 
  }, [selectedId, fetchMessages])

  const selectedIdRef = useRef<string | null>(null)
  useEffect(() => { selectedIdRef.current = selectedId }, [selectedId])

  useEffect(() => {
    if (!userId) return
    const channel = supabase.channel(`sync:${userId.slice(0, 8)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new as any
        if (selectedIdRef.current && msg.conversation_id === selectedIdRef.current) fetchMessages(selectedIdRef.current)
        fetchConversations()
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'conversations' }, () => fetchConversations())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [userId, fetchMessages, fetchConversations])

  useEffect(() => {
    if (conversations.length > 0) {
      import('fuse.js').then(Fuse => {
        setFuse(new Fuse.default(conversations, { keys: ['name', 'members.name'], threshold: 0.3 }))
      })
    }
  }, [conversations])

  // --- Handlers ---
  const markAllAsRead = useCallback(async (convId: string) => {
    if (!userId) return
    const { error } = await supabase.from('messages').update({ status: 'read', is_read: true })
      .eq('conversation_id', convId).eq('is_read', false).neq('sender_id', userId)
    if (!error) setConversations(prev => prev.map(c => c.id === convId ? { ...c, unread: 0 } : c))
  }, [userId])

  const handleSelectConversation = useCallback((id: string) => {
    setSelectedId(id); setShowMobileChat(true); setReplyingTo(null); markAllAsRead(id)
  }, [markAllAsRead])

  const handleSendMessage = useCallback(async (content: string, replyTo?: Message["replyTo"], attachment?: { url: string, type: string }) => {
    if (!userId || !selectedId) return
    const tempId = `temp-${Date.now()}`
    const newMessage: Message = {
      id: tempId, content, senderId: userId, senderName: currentUser?.name || "You",
      timestamp: new Date().toISOString(), status: 'sent', attachmentUrl: attachment?.url, attachmentType: attachment?.type,
      replyTo: replyingTo ? { 
        id: replyingTo.message.id, 
        content: replyingTo.message.content || (
          replyingTo.message.attachmentType?.startsWith('image/') ? "📷 Photo" : 
          replyingTo.message.attachmentType?.startsWith('audio/') ? "🎤 Voice Note" : 
          replyingTo.message.attachmentType ? "📎 Attachment" : ""
        ), 
        senderName: replyingTo.senderName 
      } : undefined
    }
    setMessages(prev => ({ ...prev, [selectedId]: [...(prev[selectedId] || []), newMessage] }))

    const { data: savedMsg, error } = await supabase.from('messages').insert({
      content, conversation_id: selectedId, sender_id: userId, reply_to_id: replyingTo?.message.id,
      attachment_url: attachment?.url, attachment_type: attachment?.type, status: 'sent'
    }).select().single()

    if (error || !savedMsg) return
    setReplyingTo(null)
    setMessages(prev => ({
      ...prev,
      [selectedId]: (prev[selectedId] || []).map(m => m.id === tempId ? { ...m, id: savedMsg.id, timestamp: savedMsg.created_at, status: savedMsg.status } : m)
    }))

    await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', selectedId)
  }, [userId, currentUser, selectedId, selectedConversation, messages, replyingTo, fetchMessages])

  const handleReply = useCallback((message: Message) => {
    let name = message.senderId === userId ? "You" : (selectedConversation?.isGroup ? message.senderName : selectedConversation?.name) || "Unknown"
    setReplyingTo({ message, senderName: name })
  }, [userId, selectedConversation])

  const handleDeleteMessage = useCallback(async (messageId: string) => {
    if (!userId || !selectedId) return
    setMessages(prev => ({ ...prev, [selectedId]: (prev[selectedId] || []).filter(m => m.id !== messageId) }))
    await supabase.rpc('delete_message_for_user', { msg_id: messageId, u_id: userId })
  }, [userId, selectedId])

  const handleDeleteConversation = useCallback(async (conversationId: string) => {
    if (!userId) return
    setConversations(prev => prev.filter(c => c.id !== conversationId))
    if (selectedId === conversationId) setSelectedId(null)
    await supabase.rpc('clear_conversation_for_user', { conv_id: conversationId, u_id: userId })
    fetchConversations()
  }, [userId, selectedId, fetchConversations])

  const handleNewChat = useCallback(async (user: { id: string; name: string; avatar?: string; phone: string }) => {
    if (!userId) return
    const { data: existingConvs } = await supabase.from('conversations').select('id, members:conversation_members(user_id)').eq('is_group', false)
    const existing = existingConvs?.find(conv => conv.members.some((m: any) => m.user_id === user.id) && conv.members.some((m: any) => m.user_id === userId))

    if (existing) {
      handleSelectConversation(existing.id); setShowNewChatModal(false); return
    }

    const { data: convData } = await supabase.from('conversations').insert({ is_group: false }).select().single()
    if (!convData) return
    await supabase.from('conversation_members').insert([{ conversation_id: convData.id, user_id: userId }, { conversation_id: convData.id, user_id: user.id }])
    
    await fetchConversations()
    handleSelectConversation(convData.id); setNavView("dm"); setShowNewChatModal(false)
  }, [userId, fetchConversations, handleSelectConversation])

  const handleCreateGroup = useCallback(async (name: string, userIds: string[]) => {
    if (!userId) return
    const { data: convData } = await supabase.from('conversations').insert({ name, is_group: true }).select().single()
    if (!convData) return
    await supabase.from('conversation_members').insert([userId, ...userIds].map(id => ({ conversation_id: convData.id, user_id: id })))
    await fetchConversations(); handleSelectConversation(convData.id); setNavView("groups"); setShowNewChatModal(false)
  }, [userId, fetchConversations, handleSelectConversation])

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut(); router.push("/sign-in")
  }, [router])

  const handleUpdateUser = useCallback(async (updates: any) => {
    if (!userId) return
    const { error } = await supabase.from('profiles').update(updates).eq('id', userId)
    if (!error) fetchCurrentUser()
  }, [userId, fetchCurrentUser])

  const handleBack = useCallback(() => { setShowMobileChat(false); setReplyingTo(null) }, [])

  // --- Profiles (Derived) ---
  const contactProfile = useMemo(() => selectedConversation && !selectedConversation.isGroup ? {
    id: selectedConversation.id, name: selectedConversation.name, avatar: selectedConversation.avatar,
    email: (selectedConversation as any).email, phone: (selectedConversation as any).phone,
    about: (selectedConversation as any).about || "Hey there!", lastSeen: "Online"
  } : null, [selectedConversation])

  const groupProfile = useMemo(() => selectedConversation?.isGroup ? {
    id: selectedConversation.id, name: selectedConversation.name,
    members: selectedConversation.members?.map((m: any, i: number) => ({ id: `m-${i}`, name: m.name, avatar: m.avatar })) || []
  } : null, [selectedConversation])

  return {
    currentUser, isLoading: false, showUserProfile, setShowUserProfile, handleUpdateUser,
    theme, handleThemeChange: (t: 'light' | 'dark') => { setTheme(t); document.documentElement.classList.toggle('dark', t === 'dark') },
    selectedId, conversations, allUsers, filteredConversations, messages, showMobileChat, searchQuery, setSearchQuery,
    navView, setNavView, showNewChatModal, setShowNewChatModal, showContactProfile, setShowContactProfile,
    showGroupProfile, setShowGroupProfile, replyingTo, setReplyingTo, selectedConversation, contactProfile, groupProfile,
    handleSelectConversation, handleSendMessage, handleReply, handleBack, handleNewChat, handleCreateGroup,
    handleDeleteMessage, handleDeleteConversation, handleLogout,
    handleAddMemberToGroup: async (cid: string, uid: string) => { await supabase.from('conversation_members').insert({ conversation_id: cid, user_id: uid }); fetchConversations() },
    handleRemoveMemberFromGroup: async (cid: string, uid: string) => { await supabase.from('conversation_members').delete().eq('conversation_id', cid).eq('user_id', uid ); fetchConversations() },
    markMessageAsRead: async (mid: string) => { if (!userId) return; await supabase.from('messages').update({ status: 'read', is_read: true }).eq('id', mid).neq('sender_id', userId); fetchConversations() },
    markAllAsRead
  }
}
