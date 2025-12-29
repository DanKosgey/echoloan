import React from 'react';
import { Input } from './ui/input';
import { Eye, EyeOff } from 'lucide-react';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
  name?: string;
  showTogglePassword?: boolean;
  onTogglePassword?: () => void;
  passwordVisible?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  required = false,
  name,
  showTogglePassword = false,
  onTogglePassword,
  passwordVisible = false
}) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-2 pl-1">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full ${icon ? 'pl-10 pr-4' : 'px-4'} py-3 text-base border ${
            error ? 'border-destructive focus:ring-destructive/50 focus:border-destructive' : 'border-input focus:ring-primary/50 focus:border-primary'
          } rounded-lg focus:outline-none focus:ring-1 bg-background placeholder:text-muted-foreground`}
        />
        {showTogglePassword && onTogglePassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={onTogglePassword}
          >
            {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
};