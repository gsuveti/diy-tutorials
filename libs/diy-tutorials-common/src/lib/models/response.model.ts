export interface Response {
  questionUUID?: string,
  responseUUID?: string,
  value?: string,
  values?: string[],
  text?: string,
  nextSection?: string
  goToNextSection?: boolean
}
