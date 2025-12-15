# Restaurant-Resort Relationship Changes

## Summary
Restaurants can now belong to multiple resorts. The relationship is based on proximity (within 30 miles).

## Data Structure Changes

### Old Structure:
```javascript
{
    id: 'restaurant-id',
    resort: 'resort-id',  // Single resort
    // ... other fields
}
```

### New Structure:
```javascript
{
    id: 'restaurant-id',
    resorts: [  // Array of resorts, sorted by distance (closest first)
        { id: 'resort-id-1', distance: 5.2 },  // Distance in miles
        { id: 'resort-id-2', distance: 12.8 }
    ],
    // ... other fields
}
```

## Implementation Details

### Runtime Normalization
The code includes `normalizeRestaurantResorts()` function that:
- Converts old `resort` (string) format to new `resorts` (array) format at runtime
- Calculates distances to all resorts within 30 miles
- Sorts resorts by distance (closest first)
- Preserves existing relationships even if slightly over 30 miles

### Display Logic
- **Closest resort first**: `getClosestResort()` returns the nearest resort
- **All resorts shown**: When displaying, all resorts are shown with distances
- **Format**: "Resort Name (5.2 mi), Another Resort (12.8 mi)"
- **Distance calculation**: Uses Haversine formula (accurate for Earth's surface)

### Filtering
- Resort filter now matches if restaurant belongs to ANY of the selected resort's resorts
- Search/autocomplete works with multiple resorts
- All filtering functions updated to work with `resorts` array

### Card Format Standardization
- Both `index.html` and `restaurants.html` now use consistent card format
- Shows: Name, Resort(s) with distances, Category, Rating, Description, Actions
- Badges: Featured, Popular
- Same styling and layout across all pages

## Files Modified

1. **restaurants.js**
   - Added `normalizeRestaurantResorts()` function
   - Added `getClosestResort()`, `getRestaurantResorts()`, `getResortNamesForDisplay()` helpers
   - Updated `loadRestaurants()` to normalize data
   - Updated all resort access points to use new structure
   - Updated filtering logic
   - Updated search/autocomplete
   - Updated card rendering to show multiple resorts

2. **index.html**
   - Added same normalization and helper functions
   - Updated `getSortedRestaurants()` to normalize data
   - Updated `renderRestaurantCards()` to show multiple resorts
   - Standardized card format to match restaurants.html

3. **data.js** (Status: Pending transformation)
   - Currently still uses old `resort: 'id'` format
   - Runtime normalization handles the conversion automatically
   - Can be transformed later if desired (see transform scripts)

## Next Steps (Optional)

To permanently transform data.js:
1. Run a transformation script (transform-data-file.js or similar)
2. Or manually update restaurant entries to use `resorts` array instead of `resort` string

The runtime normalization ensures everything works correctly with either format.



