// Gestion des nouveautés
let newMotifsLoaded = 0;
const motifsPerLoad = 6;

// Charger les nouveaux motifs
async function loadNewMotifs() {
    try {
        const response = await fetch('data/motifs.json');
        const motifs = await response.json();
        
        // Filtrer pour n'avoir que les nouveaux motifs (par exemple, de l'année en cours)
        const currentYear = new Date().getFullYear();
        const newMotifs = motifs.filter(motif => motif.year >= currentYear - 1);
        
        // Afficher les premiers motifs
        displayNewMotifs(newMotifs.slice(0, motifsPerLoad));
        newMotifsLoaded = motifsPerLoad;
        
        // Configurer le bouton "Charger plus"
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                const nextMotifs = newMotifs.slice(newMotifsLoaded, newMotifsLoaded + motifsPerLoad);
                displayNewMotifs(nextMotifs, true);
                newMotifsLoaded += motifsPerLoad;
                
                // Cacher le bouton si plus de motifs à charger
                if (newMotifsLoaded >= newMotifs.length) {
                    loadMoreBtn.style.display = 'none';
                }
            });
        }
        
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Afficher les nouveaux motifs
function displayNewMotifs(motifs, append = false) {
    const container = document.getElementById('new-motifs-grid');
    
    if (!append) {
        container.innerHTML = '';
    }
    
    motifs.forEach(motif => {
        const motifCard = createNewMotifCard(motif);
        container.innerHTML += motifCard;
    });
}

// Créer une carte spéciale pour les nouveaux motifs
function createNewMotifCard(motif) {
    const isNew = motif.year >= new Date().getFullYear();
    const isLimited = motif.reference.includes('LIMITED');
    
    return `
        <div class="new-motif-card">
            ${isNew ? '<span class="new-badge">NOUVEAU</span>' : ''}
            ${isLimited ? '<span class="limited-badge">LIMITÉ</span>' : ''}
            
            <div class="new-motif-image">
                <img src="${motif.image}" alt="${motif.name}">
            </div>
            
            <div class="new-motif-info">
                <h3>${motif.name}</h3>
                <div class="new-motif-meta">
                    <span class="brand">${motif.brand}</span>
                    <span class="year">${motif.year}</span>
                </div>
                <p class="motif-desc">${motif.description.substring(0, 100)}...</p>
                
                <div class="new-motif-actions">
                    <a href="motif.html?id=${motif.id}" class="btn btn-primary">Voir</a>
                    <button class="btn-icon" title="Ajouter aux favoris">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Gérer le calendrier
function initCalendar() {
    const prevBtn = document.querySelector('.month-nav:first-child');
    const nextBtn = document.querySelector('.month-nav:last-child');
    
    // Navigation du calendrier
    [prevBtn, nextBtn].forEach(btn => {
        btn.addEventListener('click', function() {
            // Implémenter la navigation du calendrier
            console.log('Changement de mois');
        });
    });
}

// Initialiser la page
document.addEventListener('DOMContentLoaded', function() {
    initCalendar();
});