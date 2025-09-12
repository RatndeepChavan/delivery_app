/** 
 * * 🏷️ Generate a label from a field name
 *  Example: "first_name" => "First Name"
 */
export const generateLabel = (name: string) =>
    name
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

/** 
 * * 📝 Generate placeholder text from a field name
 *  type: "input" | "textarea" | "select"
 *  Example: generatePlaceholder("first_name", "input") => "Please enter first name"
 */
export const generatePlaceholder = (name: string, type: "input" | "textarea" | "select") => {
    const label = name.replace("_", " ");
    switch (type) {
        case "input":
            return `Please enter ${label}`;
        case "textarea":
            return `Please describe ${label}`;
        case "select":
            return `Please select ${label}`;
        default:
            return label;
    }
};
