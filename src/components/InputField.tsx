import React from "react";
import { InputData } from "../types";

interface InputFieldProps {
  label: string;
  id: string;
  name: keyof InputData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = React.memo(
  ({ label, id, name, value, onChange }) => (
    <div className="flex flex-col mb-4">
      <label htmlFor={id} className="mb-2 font-medium">
        {label}
      </label>
      <input
        type="number"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        required
        aria-required="true"
        min="0"
        step="any"
      />
    </div>
  )
);

export default InputField;
