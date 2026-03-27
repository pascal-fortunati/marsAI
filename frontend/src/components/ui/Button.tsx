import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { forwardRef } from "react";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        /* Bouton primaire avec dégradé et meilleur contraste */
        default:
          "bg-gradient-to-r from-violet-500 to-violet-600 text-white font-semibold hover:from-violet-600 hover:to-violet-700 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 active:from-violet-700 active:to-violet-800",

        /* Bouton secondaire subtil */
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",

        /* Bouton outline avec meilleur contraste */
        outline:
          "border-2 border-border bg-transparent text-foreground hover:bg-secondary/30 hover:border-ring active:bg-secondary/50",

        /* Bouton ghost (transparent) */
        ghost:
          "bg-transparent text-foreground hover:bg-secondary/20 active:bg-secondary/40",

        /* Bouton destructif */
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-90 shadow-lg shadow-destructive/30 active:opacity-100",

        /* Lien texte */
        link: "text-primary underline-offset-4 hover:underline",

        /* Bouton navbar adapte au theme actif */
        nav: "text-foreground bg-transparent hover:text-primary active:text-primary/80 hover:bg-secondary/40 rounded px-2 py-1",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
        nav: "h-8 px-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  ),
);
Button.displayName = "Button";
