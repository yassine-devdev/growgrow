import React, { useState, useMemo } from 'react';
import { Search, ChevronRight } from 'lucide-react';

const faqs = [
    {
        question: "How do I change my password?",
        answer: "You can change your password from the System > Settings > Profile view. Look for the 'Change Password' section."
    },
    {
        question: "How does the AI Concierge work?",
        answer: "The AI Concierge uses Google's Gemini model to provide helpful answers. Simply type your question in the chat box and send. It's aware of your role in the app to provide more relevant responses."
    },
    {
        question: "Where can I find my grades?",
        answer: "If you are a Student or Parent, navigate to School Hub > Academics > Grades to see an overview of current grades for all courses."
    },
    {
        question: "How do I manage users as a Provider?",
        answer: "As a Provider, go to the Schools module, then select the Users tab in the header. From there, you can manage Admins, Teachers, Students, and Parents."
    }
];

const HelpOverlay: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFaqs = useMemo(() => {
        if (!searchTerm) {
            return faqs;
        }
        return faqs.filter(faq => 
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <header className="text-center">
                <h2 className="text-2xl font-bold text-brand-text dark:text-dark-text">Help Center</h2>
                <p className="text-brand-text-alt dark:text-dark-text-alt">How can we help you today?</p>
                <div className="relative mt-4 max-w-md mx-auto">
                    <input 
                        type="text"
                        placeholder="Search for help articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-10 border border-brand-border dark:border-dark-border rounded-lg bg-brand-surface dark:bg-dark-surface text-brand-text dark:text-dark-text"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-alt dark:text-dark-text-alt" />
                </div>
            </header>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                <h3 className="font-bold text-brand-text dark:text-dark-text">Frequently Asked Questions</h3>
                {filteredFaqs.length > 0 ? filteredFaqs.map((faq, index) => (
                    <details key={index} className="bg-brand-surface dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-lg p-3 group">
                        <summary className="flex justify-between items-center cursor-pointer font-semibold text-brand-text dark:text-dark-text">
                            {faq.question}
                            <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
                        </summary>
                        <p className="text-sm text-brand-text-alt dark:text-dark-text-alt mt-2 pt-2 border-t border-brand-border dark:border-dark-border">
                            {faq.answer}
                        </p>
                    </details>
                )) : (
                    <div className="text-center py-10 text-brand-text-alt dark:text-dark-text-alt">
                        <p>No results found for "{searchTerm}"</p>
                    </div>
                )}
            </div>
            
            <footer className="text-center text-sm text-brand-text-alt dark:text-dark-text-alt p-2 border-t border-brand-border dark:border-dark-border">
                Can't find what you're looking for? <a href="#" className="text-brand-primary hover:underline">Contact Support</a>
            </footer>
        </div>
    );
};

export default HelpOverlay;