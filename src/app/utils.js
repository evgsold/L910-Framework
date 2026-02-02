import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../../data');

/**
 * Reads data from a JSON file in the data directory.
 * @param {string} filename - The name of the JSON file (e.g., 'books.json').
 * @returns {Promise<Array<Object>>} A promise that resolves to the parsed JSON data, or an empty array if the file does not exist.
 */
export const readData = async (filename) => {
    const filePath = path.join(dataDir, filename);
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

/**
 * Writes data to a JSON file in the data directory.
 * @param {string} filename - The name of the JSON file (e.g., 'books.json').
 * @param {Array<Object>} data - The data to be written to the file.
 * @returns {Promise<void>}
 */
export const writeData = async (filename, data) => {
    const filePath = path.join(dataDir, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};
