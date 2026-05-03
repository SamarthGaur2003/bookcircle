export const required = (value) => !String(value || '').trim() ? 'This field is required' : ''
export const positiveNumber = (value) => Number(value) > 0 ? '' : 'Enter a valid positive number'
