import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow-md hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg focus-visible:ring-primary active:bg-primary-dark",
        outline:
          "border-primary bg-transparent text-primary hover:bg-primary hover:text-white focus-visible:ring-primary",
        secondary:
          "bg-secondary text-text-dark shadow-md hover:-translate-y-0.5 hover:bg-secondary-hover hover:shadow-lg focus-visible:ring-secondary",
        ghost:
          "text-text-dark hover:bg-bg-light hover:text-primary focus-visible:ring-primary",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive",
        link: "text-primary underline-offset-4 hover:text-primary-hover hover:underline",
      },
      size: {
        default: "h-11 gap-2 px-6 py-3 text-base",
        xs: "h-8 gap-1 rounded-md px-3 text-xs",
        sm: "h-9 gap-1.5 rounded-md px-4 text-sm",
        lg: "h-12 gap-2 rounded-md px-8 text-base",
        icon: "size-11",
        "icon-xs": "size-8 rounded-md",
        "icon-sm": "size-9 rounded-md",
        "icon-lg": "size-12",
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
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
