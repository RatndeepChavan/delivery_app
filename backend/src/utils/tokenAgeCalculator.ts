/**
 * * 🕒 calculateTokenAge
 *
 * ? Converts a numeric expression string (e.g. "60*60*24") into a number.
 * ? Used for converting token lifetime expressions into seconds.
 *
 * ! Only supports multiplication expressions with integers.
 * ! Returns 0 if:
 *    - Expression is empty/null
 *    - Contains invalid/non-numeric parts
 *    - Any error occurs during parsing
 *
 * @param numericExpression - Expression like "60*60*24" (seconds in a day)
 * @returns number - Evaluated result, or 0 on failure
 */
export const calculateTokenAge = (numericExpression: string): number => {
    // Fallback if input is empty/null
    if (!numericExpression){
        return 0;
    }
    try {
        // 🔪 Split by "*" and convert each to integer
        const parts = numericExpression.split("*").map((part) => parseInt(part.trim(), 10));
        
        // Check for NaN values (invalid numbers)
        if (parts.some(isNaN)) {
            throw new Error("Invalid number in expression.");
        }

        // 🔁 Multiply all values together
        return parts.reduce((acc, current) => acc * current, 1);
    } catch (e) {
        console.error("Error calculating token age:", e);
        return 0; 
    }
};

