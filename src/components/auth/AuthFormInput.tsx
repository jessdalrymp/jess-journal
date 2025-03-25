
interface AuthFormInputProps {
  id: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  disabled?: boolean; // Make disabled an optional prop
}

export const AuthFormInput = ({ 
  id, 
  type, 
  value, 
  onChange, 
  label, 
  placeholder,
  disabled = false // Default value is false
}: AuthFormInputProps) => {
  return (
    <div>
      <label 
        htmlFor={id} 
        className="block text-sm font-medium mb-1 text-jess-foreground"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-jess-subtle border border-jess-border rounded-md focus:outline-none focus:ring-2 focus:ring-jess-primary focus:border-transparent"
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};
