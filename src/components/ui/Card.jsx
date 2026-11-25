// Card: children, className, hoverable (boolean), padding ('none'|'sm'|'md'|'lg')
export default function Card({
  children,
  className = '',
  hoverable = false,
  padding = 'md',
  ...props
}) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={`fintech-card rounded-2xl ${paddingClasses[padding] || paddingClasses.md} ${
        hoverable ? 'hover:-translate-y-0.5 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
