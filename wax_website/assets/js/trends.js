// Gestion des tendances
function initTrendsPage() {
    // Tabs des catégories
    const categoryTabs = document.querySelectorAll('.category-tab');
    const categoryContents = document.querySelectorAll('.category-content');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Mettre à jour les tabs actives
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Afficher le contenu correspondant
            categoryContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === category) {
                    content.classList.add('active');
                }
            });
            
            // Charger les motifs de la catégorie
            loadCategoryMotifs(category);
        });
    });
    
    // Newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simuler l'envoi
            alert(`Merci ! Vous êtes maintenant inscrit avec l'email: ${email}`);
            this.reset();
        });
    }
}

// Charger les motifs par catégorie
async function loadCategoryMotifs(category) {
    try {
        const response = await fetch('data/motifs.json');
        const motifs = await response.json();
        
        // Filtrer par catégorie
        const filteredMotifs = motifs.filter(motif => 
            motif.patternType === category
        ).slice(0, 6); // Limiter à 6 motifs
        
        // Afficher
        const container = document.querySelector(`#${category} .motifs-grid`);
        if (container) {
            container.innerHTML = filteredMotifs.map(motif => 
                createMotifCard(motif)
            ).join('');
        }
        
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Initialiser la page
document.addEventListener('DOMContentLoaded', initTrendsPage);