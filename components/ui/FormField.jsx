// Form field: label, the input (children) and a friendly error message under it.
// htmlFor must match the input's id. The error gets the id "<htmlFor>-error", so the input can point to it
// with aria-describedby.
export default function FormField({ label, htmlFor, error, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="field-label">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
