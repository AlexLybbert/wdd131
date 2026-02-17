const formState = {
    isSubmitting: false,
    submissions: []
};

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initForm();
    loadRecentSubmissions();
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

function initForm() {
    const form = document.getElementById('vendorForm');
    const submitAnotherBtn = document.getElementById('submitAnother');

    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        });

        form.addEventListener('submit', handleSubmit);

        form.addEventListener('reset', () => {
            clearAllErrors();
            setTimeout(() => {
                document.getElementById('vendorName').focus();
            }, 100);
        });
    }

    if (submitAnotherBtn) {
        submitAnotherBtn.addEventListener('click', () => {
            document.getElementById('successMessage').style.display = 'none';
            document.getElementById('vendorForm').style.display = 'block';
            document.getElementById('vendorForm').reset();
            clearAllErrors();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    clearFieldError(field);

    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    else if (field.type === 'tel' && value) {
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please use format: 555-555-5555';
        }
    }
    else if (field.type === 'url' && value) {
        try {
            new URL(value);
        } catch {
            isValid = false;
            errorMessage = 'Please enter a valid URL (e.g., https://example.com)';
        }
    }
    else if (fieldName === 'zipCode' && value) {
        const zipRegex = /^\d{5}$/;
        if (!zipRegex.test(value)) {
            isValid = false;
            errorMessage = 'ZIP code must be 5 digits';
        }
    }
    else if (fieldName === 'state' && value) {
        if (value.length !== 2) {
            isValid = false;
            errorMessage = 'State must be 2 letters (e.g., OR)';
        }
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function validateSustainability() {
    const checkboxes = document.querySelectorAll('input[name="sustainability"]');
    const checked = Array.from(checkboxes).some(cb => cb.checked);
    
    const errorElement = document.getElementById('sustainabilityError');
    
    if (!checked) {
        errorElement.textContent = 'Please select at least one sustainability feature';
        return false;
    }
    
    errorElement.textContent = '';
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorElement = document.getElementById(`${field.name}Error`);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = document.getElementById(`${field.name}Error`);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function clearAllErrors() {
    const form = document.getElementById('vendorForm');
    if (form) {
        form.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
        form.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
    }
}

async function handleSubmit(e) {
    e.preventDefault();

    if (formState.isSubmitting) {
        return;
    }

    const form = e.target;
    let isValid = true;

    const fields = form.querySelectorAll('input:not([type="checkbox"]), select, textarea');
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    if (!validateSustainability()) {
        isValid = false;
    }

    if (!isValid) {
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        return;
    }

    const formData = collectFormData(form);

    formState.isSubmitting = true;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;

    try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        saveSubmission(formData);

        form.style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });

        loadRecentSubmissions();

    } catch (error) {
        console.error('Submission error:', error);
        alert('An error occurred. Please try again.');
    } finally {
        formState.isSubmitting = false;
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

function collectFormData(form) {
    const data = {
        vendorName: form.vendorName.value.trim(),
        category: form.category.value,
        address: form.address.value.trim(),
        city: form.city.value.trim(),
        state: form.state.value.trim().toUpperCase(),
        zipCode: form.zipCode.value.trim(),
        phone: form.phone.value.trim(),
        website: form.website.value.trim(),
        hours: form.hours.value.trim(),
        sustainability: Array.from(form.querySelectorAll('input[name="sustainability"]:checked'))
            .map(cb => cb.value),
        description: form.description.value.trim(),
        yourName: form.yourName.value.trim(),
        yourEmail: form.yourEmail.value.trim(),
        submittedAt: new Date().toISOString()
    };

    return data;
}

function saveSubmission(submission) {
    try {
        const submissions = getSubmissions();
        
        submissions.unshift(submission);
        
        const trimmedSubmissions = submissions.slice(0, 10);
        
        localStorage.setItem('foodstead_submissions', JSON.stringify(trimmedSubmissions));
        
        formState.submissions = trimmedSubmissions;
    } catch (error) {
        console.error('Error saving submission:', error);
    }
}

function getSubmissions() {
    try {
        const stored = localStorage.getItem('foodstead_submissions');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading submissions:', error);
        return [];
    }
}

function loadRecentSubmissions() {
    const container = document.getElementById('recentSubmissions');
    
    if (!container) {
        return;
    }

    const submissions = getSubmissions();

    if (submissions.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No submissions yet. Be the first to contribute!</p>';
        return;
    }

    const submissionsHTML = submissions.map(submission => {
        const date = new Date(submission.submittedAt);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const sustainabilityIcons = {
            'local': '🌍',
            'organic': '🌿',
            'seasonal': '🍂',
            'zero-waste': '♻️'
        };

        const sustainabilityHTML = submission.sustainability
            .map(tag => sustainabilityIcons[tag] || '')
            .join(' ');

        return `
            <article class="submission-card">
                <h4>${submission.vendorName}</h4>
                <p><strong>${formatCategory(submission.category)}</strong></p>
                <p>${submission.city}, ${submission.state}</p>
                <p>${sustainabilityHTML}</p>
                <p class="submission-meta">Submitted by ${submission.yourName} on ${formattedDate}</p>
            </article>
        `;
    }).join('');

    container.innerHTML = submissionsHTML;
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
