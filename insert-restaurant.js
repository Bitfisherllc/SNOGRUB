#!/usr/bin/env node

/**
 * Insert Restaurant into data.js
 * 
 * Automatically inserts a restaurant entry into data.js at the correct location.
 * 
 * Usage:
 *   node insert-restaurant.js <restaurant-json-file>
 * 
 * Or pipe JSON directly:
 *   echo '{"id":"test","name":"Test"}' | node insert-restaurant.js
 * 
 * The restaurant JSON can be generated using generate-restaurant-data.js
 * and saved to a file, or you can create it manually.
 */

const fs = require('fs');
const path = require('path');
const { validateNewRestaurant } = require('./add-restaurant-validator.js');
const { loadData } = require('./validate-restaurant-distances.js');

function insertRestaurantIntoData(restaurantData) {
    const dataPath = path.join(__dirname, 'data.js');
    const backupPath = path.join(__dirname, `data.js.backup.${Date.now()}`);
    
    // Create backup
    const originalContent = fs.readFileSync(dataPath, 'utf8');
    fs.writeFileSync(backupPath, originalContent);
    console.log(`📦 Backup created: ${backupPath}`);
    
    // Validate restaurant data
    if (!restaurantData.id || !restaurantData.name) {
        throw new Error('Restaurant must have at least id and name');
    }
    
    // Validate distance if coordinates and resort are provided
    if (restaurantData.coordinates && restaurantData.coordinates.lat && 
        restaurantData.coordinates.lng && restaurantData.resort) {
        const isValid = validateNewRestaurant(
            restaurantData.coordinates.lat,
            restaurantData.coordinates.lng,
            restaurantData.resort
        );
        if (!isValid) {
            throw new Error('Restaurant is not within 40 miles of the resort');
        }
    }
    
    // Check if restaurant already exists
    const skiEatsData = loadData();
    const existingRestaurant = skiEatsData.restaurants.find(r => r.id === restaurantData.id);
    if (existingRestaurant) {
        throw new Error(`Restaurant with id '${restaurantData.id}' already exists`);
    }
    
    // Find the insertion point in the restaurants array
    // Find the restaurants array start
    const restaurantsArrayStart = originalContent.indexOf('restaurants: [');
    if (restaurantsArrayStart === -1) {
        throw new Error('Could not find restaurants array in data.js');
    }
    
    // Find the matching closing bracket by counting nested brackets
    let bracketCount = 0;
    let inString = false;
    let stringChar = null;
    let restaurantsArrayEnd = -1;
    
    for (let i = restaurantsArrayStart + 'restaurants: ['.length; i < originalContent.length; i++) {
        const char = originalContent[i];
        const prevChar = i > 0 ? originalContent[i - 1] : '';
        
        // Handle string literals (skip brackets inside strings)
        if (!inString && (char === '"' || char === "'")) {
            inString = true;
            stringChar = char;
        } else if (inString && char === stringChar && prevChar !== '\\') {
            inString = false;
            stringChar = null;
        }
        
        if (!inString) {
            if (char === '[') bracketCount++;
            if (char === ']') {
                if (bracketCount === 0) {
                    restaurantsArrayEnd = i;
                    break;
                }
                bracketCount--;
            }
        }
    }
    
    if (restaurantsArrayEnd === -1) {
        throw new Error('Could not find closing bracket for restaurants array');
    }
    
    // Convert restaurant data to JavaScript object literal format
    // This function converts the object to match the existing format in data.js
    function toJsObject(obj, indent = 0) {
        const spaces = ' '.repeat(indent * 4);
        const nextSpaces = ' '.repeat((indent + 1) * 4);
        
        if (obj === null) return 'null';
        if (obj === undefined) return 'undefined';
        
        if (typeof obj === 'string') {
            // Escape single quotes and wrap in single quotes
            const escaped = obj.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            return `'${escaped}'`;
        }
        
        if (typeof obj === 'number' || typeof obj === 'boolean') {
            return String(obj);
        }
        
        if (Array.isArray(obj)) {
            if (obj.length === 0) return '[]';
            const items = obj.map(item => `${nextSpaces}${toJsObject(item, indent + 1)}`).join(',\n');
            return `[\n${items}\n${spaces}]`;
        }
        
        if (typeof obj === 'object') {
            const keys = Object.keys(obj);
            if (keys.length === 0) return '{}';
            const items = keys.map(key => {
                const value = toJsObject(obj[key], indent + 1);
                return `${nextSpaces}${key}: ${value}`;
            }).join(',\n');
            return `{\n${items}\n${spaces}}`;
        }
        
        return String(obj);
    }
    
    const restaurantJs = toJsObject(restaurantData, 0);
    
    // Determine if we need a comma
    const beforeArrayEnd = originalContent.substring(restaurantsArrayStart, restaurantsArrayEnd);
    const trimmed = beforeArrayEnd.trim();
    const needsComma = trimmed.endsWith('}') && !trimmed.endsWith('},');
    
    // Build the new restaurant entry
    const indent = '        '; // 8 spaces to match the array indentation
    const newRestaurantEntry = needsComma 
        ? `,\n${indent}${restaurantJs.replace(/\n/g, '\n' + indent)}`
        : `\n${indent}${restaurantJs.replace(/\n/g, '\n' + indent)}`;
    
    // Insert the restaurant before the closing bracket
    const beforeClosing = originalContent.substring(0, restaurantsArrayEnd);
    const afterClosing = originalContent.substring(restaurantsArrayEnd);
    
    const newContent = beforeClosing + newRestaurantEntry + '\n    ' + afterClosing;
    
    // Write the updated content
    fs.writeFileSync(dataPath, newContent, 'utf8');
    console.log(`✅ Restaurant '${restaurantData.name}' (${restaurantData.id}) inserted into data.js`);
    console.log(`📝 Total restaurants: ${skiEatsData.restaurants.length + 1}`);
}

function main() {
    const args = process.argv.slice(2);
    
    let restaurantData = null;
    
    // Check if data is piped in
    if (!process.stdin.isTTY) {
        // Read from stdin
        let input = '';
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', (chunk) => {
            input += chunk;
        });
        process.stdin.on('end', () => {
            try {
                restaurantData = JSON.parse(input);
                insertRestaurantIntoData(restaurantData);
            } catch (error) {
                console.error('❌ Error parsing JSON from stdin:', error.message);
                process.exit(1);
            }
        });
    } else if (args.length > 0) {
        // Read from file
        const filePath = args[0];
        if (!fs.existsSync(filePath)) {
            console.error(`❌ File not found: ${filePath}`);
            process.exit(1);
        }
        
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            restaurantData = JSON.parse(fileContent);
            insertRestaurantIntoData(restaurantData);
        } catch (error) {
            console.error(`❌ Error reading/parsing file: ${error.message}`);
            process.exit(1);
        }
    } else {
        console.error('Usage:');
        console.error('  node insert-restaurant.js <restaurant-json-file>');
        console.error('  echo \'{"id":"test","name":"Test"}\' | node insert-restaurant.js');
        console.error('\nExample:');
        console.error('  1. Generate restaurant data: node generate-restaurant-data.js > restaurant.json');
        console.error('  2. Insert it: node insert-restaurant.js restaurant.json');
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { insertRestaurantIntoData };



