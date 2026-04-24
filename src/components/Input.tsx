import { forwardRef, type ComponentPropsWithRef } from 'react'

export type InputProps = ComponentPropsWithRef<'input'>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  const merged = ['input', className].filter(Boolean).join(' ')
  return <input ref={ref} className={merged} {...props} />
})
