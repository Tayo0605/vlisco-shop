// collection.js - Gestion de la page collection
let currentFilters = {
    brand: 'all',
    color: null,
    pattern: 'all',
    search: '',
    minPrice: 0,
    maxPrice: 165000,
    sortBy: 'newest'
};

let currentView = 'grid';
let allMotifs = [];

// Données de démo pour les tissus (en attendant le JSON)
const demoMotifs = [
    {
        id: 1,
        name: "Motif Classique Royal",
        brand: "vlisco",
        patternType: "traditionnel",
        price: 25000,
        colors: ["red", "gold", "blue"],
        image: "assets/images/motif1.jpg",
        description: "Un classique intemporel de la collection Vlisco",
        reference: "VL001",
        date: "2024-01-15"
    },
    {
        id: 2,
        name: "Wax Floral Printemps",
        brand: "hollandais",
        patternType: "floral",
        price: 18500,
        colors: ["green", "gold", "white"],
        image: "assets/images/motif2.jpg",
        description: "Motif floral printanier en wax hollandais",
        reference: "WH002",
        date: "2024-02-20"
    },
    {
        id: 3,
        name: "Motif Traditionnel Africain",
        brand: "woodin",
        patternType: "traditionnel",
        price: 22000,
        colors: ["black", "gold", "purple"],
        image: "assets/images/motif3.jpg",
        description: "Inspiration africaine traditionnelle",
        reference: "WD003",
        date: "2024-01-10"
    },
    {
        id: 4,
        name: "Géométrique Moderne",
        brand: "vlisco",
        patternType: "geometrique",
        price: 28500,
        colors: ["blue", "white", "red"],
        image: "assets/images/motif4.jpg",
        description: "Motif géométrique moderne et élégant",
        reference: "VL004",
        date: "2024-03-05"
    },
    {
        id: 5,
        name: "Safari Animal Print",
        brand: "hollandais",
        patternType: "animaux",
        price: 20000,
        colors: ["green", "black", "gold"],
        image: "assets/images/motif5.jpg",
        description: "Inspiration safari avec motifs animaux",
        reference: "WH005",
        date: "2024-02-15"
    },
    {
        id: 6,
        name: "Contemporain Élégant",
        brand: "woodin",
        patternType: "abstrait",
        price: 19500,
        colors: ["purple", "gold", "white"],
        image: "assets/images/motif6.jpg",
        description: "Design contemporain et abstrait",
        reference: "WD006",
        date: "2024-01-25"
    },
    {
        id: 7,
        name: "Collection Premium Gold",
        brand: "vlisco",
        patternType: "traditionnel",
        price: 35000,
        colors: ["gold", "black", "white"],
        image: "assets/images/motif7.jpg",
        description: "Collection premium avec finitions or",
        reference: "VL007",
        date: "2024-03-10"
    },
    {
        id: 8,
        name: "Traditionnel Royal",
        brand: "hollandais",
        patternType: "traditionnel",
        price: 23500,
        colors: ["red", "gold", "blue"],
        image: "assets/images/motif8.jpg",
        description: "Motif traditionnel royal hollandais",
        reference: "WH008",
        date: "2024-02-01"
    },
    {
        id: 9,
        name: "Moderne Abstract",
        brand: "woodin",
        patternType: "abstrait",
        price: 21000,
        colors: ["blue", "green", "gold"],
        image: "assets/images/motif9.jpg",
        description: "Design moderne et abstrait",
        reference: "WD009",
        date: "2024-01-30"
    },
    {
        id: 10,
        name: "Édition Limitée 2024",
        brand: "vlisco",
        patternType: "geometrique",
        price: 40000,
        colors: ["purple", "gold", "white"],
        image: "assets/images/motif10.jpg",
        description: "Édition limitée spéciale 2024",
        reference: "VL010",
        date: "2024-03-15"
    },
    {
        id: 11,
        name: "Quotidien Élégant",
        brand: "hollandais",
        patternType: "floral",
        price: 16500,
        colors: ["green", "white", "red"],
        image: "assets/images/motif11.jpg",
        description: "Parfait pour un usage quotidien",
        reference: "WH011",
        date: "2024-02-10"
    },
    {
        id: 12,
        name: "Collection Festive",
        brand: "woodin",
        patternType: "traditionnel",
        price: 24500,
        colors: ["red", "gold", "blue"],
        image: "assets/images/motif12.jpg",
        description: "Collection spéciale pour les fêtes",
        reference: "WD012",
        date: "2024-01-20"
    }
];

// Charger la collection
async function loadCollection() {
    try {
        showLoading();
        
        // Attendre 500ms pour simuler le chargement
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Essayer de charger depuis le fichier JSON
        try {
            const response = await fetch('data/motifs.json');
            if (response.ok) {
                allMotifs = await response.json();
            } else {
                // Si le fichier n'existe pas, utiliser les données de démo
                allMotifs = demoMotifs;
            }
        } catch (fetchError) {
            // En cas d'erreur, utiliser les données de démo
            allMotifs = demoMotifs;
        }
        
        const filteredMotifs = filterMotifs(allMotifs);
        const sortedMotifs = sortMotifs(filteredMotifs, currentFilters.sortBy);
        
        displayFilteredMotifs(sortedMotifs);
        
        // Mettre à jour le compteur
        document.getElementById('results-count').textContent = 
            `${sortedMotifs.length} tissus disponible${sortedMotifs.length !== 1 ? 's' : ''}`;
        
        updateActiveFilters();
        
        hideLoading();
        
    } catch (error) {
        console.error('Erreur lors du chargement de la collection:', error);
        document.getElementById('collection-motifs').innerHTML = 
            '<div class="no-results"><i class="fas fa-exclamation-circle"></i><h3>Erreur de chargement</h3><p>Veuillez réessayer plus tard</p></div>';
        hideLoading();
    }
}

// Filtrer les motifs
function filterMotifs(motifs) {
    return motifs.filter(motif => {
        // Filtre par marque
        if (currentFilters.brand !== 'all' && motif.brand !== currentFilters.brand) {
            return false;
        }
        
        // Filtre par couleur
        if (currentFilters.color && !motif.colors.includes(currentFilters.color)) {
            return false;
        }
        
        // Filtre par type de motif
        if (currentFilters.pattern !== 'all' && motif.patternType !== currentFilters.pattern) {
            return false;
        }
        
        // Filtre par prix
        if (motif.price < currentFilters.minPrice || motif.price > currentFilters.maxPrice) {
            return false;
        }
        
        // Filtre par recherche
        if (currentFilters.search.trim() !== '') {
            const searchTerm = currentFilters.search.toLowerCase();
            const motifText = `${motif.name} ${motif.brand} ${motif.reference || ''} ${motif.description || ''}`.toLowerCase();
            if (!motifText.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
}

// Trier les motifs
function sortMotifs(motifs, sortType) {
    const sorted = [...motifs];
    
    switch(sortType) {
        case 'newest':
            return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'oldest':
            return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        case 'price-asc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name-asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
        case 'name-desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name, 'fr'));
        default:
            return sorted;
    }
}

// Afficher les motifs filtrés
function displayFilteredMotifs(motifs) {
    const gridContainer = document.getElementById('collection-motifs');
    const listContainer = document.getElementById('collection-list');
    
    gridContainer.innerHTML = '';
    listContainer.innerHTML = '';
    
    if (motifs.length === 0) {
        const noResultsHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Aucun tissu trouvé</h3>
                <p>Essayez de modifier vos filtres ou votre recherche</p>
            </div>
        `;
        gridContainer.innerHTML = noResultsHTML;
        return;
    }
    
    // Générer la vue grille
    motifs.forEach(motif => {
        gridContainer.innerHTML += createMotifCard(motif);
    });
    
    // Générer la vue liste
    motifs.forEach(motif => {
        listContainer.innerHTML += createMotifListItem(motif);
    });
    
    updateViewDisplay();
}

// Créer une carte de motif (vue grille)
function createMotifCard(motif) {
    const priceFormatted = motif.price.toLocaleString('fr-FR');
    
    return `
        <div class="motif-card" data-brand="${motif.brand}" data-color="${motif.colors.join(',')}" data-pattern="${motif.patternType}">
            <div class="motif-image">
                <img src="${motif.image}" alt="${motif.name}" 
                     loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/300x300?text=${encodeURIComponent(motif.name)}'"
                     class="clickable-image" 
                     data-caption="${motif.name} - ${motif.brand} - ${priceFormatted} FCFA">
                <button class="quick-view" data-id="${motif.id}" aria-label="Vue rapide">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
            <div class="motif-info">
                <div class="motif-header">
                    <h3>${motif.name}</h3>
                    <span class="motif-brand ${motif.brand}">${motif.brand}</span>
                </div>
                <p class="motif-description">${motif.description || ''}</p>
                <div class="motif-colors">
                    ${motif.colors.map(color => 
                        `<span class="color-dot" style="background-color: ${getColorHex(color)}" title="${color}"></span>`
                    ).join('')}
                </div>
                <div class="motif-footer">
                    <span class="motif-price">${priceFormatted} FCFA</span>
                    <button class="add-to-cart" data-id="${motif.id}" aria-label="Ajouter au panier">
                        <i class="fas fa-shopping-bag"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Créer un élément de liste de motif (vue liste)
function createMotifListItem(motif) {
    const priceFormatted = motif.price.toLocaleString('fr-FR');
    
    return `
        <div class="motif-list-item" data-brand="${motif.brand}" data-color="${motif.colors.join(',')}" data-pattern="${motif.patternType}">
            <img src="${motif.image}" alt="${motif.name}" 
                 class="motif-list-image clickable-image" 
                 loading="lazy"
                 onerror="this.src='https://via.placeholder.com/300x200?text=${encodeURIComponent(motif.name)}'"
                 data-caption="${motif.name} - ${motif.brand} - ${priceFormatted} FCFA">
            <div class="motif-list-info">
                <h3>${motif.name}</h3>
                <span class="motif-brand ${motif.brand}">${motif.brand}</span>
                <p class="motif-description">${motif.description || ''}</p>
                <div class="motif-colors">
                    ${motif.colors.map(color => 
                        `<span class="color-dot" style="background-color: ${getColorHex(color)}" title="${color}"></span>`
                    ).join('')}
                </div>
                <p class="motif-list-price">${priceFormatted} FCFA</p>
                <div class="motif-list-actions">
                    <button class="view-btn-small" data-id="${motif.id}">
                        <i class="fas fa-eye"></i> Voir détails
                    </button>
                    <button class="add-to-cart" data-id="${motif.id}">
                        <i class="fas fa-shopping-bag"></i> Ajouter
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Obtenir le code hexadécimal d'une couleur
function getColorHex(color) {
    const colorMap = {
        'red': '#C41E3A',
        'gold': '#D4AF37',
        'blue': '#1E3A8A',
        'green': '#10B981',
        'black': '#000000',
        'purple': '#7C3AED',
        'white': '#FFFFFF'
    };
    return colorMap[color.toLowerCase()] || '#CCCCCC';
}

// Mettre à jour l'affichage de la vue active
function updateViewDisplay() {
    const gridContainer = document.getElementById('collection-motifs');
    const listContainer = document.getElementById('collection-list');
    
    if (currentView === 'grid') {
        gridContainer.style.display = 'grid';
        listContainer.style.display = 'none';
    } else {
        gridContainer.style.display = 'none';
        listContainer.style.display = 'flex';
    }
}

// Mettre à jour les filtres actifs
function updateActiveFilters() {
    const activeFiltersList = document.getElementById('active-filters-list');
    const activeFiltersSection = document.getElementById('active-filters-section');
    
    let activeFiltersHTML = '';
    let hasActiveFilters = false;
    
    // Marque
    if (currentFilters.brand !== 'all') {
        hasActiveFilters = true;
        activeFiltersHTML += `
            <span class="active-filter-tag">
                Marque: ${currentFilters.brand}
                <button class="remove-filter" data-type="brand">×</button>
            </span>
        `;
    }
    
    // Couleur
    if (currentFilters.color) {
        hasActiveFilters = true;
        activeFiltersHTML += `
            <span class="active-filter-tag">
                Couleur: ${currentFilters.color}
                <button class="remove-filter" data-type="color">×</button>
            </span>
        `;
    }
    
    // Type de motif
    if (currentFilters.pattern !== 'all') {
        hasActiveFilters = true;
        const patternNames = {
            'geometrique': 'Géométrique',
            'floral': 'Floral',
            'animaux': 'Animaux',
            'abstrait': 'Abstrait',
            'traditionnel': 'Traditionnel'
        };
        activeFiltersHTML += `
            <span class="active-filter-tag">
                Motif: ${patternNames[currentFilters.pattern] || currentFilters.pattern}
                <button class="remove-filter" data-type="pattern">×</button>
            </span>
        `;
    }
    
    // Prix
    if (currentFilters.minPrice > 0 || currentFilters.maxPrice < 165000) {
        hasActiveFilters = true;
        activeFiltersHTML += `
            <span class="active-filter-tag">
                Prix: ${currentFilters.minPrice.toLocaleString()} - ${currentFilters.maxPrice.toLocaleString()} FCFA
                <button class="remove-filter" data-type="price">×</button>
            </span>
        `;
    }
    
    // Recherche
    if (currentFilters.search.trim() !== '') {
        hasActiveFilters = true;
        activeFiltersHTML += `
            <span class="active-filter-tag">
                Recherche: "${currentFilters.search}"
                <button class="remove-filter" data-type="search">×</button>
            </span>
        `;
    }
    
    activeFiltersList.innerHTML = activeFiltersHTML;
    activeFiltersSection.style.display = hasActiveFilters ? 'block' : 'none';
    
    // Ajouter les événements pour les boutons de suppression
    document.querySelectorAll('.remove-filter').forEach(btn => {
        btn.addEventListener('click', function() {
            const filterType = this.dataset.type;
            removeFilter(filterType);
        });
    });
}

// Supprimer un filtre
function removeFilter(filterType) {
    switch(filterType) {
        case 'brand':
            currentFilters.brand = 'all';
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.filter === 'all') btn.classList.add('active');
            });
            break;
        case 'color':
            currentFilters.color = null;
            document.querySelectorAll('.color-filter').forEach(btn => {
                btn.style.transform = 'scale(1)';
                btn.style.border = '2px solid white';
            });
            break;
        case 'pattern':
            currentFilters.pattern = 'all';
            document.getElementById('pattern-type').value = 'all';
            break;
        case 'price':
            currentFilters.minPrice = 0;
            currentFilters.maxPrice = 165000;
            document.getElementById('price-min').value = 0;
            document.getElementById('price-max').value = 165000;
            updatePriceLabels();
            break;
        case 'search':
            currentFilters.search = '';
            document.getElementById('search-input').value = '';
            break;
    }
    
    loadCollection();
}

// Initialiser les filtres
function initFilters() {
    // Boutons de filtres par marque
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilters.brand = this.dataset.filter;
            loadCollection();
        });
    });
    
    // Filtres par couleur
    document.querySelectorAll('.color-filter').forEach(btn => {
        btn.addEventListener('click', function() {
            const color = this.dataset.color;
            currentFilters.color = currentFilters.color === color ? null : color;
            
            document.querySelectorAll('.color-filter').forEach(b => {
                b.style.transform = b.dataset.color === currentFilters.color ? 'scale(1.2)' : 'scale(1)';
                b.style.border = b.dataset.color === currentFilters.color ? '3px solid #333' : '2px solid white';
            });
            
            loadCollection();
        });
    });
    
    // Filtre par type de motif
    document.getElementById('pattern-type').addEventListener('change', function() {
        currentFilters.pattern = this.value;
        loadCollection();
    });
    
    // Filtres par prix
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    
    // Fonction pour mettre à jour les labels de prix
    function updatePriceLabels() {
        const minValue = parseInt(priceMin.value);
        const maxValue = parseInt(priceMax.value);
        
        document.getElementById('min-price-label').textContent = `${minValue.toLocaleString()} FCFA`;
        document.getElementById('max-price-label').textContent = `${maxValue.toLocaleString()} FCFA`;
        
        // S'assurer que min <= max
        if (minValue > maxValue) {
            priceMin.value = maxValue;
            document.getElementById('min-price-label').textContent = `${maxValue.toLocaleString()} FCFA`;
        }
        
        // Mettre à jour les filtres
        currentFilters.minPrice = parseInt(priceMin.value);
        currentFilters.maxPrice = parseInt(priceMax.value);
    }
    
    priceMin.addEventListener('input', updatePriceLabels);
    priceMax.addEventListener('input', updatePriceLabels);
    
    // Appliquer les filtres de prix lors du relâchement
    priceMin.addEventListener('change', () => loadCollection());
    priceMax.addEventListener('change', () => loadCollection());
    
    // Recherche
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    searchBtn.addEventListener('click', () => {
        currentFilters.search = searchInput.value;
        loadCollection();
    });
    
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            currentFilters.search = searchInput.value;
            loadCollection();
        }
    });
    
    // Tri
    document.getElementById('sort-by').addEventListener('change', function() {
        currentFilters.sortBy = this.value;
        loadCollection();
    });
    
    // View options
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentView = view;
            updateViewDisplay();
        });
    });
    
    // Réinitialiser tous les filtres
    document.getElementById('reset-filters').addEventListener('click', resetAllFilters);
    document.getElementById('clear-all-filters').addEventListener('click', resetAllFilters);
    
    // Appliquer les filtres (pour les prix)
    document.getElementById('apply-filters').addEventListener('click', () => {
        loadCollection();
    });
    
    // Toggle des filtres mobiles
    document.getElementById('mobile-filters-toggle').addEventListener('click', function() {
        const filtersContainer = document.getElementById('filters-container');
        filtersContainer.classList.toggle('active');
    });
}

// Réinitialiser tous les filtres
function resetAllFilters() {
    // Réinitialiser les variables
    currentFilters = {
        brand: 'all',
        color: null,
        pattern: 'all',
        search: '',
        minPrice: 0,
        maxPrice: 165000,
        sortBy: 'newest'
    };
    
    // Réinitialiser l'interface
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === 'all') btn.classList.add('active');
    });
    
    document.querySelectorAll('.color-filter').forEach(btn => {
        btn.style.transform = 'scale(1)';
        btn.style.border = '2px solid white';
    });
    
    document.getElementById('pattern-type').value = 'all';
    
    document.getElementById('price-min').value = 0;
    document.getElementById('price-max').value = 165000;
    document.getElementById('min-price-label').textContent = '0 FCFA';
    document.getElementById('max-price-label').textContent = '165.000 FCFA';
    
    document.getElementById('search-input').value = '';
    document.getElementById('sort-by').value = 'newest';
    
    loadCollection();
}

// Afficher le loader
function showLoading() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'flex';
    }
}

// Cacher le loader
function hideLoading() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

// Fonction pour initialiser le modal d'images
function initImageModal() {
    const modal = document.getElementById('image-modal');
    if (!modal) return;
    
    const modalImg = document.getElementById('modal-image');
    const captionText = document.getElementById('modal-caption');
    const closeBtn = modal.querySelector('.modal-close');
    const prevBtn = modal.querySelector('.modal-prev');
    const nextBtn = modal.querySelector('.modal-next');
    
    let currentImageIndex = 0;
    let images = [];
    
    // Récupérer toutes les images cliquables
    function updateImages() {
        images = Array.from(document.querySelectorAll('.clickable-image'));
    }
    
    // Ouvrir le modal
    function openModal(index) {
        if (images.length === 0) return;
        
        currentImageIndex = index;
        const img = images[currentImageIndex];
        modal.style.display = 'block';
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        captionText.innerHTML = img.dataset.caption || img.alt;
        
        // Mettre à jour la navigation
        updateNavigation();
        
        // Empêcher le scroll du body
        document.body.style.overflow = 'hidden';
    }
    
    // Fermer le modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Navigation entre images
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        openModal(currentImageIndex);
    }
    
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        openModal(currentImageIndex);
    }
    
    // Mettre à jour les boutons de navigation
    function updateNavigation() {
        if (images.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
        } else {
            if (prevBtn) prevBtn.style.display = 'flex';
            if (nextBtn) nextBtn.style.display = 'flex';
        }
    }
    
    // Zoom sur l'image
    function toggleZoom() {
        modalImg.classList.toggle('zoomed');
    }
    
    // Événements
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Navigation au clavier
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
                case ' ':
                case 'Spacebar':
                    toggleZoom();
                    e.preventDefault();
                    break;
            }
        }
    });
    
    // Navigation avec les flèches
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            prevImage();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            nextImage();
        });
    }
    
    // Zoom au double-clic
    if (modalImg) {
        modalImg.addEventListener('dblclick', toggleZoom);
    }
    
    // Ajouter les événements aux images
    function addClickEventsToImages() {
        updateImages();
        
        images.forEach((img, index) => {
            // Supprimer les anciens événements
            const newImg = img.cloneNode(true);
            img.parentNode.replaceChild(newImg, img);
            
            // Ajouter le nouvel événement
            newImg.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openModal(index);
            });
            
            // Accessibilité
            newImg.setAttribute('tabindex', '0');
            newImg.setAttribute('role', 'button');
            newImg.setAttribute('aria-label', `Voir en grand: ${newImg.alt}`);
            
            // Navigation clavier
            newImg.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(index);
                }
            });
        });
    }
    
    return {
        updateImages: addClickEventsToImages
    };
}

// Fonction pour initialiser le modal des détails du tissu
function initFabricModal() {
    const modal = document.getElementById('fabric-modal');
    if (!modal) return;
    
    const closeBtn = modal.querySelector('.fabric-modal-close');
    
    // Fermer le modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Événements de fermeture
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Navigation au clavier
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block' && e.key === 'Escape') {
            closeModal();
        }
    });
    
    return {
        closeModal: closeModal
    };
}

// Fonction pour obtenir les détails d'un tissu par ID
function getFabricById(id) {
    // Chercher d'abord dans allMotifs
    const motif = allMotifs.find(m => m.id === parseInt(id));
    if (motif) {
        return {
            ...motif,
            price: motif.price || 25000,
            colors: motif.colors || ['#C41E3A', '#D4AF37', '#1E3A8A']
        };
    }
    
    // Données par défaut pour les tissus non trouvés dans motifs.json
    const defaultFabrics = {
        1: { id: 1, name: 'Motif Classique Royal', brand: 'Vlisco', description: 'Un classique intemporel de la collection Vlisco avec des motifs traditionnels.', story: 'Créé par les meilleurs artisans de Vlisco, ce motif représente l\'élégance et la tradition africaine.', composition: '100% coton', width: '120 cm', origin: 'Helmond, Pays-Bas', year: 1972, reference: 'VL-1972-001', price: 25000, colors: ['#C41E3A', '#D4AF37', '#1E3A8A'] },
        2: { id: 2, name: 'Wax Floral Printemps', brand: 'Wax Hollandais', description: 'Motif floral printanier vibrant en wax holonnais.', story: 'Inspiré par les fleurs цветущие du Sahel, ce motif célèbre la beauté de la nature africaine.', composition: '100% coton', width: '115 cm', origin: 'Amsterdam, Pays-Bas', year: 2015, reference: 'WH-2015-002', price: 18500, colors: ['#10B981', '#D4AF37', '#FFFFFF'] },
        3: { id: 3, name: 'Motif Traditionnel Africain', brand: 'Woodin', description: 'Inspiration africaine traditionnelle avec des symboles ancestraux.', story: 'Ce motif rend hommage aux traditions africaines avec des symboles qui racontent des histoires de sagesse et de philosophie.', composition: '100% coton', width: '118 cm', origin: 'Accra, Ghana', year: 2020, reference: 'WD-2020-003', price: 22000, colors: ['#000000', '#D4AF37', '#7C3AED'] },
        4: { id: 4, name: 'Géométrique Moderne', brand: 'Vlisco', description: 'Motif géométrique moderne et élégant pour les occasions spéciales.', story: 'Une interprétation contemporaine des formes géométriques traditionnelles, parfaite pour les femmes modernes.', composition: '100% coton', width: '120 cm', origin: 'Helmond, Pays-Bas', year: 2018, reference: 'VL-2018-004', price: 28500, colors: ['#1E3A8A', '#FFFFFF', '#C41E3A'] },
        5: { id: 5, name: 'Safari Animal Print', brand: 'Wax Hollandais', description: 'Inspiration safari avec des motifs animals majestueux.', story: 'Créé pour célébrer la faune africaine, ce motif est parfait pour les esprits libres et aventureux.', composition: '100% coton', width: '115 cm', origin: 'Amsterdam, Pays-Bas', year: 2019, reference: 'WH-2019-005', price: 20000, colors: ['#10B981', '#000000', '#D4AF37'] },
        6: { id: 6, name: 'Contemporain Élégant', brand: 'Woodin', description: 'Design contemporain et abstrait pour un style unique.', story: 'Une fusion moderne de l\'art africain contemporain avec des influences occidentales.', composition: '100% coton', width: '118 cm', origin: 'Accra, Ghana', year: 2021, reference: 'WD-2021-006', price: 19500, colors: ['#7C3AED', '#D4AF37', '#FFFFFF'] },
        7: { id: 7, name: 'Collection Premium Gold', brand: 'Vlisco', description: 'Collection premium avec des finitions or exquis.', story: 'L\'ultime expression du luxe africain, avec des fils d\'or tissés avec expertise.', composition: '100% coton premium', width: '120 cm', origin: 'Helmond, Pays-Bas', year: 2023, reference: 'VL-2023-007', price: 35000, colors: ['#D4AF37', '#000000', '#FFFFFF'] },
        8: { id: 8, name: 'Traditionnel Royal', brand: 'Wax Hollandais', description: 'Motif traditionnel royal holonnais pour les grandes occasions.', story: 'Un hommage aux rois et reines africains, ce motif évoque la majesté et la dignité.', composition: '100% coton', width: '115 cm', origin: 'Amsterdam, Pays-Bas', year: 2017, reference: 'WH-2017-008', price: 23500, colors: ['#C41E3A', '#D4AF37', '#1E3A8A'] },
        9: { id: 9, name: 'Moderne Abstract', brand: 'Woodin', description: 'Design moderne et abstrait avec des formes audacieuses.', story: 'Une interprétation abstraite de l\'art africain moderne, pour ceux qui osent être différents.', composition: '100% coton', width: '118 cm', origin: 'Accra, Ghana', year: 2022, reference: 'WD-2022-009', price: 21000, colors: ['#1E3A8A', '#10B981', '#D4AF37'] },
        10: { id: 10, name: 'Édition Limitée 2024', brand: 'Vlisco', description: 'Édition limitée spéciale 2024 avec des motifs exclusifs.', story: 'Célébration de l\'année 2024 avec un motif exclusif qui capture l\'essence de notre époque.', composition: '100% coton premium', width: '120 cm', origin: 'Helmond, Pays-Bas', year: 2024, reference: 'VL-2024-010', price: 40000, colors: ['#7C3AED', '#D4AF37', '#FFFFFF'] },
        11: { id: 11, name: 'Quotidien Élégant', brand: 'Wax Hollandais', description: 'Parfait pour un usage quotidien avec style.', story: 'Un tissu confortable et élégant pour accompagner vos moments de tous les jours.', composition: '100% coton', width: '115 cm', origin: 'Amsterdam, Pays-Bas', year: 2023, reference: 'WH-2023-011', price: 16500, colors: ['#10B981', '#FFFFFF', '#C41E3A'] },
        12: { id: 12, name: 'Collection Festive', brand: 'Woodin', description: 'Collection spéciale pour les fêtes et célébrations.', story: 'Des motifs joyeux et vibrants conçus pour illuminer vos moments de célébration.', composition: '100% coton', width: '118 cm', origin: 'Accra, Ghana', year: 2023, reference: 'WD-2023-012', price: 24500, colors: ['#C41E3A', '#D4AF37', '#1E3A8A'] }
    };
    
    return defaultFabrics[id] || null;
}

// Fonction pour ouvrir le modal avec les détails du tissu
function openFabricModal(fabricId) {
    const modal = document.getElementById('fabric-modal');
    if (!modal) return;
    
    const fabric = getFabricById(fabricId);
    if (!fabric) {
        console.error('Tissu non trouvé:', fabricId);
        return;
    }
    
    // Remplir les informations du modal
    document.getElementById('modal-fabric-image').src = fabric.image || getFabricImage(fabricId);
    document.getElementById('modal-fabric-image').alt = fabric.name;
    document.getElementById('modal-fabric-brand').textContent = fabric.brand;
    document.getElementById('modal-fabric-name').textContent = fabric.name;
    document.getElementById('modal-fabric-reference').textContent = `Référence: ${fabric.reference || 'N/A'}`;
    document.getElementById('modal-fabric-description').textContent = fabric.description || '';
    document.getElementById('modal-fabric-story').textContent = fabric.story || '';
    document.getElementById('modal-fabric-composition').textContent = fabric.composition || '100% coton';
    document.getElementById('modal-fabric-width').textContent = fabric.width || '120 cm';
    document.getElementById('modal-fabric-origin').textContent = fabric.origin || 'Helmond, Pays-Bas';
    document.getElementById('modal-fabric-year').textContent = fabric.year || '2024';
    document.getElementById('modal-fabric-price').textContent = `${fabric.price.toLocaleString('fr-FR')}FCFA`;
    
    // Couleurs
    const colorsContainer = document.getElementById('modal-fabric-colors');
    colorsContainer.innerHTML = '';
    if (fabric.colors && Array.isArray(fabric.colors)) {
        fabric.colors.forEach(color => {
            const colorDot = document.createElement('div');
            colorDot.className = 'color-dot';
            colorDot.style.backgroundColor = color;
            if (color === '#FFFFFF') {
                colorDot.style.border = '1px solid #ccc';
            }
            colorsContainer.appendChild(colorDot);
        });
    }
    
    // Gallery
    const galleryContainer = document.getElementById('modal-fabric-gallery');
    galleryContainer.innerHTML = '';
    if (fabric.gallery && Array.isArray(fabric.gallery)) {
        fabric.gallery.forEach((img, index) => {
            const thumb = document.createElement('img');
            thumb.src = img;
            thumb.alt = `${fabric.name} - Image ${index + 1}`;
            thumb.className = 'gallery-thumb';
            thumb.addEventListener('click', () => {
                document.getElementById('modal-fabric-image').src = img;
            });
            galleryContainer.appendChild(thumb);
        });
    }
    
    // Afficher le modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Fonction pour obtenir l'image du tissu par ID
function getFabricImage(id) {
    const images = {
        1: 'assets/image/vlisco_3.jpg',
        2: 'assets/image/vlisco_2.jpg',
        3: 'assets/image/vlisco_1.jpg',
        4: 'assets/image/Super Wax.jpg',
        5: 'assets/image/Grand Super Limited Edition_6.jpg',
        6: 'assets/image/Grand Super Limited Edition_5.jpg',
        7: 'assets/image/wax_image_1.jpg',
        8: 'assets/image/Grand Super Limited Edition_3.jpg',
        9: 'assets/image/Grand Super Limited Edition_2.jpg',
        10: 'assets/image/Grand Super Limited Edition.jpg',
        11: 'assets/image/Grand Super Limited Edition_7.jpg',
        12: 'assets/image/wax_image_4.jpeg'
    };
    return images[id] || 'assets/image/vlisco_1.jpg';
}

// Fonction pour le menu mobile
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMobile = document.querySelector('.nav-mobile');
    const overlay = document.querySelector('.mobile-overlay');
    
    if (menuToggle && navMobile) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            if (navMobile) navMobile.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
            document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
        });
        
        if (overlay) {
            overlay.addEventListener('click', function() {
                if (menuToggle) menuToggle.classList.remove('active');
                if (navMobile) navMobile.classList.remove('active');
                this.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        const mobileLinks = document.querySelectorAll('.nav-mobile a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (menuToggle) menuToggle.classList.remove('active');
                if (navMobile) navMobile.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// Initialiser quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    initFilters();
    initMobileMenu();
    
    // Initialiser le modal pour les images
    const imageModal = initImageModal();
    
    // Initialiser le modal des détails du tissu
    initFabricModal();
    
    // Charger la collection initiale
    loadCollection();
    
    // Réattacher les événements d'images après le chargement de la collection
    if (imageModal && imageModal.updateImages) {
        setTimeout(imageModal.updateImages, 100);
    }
    
    // Gérer les boutons "Ajouter au panier"
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart')) {
            const btn = e.target.closest('.add-to-cart');
            const id = btn.dataset.id;
            alert(`Produit ${id} ajouté au panier!`);
            // Ici vous ajouteriez la logique pour ajouter au panier
        }
        
        if (e.target.closest('.quick-view')) {
            const btn = e.target.closest('.quick-view');
            const id = btn.dataset.id;
            alert(`Vue rapide du produit ${id}!`);
            // Ici vous ajouteriez la logique pour la vue rapide
        }
        
        // Gérer les boutons "Voir détails" du modal
        if (e.target.closest('.view-details-btn')) {
            const btn = e.target.closest('.view-details-btn');
            const id = btn.dataset.id;
            openFabricModal(id);
        }
        
        // Gérer le bouton "Ajouter au panier" dans le modal
        if (e.target.closest('#modal-add-to-cart')) {
            const btn = e.target.closest('#modal-add-to-cart');
            const fabricName = document.getElementById('modal-fabric-name').textContent;
            alert(`${fabricName} ajouté au panier!`);
        }
    });
});