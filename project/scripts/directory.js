const vendorsData = [
    {
        id: 1,
        name: "Green Valley Farmers Market",
        category: "farmers-market",
        address: "123 Market Street",
        city: "Portland",
        state: "OR",
        zip: "97201",
        phone: "503-555-0101",
        website: "https://greenvalleyfm.com",
        hours: "Sat-Sun: 8am-2pm",
        sustainability: ["local", "organic", "seasonal"],
        description: "Weekly farmers market featuring local produce, artisan goods, and sustainable products.",
        distance: 2.3
    },
    {
        id: 2,
        name: "Earthbound CSA",
        category: "csa",
        address: "456 Farm Road",
        city: "Beaverton",
        state: "OR",
        zip: "97005",
        phone: "503-555-0102",
        website: "https://earthboundcsa.com",
        hours: "Pickup: Wed 4pm-7pm",
        sustainability: ["local", "organic", "seasonal"],
        description: "Community supported agriculture program with weekly produce boxes from our organic farm.",
        distance: 5.1
    },
    {
        id: 3,
        name: "People's Food Co-op",
        category: "coop",
        address: "789 Community Lane",
        city: "Portland",
        state: "OR",
        zip: "97214",
        phone: "503-555-0103",
        website: "https://peoplesfoodcoop.com",
        hours: "Mon-Sun: 8am-9pm",
        sustainability: ["local", "organic", "zero-waste"],
        description: "Member-owned cooperative grocery store focusing on local, sustainable, and organic products.",
        distance: 1.8
    },
    {
        id: 4,
        name: "Harvest Table Restaurant",
        category: "restaurant",
        address: "321 Farm-to-Table Blvd",
        city: "Portland",
        state: "OR",
        zip: "97209",
        phone: "503-555-0104",
        website: "https://harvesttablepdx.com",
        hours: "Tue-Sun: 11am-10pm",
        sustainability: ["local", "seasonal", "zero-waste"],
        description: "Farm-to-table restaurant featuring seasonal menus with ingredients from local farms.",
        distance: 3.2
    },
    {
        id: 5,
        name: "Sunrise Organic Market",
        category: "farmers-market",
        address: "567 Sunrise Avenue",
        city: "Lake Oswego",
        state: "OR",
        zip: "97034",
        phone: "503-555-0105",
        website: "https://sunriseorganicmarket.com",
        hours: "Sat: 9am-3pm",
        sustainability: ["organic", "seasonal"],
        description: "Outdoor market specializing in certified organic produce and sustainable goods.",
        distance: 7.5
    },
    {
        id: 6,
        name: "Root & Harvest CSA",
        category: "csa",
        address: "890 Countryside Road",
        city: "Hillsboro",
        state: "OR",
        zip: "97123",
        phone: "503-555-0106",
        website: "https://rootandharvest.com",
        hours: "Pickup: Thu 3pm-6pm, Sat 10am-1pm",
        sustainability: ["local", "organic", "zero-waste"],
        description: "Zero-waste CSA program offering seasonal vegetable shares and add-on options.",
        distance: 9.2
    },
    {
        id: 7,
        name: "Eco Eats Cafe",
        category: "restaurant",
        address: "234 Green Street",
        city: "Portland",
        state: "OR",
        zip: "97202",
        phone: "503-555-0107",
        website: "https://ecoeatscafe.com",
        hours: "Mon-Fri: 7am-3pm, Sat-Sun: 8am-4pm",
        sustainability: ["local", "organic", "zero-waste"],
        description: "Zero-waste cafe serving organic, plant-based meals with compostable packaging.",
        distance: 2.7
    },
    {
        id: 8,
        name: "Northwest Food Collective",
        category: "coop",
        address: "678 Cooperative Way",
        city: "Portland",
        state: "OR",
        zip: "97232",
        phone: "503-555-0108",
        website: "https://nwfoodcollective.com",
        hours: "Daily: 9am-8pm",
        sustainability: ["local", "organic", "seasonal", "zero-waste"],
        description: "Community-owned grocery featuring bulk bins, local producers, and zero-waste options.",
        distance: 4.1
    }
];

let filteredVendors = [...vendorsData];
let activeFilters = {
    search: '',
    categories: [],
    sustainability: []
};

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initFilters();
    initSort();
    loadVendors();
    
    loadSavedFilters();
});

function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            const spans = menuToggle.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

function initFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    const sustainabilityCheckboxes = document.querySelectorAll('input[name="sustainability"]');
    const resetButton = document.getElementById('resetFilters');
    const clearButton = document.getElementById('clearSearch');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            activeFilters.search = e.target.value.toLowerCase();
            filterAndRenderVendors();
            saveFilters();
        });
    }

    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.value === 'all') {
                if (checkbox.checked) {
                    categoryCheckboxes.forEach(cb => {
                        if (cb.value !== 'all') {
                            cb.checked = false;
                        }
                    });
                    activeFilters.categories = [];
                }
            } else {
                document.querySelector('input[name="category"][value="all"]').checked = false;
                updateCategoryFilters();
            }
            filterAndRenderVendors();
            saveFilters();
        });
    });

    sustainabilityCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateSustainabilityFilters();
            filterAndRenderVendors();
            saveFilters();
        });
    });

    if (resetButton) {
        resetButton.addEventListener('click', resetFilters);
    }

    if (clearButton) {
        clearButton.addEventListener('click', resetFilters);
    }
}

function updateCategoryFilters() {
    const checkedCategories = Array.from(
        document.querySelectorAll('input[name="category"]:checked:not([value="all"])')
    ).map(cb => cb.value);
    
    activeFilters.categories = checkedCategories;
}

function updateSustainabilityFilters() {
    const checkedSustainability = Array.from(
        document.querySelectorAll('input[name="sustainability"]:checked')
    ).map(cb => cb.value);
    
    activeFilters.sustainability = checkedSustainability;
}

function initSort() {
    const sortSelect = document.getElementById('sortSelect');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortVendors(e.target.value);
            renderVendors(filteredVendors);
        });
    }
}

function sortVendors(sortBy) {
    if (sortBy === 'name') {
        filteredVendors.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'category') {
        filteredVendors.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === 'distance') {
        filteredVendors.sort((a, b) => a.distance - b.distance);
    }
}

function filterAndRenderVendors() {
    filteredVendors = vendorsData.filter(vendor => {
        const matchesSearch = activeFilters.search === '' || 
            vendor.name.toLowerCase().includes(activeFilters.search) ||
            vendor.description.toLowerCase().includes(activeFilters.search);

        const matchesCategory = activeFilters.categories.length === 0 ||
            activeFilters.categories.includes(vendor.category);

        const matchesSustainability = activeFilters.sustainability.length === 0 ||
            activeFilters.sustainability.every(filter => 
                vendor.sustainability.includes(filter)
            );

        return matchesSearch && matchesCategory && matchesSustainability;
    });

    const sortValue = document.getElementById('sortSelect').value;
    sortVendors(sortValue);

    renderVendors(filteredVendors);
}

function loadVendors() {
    filterAndRenderVendors();
}

function renderVendors(vendors) {
    const vendorGrid = document.getElementById('vendorGrid');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');

    if (!vendorGrid) {
        return;
    }

    resultsCount.textContent = vendors.length;

    if (vendors.length === 0) {
        vendorGrid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    const vendorCards = vendors.map((vendor, index) => {
        const sustainabilityHTML = vendor.sustainability.map(tag => {
            const icons = {
                'local': '🌍',
                'organic': '🌿',
                'seasonal': '🍂',
                'zero-waste': '♻️'
            };
            return `<span class="tag">${icons[tag]} ${tag.charAt(0).toUpperCase() + tag.slice(1)}</span>`;
        }).join('');

        return `
            <article class="vendor-card" style="animation-delay: ${index * 0.1}s">
                <div class="vendor-header">
                    <h3 class="vendor-name">${vendor.name}</h3>
                    <span class="vendor-category">${formatCategory(vendor.category)}</span>
                </div>
                <div class="vendor-info">
                    <p>📍 ${vendor.address}, ${vendor.city}, ${vendor.state} ${vendor.zip}</p>
                    <p>📞 ${vendor.phone}</p>
                    <p>🕒 ${vendor.hours}</p>
                    ${vendor.website ? `<p>🌐 <a href="${vendor.website}" target="_blank" rel="noopener">Visit Website</a></p>` : ''}
                    <p>📏 ${vendor.distance} miles away</p>
                </div>
                <p>${vendor.description}</p>
                <div class="sustainability-tags">
                    ${sustainabilityHTML}
                </div>
            </article>
        `;
    }).join('');

    vendorGrid.innerHTML = vendorCards;
}

function formatCategory(category) {
    const categories = {
        'farmers-market': "Farmers' Market",
        'csa': 'CSA Program',
        'coop': 'Food Co-op',
        'restaurant': 'Restaurant'
    };
    return categories[category] || category;
}

function resetFilters() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    document.querySelectorAll('input[name="category"]').forEach(cb => {
        cb.checked = cb.value === 'all';
    });

    document.querySelectorAll('input[name="sustainability"]').forEach(cb => {
        cb.checked = false;
    });

    activeFilters = {
        search: '',
        categories: [],
        sustainability: []
    };

    filterAndRenderVendors();
    saveFilters();
}

function saveFilters() {
    try {
        localStorage.setItem('foodstead_filters', JSON.stringify(activeFilters));
    } catch (error) {
        console.error('Error saving filters:', error);
    }
}

function loadSavedFilters() {
    try {
        const saved = localStorage.getItem('foodstead_filters');
        if (saved) {
            const filters = JSON.parse(saved);
            
            if (filters.search) {
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.value = filters.search;
                    activeFilters.search = filters.search;
                }
            }
            if (filters.categories && filters.categories.length > 0) {
                document.querySelector('input[name="category"][value="all"]').checked = false;
                filters.categories.forEach(category => {
                    const checkbox = document.querySelector(`input[name="category"][value="${category}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
                activeFilters.categories = filters.categories;
            }

            if (filters.sustainability && filters.sustainability.length > 0) {
                filters.sustainability.forEach(tag => {
                    const checkbox = document.querySelector(`input[name="sustainability"][value="${tag}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
                activeFilters.sustainability = filters.sustainability;
            }

            filterAndRenderVendors();
        }
    } catch (error) {
        console.error('Error loading saved filters:', error);
    }
}
