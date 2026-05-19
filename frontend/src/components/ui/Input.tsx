import React from "react";

interface InputProps {
  label: string;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  // Para mostrar indicador opcional, como contador de caracteres
  rightLabel?: string;
}

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  rightLabel,
}: InputProps) {
  const inputId = React.useId();

  return (
    <div>
      <label
        htmlFor={inputId}
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#374151",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span>
          {label}
          {required && <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>}
        </span>
        {rightLabel && (
          <span style={{ fontWeight: 400, color: "#9ca3af", fontSize: 12 }}>
            {rightLabel}
          </span>
        )}
      </label>
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        style={{
          width: "100%",
          padding: "10px 14px",
          border: `1.5px solid ${error ? "#ef4444" : "#d1d5db"}`,
          borderRadius: 8,
          fontSize: 14,
          color: "#111827",
          outline: "none",
          boxSizing: "border-box",
          background: disabled ? "#f9fafb" : "#fff",
          cursor: disabled ? "not-allowed" : "text",
        }}
        onFocus={(e) => {
          if (!error) e.currentTarget.style.borderColor = "#10b981";
        }}
        onBlur={(e) => {
          if (!error) e.currentTarget.style.borderColor = "#d1d5db";
        }}
      />
      {error && (
        <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4, marginBottom: 0 }}>
          {error}
        </p>
      )}
    </div>
  );
}