import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '~/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // --- ของเดิม ---
        'default': 'bg-accent text-white shadow hover:bg-primary',
        'destructive':
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        'outline':
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        'secondary': 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        'ghost': 'hover:bg-accent hover:text-accent-foreground',
        'link': 'text-primary underline-offset-4 hover:underline',

        // 1. กลุ่ม Status Colors (แจ้งเตือนสถานะ)
        'success': 'bg-green-500 text-white shadow-sm hover:bg-green-600',
        'warning': 'bg-amber-500 text-white shadow-sm hover:bg-amber-600',
        'info': 'bg-blue-500 text-white shadow-sm hover:bg-blue-600',

        // 2. กลุ่ม Soft Colors (สีพื้นหลังอ่อนๆ ดูสบายตา)
        'soft': 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-transparent',
        'soft-success': 'bg-green-100 text-green-700 hover:bg-green-200',
        'soft-danger': 'bg-red-100 text-red-700 hover:bg-red-200',

        // 3. กลุ่ม Design เฉพาะทาง
        'gradient':
          'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-none shadow-md hover:opacity-90',
        'glass':
          'bg-white/30 backdrop-blur-md border border-white/20 text-slate-800 shadow-sm hover:bg-white/40',
        'rounded': 'rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
