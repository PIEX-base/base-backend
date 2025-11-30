interface CardProps {
  title: string;
  description: string | React.ReactNode;
  variant?: "clickable" | "button";
  href?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  onCardClick?: () => void;
  className?: string;
}

export const Card = ({
  title,
  description,
  variant = "clickable",
  href = "#",
  buttonText = "Read more",
  onButtonClick,
  onCardClick,
  className,
}: CardProps) => {
  const baseClasses =
    "w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700";

  if (variant === "clickable") {
    return (
      <a
        href={href}
        onClick={onCardClick}
        className={`
          ${baseClasses}
          block hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer
          ${className || ""}
        `}>
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {description}
        </p>
      </a>
    );
  }

  // Variante com botão
  return (
    <div className={`${baseClasses} ${className || ""}`}>
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h5>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        {description}
      </p>

      {variant === "button" && buttonText && (
        <button
          onClick={onButtonClick}
          className="inline-flex items-center px-3 py-2 mt-4 text-sm font-medium text-center text-black bg-primary rounded-lg hover:bg-primary/80 focus:ring-4 focus:outline-none focus:ring-primary/30 transition-colors">
          {buttonText}
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
