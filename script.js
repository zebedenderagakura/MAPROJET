// Variables globales
let currentPage = 1;
let reservedSpots = parseInt(localStorage.getItem('reservedSpots')) || 0;
const totalSpots = 100;
let photoURL = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initSlideshow();
    updateSpotCounter();
    
    document.querySelector('.btn-quit').addEventListener('click', function() 
    {
        if(confirm('Voulez-vous vraiment quitter')) {
            window.close();
        }
    });

    // Gestionnaire pour la prévisualisation de la photo
    document.querySelector('input[name="photo"]').addEventListener('change', previewPhoto);
});

// Initialisation de la slideshow
function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    slides[currentSlide].style.opacity = 1;
    
    setInterval(() => {
        slides[currentSlide].style.opacity = 0;
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].style.opacity = 1;
    }, 5000);
}

// Navigation entre les pages
function showPage(pageNumber) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`page${pageNumber}`).classList.add('active');
    currentPage = pageNumber;
    
    if(pageNumber === 1) {
        document.getElementById('registrationForm').reset();
        if(photoURL) {
            URL.revokeObjectURL(photoURL);
            photoURL = null;
        }
    }
    
    if(pageNumber === 3) {
        fillVerificationPage();
    }
    
    if(pageNumber === 6) {
        reservedSpots++;
        localStorage.setItem('reservedSpots', reservedSpots.toString());
        updateSpotCounter();
    }
}

// Validation du formulaire
function validateForm(nextPage) {
    const form = document.getElementById('registrationForm');
    if(form.checkValidity()) {
        showPage(nextPage);
    } else {
        alert('Veuillez remplir tous les champs obligatoires!');
        form.reportValidity();
    }
}

// Prévisualisation de la photo
function previewPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        if (photoURL) URL.revokeObjectURL(photoURL);
        photoURL = URL.createObjectURL(file);
    }
}

// Remplissage de la page de vérification
function fillVerificationPage() {
    const form = document.getElementById('registrationForm');
    const formData = new FormData(form);

    // Remplir les informations
    document.getElementById('verification-lastname').textContent = formData.get('lastname');
    document.getElementById('verification-firstname').textContent = formData.get('firstname');
    document.getElementById('verification-birthdate').textContent = formatDate(formData.get('birthdate'));
    document.getElementById('verification-birthplace').textContent = formData.get('birthplace');
    document.getElementById('verification-nationality').textContent = formData.get('nationality');
    document.getElementById('verification-address').textContent = formData.get('address');
    document.getElementById('verification-phone').textContent = formData.get('phone');
    document.getElementById('verification-email').textContent = formData.get('email');
    document.getElementById('verification-idtype').textContent = getIDTypeText(formData.get('id_type'));
    document.getElementById('verification-idnumber').textContent = formData.get('id_number');
    document.getElementById('verification-profession').textContent = formData.get('profession');
    document.getElementById('verification-gender').textContent = getGenderText(formData.get('gender'));

    // Afficher la photo
    if (photoURL,RCURL) {
        document.getElementById('photo-preview').src = photoURL;      
        document.getElementById('RC-preview').src = RCURL;
    }
}

// Formatage de la date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
}

// Traduction type de pièce d'identité
function getIDTypeText(idType) {
    const types = {
        'cni': 'Carte Nationale',
        'passeport': 'Passeport',
        'permit': 'Permis de séjour'
    };
    return types[idType] || idType;
}

// Traduction genre
function getGenderText(gender) {
    const genders = {
        'male': 'Masculin',
        'female': 'Féminin',
        'other': 'Autre'
    };
    return genders[gender] || gender;
}

// Validation des produits
function validateProducts() {
    const category = document.getElementById('product-category').value;
    const description = document.getElementById('product-description').value;
    
    if (!category || !description.trim()) {
        alert('Veuillez remplir les champs obligatoires pour les produits!');
        return;
    }
    showPage(5);
}

// Sélection du mode de paiement
function selectPayment(element, paymentType) {
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    element.classList.add('selected');
    
    const bankOptions = document.getElementById('bankOptions');
    bankOptions.classList.toggle('active', paymentType === 'card');
}

// Sélection de la banque
function selectBank(element) {
    document.querySelectorAll('.bank-option').forEach(option => {
        option.classList.remove('selected');
    });
    element.classList.add('selected');
}

// Traitement du paiement
function processPayment() {
    const paymentSelected = document.querySelector('.payment-option.selected');
    
    if(!paymentSelected) {
        alert('Veuillez sélectionner un mode de paiement');
        return;
    }
    
    if(paymentSelected.textContent.includes('Carte Bancaire')) {
        const bankSelected = document.querySelector('.bank-option.selected');
        if(!bankSelected) {
            alert('Veuillez sélectionner votre banque');
            return;
        }
    }
    
    // Simulation du traitement du paiement
    setTimeout(() => {
        showPage(6);
    }, 1500);
}

// Mise à jour du compteur de places
function updateSpotCounter() {
    document.getElementById('reservedSpots').textContent = reservedSpots;
    document.getElementById('remainingSpots').textContent = totalSpots - reservedSpots;
}