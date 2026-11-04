/** Shared metadata for every WinForms form ported into the web app. */
export type PortStatus = 'ported' | 'in-progress' | 'todo' | 'blocked'

export type SourceFormKind = 'list' | 'edit' | 'dialog'

export interface SourceFormMeta {
  /** WinForms class name, e.g. `FrmProductionReportList`. */
  id: string
  title: string
  /** Path relative to the source repository root. */
  source: string
  kind: SourceFormKind
  status: PortStatus
  /** Web route once the form is ported. */
  route?: string
}
