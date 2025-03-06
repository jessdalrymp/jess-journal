
import { Input } from '../ui/input';

interface AuthFormInputProps {
  id: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
}

export const AuthFormInput = ({
  id,
  type,
  value,
  onChange,
  label,
  placeholder,
}: AuthFormInputProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-jess-muted mb-1">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-jess-subtle text-jess-foreground"
        placeholder={placeholder}
        required
      />
    </div>
  );
};
