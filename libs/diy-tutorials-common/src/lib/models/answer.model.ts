export interface Answer {
  uuid: string,
  value?: string,
  values?: string[],
  text: string,
  nextSection?: number
  sectionIndex?: number
  goToNextSection?: boolean
}
