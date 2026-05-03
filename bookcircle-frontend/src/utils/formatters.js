export const currency = (value) => {
  const number = Number(value || 0)
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(number)
}

export const initials = (name = '') => name
  .split(' ')
  .map(part => part[0])
  .filter(Boolean)
  .slice(0, 2)
  .join('')
  .toUpperCase()
