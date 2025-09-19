import * as React from "react";

interface SwitchProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, checked, onChange, disabled, className }, ref) => {
    return (
      <label className={`inline-flex items-center cursor-pointer select-none ${className}`}>
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          ref={ref}
        />
        <span className={`w-10 h-6 bg-gray-300 rounded-full relative transition-colors duration-200 ease-in-out ${
          checked ? 'bg-green-500' : 'bg-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`} />
        </span>
        {label && <span className="ml-3 text-sm text-gray-700">{label}</span>}
      </label>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;
