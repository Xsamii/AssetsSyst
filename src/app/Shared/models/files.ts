export interface UploadFiles {
  [x: string]: any
  isSuccess: true,
  errors: [],
  data:
  {
    id: number,
    filePath: string,
    fullPath: string,
    originalName: string,
    attachTypeId: number | null
  }[]
}
export interface File {
  id?: number | null,
  filePath?: string | null,
  fullPath?: string | null,
  originalName?: string | null,
  attachTypeId?: number | null,
  name?: string | null,
  size?: string | null,
  type?: number | null,
  progress?: number | null
  fileSize?: number | null,
  isPicked?: boolean,
  hide?: boolean
}
