// Gestion de la page collection
let currentFilters = {
    brand: 'all',
    color: null,
    pattern: 'all',
    search: ''
};

// Charger la collection
async function loadCollection() {
    try {
        const response = await fetch('data/motifs.json');
        const motifs = await response.json();
        
        // Appliquer les filtres
        const filteredMotifs = filterMotifs(motifs);
        
        // Afficher les résultats
        displayFilteredMotifs(filteredMotifs);
        
        // Mettre à jour le compteur
        document.getElementById('results-count').textContent = 
            `${filteredMotifs.length} motifs disponibles`;
            
    } catch (error) {
        console.error('Erreur lors du chargement de la collection:', error);
        document.getElementById('collection-motifs').innerHTML = 
            '<p class="error">Erreur de chargement des motifs</p>';
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
        
        // Filtre par recherche
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            const motifText = `${motif.name} ${motif.brand} ${motif.reference}`.toLowerCase();
            if (!motifText.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
}

// Afficher les motifs filtrés
function displayFilteredMotifs(motifs) {
    const container = document.getElementById('collection-motifs');
    container.innerHTML = '';
    
    if (motifs.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Aucun motif trouvé</h3>
                <p>Essayez de modifier vos filtres</p>
            </div>
        `;
        return;
    }
    
    motifs.forEach(motif => {
        container.innerHTML += createMotifCard(motif);
    });
}

// Initialiser les filtres
function initFilters() {
    // Boutons de filtres par marque
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Mettre à jour le filtre
            currentFilters.brand = this.dataset.filter;
            
            // Recharger la collection
            loadCollection();
        });
    });
    
    // Filtres par couleur
    document.querySelectorAll('.color-filter').forEach(btn => {
        btn.addEventListener('click', function() {
            const color = this.dataset.color;
            currentFilters.color = currentFilters.color === color ? null : color;
            
            // Mettre en évidence le filtre actif
            document.querySelectorAll('.color-filter').forEach(b => {
                b.style.transform = b.dataset.color === currentFilters.color ? 'scale(1.2)' : 'scale(1)';
                b.style.border = b.dataset.color === currentFilters.color ? '2px solid #333' : '2px solid white';
            });
            
            loadCollection();
        });
    });
    
    // Filtre par type de motif
    document.getElementById('pattern-type').addEventListener('change', function() {
        currentFilters.pattern = this.value;
        loadCollection();
    });
    
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
        sortCollection(this.value);
    });
}

// Trier la collection
function sortCollection(sortType) {
    // Implémenter le tri selon le type sélectionné
    console.log('Tri par:', sortType);
    // À implémenter selon tes besoins
}

// Initialiser quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    initFilters();
});