# 🚀 START HERE: Adding Your First Restaurant

## Quick Start (3 Steps)

### Step 1: See Available Resorts
```bash
node list-resorts.js
```

This shows all 38 resorts. Currently only **Wisp Resort** has restaurants (9).

### Step 2: Generate Restaurant Data
```bash
node generate-restaurant-data.js > my-restaurant.json
```

**The script will ask you:**
- Restaurant name
- Location (City, State)
- Coordinates (get from Google Maps)
- Resort ID (from the list above)
- Description, category, cuisine, etc.

**Tip:** Have this info ready before starting!

### Step 3: Insert into data.js
```bash
node insert-restaurant.js my-restaurant.json
```

Done! Your restaurant is now in the system.

## Example: Adding a Restaurant to Whistler Blackcomb

```bash
# 1. Start the generator
node generate-restaurant-data.js > whistler-restaurant.json

# When prompted, enter:
#   Name: Bearfoot Bistro
#   Location: Whistler, British Columbia
#   Latitude: 50.1163
#   Longitude: -122.9574
#   Resort ID: whistler-blackcomb
#   ... (continue with other prompts)

# 2. Insert it
node insert-restaurant.js whistler-restaurant.json

# 3. Verify
node validate-restaurant-distances.js --report-only

# 4. Test the page
# Open: restaurant-detail.html?id=bearfoot-bistro
```

## Getting Coordinates

1. Open **Google Maps**
2. Search for the restaurant
3. **Right-click** on the location
4. Click the **coordinates** (they'll be highlighted)
5. Copy them (format: `lat, lng`)

Example: `50.1163, -122.9574`

## Popular Resorts to Add Restaurants To

- **Whistler Blackcomb** (`whistler-blackcomb`) - 0 restaurants
- **Vail** (`vail`) - 0 restaurants  
- **Park City** (`park-city`) - 0 restaurants
- **Aspen Snowmass** (`aspen-snowmass`) - 0 restaurants
- **Breckenridge** (`breckenridge`) - 0 restaurants

## What You Need Before Starting

✅ Restaurant name  
✅ Full address  
✅ Coordinates (lat/lng from Google Maps)  
✅ Resort ID (from `list-resorts.js`)  
✅ Description  
✅ Category (restaurant/bar/cafe)  
✅ Cuisine type  
✅ Price range ($/$$/$$$/$$$$)  
✅ Phone number  
✅ Website URL  
✅ (Optional) Logo URL  
✅ (Optional) Background photo URL  
✅ (Optional) Hours of operation  
✅ (Optional) Menu items  

## Need Help?

- **How to use generator:** See `HOW_TO_USE_GENERATOR.md`
- **Complete guide:** See `ADDING_RESTAURANTS_GUIDE.md`
- **Quick reference:** See `QUICK_START_RESTAURANTS.md`

## Ready? Let's Go!

```bash
# Start here:
node list-resorts.js

# Then generate your first restaurant:
node generate-restaurant-data.js > restaurant1.json
```

Good luck! 🎉






