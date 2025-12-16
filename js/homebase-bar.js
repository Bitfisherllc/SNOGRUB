// Home Base Bar Component
// Handles the UI for the sticky home base selection bar

(function() {
    'use strict';
    
    // Create the home base bar HTML
    function createHomeBaseBar() {
        const bar = document.createElement('div');
        bar.id = 'homebase-bar';
        bar.className = 'fixed top-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm';
        bar.style.display = 'block'; // Always visible
        
        bar.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6">
                <div class="flex items-center justify-between h-12">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-shrink-0">
                            <svg class="w-4 h-4 text-[var(--accent-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                            </svg>
                            <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Home Base:</span>
                        </div>
                        <div class="relative flex-1 max-w-md">
                            <input 
                                type="text" 
                                id="homebase-input"
                                autocomplete="off"
                                placeholder="Search or select a resort..."
                                class="w-full pl-3 pr-10 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent bg-white"
                            />
                            <div id="homebase-dropdown" class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50 hidden">
                                <!-- Dropdown items will be populated here -->
                            </div>
                        </div>
                        <div id="homebase-selected" class="flex items-center gap-2 flex-shrink-0 hidden">
                            <span class="text-sm font-medium text-[var(--accent-blue)]" id="homebase-selected-name"></span>
                            <button 
                                id="homebase-clear"
                                class="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Clear home base"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0 ml-4">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                id="homebase-toggle"
                                class="w-4 h-4 text-[var(--accent-blue)] border-gray-300 rounded focus:ring-[var(--accent-blue)]"
                            />
                            <span class="text-xs text-gray-600 whitespace-nowrap">Enable Home Base</span>
                        </label>
                    </div>
                </div>
            </div>
        `;
        
        return bar;
    }
    
    // Initialize the home base bar
    function initHomeBaseBar() {
        // Insert bar at the top of body (before nav)
        const bar = createHomeBaseBar();
        document.body.insertBefore(bar, document.body.firstChild);
        
        const input = document.getElementById('homebase-input');
        const dropdown = document.getElementById('homebase-dropdown');
        const toggle = document.getElementById('homebase-toggle');
        const selectedDiv = document.getElementById('homebase-selected');
        const selectedName = document.getElementById('homebase-selected-name');
        const clearBtn = document.getElementById('homebase-clear');
        
        let dropdownTimeout = null;
        let selectedResort = null;
        
        // Update UI based on current home base state
        function updateUI() {
            const homebase = HomeBase.get();
            const isActive = HomeBase.isActive();
            const bar = document.getElementById('homebase-bar');
            
            // Bar is always visible
            bar.style.display = 'block';
            
            if (isActive && homebase) {
                // Show selected state
                selectedDiv.classList.remove('hidden');
                selectedName.textContent = homebase.resortName;
                input.style.display = 'none';
                toggle.checked = true;
                selectedResort = { id: homebase.resortId, name: homebase.resortName };
            } else {
                // Show input state (no resort selected)
                selectedDiv.classList.add('hidden');
                input.style.display = 'block';
                toggle.checked = false;
                selectedResort = null;
            }
        }
        
        // Populate dropdown with resorts
        function populateDropdown(query = '') {
            const resorts = HomeBase.searchResorts(query);
            dropdown.innerHTML = '';
            
            if (resorts.length === 0) {
                dropdown.innerHTML = '<div class="px-4 py-3 text-sm text-gray-500">No resorts found</div>';
                dropdown.classList.remove('hidden');
                return;
            }
            
            resorts.slice(0, 10).forEach(resort => {
                const item = document.createElement('div');
                item.className = 'px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors';
                item.innerHTML = `
                    <div class="font-medium text-sm text-gray-900">${resort.name}</div>
                    <div class="text-xs text-gray-500">${resort.location}</div>
                `;
                item.addEventListener('click', () => {
                    selectResort(resort);
                });
                dropdown.appendChild(item);
            });
        }
        
        // Select a resort
        function selectResort(resort) {
            HomeBase.set(resort.id, resort.name);
            selectedResort = resort;
            input.value = '';
            dropdown.classList.add('hidden');
            updateUI();
        }
        
        // Clear home base
        function clearHomeBase() {
            HomeBase.clear();
            selectedResort = null;
            input.value = '';
            dropdown.classList.add('hidden');
            updateUI();
        }
        
        // Event listeners
        toggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                // Bar is always visible, just focus input
                input.focus();
                updateUI(); // Update UI to show input field
            } else {
                clearHomeBase();
            }
        });
        
        input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            clearTimeout(dropdownTimeout);
            
            if (query.length > 0) {
                dropdownTimeout = setTimeout(() => {
                    populateDropdown(query);
                    dropdown.classList.remove('hidden');
                }, 150);
            } else {
                populateDropdown('');
                dropdown.classList.remove('hidden');
            }
        });
        
        input.addEventListener('focus', () => {
            if (input.value.trim().length > 0 || HomeBase.getAllResorts().length > 0) {
                populateDropdown(input.value.trim());
                dropdown.classList.remove('hidden');
            }
        });
        
        input.addEventListener('blur', () => {
            // Delay hiding dropdown to allow clicks
            setTimeout(() => {
                dropdown.classList.add('hidden');
            }, 200);
        });
        
        clearBtn.addEventListener('click', clearHomeBase);
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!bar.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });
        
        // Listen for home base changes from other tabs/windows
        window.addEventListener('storage', (e) => {
            if (e.key === HomeBase.STORAGE_KEY) {
                updateUI();
            }
        });
        
        // Listen for programmatic changes
        window.addEventListener('homebaseChanged', () => {
            updateUI();
        });
        
        // Initial UI update
        updateUI();
        
        // Adjust body padding to account for bar (always visible)
        function adjustBodyPadding() {
            const bar = document.getElementById('homebase-bar');
            const nav = document.querySelector('nav');
            if (bar) {
                const barHeight = bar.offsetHeight;
                if (nav) {
                    nav.style.top = `${barHeight}px`;
                }
                document.body.style.paddingTop = `${barHeight}px`;
            }
        }
        
        // Adjust padding when bar size changes (always visible, but size might change)
        const observer = new MutationObserver(() => {
            adjustBodyPadding();
        });
        
        const barElement = document.getElementById('homebase-bar');
        if (barElement) {
            observer.observe(barElement, {
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }
        
        // Initial padding adjustment
        setTimeout(adjustBodyPadding, 100);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHomeBaseBar);
    } else {
        initHomeBaseBar();
    }
})();





