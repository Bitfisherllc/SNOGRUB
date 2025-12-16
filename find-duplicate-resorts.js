#!/usr/bin/env node

/**
 * Find duplicate resorts in data.js
 * 
 * This script identifies resorts that have duplicate IDs or names
 * and shows which ones should be kept (newer) vs removed (older)
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.js');

function findDuplicates() {
    try {
        // Read and evaluate the data file
        // The file contains: const skiEatsData = { ... };
        const dataContent = fs.readFileSync(DATA_FILE, 'utf8');
        
        // Wrap in a function to capture skiEatsData
        const wrappedCode = `
            ${dataContent}
            return skiEatsData;
        `;
        
        const getData = new Function(wrappedCode);
        const skiEatsData = getData();
        
        if (!skiEatsData || !skiEatsData.resorts || !Array.isArray(skiEatsData.resorts)) {
            console.error('Could not find resorts array in data.js');
            console.error('skiEatsData:', typeof skiEatsData, skiEatsData ? Object.keys(skiEatsData) : 'null');
            process.exit(1);
        }
        
        const resorts = skiEatsData.resorts.map((resort, index) => ({
            arrayIndex: index,
            id: resort.id,
            name: resort.name,
            location: resort.location || '',
            resort: resort
        }));
        
        // Find duplicates by ID
        const duplicatesById = {};
        const duplicatesByName = {};
        
        resorts.forEach((resort) => {
            // Check for duplicate IDs
            if (!duplicatesById[resort.id]) {
                duplicatesById[resort.id] = [];
            }
            duplicatesById[resort.id].push(resort);
            
            // Check for duplicate names (case-insensitive)
            const nameKey = resort.name.toLowerCase().trim();
            if (!duplicatesByName[nameKey]) {
                duplicatesByName[nameKey] = [];
            }
            duplicatesByName[nameKey].push(resort);
        });
        
        // Filter to only show actual duplicates (more than one)
        const idDuplicates = Object.entries(duplicatesById)
            .filter(([id, resorts]) => resorts.length > 1)
            .map(([id, resorts]) => ({ id, resorts }));
        
        const nameDuplicates = Object.entries(duplicatesByName)
            .filter(([name, resorts]) => resorts.length > 1)
            .map(([name, resorts]) => ({ name, resorts }));
        
        console.log('\n=== DUPLICATE RESORTS ANALYSIS ===\n');
        
        if (idDuplicates.length === 0 && nameDuplicates.length === 0) {
            console.log('✅ No duplicates found!');
            return;
        }
        
        // Report duplicates by ID
        if (idDuplicates.length > 0) {
            console.log('🔴 DUPLICATES BY ID (same ID, different entries):\n');
            idDuplicates.forEach(({ id, resorts: dupResorts }) => {
                console.log(`ID: "${id}"`);
                dupResorts.forEach((resort, idx) => {
                    console.log(`  ${idx + 1}. Array Index: ${resort.arrayIndex}, Name: "${resort.name}", Location: "${resort.location}"`);
                });
                console.log(`  → KEEP: Array Index ${dupResorts[dupResorts.length - 1].arrayIndex} (last occurrence - newest)`);
                console.log(`  → REMOVE: Array Indices ${dupResorts.slice(0, -1).map(r => r.arrayIndex).join(', ')} (older occurrences)\n`);
            });
        }
        
        // Report duplicates by name (but not by ID - these might be different resorts with same name)
        const nameOnlyDuplicates = nameDuplicates.filter(({ name, resorts: dupResorts }) => {
            // Only show if they have different IDs
            const ids = new Set(dupResorts.map(r => r.id));
            return ids.size > 1;
        });
        
        if (nameOnlyDuplicates.length > 0) {
            console.log('\n⚠️  DUPLICATES BY NAME (same name, different IDs - might be intentional):\n');
            nameOnlyDuplicates.forEach(({ name, resorts: dupResorts }) => {
                console.log(`Name: "${name}"`);
                dupResorts.forEach((resort, idx) => {
                    console.log(`  ${idx + 1}. Array Index: ${resort.arrayIndex}, ID: "${resort.id}", Location: "${resort.location}"`);
                });
                console.log();
            });
        }
        
        // Summary
        console.log('\n=== SUMMARY ===');
        console.log(`Total resorts found: ${resorts.length}`);
        console.log(`Duplicates by ID: ${idDuplicates.length} groups`);
        console.log(`Duplicates by name only: ${nameOnlyDuplicates.length} groups`);
        
        if (idDuplicates.length > 0) {
            const totalToRemove = idDuplicates.reduce((sum, { resorts: dupResorts }) => sum + dupResorts.length - 1, 0);
            console.log(`\nTotal duplicate entries to remove: ${totalToRemove}`);
            console.log('\nResorts to REMOVE (older versions):');
            idDuplicates.forEach(({ id, resorts: dupResorts }) => {
                dupResorts.slice(0, -1).forEach(resort => {
                    console.log(`  - Array Index ${resort.arrayIndex}: "${resort.name}" (ID: ${resort.id})`);
                });
            });
        }
        
    } catch (error) {
        console.error('Error finding duplicates:', error);
        process.exit(1);
    }
}

findDuplicates();





