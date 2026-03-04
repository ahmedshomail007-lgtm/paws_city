const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const variants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed",
  secondary:
    "bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-60 disabled:cursor-not-allowed",
  outline:
    "bg-transparent text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed",
  danger:
    "bg-red-500 text-white hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  icon,
  iconOnly = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const sizeClasses = sizes[size] || sizes.md;
  const variantClasses = variants[variant] || variants.primary;
  const widthClass = fullWidth ? "w-full" : "";
  const iconOnlyClass = iconOnly ? "p-3" : "";

  return (
    <button
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${iconOnlyClass} ${className}`}
      {...props}
    >
      {icon && !iconOnly && <span className="mr-2">{icon}</span>}
      {iconOnly ? icon : children}
    </button>
  );
};

export default Button;
