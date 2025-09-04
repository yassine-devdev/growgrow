import React, { lazy, Suspense, useState } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { getMessages, getAnnouncements, deleteAnnouncement } from '../../api/schoolHubApi';
import { Loader2, Bell, Inbox as InboxIcon, Plus, Edit, Trash2 } from 'lucide-react';
import EmptyState from '../EmptyState';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Message, Announcement } from '@/api/schemas/schoolHubSchemas';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';
import DataEmptyState from '@/components/ui/DataEmptyState';
import AnnouncementFormModal from './AnnouncementFormModal';
import MessageComposerModal from './MessageComposerModal';

const LoadingSpinner = () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;

const Inbox = () => {
    const { data: messages, isLoading } = useQuery({ queryKey: ['messages'], queryFn: getMessages });
    const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    
    const selectedMessage = messages?.find(m => m.id === selectedMessageId);
    
    if (isLoading) return <LoadingSpinner />;
    if (!messages || messages.length === 0) return (
         <>
            <div className="h-full flex flex-col items-center justify-center">
                <DataEmptyState 
                    icon={InboxIcon} 
                    title="Your Inbox is Empty" 
                    description="When you receive new messages, they will appear here."
                    action={{ label: "Compose New Message", onClick: () => setIsComposerOpen(true) }}
                />
            </div>
             <MessageComposerModal isOpen={isComposerOpen} onClose={() => setIsComposerOpen(false)} />
        </>
    );

    // Select the first message by default if none is selected
    if (selectedMessageId === null && messages.length > 0) {
        setSelectedMessageId(messages[0].id);
    }
    
    return (
        <>
            <div className="h-full flex gap-4">
                <div className="w-1/3 border border-brand-border rounded-lg flex flex-col">
                    <div className="flex justify-between items-center p-3 border-b border-brand-border">
                        <h2 className="text-lg font-bold">Inbox</h2>
                        <button 
                            onClick={() => setIsComposerOpen(true)}
                            className="p-2 bg-brand-primary text-white rounded-full hover:bg-brand-primary-hover"
                            aria-label="New Message"
                        >
                            <Plus className="w-4 h-4"/>
                        </button>
                    </div>
                     <div className="flex-1 overflow-y-auto">
                        {messages.map((msg) => (
                            <button
                                key={msg.id}
                                onClick={() => setSelectedMessageId(msg.id)}
                                className={`w-full text-left p-3 border-b border-brand-border last:border-b-0 ${selectedMessageId === msg.id ? 'bg-brand-primary/10' : 'hover:bg-brand-surface-alt'}`}
                            >
                                <div className="flex justify-between items-baseline">
                                    <p className={`font-semibold text-sm truncate ${!msg.read ? 'text-brand-text' : 'text-brand-text-alt'}`}>{msg.from}</p>
                                    {!msg.read && <div className="w-2 h-2 bg-brand-primary rounded-full shrink-0"></div>}
                                </div>
                                <p className="text-sm truncate">{msg.subject}</p>
                            </button>
                        ))}
                     </div>
                </div>
                 <div className="w-2/3 border border-brand-border rounded-lg p-4">
                    {selectedMessage ? (
                        <div>
                            <h3 className="text-xl font-bold">{selectedMessage.subject}</h3>
                            <p className="text-sm text-brand-text-alt">From: {selectedMessage.from}</p>
                            <div className="border-t border-brand-border my-4"></div>
                            <p className="whitespace-pre-wrap">{selectedMessage.body}</p>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-center text-brand-text-alt">
                            <div>
                                <InboxIcon className="w-12 h-12 mx-auto mb-2" />
                                <p>Select a message to read</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <MessageComposerModal isOpen={isComposerOpen} onClose={() => setIsComposerOpen(false)} />
        </>
    );
}

const Announcements = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    const user = useAppStore(s => s.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

    const { data: announcements = [], isLoading } = useQuery<Announcement[]>({
        queryKey: ['announcements'],
        queryFn: getAnnouncements,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteAnnouncement,
        onSuccess: () => {
            addToast({ message: 'Announcement deleted', type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['announcements'] });
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to delete announcement', type: 'error' });
        }
    });
    
    const canManage = user?.role === 'Admin' || user?.role === 'Teacher';
    
    const handleOpenAddModal = () => {
        setEditingAnnouncement(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (announcement: Announcement) => {
        setEditingAnnouncement(announcement);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            deleteMutation.mutate(id);
        }
    };
    
    if (isLoading) return <LoadingSpinner />;

    return (
        <>
            <div className="h-full flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-brand-text">{t('views.announcements.title')}</h1>
                    {canManage && (
                        <button onClick={handleOpenAddModal} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary-hover">
                            <Plus className="w-4 h-4" />
                            {t('views.announcements.addAnnouncement')}
                        </button>
                    )}
                </div>
                {announcements.length === 0 ? (
                    <div className="flex-1">
                        <DataEmptyState
                            icon={Bell}
                            title={t('views.announcements.noAnnouncementsTitle')}
                            description={t('views.announcements.noAnnouncementsDescription')}
                            action={canManage ? { label: t('views.announcements.addAnnouncement'), onClick: handleOpenAddModal } : undefined}
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {announcements.map(item => (
                            <div key={item.id} className="p-4 bg-brand-surface border border-brand-border rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-brand-text">{item.title}</h3>
                                        <p className="text-xs text-brand-text-alt">{t('views.announcements.postedOn', { date: new Date(item.date).toLocaleDateString() })}</p>
                                    </div>
                                    {canManage && (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleOpenEditModal(item)} className="p-1"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-brand-text mt-2">{item.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
             <AnnouncementFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                announcementToEdit={editingAnnouncement}
            />
        </>
    );
}


const L2Routes: React.FC = () => {
    const { l2_id } = useParams();
    switch (l2_id) {
        case 'inbox': return <Inbox />;
        case 'announcements': return <Announcements />;
        default: return <EmptyState message="Unknown channel" />;
    }
}

const CommsView: React.FC = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route index element={<Navigate to="messages/inbox" replace />} />
                <Route path=":l1_id/:l2_id" element={<L2Routes />} />
            </Routes>
        </Suspense>
    );
};

export default CommsView;