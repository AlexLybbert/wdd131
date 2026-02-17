document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initStatsCounter();
    initScrollAnimations();
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

        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    if (stats.length === 0) {
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetCount = parseInt(target.getAttribute('data-count'));
                animateCount(target, targetCount);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

function animateCount(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, stepTime);
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .vendor-card');
    
    if (animatedElements.length === 0) {
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

const userPreferences = {
    save: (key, value) => {
        try {
            localStorage.setItem(`foodstead_${key}`, JSON.stringify(value));
        } catch (error) {
            console.error(`Error saving preference ${key}:`, error);
        }
    },

    get: (key, defaultValue = null) => {
        try {
            const value = localStorage.getItem(`foodstead_${key}`);
            return value ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.error(`Error getting preference ${key}:`, error);
            return defaultValue;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(`foodstead_${key}`);
        } catch (error) {
            console.error(`Error removing preference ${key}:`, error);
        }
    }
};

if (document.querySelector('.hero')) {
    const lastVisit = userPreferences.get('lastVisit');
    const currentVisit = new Date().toISOString();
    
    if (lastVisit) {
        console.log(`Welcome back! Last visit: ${new Date(lastVisit).toLocaleDateString()}`);
    } else {
        console.log('Welcome to The Foodstead!');
    }
    
    userPreferences.save('lastVisit', currentVisit);
}
