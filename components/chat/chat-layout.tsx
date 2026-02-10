"use client"

import { cn } from "@/lib/utils"
import { useChat } from "@/context/ChatContext"
import { ChatSidebar } from "./chat-sidebar"
import { ChatHeader } from "./chat-header"
import { MessageList } from "./message-list"
import { ChatInput } from "./chat-input"
import { UserProfilePanel } from "./user-profile-panel"
import { ContactProfilePanel } from "./contact-profile-panel"
import { GroupProfilePanel } from "./group-profile-panel"
import { NavBar } from "./nav-bar"
import { NewChatModal } from "./new-chat-modal"
import { motion, AnimatePresence } from "framer-motion"

export function ChatLayout() {
  const {
    currentUser,
    isLoading,
    showUserProfile,
    setShowUserProfile,
    handleUpdateUser,
    theme,
    handleThemeChange,
    handleLogout,
    contactProfile,
    showContactProfile,
    setShowContactProfile,
    groupProfile,
    showGroupProfile,
    setShowGroupProfile,
    showNewChatModal,
    setShowNewChatModal,
    allUsers,
    handleNewChat,
    navView,
    setNavView,
    showMobileChat,
    filteredConversations,
    selectedId,
    handleSelectConversation,
    searchQuery,
    setSearchQuery,
    selectedConversation,
    handleBack,
    messages,
    handleSendMessage,
    replyingTo,
    setReplyingTo,
    handleReply,
    markMessageAsRead,
    handleAddMemberToGroup,
    handleRemoveMemberFromGroup,
    handleCreateGroup,
    handleDeleteMessage,
    handleDeleteConversation,
  } = useChat()

  if (isLoading || !currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your chats...</p>
        </div>
      </div>
    )
  }

  const isAnyPanelOpen = showUserProfile || showContactProfile || showGroupProfile

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AnimatePresence>
        {showUserProfile && (
          <UserProfilePanel
            key="user-profile"
            user={currentUser}
            isOpen={showUserProfile}
            onClose={() => setShowUserProfile(false)}
            onUpdateUser={handleUpdateUser}
            theme={theme}
            onThemeChange={handleThemeChange}
            onLogout={handleLogout}
          />
        )}

        {showContactProfile && (
          <ContactProfilePanel
            key="contact-profile"
            contact={contactProfile}
            isOpen={showContactProfile}
            onClose={() => setShowContactProfile(false)}
          />
        )}

        {showGroupProfile && (
          <GroupProfilePanel
            key="group-profile"
            group={groupProfile}
            isOpen={showGroupProfile}
            onClose={() => setShowGroupProfile(false)}
            allUsers={allUsers.filter(u => u.id !== currentUser.id)}
            onAddMember={(userId) => groupProfile && handleAddMemberToGroup(groupProfile.id, userId)}
            onRemoveMember={(userId) => groupProfile && handleRemoveMemberFromGroup(groupProfile.id, userId)}
          />
        )}

        {isAnyPanelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => {
              setShowUserProfile(false)
              setShowContactProfile(false)
              setShowGroupProfile(false)
            }}
          />
        )}
      </AnimatePresence>

      <div className={cn(
        "hidden md:flex",
        showMobileChat && "lg:flex hidden"
      )}>
        <NavBar
          activeView={navView}
          onViewChange={setNavView}
          onProfileClick={() => setShowUserProfile(true)}
        />
      </div>

      {!showMobileChat && (
        <div className="md:hidden">
          <NavBar
            activeView={navView}
            onViewChange={setNavView}
            onProfileClick={() => setShowUserProfile(true)}
          />
        </div>
      )}

      <div className={cn(
        "h-full border-r border-border bg-card/50 lg:w-[380px] xl:w-[420px] flex-shrink-0",
        showMobileChat ? "hidden lg:block" : "block w-full lg:block"
      )}>
        <ChatSidebar
          conversations={filteredConversations}
          selectedId={selectedId || ""}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewChat={() => setShowNewChatModal(true)}
          navView={navView}
          setNavView={setNavView}
        />
      </div>

      <div className={cn(
        "flex flex-1 flex-col relative",
        !showMobileChat && "hidden lg:flex"
      )}>
        {selectedConversation && selectedId ? (
          <>
            <ChatHeader
              name={selectedConversation.name}
              avatar={selectedConversation.avatar}
              online={selectedConversation.online}
              onBack={handleBack}
              showBackButton={showMobileChat}
              onProfileClick={selectedConversation.isGroup ? () => setShowGroupProfile(true) : () => setShowContactProfile(true)}
              isGroup={selectedConversation.isGroup}
              memberCount={selectedConversation.isGroup ? selectedConversation.members?.length : undefined}
            />
            <MessageList
              messages={messages[selectedId] || []}
              currentUserId={currentUser?.id || ""}
              participantName={selectedConversation.name}
              onReply={handleReply}
              onDelete={handleDeleteMessage}
              onMarkAsRead={markMessageAsRead}
              isGroup={selectedConversation.isGroup}
            />
            <ChatInput 
              onSend={handleSendMessage} 
              replyingTo={replyingTo}
              onCancelReply={() => setReplyingTo(null)}
            />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-muted-foreground">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>

      <NewChatModal
        open={showNewChatModal}
        onOpenChange={setShowNewChatModal}
        allUsers={allUsers.filter(u => u.id !== currentUser.id)}
        onSelectUser={handleNewChat}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  )
}
