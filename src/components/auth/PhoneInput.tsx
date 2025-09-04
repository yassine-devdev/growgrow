import React from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import PhoneInput2 from 'react-phone-input-2';

interface PhoneInputProps {
    control: Control<any>;
    name: string;
    error?: FieldError;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ control, name, error }) => {
    return (
        <div>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <PhoneInput2
                        {...field}
                        country={'us'}
                        inputClass={`!w-full !px-4 !py-3 !text-sm !border !rounded-lg ${error ? '!border-red-500' : '!border-gray-300'}`}
                        buttonClass={`${error ? '!border-red-500' : '!border-gray-300'}`}
                        containerClass="w-full"
                    />
                )}
            />
            {error && <p className="text-red-600 text-xs mt-1">{error.message}</p>}
        </div>
    );
};

export default PhoneInput;