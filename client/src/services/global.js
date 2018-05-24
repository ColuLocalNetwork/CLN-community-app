// Global utility functions
export const formatAmount = (amount, divisibility) => {
	return Math.round(amount / Math.pow(10, divisibility))
}

export const formatMoney = (amount, c, d, t) => {
	var n = amount, 
	c = isNaN(c = Math.abs(c)) ? 2 : c, 
	d = d == undefined ? "." : d, 
	t = t == undefined ? "," : t, 
	s = n < 0 ? "-" : "", 
	i = String(parseInt(n = Math.abs((n) || 0).toFixed(c))), 
	j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}


export const formatAmountReal = (amount, divisibility) => {
	return amount * Math.pow(10, divisibility)
}