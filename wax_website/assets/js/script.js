// ===== FONCTIONS UTILITAIRES =====

// Charger un composant HTML dans un élément
function loadComponent(elementId, componentPath) {
    fetch(componentPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur de chargement: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            // Ré-exécuter les scripts après chargement
            const scripts = document.getElementById(elementId).getElementsByTagName('script');
            for (let script of scripts) {
                eval(script.innerHTML);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            document.getElementById(elementId).innerHTML = 
                `<div style="color: red; padding: 20px;">Erreur de chargement: ${error.message}</div>`;
        });
}

// Charger les motifs depuis le JSON
async function loadMotifs(limit = null) {
    try {
        const response = await fetch('data/motifs.json');
        const motifs = await response.json();
        
        if (limit) {
            return motifs.slice(0, limit);
        }
        return motifs;
    } catch (error) {
        console.error('Erreur lors du chargement des motifs:', error);
        return [];
    }
}

// Afficher les motifs dans un conteneur
function displayMotifs(motifs, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    motifs.forEach(motif => {
        const motifCard = createMotifCard(motif);
        container.innerHTML += motifCard;
    });
}

// Créer une carte motif HTML
function createMotifCard(motif) {
    const colorsHTML = motif.colors.map(color => 
        `<div class="color-dot" style="background-color: ${color};" title="${color}"></div>`
    ).join('');
    
    return `
        <a href="motif.html?id=${motif.id}" class="motif-card">
            <div class="motif-image">
                <img src="${motif.image}" alt="${motif.name}">
            </div>
            <div class="motif-info">
                <div class="motif-name">${motif.name}</div>
                <div class="motif-brand">${motif.brand}</div>
                <div class="motif-colors">
                    ${colorsHTML}
                </div>
            </div>
        </a>
    `;
}

// Charger les motifs vedettes pour la page d'accueil
async function loadFeaturedMotifs() {
    const motifs = await loadMotifs(4);
    displayMotifs(motifs, 'featured-motifs');
}

// Charger tous les motifs pour la page collection
async function loadAllMotifs() {
    const motifs = await loadMotifs();
    displayMotifs(motifs, 'all-motifs');
}

// Charger un motif spécifique par ID
async function loadMotifById(id) {
    try {
        const response = await fetch('data/motifs.json');
        const motifs = await response.json();
        return motifs.find(motif => motif.id == id) || null;
    } catch (error) {
        console.error('Erreur:', error);
        return null;
    }
}

// Afficher les détails d'un motif
async function displayMotifDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const motifId = urlParams.get('id');
    
    if (!motifId) {
        document.getElementById('motif-detail').innerHTML = 
            '<p class="error">Motif non trouvé</p>';
        return;
    }
    
    const motif = await loadMotifById(motifId);
    
    if (!motif) {
        document.getElementById('motif-detail').innerHTML = 
            '<p class="error">Motif non trouvé</p>';
        return;
    }
    
    // Construction de la galerie
    const galleryHTML = motif.gallery.map(img => 
        `<img src="${img}" alt="${motif.name}" class="gallery-thumb">`
    ).join('');
    
    // Construction des couleurs
    const colorsHTML = motif.colors.map(color => `
        <div class="color-item">
            <div class="color-preview" style="background-color: ${color};"></div>
            <span>${color}</span>
        </div>
    `).join('');
    
    document.getElementById('motif-detail').innerHTML = `
        <div class="motif-detail-container">
            <div class="motif-gallery">
                <div class="main-image">
                    <img src="${motif.image}" alt="${motif.name}">
                </div>
                <div class="gallery-thumbs">
                    ${galleryHTML}
                </div>
            </div>
            
            <div class="motif-info-detail">
                <span class="motif-brand">${motif.brand}</span>
                <h1>${motif.name}</h1>
                <p class="motif-description">${motif.description}</p>
                
                <div class="specs">
                    <h3>Caractéristiques</h3>
                    <div class="specs-grid">
                        <div class="spec-item">
                            <span class="spec-label">Référence:</span>
                            <span class="spec-value">${motif.reference}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Composition:</span>
                            <span class="spec-value">${motif.composition}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Largeur:</span>
                            <span class="spec-value">${motif.width} cm</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Origine:</span>
                            <span class="spec-value">${motif.origin}</span>
                        </div>
                    </div>
                </div>
                
                <div class="colors-section">
                    <h3>Palette de couleurs</h3>
                    <div class="colors-grid">
                        ${colorsHTML}
                    </div>
                </div>
                
                <div class="story-section">
                    <h3>Histoire du motif</h3>
                    <p>${motif.story}</p>
                </div>
            </div>
        </div>
    `;
}

// ===== GESTION DE LA NAVIGATION MOBILE =====
document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', function(event) {
        if (navMenu && menuToggle && 
            !navMenu.contains(event.target) && 
            !menuToggle.contains(event.target) &&
            navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
});