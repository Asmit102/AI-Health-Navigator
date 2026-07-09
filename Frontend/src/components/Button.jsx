export default function Button({ children, variant = "primary", size = "md", href, onClick, className = "", as = "a" }) {
  const base = "btn";
  const variantClass = variant === "outline" ? "btn-outline" : variant === "ghost" ? "btn-ghost" : "btn-primary";
  const sizeClass = size === "lg" ? "btn-lg" : "";
  const classes = `${base} ${variantClass} ${sizeClass} ${className}`;

  if (as === "button") {
    return <button type="submit" onClick={onClick} className={classes}>{children}</button>;
  }
  return <a href={href} onClick={onClick} className={classes}>{children}</a>;
}