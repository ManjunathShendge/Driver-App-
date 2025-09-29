// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Header Background Change on Scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Animations
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

// Observe all elements with fade-in class
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Form Validation
const form = document.getElementById('booking-form');
const inputs = {
    name: document.getElementById('name'),
    phone: document.getElementById('phone'),
    location: document.getElementById('location'),
    date: document.getElementById('date'),
    time: document.getElementById('time'),
    duration: document.getElementById('duration')
};

const errors = {
    name: document.getElementById('name-error'),
    phone: document.getElementById('phone-error'),
    location: document.getElementById('location-error'),
    date: document.getElementById('date-error'),
    time: document.getElementById('time-error'),
    duration: document.getElementById('duration-error')
};

// Validation Functions
function validateName(name) {
    if (name.length < 2) {
        return 'Name must be at least 2 characters long';
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return 'Name can only contain letters and spaces';
    }
    return '';
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/\s|-|\(|\)/g, ''))) {
        return 'Please enter a valid phone number';
    }
    return '';
}

function validateLocation(location) {
    if (location.length < 5) {
        return 'Please enter a more specific location';
    }
    return '';
}

function validateDate(date) {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        return 'Please select a future date';
    }
    return '';
}

function validateTime(time, date) {
    if (!time) {
        return 'Please select a time';
    }
    
    const selectedDate = new Date(date);
    const today = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    
    if (selectedDate.toDateString() === today.toDateString() && selectedDateTime < now) {
        return 'Please select a future time';
    }
    return '';
}

function validateDuration(duration) {
    if (!duration) {
        return 'Please select a duration';
    }
    return '';
}

// Real-time Validation
inputs.name.addEventListener('blur', () => {
    const error = validateName(inputs.name.value.trim());
    errors.name.textContent = error;
});

inputs.phone.addEventListener('blur', () => {
    const error = validatePhone(inputs.phone.value.trim());
    errors.phone.textContent = error;
});

inputs.location.addEventListener('blur', () => {
    const error = validateLocation(inputs.location.value.trim());
    errors.location.textContent = error;
});

inputs.date.addEventListener('blur', () => {
    const error = validateDate(inputs.date.value);
    errors.date.textContent = error;
});

inputs.time.addEventListener('blur', () => {
    const error = validateTime(inputs.time.value, inputs.date.value);
    errors.time.textContent = error;
});

inputs.duration.addEventListener('change', () => {
    const error = validateDuration(inputs.duration.value);
    errors.duration.textContent = error;
});

// Set minimum date to today
inputs.date.min = new Date().toISOString().split('T')[0];

// Form Submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Clear previous errors
    Object.values(errors).forEach(error => error.textContent = '');
    
    // Validate all fields
    const nameError = validateName(inputs.name.value.trim());
    const phoneError = validatePhone(inputs.phone.value.trim());
    const locationError = validateLocation(inputs.location.value.trim());
    const dateError = validateDate(inputs.date.value);
    const timeError = validateTime(inputs.time.value, inputs.date.value);
    const durationError = validateDuration(inputs.duration.value);
    
    // Display errors
    errors.name.textContent = nameError;
    errors.phone.textContent = phoneError;
    errors.location.textContent = locationError;
    errors.date.textContent = dateError;
    errors.time.textContent = timeError;
    errors.duration.textContent = durationError;
    
    // Check if there are any errors
    const hasErrors = nameError || phoneError || locationError || dateError || timeError || durationError;
    
    if (!hasErrors) {
        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
        
        // Scroll to top of form
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        // Scroll to first error
        const firstErrorField = Object.entries(errors).find(([key, error]) => error.textContent !== '');
        if (firstErrorField) {
            inputs[firstErrorField[0]].focus();
            inputs[firstErrorField[0]].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

// Success Message
function showSuccessMessage() {
    // Remove existing success message if any
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message show';
    successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <strong>Booking Request Submitted Successfully!</strong>
        <p>We'll contact you within 15 minutes to confirm your booking details.</p>
    `;
    
    // Insert before form
    form.parentNode.insertBefore(successMessage, form);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successMessage.style.opacity = '0';
        setTimeout(() => {
            successMessage.remove();
        }, 300);
    }, 5000);
}

// Pricing Button Actions
document.querySelectorAll('.pricing-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.pricing-card');
        const planType = card.querySelector('h3').textContent;
        
        if (planType === 'Corporate Package') {
            // For corporate package, show alert to contact
            alert('Thank you for your interest in our Corporate Package! Please call us at (555) 123-4567 or email corporate@runyourbrain.com for custom pricing and dedicated account management.');
        } else {
            // For other plans, scroll to booking form and pre-fill duration
            const durationSelect = document.getElementById('duration');
            
            if (planType === 'Hourly Booking') {
                durationSelect.value = '2-hours';
            } else if (planType === 'Full Day Booking') {
                durationSelect.value = '8-hours';
            }
            
            // Scroll to contact form
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            
            // Focus on name field after a short delay
            setTimeout(() => {
                inputs.name.focus();
            }, 800);
        }
    });
});

// Add loading animation to submit button
const submitButton = document.querySelector('.submit-button');
const originalSubmitText = submitButton.innerHTML;

form.addEventListener('submit', () => {
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitButton.disabled = true;
    
    // Re-enable button and restore text after validation
    setTimeout(() => {
        submitButton.innerHTML = originalSubmitText;
        submitButton.disabled = false;
    }, 2000);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Counter animation for statistics (if you want to add them later)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Add hover effect for feature cards
document.querySelectorAll('.feature-card, .step-card, .testimonial-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Dynamic year in footer
const currentYear = new Date().getFullYear();
document.querySelector('.footer-bottom p').innerHTML = `&copy; ${currentYear} Run Your Brain. All rights reserved.`;

// Chatbot Functionality
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWidget = document.getElementById('chatbot-widget');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatBadge = document.getElementById('chat-badge');
const quickActions = document.querySelectorAll('.quick-action');

let chatbotOpen = false;

// Toggle chatbot
chatbotToggle.addEventListener('click', () => {
    chatbotOpen = !chatbotOpen;
    if (chatbotOpen) {
        chatbotWidget.classList.add('active');
        chatBadge.style.display = 'none';
        chatbotInput.focus();
    } else {
        chatbotWidget.classList.remove('active');
    }
});

// Close chatbot
chatbotClose.addEventListener('click', () => {
    chatbotOpen = false;
    chatbotWidget.classList.remove('active');
});

// Send message function
function sendMessage(message, isUser = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${isUser ? 'fa-user' : 'fa-robot'}"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
            <span class="message-time">${currentTime}</span>
        </div>
    `;
    
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    return messageDiv;
}

// Bot responses
const botResponses = {
    greeting: [
        "Hello! How can I help you book a professional driver today?",
        "Hi there! I'm here to assist you with your driver booking needs.",
        "Welcome! What can I help you with regarding our driver services?"
    ],
    pricing: "Our pricing starts at $25/hour with a 2-hour minimum. We also offer full-day bookings at $180/day and corporate packages starting at $500/week. Would you like to see our detailed pricing?",
    booking: "I'd be happy to help you book a driver! You can use our booking form below, or I can guide you through the process. What type of service do you need?",
    contact: "You can reach us at (555) 123-4567 or email us at info@runyourbrain.com. We're available 24/7 to assist you!",
    hours: "We're available 24/7! You can book a driver anytime, whether it's for immediate service or scheduled in advance.",
    safety: "All our drivers undergo thorough background checks, safety training, and are fully licensed and insured. Your safety is our top priority!",
    areas: "We currently serve major metropolitan areas. Please provide your location in the booking form, and we'll confirm availability in your area.",
    default: "I understand you're interested in our driver services. Could you please be more specific about what you'd like to know? I can help with pricing, booking, safety information, or any other questions!"
};

// Simple keyword matching for bot responses
function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)];
    } else if (message.includes('price') || message.includes('cost') || message.includes('pricing')) {
        return botResponses.pricing;
    } else if (message.includes('book') || message.includes('hire') || message.includes('reserve')) {
        return botResponses.booking;
    } else if (message.includes('contact') || message.includes('phone') || message.includes('email')) {
        return botResponses.contact;
    } else if (message.includes('hour') || message.includes('time') || message.includes('available')) {
        return botResponses.hours;
    } else if (message.includes('safe') || message.includes('security') || message.includes('background')) {
        return botResponses.safety;
    } else if (message.includes('area') || message.includes('location') || message.includes('where')) {
        return botResponses.areas;
    } else {
        return botResponses.default;
    }
}

// Handle user input
function handleUserInput() {
    const message = chatbotInput.value.trim();
    if (message) {
        sendMessage(message, true);
        chatbotInput.value = '';
        
        // Simulate bot typing delay
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            sendMessage(botResponse, false);
        }, 1000);
    }
}

// Send message on button click
chatbotSend.addEventListener('click', handleUserInput);

// Send message on Enter key
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

// Quick action buttons
quickActions.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        let response = '';
        
        switch (action) {
            case 'pricing':
                response = botResponses.pricing;
                break;
            case 'booking':
                response = botResponses.booking;
                setTimeout(() => {
                    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                    chatbotWidget.classList.remove('active');
                    chatbotOpen = false;
                }, 2000);
                break;
            case 'contact':
                response = botResponses.contact;
                break;
        }
        
        if (response) {
            sendMessage(response, false);
        }
    });
});

// Show notification badge after some time if chat hasn't been opened
setTimeout(() => {
    if (!chatbotOpen) {
        chatBadge.style.display = 'flex';
    }
}, 10000);

// Hide badge when user scrolls or interacts
let badgeHidden = false;
window.addEventListener('scroll', () => {
    if (!badgeHidden && window.scrollY > 100) {
        chatBadge.style.display = 'none';
        badgeHidden = true;
    }
});

console.log('Run Your Brain - Driver Booking Platform loaded successfully!');