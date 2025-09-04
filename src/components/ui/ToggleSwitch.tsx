import React, { InputHTMLAttributes } from 'react';

interface ToggleSwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  description: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ name, label, description, checked, onChange, ...props }) => (
    <>
        <style>{`
            .toggle-checkbox:checked { right: 0; border-color: #4f46e5; }
            .toggle-checkbox:checked + .toggle-label { background-color: #4f46e5; }
        `}</style>
        <div className="flex items-start justify-between">
            <div>
                <label htmlFor={name} className="font-medium text-brand-text cursor-pointer">{label}</label>
                <p className="text-sm text-brand-text-alt">{description}</p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                    type="checkbox"
                    name={name}
                    id={name}
                    checked={checked}
                    onChange={onChange}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    {...props}
                />
                <label htmlFor={name} className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
        </div>
    </>
);

export default ToggleSwitch;