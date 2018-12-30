function formatCurrency(num, opts = {}){
  const defaults = {
    style: 'currency',
    currency: 'INR',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2
  }

  let formatter = new Intl.NumberFormat('en-US', Object.assign({}, defaults, opts));
  return formatter.format(num);
}

export default { formatCurrency };
