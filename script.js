// Portfolio Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initTypingEffect();
    initScrollAnimations();
    initSkillBars();
    initContactForm();
    initBackToTop();
    initDownloadCV();
    loadGitHubProjects();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Typing effect for hero section
function initTypingEffect() {
    const typedTextElement = document.getElementById('typed-text');
    const texts = [
        'Cybersecurity Student',
        'Cloud Infrastructure Specialist',
        'Linux Systems Administrator',
        'Network Security Enthusiast',
        'Developer',
        'Tech Enthusiast'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeText() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            typedTextElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typedTextElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause before deleting
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before typing next text
        }

        setTimeout(typeText, typingSpeed);
    }

    typeText();
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements that should animate
    const animateElements = document.querySelectorAll('.section-header, .about-content, .project-card, .skill-item, .contact-content');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Skill bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                skillBar.style.width = width + '%';
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const formData = new FormData(contactForm);

        // Show loading state
        submitBtn.classList.add('loading');

        // Simulate form submission (replace with actual form handling)
        try {
            await simulateFormSubmission(formData);
            showNotification('Message sent successfully!', 'success');
            contactForm.reset();
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.classList.remove('loading');
        }
    });
}

// Simulate form submission (replace with actual implementation)
function simulateFormSubmission(formData) {
    // Log form data for debugging (remove in production)
    console.log('Form data:', Object.fromEntries(formData));

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success/failure
            if (Math.random() > 0.1) {
                resolve();
            } else {
                reject(new Error('Submission failed'));
            }
        }, 2000);
    });
}

// Back to top functionality
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// GitHub Projects Integration
async function loadGitHubProjects() {
    const username = 'beemal01';

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        const repos = await response.json();

        if (response.ok) {
            displayProjects(repos);
        } else {
            throw new Error('Failed to fetch repositories');
        }
    } catch (error) {
        console.error('Error loading GitHub projects:', error);
        displayFallbackProjects();
    }
}

function displayProjects(repos) {
    const projectsGrid = document.getElementById('projects-grid');

    // Featured projects with custom descriptions
    const featuredProjects = {
        'weatherapp': {
            description: 'A modern, responsive weather application featuring real-time weather data, 5-day forecasts, and location-based services with beautiful UI.',
            icon: 'fas fa-cloud-sun',
            tech: ['JavaScript', 'HTML5', 'CSS3', 'OpenWeatherMap API', 'Geolocation API']
        },
        'chat-bot': {
            description: 'An intelligent chatbot with natural language processing capabilities for customer support.',
            icon: 'fas fa-comments',
            tech: ['Python', 'NLTK', 'scikit-learn', 'Flask', 'Natural Language Processing']
        },
        'plagiarism-checker': {
            description: 'A comprehensive plagiarism detection tool that analyzes text for originality and similarity.',
            icon: 'fas fa-search',
            tech: ['Python', 'NLTK', 'Text Mining', 'Similarity Algorithms', 'Flask']
        },
        'unity-cybersecurity-lab': {
            description: 'An interactive Unity-based cybersecurity training environment for hands-on learning.',
            icon: 'fas fa-shield-alt',
            tech: ['Unity 3D', 'C#', 'Cybersecurity Concepts', 'Game Development', 'Educational Technology']
        }
    };

    const projectsHTML = repos.slice(0, 6).map(repo => {
        const repoName = repo.name.toLowerCase();
        const featured = featuredProjects[repoName] || {};
        const description = featured.description || repo.description || 'A project showcasing modern development practices and innovative solutions.';
        const icon = featured.icon || 'fas fa-code';
        const tech = featured.tech || getLanguageTags(repo.language);

        return `
            <div class="project-card fade-in">
                <div class="project-header">
                    <div class="project-icon">
                        <i class="${icon}"></i>
                    </div>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" class="project-link" title="View Code">
                            <i class="fab fa-github"></i>
                        </a>
                        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-link" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
                    </div>
                </div>
                <h3 class="project-title">${formatProjectName(repo.name)}</h3>
                <p class="project-description">${description}<br><br><strong>Built with:</strong> ${tech.join(', ')}</p>
                <div class="project-tech">
                    ${tech.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
    }).join('');

    projectsGrid.innerHTML = projectsHTML;

    // Re-observe new project cards for animations
    const newProjectCards = projectsGrid.querySelectorAll('.project-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    newProjectCards.forEach(card => observer.observe(card));
}

function displayFallbackProjects() {
    const projectsGrid = document.getElementById('projects-grid');

    const fallbackProjects = [
        {
            name: 'Weather App',
            description: 'A modern, responsive weather application featuring real-time weather data, 5-day forecasts, and location-based services with beautiful UI.',
            icon: 'fas fa-cloud-sun',
            tech: ['JavaScript', 'HTML5', 'CSS3', 'OpenWeatherMap API', 'Geolocation API'],
            github: 'https://github.com/beemal01',
            demo: null
        },
        {
            name: 'Chat-bot',
            description: 'An intelligent chatbot with natural language processing capabilities for customer support.',
            icon: 'fas fa-comments',
            tech: ['Python', 'NLTK', 'scikit-learn', 'Flask', 'Natural Language Processing'],
            github: 'https://github.com/beemal01',
            demo: null
        },
        {
            name: 'Unity Cybersecurity Lab',
            description: 'An interactive Unity-based cybersecurity training environment for hands-on learning.',
            icon: 'fas fa-shield-alt',
            tech: ['Unity 3D', 'C#', 'Cybersecurity Concepts', 'Game Development', 'Educational Technology'],
            github: 'https://github.com/beemal01',
            demo: null
        },
        {
            name: 'Portfolio Website',
            description: 'A modern, responsive portfolio website showcasing projects and skills with dark theme design.',
            icon: 'fas fa-globe',
            tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'Font Awesome'],
            github: 'https://github.com/beemal01',
            demo: null
        }
    ];

    const projectsHTML = fallbackProjects.map(project => `
        <div class="project-card fade-in">
            <div class="project-header">
                <div class="project-icon">
                    <i class="${project.icon}"></i>
                </div>
                <div class="project-links">
                    <a href="${project.github}" target="_blank" class="project-link" title="View Code">
                        <i class="fab fa-github"></i>
                    </a>
                    ${project.demo ? `<a href="${project.demo}" target="_blank" class="project-link" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
                </div>
            </div>
            <h3 class="project-title">${project.name}</h3>
            <p class="project-description">${project.description}<br><br><strong>Built with:</strong> ${project.tech.join(', ')}</p>
            <div class="project-tech">
                ${project.tech.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');

    projectsGrid.innerHTML = projectsHTML;
}

// Helper functions
function formatProjectName(name) {
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function getLanguageTags(language) {
    const languageMap = {
        'JavaScript': ['JavaScript', 'HTML5', 'CSS3', 'Web Development'],
        'Python': ['Python', 'Flask', 'Backend Development', 'Data Science'],
        'HTML': ['HTML5', 'CSS3', 'Frontend Development'],
        'CSS': ['CSS3', 'Responsive Design', 'Frontend Styling'],
        'C#': ['C#', 'Unity 3D', 'Game Development', '.NET'],
        'PHP': ['PHP', 'MySQL', 'Backend Development', 'Web Applications'],
        'Java': ['Java', 'Spring Framework', 'Backend Development', 'Enterprise Applications'],
        'TypeScript': ['TypeScript', 'JavaScript', 'Angular', 'React'],
        'C++': ['C++', 'System Programming', 'Performance Optimization'],
        'Go': ['Go', 'Microservices', 'Backend Development', 'Cloud Native'],
        'Rust': ['Rust', 'System Programming', 'Memory Safety', 'Performance']
    };

    return languageMap[language] || [language || 'Programming', 'Software Development'];
}

// Download CV functionality (called from main DOMContentLoaded)
function initDownloadCV() {
    const downloadCvBtn = document.getElementById('download-cv');
}

// Enhanced notification function with info type
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        background: ${colors[type] || colors.info};
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}