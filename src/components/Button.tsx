import { forwardRef, type ComponentPropsWithRef } from 'react'

export type ButtonVariant = 'primary' | 'ghost' | 'secondary'

const variantClass: Record<ButtonVariant, string> = {
  primary: 'button button--primary',
  ghost: 'button button--ghost',
  secondary: 'button button--secondary',
}

export type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: ButtonVariant
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', type = 'button', ...props },
  ref,
) {
  const merged = [variantClass[variant], className].filter(Boolean).join(' ')
  return <button ref={ref} type={type} className={merged} {...props} />
})
