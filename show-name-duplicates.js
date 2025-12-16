#!/usr/bin/env node

/**
 * Show resorts with the same name but different IDs
 * 
 * This script identifies resorts that have duplicate names but different IDs
 * and shows which ones should be kept (newer) vs removed (older)
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.js');

function showNameDuplicates() {
    try {
        console.log('Loading data.js...');
        
        // Read and evaluate the data file
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
            process.exit(1);
        }
        
        const resorts = skiEatsData.resorts.map((resort, index) => ({
            arrayIndex: index,
            id: resort.id,
            name: resort.name,
            location: resort.location || '',
            resort: resort
        }));
        
        // Find duplicates by name (case-insensitive)
        const duplicatesByName = {};
        
        resorts.forEach((resort) => {
            const nameKey = resort.name.toLowerCase().trim();
            if (!duplicatesByName[nameKey]) {
                duplicatesByName[nameKey] = [];
            }
            duplicatesByName[nameKey].push(resort);
        });
        
        // Filter to only show actual duplicates (more than one) with different IDs
        const nameDuplicates = Object.entries(duplicatesByName)
            .filter(([name, resorts]) => {
                // Only show if there are multiple resorts AND they have different IDs
                if (resorts.length <= 1) return false;
                const ids = new Set(resorts.map(r => r.id));
                return ids.size > 1;
            })
            .map(([name, resorts]) => ({ name, resorts }));
        
        console.log('\n=== RESORTS WITH SAME NAME BUT DIFFERENT IDs ===\n');
        
        if (nameDuplicates.length === 0) {
            console.log('✅ No name duplicates found!');
            return;
        }
        
        console.log(`Found ${nameDuplicates.length} groups with same name but different IDs:\n`);
        
        nameDuplicates.forEach(({ name, resorts: dupResorts }, groupIdx) => {
            console.log(`${'='.repeat(80)}`);
            console.log(`GROUP ${groupIdx + 1}: "${name}"`);
            console.log(`${'='.repeat(80)}`);
            
            // Sort by array index to show order
            dupResorts.sort((a, b) => a.arrayIndex - b.arrayIndex);
            
            dupResorts.forEach((resort, idx) => {
                console.log(`\n  ${idx + 1}. Array Index: ${resort.arrayIndex}`);
                console.log(`     ID: "${resort.id}"`);
                console.log(`     Name: "${resort.name}"`);
                console.log(`     Location: "${resort.location}"`);
                
                // Show some additional details
                if (resort.resort.featured) {
                    console.log(`     Featured: Yes`);
                }
                if (resort.resort.restaurantCount > 0) {
                    console.log(`     Restaurants: ${resort.resort.restaurantCount}`);
                }
                if (resort.resort.terrain && resort.resort.terrain.skiableAcres) {
                    console.log(`     Skiable Acres: ${resort.resort.terrain.skiableAcres}`);
                }
            });
            
            // Determine which to keep (last occurrence) and which to remove
            const lastIndex = dupResorts[dupResorts.length - 1].arrayIndex;
            const toRemove = dupResorts.slice(0, -1);
            const toKeep = dupResorts[dupResorts.length - 1];
            
            console.log(`\n  → KEEP: Array Index ${lastIndex} (last occurrence - newest)`);
            console.log(`     ID: "${toKeep.id}"`);
            console.log(`     Name: "${toKeep.name}"`);
            console.log(`     Location: "${toKeep.location}"`);
            
            console.log(`\n  → REMOVE: ${toRemove.length} older version(s):`);
            toRemove.forEach((resort) => {
                console.log(`     - Array Index ${resort.arrayIndex}: "${resort.name}" (ID: ${resort.id}, Location: ${resort.location})`);
            });
            
            console.log('\n');
        });
        
        // Summary
        console.log('\n=== SUMMARY ===');
        console.log(`Total groups with same name but different IDs: ${nameDuplicates.length}`);
        
        const totalToRemove = nameDuplicates.reduce((sum, { resorts: dupResorts }) => {
            return sum + dupResorts.length - 1;
        }, 0);
        
        console.log(`Total entries to remove: ${totalToRemove}`);
        console.log('\nAll resorts to REMOVE (older versions):');
        
        nameDuplicates.forEach(({ name, resorts: dupResorts }) => {
            const sorted = [...dupResorts].sort((a, b) => a.arrayIndex - b.arrayIndex);
            sorted.slice(0, -1).forEach(resort => {
                console.log(`  - Array Index ${resort.arrayIndex}: "${resort.name}" (ID: ${resort.id})`);
            });
        });
        
    } catch (error) {
        console.error('Error finding duplicates:', error);
        process.exit(1);
    }
}

showNameDuplicates();





