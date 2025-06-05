/**
 * Formats a number as Indonesian Rupiah currency
 * 
 * @param {number} amount - The amount to format
 * @param {boolean} withSymbol - Whether to include the Rp symbol (default: true)
 * @param {boolean} withSpacing - Whether to include spacing after Rp symbol (default: true)
 * @return {string} Formatted currency string
 */
export function formatRupiah(amount, withSymbol = true, withSpacing = true) {
    // Handle null or undefined values
    if (amount === null || amount === undefined) {
        return withSymbol ? (withSpacing ? 'Rp 0' : 'Rp0') : '0';
    }
    
    // Convert to number if it's a string
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Format the number with thousand separators
    const formattedNumber = new Intl.NumberFormat('id-ID').format(numAmount);
    
    // Return with or without the Rp symbol
    if (withSymbol) {
        return withSpacing ? `Rp ${formattedNumber}` : `Rp${formattedNumber}`;
    }
    
    return formattedNumber;
}

/**
 * Parses a Rupiah-formatted string back to a number
 * 
 * @param {string} rupiahString - The formatted Rupiah string
 * @return {number} The parsed number value
 */
export function parseRupiah(rupiahString) {
    if (!rupiahString) return 0;
    
    // Remove Rp symbol and all non-digit characters except decimal point
    const cleanString = rupiahString.replace(/[^0-9,]/g, '').replace(',', '.');
    
    // Parse the clean string to a float
    return parseFloat(cleanString) || 0;
}

/**
 * Formats a number to a compact representation (e.g., 1000 -> 1K)
 * 
 * @param {number} num - The number to format
 * @return {string} Compact representation of the number
 */
export function formatCompactNumber(num) {
    return new Intl.NumberFormat('id-ID', { 
        notation: 'compact',
        compactDisplay: 'short' 
    }).format(num);
}
