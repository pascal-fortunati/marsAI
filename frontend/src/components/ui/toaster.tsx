import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './toast'
import { useToast } from '../../hooks/use-toast'
import { CheckCircledIcon, CrossCircledIcon, InfoCircledIcon } from '@radix-ui/react-icons'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <ToastProvider>
      {toasts.map((item) => (
        (() => {
          const tone = item.kind ?? (item.variant === 'destructive' ? 'error' : 'info')
          const style =
            tone === 'success'
              ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-100'
              : tone === 'error'
                ? 'border-rose-400/40 bg-rose-500/15 text-rose-100'
                : 'border-violet-400/40 bg-violet-500/15 text-violet-100'
          const Icon = tone === 'success' ? CheckCircledIcon : tone === 'error' ? CrossCircledIcon : InfoCircledIcon
          return (
            <Toast
              key={item.id}
              open
              onOpenChange={(open) => {
                if (!open) dismiss(item.id)
              }}
              className={`${style} !justify-start !items-start !space-x-0 gap-3 pr-10`}
            >
              <div className="mr-3 mt-0.5 shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div className="grid flex-1 gap-1 text-left">
                {item.title ? <ToastTitle className="text-white">{item.title}</ToastTitle> : null}
                {item.description ? <ToastDescription className="text-white/85">{item.description}</ToastDescription> : null}
              </div>
              <ToastClose className="text-white/70 hover:text-white" />
            </Toast>
          )
        })()
      ))}
      <ToastViewport className="right-3 top-3 left-auto bottom-auto sm:right-4 sm:top-4 sm:left-auto sm:bottom-auto" />
    </ToastProvider>
  )
}
