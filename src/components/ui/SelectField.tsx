import React, { SelectHTMLAttributes } from 'react';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

const SelectField: React.FC<SelectFieldProps> = ({ name, label, error, children, ...props }) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-brand-text-alt">{label}</label>
        <select
            id={name}
            name={name}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base bg-brand-surface border ${error ? 'border-red-500' : 'border-brand-border'} focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md`}
            {...props}
        >
            {children}
        </select>
         {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
);

export default SelectField;