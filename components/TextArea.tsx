import React from 'react';

/**
 * Props for the TextArea component.
 */
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={props.id} className="block text-green-300 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`
          block w-full p-4 text-green-400 bg-gray-800 border border-green-700 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
          resize-y min-h-[150px] md:min-h-[250px]
          ${className}
        `}
        {...props}
      />
    </div>
  );
};

export default TextArea;
