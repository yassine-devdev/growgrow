import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Loader2, Wand2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

type EmailResult = { world: string; subjects: string[] };

interface EmailSubjectsProps {
    data: EmailResult[];
    onDataChange: (data: EmailResult[]) => void;
}

const EmailSubjects: React.FC<EmailSubjectsProps> = ({ data, onDataChange }) => {
    const addToast = useAppStore(s => s.addToast);
    const [isLoading, setIsLoading] = useState(false);
    const [topic, setTopic] = useState('');

    const handleGenerate = async () => {
        if (!topic) {
            addToast({ message: 'Please enter an email topic.', type: 'error' });
            return;
        }
        setIsLoading(true);
        const worlds = ['Curiosity', 'Urgency', 'Humor', 'Authority'];
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        try {
            const promises = worlds.map(world => 
                ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `Generate 3 email subject lines about "${topic}". The tone should be ${world}. Return only a JSON array of strings.`
                }).then(res => {
                    const resultText = res.text.replace(/```json|```/g, '').trim();
                    return { world, subjects: JSON.parse(resultText) };
                })
            );
            const responses = await Promise.all(promises);
            onDataChange(responses);
        } catch (e) {
            console.error(e);
            addToast({ message: 'Failed to generate subjects. Showing sample data.', type: 'error' });
            // Populate with sample data on failure for demonstration
            onDataChange([
                { world: 'Curiosity', subjects: ['Is this the secret to better grades?', 'You won\'t believe what\'s new...', 'The one thing every student needs.'] },
                { world: 'Urgency', subjects: ['Last chance: 50% off tuition ends tonight!', 'Your application is incomplete!', 'Don\'t miss out on early enrollment.'] },
                { world: 'Humor', subjects: ['Finally, a reason to like Mondays.', 'Stop procrastinating (after you read this).', 'Our mascot has a secret...'] },
                { world: 'Authority', subjects: ['Official Announcement: New Scholarship Program', 'A message from the Dean of Admissions', 'The 2025 Academic Calendar is here.'] },
            ]);
        }
        setIsLoading(false);
    };
    
    const handleSubjectChange = (worldIndex: number, subjectIndex: number, value: string) => {
        const newData = [...data];
        newData[worldIndex].subjects[subjectIndex] = value;
        onDataChange(newData);
    };

    return (
        <div className="space-y-4">
             <div className="flex gap-2">
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Enter email topic..." className="flex-1 p-2 border rounded-md" />
                <button onClick={handleGenerate} disabled={isLoading} className="px-4 py-2 bg-brand-primary text-white rounded-md flex items-center gap-2 disabled:bg-gray-400">
                    {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />} Generate Subjects
                </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {data.map((res, worldIndex) => (
                    <div key={res.world} className="p-4 border rounded-lg bg-brand-surface">
                        <h3 className="font-bold mb-2">{res.world} Driven</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            {res.subjects.map((s, subjectIndex) => (
                                <li key={subjectIndex}>
                                    <input 
                                        type="text" 
                                        value={s} 
                                        onChange={(e) => handleSubjectChange(worldIndex, subjectIndex, e.target.value)}
                                        className="w-full bg-transparent focus:bg-white focus:ring-1 focus:ring-brand-primary rounded p-1" 
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmailSubjects;