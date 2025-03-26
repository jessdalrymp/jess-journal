
import React from 'react';

interface AuthFormInputProps {
  id: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
}

export const AuthFormInput = ({
  id,
  type,
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  required = true,
  autoComplete
}: AuthFormInputProps) => {
  return (
    <div>
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-jess-foreground mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-jess-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-jess-primary/60 disabled:bg-jess-subtle/20 disabled:cursor-not-allowed transition-colors duration-200"
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
      />
    </div>
  );
};
