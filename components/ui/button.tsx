import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding font-bold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm",
        accent:
          "bg-brand-accent text-brand-accent-foreground shadow-sm hover:bg-brand-accent/90 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm focus-visible:ring-brand-accent/50",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground shadow-sm aria-expanded:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "border border-border/50 bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:-translate-y-0.5 active:translate-y-0",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md hover:-translate-y-0.5",
        link: "text-primary underline-offset-4 hover:underline",
        "table-action": "border border-border/50 bg-background text-foreground hover:bg-muted hover:text-primary shadow-sm",
        "icon-toggle": "bg-transparent text-foreground hover:bg-muted hover:scale-110",
      },
      size: {
        default: "h-10 px-6 py-2.5 text-sm [&_svg]:size-4 gap-2",
        xs: "h-7 px-2.5 py-1 text-xs rounded-lg gap-1.5 [&_svg]:size-3",
        sm: "h-9 px-4 py-2 text-xs gap-2 [&_svg]:size-3.5",
        lg: "h-12 px-8 py-3 text-base gap-2 [&_svg]:size-5",
        icon: "size-10 rounded-full [&_svg]:size-5",
        "icon-sm": "size-8 rounded-full [&_svg]:size-4",
        "icon-lg": "size-12 rounded-full [&_svg]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
