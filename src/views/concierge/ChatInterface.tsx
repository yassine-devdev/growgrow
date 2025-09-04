import React, { useState, useRef, useEffect } from 'react';
import { Bot, Plus, Send, Trash2, User, Sparkles, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getAiStreamingResponse } from '@/api/conciergeApi';
import { useTranslation } from 'react-i18next';
import { useFeatureFlag } from '@/context/FeatureFlagContext';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';

/**
 * Represents a single message in a conversation.
 */
interface Message {
    sender: 'user' | 'ai';
    text: string;
}

/**
 * Represents a single conversation thread.
 */
interface Conversation {
    id: number;
    title: string;
    messages: Message[];
}

/**
 * A sub-component within the Concierge view that provides a tool powered by the AI Assistant.
 * Its visibility is controlled by the `conciergeAiAssistant` feature flag.
 * @returns {JSX.Element} The rendered AI Assistant tool card.
 */
const AiAssistantTool: React.FC = () => (
    <div className="p-3 bg-brand-primary/10 border border-brand-primary/20 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-brand-primary"/>
            <h4 className="font-bold text-brand-text dark:text-dark-text">AI Assistant</h4>
        </div>
        <p className="text-sm text-brand-text-alt dark:text-dark-text-alt mb-3">
            Use AI to draft lesson plans, summarize documents, or generate ideas.
        </p>
        <button className="w-full text-sm py-2 bg-brand-primary text-white rounded-lg">
            Launch Assistant
        </button>
    </div>
);

/**
 * Renders the AI Concierge view, a chat interface for interacting with a generative AI model.
 * It manages conversation history, message sending, and streaming AI responses.
 *
 * @returns {JSX.Element} The rendered AI Concierge chat component.
 */
const ChatInterface: React.FC = () => {
    const user = useAppStore((state) => state.user);
    const { t } = useTranslation();
    const { isEnabled } = useFeatureFlag('conciergeAiAssistant');

    const [conversations, setConversations] = useState<Conversation[]>([{ id: 1, title: 'New Chat', messages: [] }]);
    const [activeConversationId, setActiveConversationId] = useState<number>(1);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    const promptStarters = [
        "Summarize recent system incidents",
        "Draft a welcome email for a new school",
        "What are the key features of the Provider dashboard?",
        "Explain the A/B testing feature",
    ];

    const handlePromptStarterClick = (prompt: string) => {
        setInput(prompt);
    };

    /**
     * Scrolls the message list to the bottom.
     */
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [activeConversation?.messages, isLoading]);

    /**
     * Handles sending a user's message. It updates the conversation state
     * and triggers the mutation to get a streaming response from the AI.
     */
    const handleSendMessage = async () => {
        if (!input.trim() || !activeConversation || !user) return;

        const currentInput = input;
        setInput('');

        const userMessage: Message = { sender: 'user', text: currentInput };
        const aiPlaceholder: Message = { sender: 'ai', text: '' };

        setConversations(prev => prev.map(c =>
            c.id === activeConversationId ? { ...c, messages: [...c.messages, userMessage, aiPlaceholder] } : c
        ));
        
        setIsLoading(true);

        try {
            const stream = getAiStreamingResponse(currentInput, user.role);
            for await (const cumulativeText of stream) {
                setConversations(prev => prev.map(c => {
                    if (c.id === activeConversationId) {
                        const newMessages = [...c.messages];
                        newMessages[newMessages.length - 1].text = cumulativeText;
                        return { ...c, messages: newMessages };
                    }
                    return c;
                }));
            }
        } catch (error) {
            console.error("Failed to get AI response:", error);
             setConversations(prev => prev.map(c => {
                if (c.id === activeConversationId) {
                    const newMessages = [...c.messages];
                    newMessages[newMessages.length - 1].text = "Sorry, I encountered an error. Please try again.";
                    return { ...c, messages: newMessages };
                }
                return c;
            }));
        } finally {
            setIsLoading(false);
        }
    };
    
    /**
     * Creates a new, empty conversation and sets it as the active one.
     */
    const handleNewChat = () => {
        const newId = Date.now();
        const newConversation: Conversation = { id: newId, title: 'New Chat', messages: [] };
        setConversations(prev => [...prev, newConversation]);
        setActiveConversationId(newId);
    };

    /**
     * Deletes a conversation from the history.
     * @param {number} id - The ID of the conversation to delete.
     */
    const handleDeleteChat = (id: number) => {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeConversationId === id && conversations.length > 1) {
            setActiveConversationId(conversations.find(c => c.id !== id)?.id || 0);
        } else if (conversations.length <= 1) {
            handleNewChat();
        }
    }

    return (
        <div className="h-full flex gap-6">
            {/* Conversation History */}
            <div className="w-1/4 bg-brand-surface dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-lg p-4 flex flex-col">
                <button onClick={handleNewChat} className="w-full flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-colors">
                    <Plus className="w-5 h-5" /> {t('views.concierge.newChat')}
                </button>
                <div className="flex-1 overflow-y-auto space-y-2">
                    {conversations.map(c => (
                        <div key={c.id} onClick={() => setActiveConversationId(c.id)} className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${activeConversationId === c.id ? 'bg-brand-surface-alt dark:bg-dark-surface-alt' : 'hover:bg-brand-surface-alt/50 dark:hover:bg-dark-surface-alt/50'}`}>
                            <p className="truncate text-sm text-brand-text dark:text-dark-text">{c.messages[0]?.text || c.title}</p>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteChat(c.id);}} className="text-brand-text-alt dark:text-dark-text-alt hover:text-red-400">
                                <Trash2 className="w-4 h-4"/>
                            </button>
                        </div>
                    ))}
                </div>
                {isEnabled && (
                    <div className="mt-4 pt-4 border-t border-brand-border dark:border-dark-border">
                        <AiAssistantTool />
                    </div>
                )}
            </div>

            {/* Chat Interface */}
            <div className="w-3/4 bg-brand-surface dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-lg flex flex-col p-4">
                <div className="flex-1 overflow-y-auto mb-4 pr-2">
                    {activeConversation?.messages.length === 0 && (
                        <div className="h-full flex flex-col justify-center items-center text-center">
                            <Bot className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                            <h2 className="text-xl font-bold text-brand-text dark:text-dark-text">AI Concierge</h2>
                            <p className="text-brand-text-alt dark:text-dark-text-alt mb-6">How can I help you manage your platform today?</p>
                             <div className="grid grid-cols-2 gap-3 max-w-lg">
                                {promptStarters.map(prompt => (
                                     <button 
                                        key={prompt}
                                        onClick={() => handlePromptStarterClick(prompt)}
                                        className="p-3 bg-brand-surface-alt dark:bg-dark-surface-alt border border-brand-border dark:border-dark-border rounded-lg text-sm text-left hover:bg-brand-primary/5 transition-colors"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeConversation?.messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-4 mb-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center shrink-0"><Bot className="w-5 h-5 text-white" /></div>}
                            <div className={`p-3 rounded-lg max-w-xl ${msg.sender === 'user' ? 'bg-brand-primary text-white' : 'bg-brand-surface-alt dark:bg-dark-surface-alt text-brand-text dark:text-dark-text'}`}>
                               {msg.sender === 'ai' ? (
                                    <MarkdownRenderer content={msg.text} />
                                ) : (
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                )}
                                {isLoading && msg.sender === 'ai' && index === activeConversation.messages.length - 1 && <Loader2 className="w-4 h-4 animate-spin inline-block ml-2" />}
                            </div>
                            {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-brand-surface-alt dark:bg-dark-surface-alt flex items-center justify-center shrink-0"><User className="w-5 h-5 text-brand-text dark:text-dark-text" /></div>}
                        </div>
                    ))}
                     <div ref={messagesEndRef} />
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                        placeholder={t('views.concierge.placeholder')}
                        disabled={isLoading}
                        className="w-full bg-brand-surface-alt dark:bg-dark-surface-alt border border-brand-border dark:border-dark-border rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text dark:text-dark-text"
                    />
                    <button onClick={handleSendMessage} disabled={isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt transition-colors">
                        <Send className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
