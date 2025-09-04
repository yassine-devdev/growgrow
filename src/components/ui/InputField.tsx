import React, { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  error?: string;
  icon?: React.ElementType;
}

const InputField: React.FC<InputFieldProps> = ({ name, label, type = 'text', error, icon: Icon, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-brand-text-alt">{label}</label>
        <div className="relative mt-1">
            {Icon && <Icon className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 h-5 w-5 text-gray-400" />}
            <input
                id={name}
                name={name}
                type={type}
                className={`block w-full px-3 py-2 bg-brand-surface border ${error ? 'border-red-500' : 'border-brand-border'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm ${Icon ? 'pl-10' : ''}`}
                {...props}
            />
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
);

export default InputField;