import { useConfirm } from 'primevue/useconfirm'

export type ConfirmTone = 'danger' | 'warn' | 'info'

export interface AppConfirmOptions {
  header: string
  message: string
  acceptLabel?: string
  rejectLabel?: string
  tone?: ConfirmTone
}

/** Promise-based wrapper around the app-wide PrimeVue ConfirmDialog. */
export function useAppConfirm() {
  const service = useConfirm()

  function ask(options: AppConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      let settled = false
      const finish = (accepted: boolean) => {
        if (settled) return
        settled = true
        resolve(accepted)
      }

      service.require({
        header: options.header,
        message: options.message,
        icon: options.tone === 'danger' ? 'pi pi-exclamation-triangle' : 'pi pi-question-circle',
        acceptLabel: options.acceptLabel ?? 'Confirm',
        rejectLabel: options.rejectLabel ?? 'Cancel',
        defaultFocus: 'reject',
        blockScroll: true,
        acceptProps: { severity: options.tone ?? 'danger' },
        rejectProps: { severity: 'secondary', outlined: true },
        accept: () => finish(true),
        reject: () => finish(false),
        onHide: () => finish(false),
      })
    })
  }

  return { ask }
}
