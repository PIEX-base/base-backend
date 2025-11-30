export const InputField = ({
  label,
  id,
  readOnly,
  labelBlack,
  backgroundColor = "bg-gray-50",
  required = false,
  maxLength,
  ...props
}: {
  label: string;
  labelBlack?: boolean;
  backgroundColor?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label
      htmlFor={id}
      className={`block mb-2 text-sm font-medium ${
        labelBlack ? "text-black" : "text-white"
      }`}>
      {label}
    </label>

    <input
      maxLength={maxLength}
      required={required}
      readOnly={readOnly}
      id={id}
      className={`${
        readOnly ? "bg-gray-400" : backgroundColor
      }  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5`}
      {...props}
    />
  </div>
);
