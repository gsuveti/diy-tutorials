export interface Answer {
  uuid: string,
  value?: string,
  values?: string[],
  text: string,
  nextSection?: string
  goToNextSection?: boolean
}
