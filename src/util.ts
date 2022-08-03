export const removeAllBlank = (str: string) => str.replace(/\s/g, '')
export const isTest = process.env.NODE_ENV === 'test'
