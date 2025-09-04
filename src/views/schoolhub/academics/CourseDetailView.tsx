import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCourseDetails } from '@/api/schoolHubApi';
import { QUERY_KEYS } from '@/constants/queries';
import { Loader2, BookOpen, ClipboardList, Paperclip, Users, FileText, Video, Link as LinkIcon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { CourseResource } from '@/api/schemas/schoolHubSchemas';

const resourceIcons: { [key in CourseResource['type']]: React.ElementType } = {
    document: FileText,
    video: Video,
    link: LinkIcon,
};

const CourseDetailView: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const user = useAppStore(s => s.user);
    const [activeTab, setActiveTab] = useState('syllabus');

    const { data: course, isLoading } = useQuery({
        queryKey: QUERY_KEYS.courseDetails(courseId!),
        queryFn: () => getCourseDetails(courseId!),
        enabled: !!courseId,
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    if (!course) return <div>Course not found.</div>;
    
    const canViewRoster = user?.role === 'Admin' || user?.role === 'Teacher';

    const tabs = [
        { id: 'syllabus', label: 'Syllabus', icon: BookOpen },
        { id: 'assignments', label: 'Assignments', icon: ClipboardList },
        { id: 'resources', label: 'Resources', icon: Paperclip },
    ];
    if (canViewRoster) {
        tabs.push({ id: 'roster', label: 'Roster', icon: Users });
    }

    return (
        <div className="flex flex-col h-full gap-4">
            <div>
                <h1 className="text-3xl font-bold text-brand-text">{course.name}</h1>
                <p className="text-brand-text-alt">Taught by {course.teacher}</p>
            </div>
            
            <div className="border-b border-brand-border">
                <nav className="flex space-x-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 py-2 px-3 text-sm font-semibold ${activeTab === tab.id ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-brand-text-alt hover:text-brand-text'}`}
                        >
                           <tab.icon className="w-4 h-4" /> {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
                {activeTab === 'syllabus' && (
                    <div className="prose max-w-none">
                        <p>{course.description}</p>
                    </div>
                )}
                {activeTab === 'assignments' && (
                    <div className="space-y-3">
                        {course.assignments.map(assignment => (
                            <Link to={`/school-hub/academics/assignments/${assignment.id}`} key={assignment.id} className="block p-3 bg-brand-surface-alt rounded-lg hover:bg-brand-primary/10 transition-colors">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-brand-text">{assignment.title}</p>
                                    <p className="text-sm text-brand-text-alt">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                {activeTab === 'resources' && (
                    <div className="space-y-3">
                        {course.resources.map(resource => {
                             const Icon = resourceIcons[resource.type];
                            return (
                                <div key={resource.id} className="p-3 bg-brand-surface-alt rounded-lg flex items-center gap-3">
                                   <Icon className="w-5 h-5 text-brand-primary" />
                                   <p className="font-semibold text-brand-text">{resource.title}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
                 {activeTab === 'roster' && canViewRoster && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {course.roster?.map(student => (
                            <div key={student.id} className="p-3 bg-brand-surface-alt rounded-lg text-center">
                                <p className="font-semibold">{student.name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDetailView;