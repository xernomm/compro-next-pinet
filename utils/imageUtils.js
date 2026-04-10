/**
 * Helper function to construct full image URL from backend
 * Handles both relative paths and absolute URLs
 * 
 * @param {string} imagePath - The image path from backend (e.g., '/uploads/logo.png')
 * @returns {string|null} - Full URL to access the image
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // If already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // Construct URL to backend server
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

    // Ensure proper path formatting
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    return `${baseUrl}${path}`;
};

/**
 * Helper function to construct full URLs for array of image paths
 * 
 * @param {string[]} imagePaths - Array of image paths
 * @returns {string[]} - Array of full URLs
 */
export const getImageUrls = (imagePaths) => {
    if (!Array.isArray(imagePaths)) return [];
    return imagePaths.map(path => getImageUrl(path)).filter(url => url !== null);
};

/**
 * Parse JSON string safely
 * @param {string} jsonString - JSON string to parse
 * @param {any} defaultValue - Default value if parsing fails
 * @returns {any} - Parsed value or default
 */
export const parseJSON = (jsonString, defaultValue = []) => {
    if (!jsonString) return defaultValue;
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return defaultValue;
    }
};
