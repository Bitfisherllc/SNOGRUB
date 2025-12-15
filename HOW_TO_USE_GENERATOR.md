# How to Use the Restaurant Generator

## Interactive Generator

The `generate-restaurant-data.js` script is **interactive** - it will prompt you for information step by step.

## Step-by-Step Usage

### 1. Start the Generator

```bash
node generate-restaurant-data.js
```

### 2. Follow the Prompts

The script will ask you for:

1. **Restaurant Name** - e.g., "The Mountain View Restaurant"
2. **Restaurant ID** - It will suggest one based on the name (you can accept or change it)
3. **Location** - City, State format - e.g., "Whistler, British Columbia"
4. **Description** - A detailed description of the restaurant
5. **Coordinates**:
   - Latitude (get from Google Maps)
   - Longitude (get from Google Maps)
6. **Resort Association**:
   - It will show you all available resorts
   - Enter the resort ID (e.g., "whistler-blackcomb")
   - It will automatically validate the distance
7. **Category** - restaurant/bar/cafe (default: restaurant)
8. **Cuisine Type** - e.g., "American", "Italian", "French"
9. **Price Range** - $/$$/$$$/$$$$ (default: $$)
10. **Rating** - 0-5 (default: 0)
11. **Review Count** - Number of reviews (default: 0)
12. **Contact Information**:
    - Full Address
    - Phone Number
    - Website URL
13. **Images** (optional):
    - Logo URL
    - Background Photo URL
    - Image URL
14. **Hours** (optional) - For each day of the week
15. **Menu** (optional) - If you want to add menu items
16. **Platform Reviews** (optional) - Reviews from Google, Yelp, etc.

### 3. Save the Output

The script will output JSON. Save it to a file:

```bash
node generate-restaurant-data.js > my-restaurant.json
```

### 4. Insert into data.js

```bash
node insert-restaurant.js my-restaurant.json
```

## Example Session

```
$ node generate-restaurant-data.js

================================================================================
RESTAURANT DATA GENERATOR
================================================================================
This tool will help you create a restaurant entry for data.js

Restaurant Name: Bearfoot Bistro
Restaurant ID (suggested: bearfoot-bistro): [Press Enter to accept]
Location (City, State): Whistler, British Columbia
Description: Fine dining restaurant in Whistler Village...

📍 Coordinates:
  Latitude: 50.1163
  Longitude: -122.9574

🏔️  Resort Association:

Available resorts:
  1. Whistler Blackcomb (whistler-blackcomb)
  2. Vail (vail)
  ...

Resort ID: whistler-blackcomb

🔍 Validating distance...
✅ VALID: Restaurant is within the allowed distance!
   You can safely add this restaurant to the data.

... [continue with remaining prompts]
```

## Tips

1. **Have information ready** - Gather all restaurant info before starting
2. **Get coordinates first** - Use Google Maps to get accurate lat/lng
3. **Know the resort ID** - Run `node list-resorts.js` to see all resorts
4. **Skip optional fields** - Press Enter to skip optional items
5. **Save output** - Always redirect to a file: `> restaurant.json`

## Quick Reference

```bash
# See all available resorts
node list-resorts.js

# Generate restaurant data (save to file)
node generate-restaurant-data.js > restaurant.json

# Insert into data.js
node insert-restaurant.js restaurant.json

# Verify everything
node validate-restaurant-distances.js --report-only
```

## Getting Coordinates from Google Maps

1. Open Google Maps
2. Search for the restaurant
3. Right-click on the location marker
4. Click on the coordinates (they'll be highlighted)
5. Copy the coordinates (format: `lat, lng`)

Example: `50.1163, -122.9574`

## Common Resort IDs

- `whistler-blackcomb` - Whistler Blackcomb
- `vail` - Vail
- `park-city` - Park City
- `aspen-snowmass` - Aspen Snowmass
- `breckenridge` - Breckenridge
- `wisp-resort` - Wisp Resort

Run `node list-resorts.js` to see the complete list.



