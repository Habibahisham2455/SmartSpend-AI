// IconBadge: icon (Lucide icon component), color (string), bgColor (string), size ('sm'|'md'|'lg'), className
export default function IconBadge({
  icon: Icon,
  color = '#8C52FF',
  bgColor = '#EDE9FE',
  size = 'md',
  className = '',
}) {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div
      className={`rounded-xl flex items-center justify-center shrink-0 transition-transform ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {Icon && (
        <Icon
          className={iconSizes[size] || iconSizes.md}
          style={{ color: color }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
