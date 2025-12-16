// Home Base Resort Selection Utility
// Manages user's home base resort selection and filtering

const HomeBase = {
    STORAGE_KEY: 'snogrub_homebase',
    
    // Get current home base from localStorage
    get: function() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            return null;
        }
    },
    
    // Set home base resort
    set: function(resortId, resortName) {
        try {
            const data = {
                resortId: resortId,
                resortName: resortName,
                timestamp: Date.now()
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            this.notifyChange();
            return true;
        } catch (e) {
            console.error('Error setting home base:', e);
            return false;
        }
    },
    
    // Clear home base
    clear: function() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            this.notifyChange();
            return true;
        } catch (e) {
            console.error('Error clearing home base:', e);
            return false;
        }
    },
    
    // Check if home base is active
    isActive: function() {
        return this.get() !== null;
    },
    
    // Get resort ID
    getResortId: function() {
        const homebase = this.get();
        return homebase ? homebase.resortId : null;
    },
    
    // Get resort name
    getResortName: function() {
        const homebase = this.get();
        return homebase ? homebase.resortName : null;
    },
    
    // Filter restaurants by home base
    filterRestaurants: function(restaurants) {
        if (!this.isActive()) {
            return restaurants;
        }
        const resortId = this.getResortId();
        return restaurants.filter(restaurant => {
            return restaurant.resort === resortId;
        });
    },
    
    // Filter bars by home base (bars also have resort field)
    filterBars: function(bars) {
        if (!this.isActive()) {
            return bars;
        }
        const resortId = this.getResortId();
        return bars.filter(bar => {
            return bar.resort === resortId;
        });
    },
    
    // Filter resorts by home base (returns single resort if active)
    filterResorts: function(resorts) {
        if (!this.isActive()) {
            return resorts;
        }
        const resortId = this.getResortId();
        return resorts.filter(resort => {
            return resort.id === resortId;
        });
    },
    
    // Notify all pages of home base change via custom event
    notifyChange: function() {
        const event = new CustomEvent('homebaseChanged', {
            detail: this.get()
        });
        window.dispatchEvent(event);
    },
    
    // Get all resort names for autocomplete
    getAllResorts: function() {
        if (typeof skiEatsData !== 'undefined' && skiEatsData.resorts) {
            return skiEatsData.resorts.map(resort => ({
                id: resort.id,
                name: resort.name,
                location: resort.location
            }));
        }
        return [];
    },
    
    // Search resorts by name (for autocomplete)
    searchResorts: function(query) {
        const resorts = this.getAllResorts();
        if (!query || query.trim() === '') {
            return resorts;
        }
        const lowerQuery = query.toLowerCase();
        return resorts.filter(resort => {
            return resort.name.toLowerCase().includes(lowerQuery) ||
                   resort.location.toLowerCase().includes(lowerQuery);
        });
    },
    
    // Get home base resort object
    getHomeBaseResort: function() {
        if (!this.isActive()) {
            return null;
        }
        const resortId = this.getResortId();
        if (typeof skiEatsData !== 'undefined' && skiEatsData.resorts) {
            return skiEatsData.resorts.find(r => r.id === resortId) || null;
        }
        return null;
    },
    
    // Calculate distance between two coordinates (Haversine formula)
    calculateDistance: function(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    },
    
    // Convert degrees to radians
    toRad: function(degrees) {
        return degrees * (Math.PI / 180);
    },
    
    // Sort restaurants by distance from home base (shows all restaurants, sorted by distance)
    sortRestaurantsByDistance: function(restaurants) {
        if (!this.isActive()) {
            return restaurants;
        }
        const homeBaseResort = this.getHomeBaseResort();
        if (!homeBaseResort || !homeBaseResort.coordinates) {
            return restaurants;
        }
        
        const homeBaseLat = homeBaseResort.coordinates.lat;
        const homeBaseLng = homeBaseResort.coordinates.lng;
        
        return restaurants.map(restaurant => {
            let distance = null;
            if (restaurant.coordinates && restaurant.coordinates.lat && restaurant.coordinates.lng) {
                distance = this.calculateDistance(
                    homeBaseLat,
                    homeBaseLng,
                    restaurant.coordinates.lat,
                    restaurant.coordinates.lng
                );
            }
            return { ...restaurant, distanceFromHomeBase: distance };
        }).sort((a, b) => {
            // Restaurants at the home base resort come first
            if (a.resort === this.getResortId() && b.resort !== this.getResortId()) return -1;
            if (a.resort !== this.getResortId() && b.resort === this.getResortId()) return 1;
            
            // Then sort by distance (null distances go to end)
            if (a.distanceFromHomeBase === null && b.distanceFromHomeBase === null) return 0;
            if (a.distanceFromHomeBase === null) return 1;
            if (b.distanceFromHomeBase === null) return -1;
            return a.distanceFromHomeBase - b.distanceFromHomeBase;
        });
    },
    
    // Sort resorts: home base first, then by distance
    sortResortsByHomeBase: function(resorts) {
        if (!this.isActive()) {
            return resorts;
        }
        const homeBaseResortId = this.getResortId();
        const homeBaseResort = this.getHomeBaseResort();
        
        if (!homeBaseResort || !homeBaseResort.coordinates) {
            // If no coordinates, just put home base first
            return resorts.sort((a, b) => {
                if (a.id === homeBaseResortId) return -1;
                if (b.id === homeBaseResortId) return 1;
                return 0;
            });
        }
        
        const homeBaseLat = homeBaseResort.coordinates.lat;
        const homeBaseLng = homeBaseResort.coordinates.lng;
        
        return resorts.map(resort => {
            let distance = null;
            if (resort.coordinates && resort.coordinates.lat && resort.coordinates.lng) {
                distance = this.calculateDistance(
                    homeBaseLat,
                    homeBaseLng,
                    resort.coordinates.lat,
                    resort.coordinates.lng
                );
            }
            return { ...resort, distanceFromHomeBase: distance };
        }).sort((a, b) => {
            // Home base always comes first
            if (a.id === homeBaseResortId) return -1;
            if (b.id === homeBaseResortId) return 1;
            
            // Then sort by distance (null distances go to end)
            if (a.distanceFromHomeBase === null && b.distanceFromHomeBase === null) return 0;
            if (a.distanceFromHomeBase === null) return 1;
            if (b.distanceFromHomeBase === null) return -1;
            return a.distanceFromHomeBase - b.distanceFromHomeBase;
        });
    },
    
    // Check if content is related to home base (for blog/articles)
    isRelatedToHomeBase: function(content) {
        if (!this.isActive()) {
            return false;
        }
        const homeBaseName = this.getResortName();
        const homeBaseId = this.getResortId();
        const homeBaseResort = this.getHomeBaseResort();
        
        if (!homeBaseName || !content) {
            return false;
        }
        
        const contentText = (content.title || '') + ' ' + (content.description || '') + ' ' + (content.body || '') + ' ' + (content.tags || '').join(' ');
        const lowerContent = contentText.toLowerCase();
        const lowerHomeBase = homeBaseName.toLowerCase();
        
        // Check if home base name appears in content
        if (lowerContent.includes(lowerHomeBase)) {
            return true;
        }
        
        // Check if home base location appears
        if (homeBaseResort && homeBaseResort.location) {
            const locationParts = homeBaseResort.location.toLowerCase().split(',');
            return locationParts.some(part => lowerContent.includes(part.trim()));
        }
        
        return false;
    }
};





