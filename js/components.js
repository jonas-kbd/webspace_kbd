/**
 * KBD GLOBAL COMPONENTS
 * Unified JavaScript for Header, Footer, Modals, and Forms
 */

// --- CONFIGURATION ---
// Werte werden aus config.js geladen (window.KBD_CONFIG)
// Falls config.js nicht geladen wurde, Fallback auf leere Strings (verhindert Fehler)
const N8N_CONTACT_WEBHOOK = (window.KBD_CONFIG && window.KBD_CONFIG.N8N_CONTACT_WEBHOOK) || '';
const N8N_NEWSLETTER_WEBHOOK = (window.KBD_CONFIG && window.KBD_CONFIG.N8N_NEWSLETTER_WEBHOOK) || '';
const N8N_UNSUBSCRIBE_WEBHOOK = (window.KBD_CONFIG && window.KBD_CONFIG.N8N_UNSUBSCRIBE_WEBHOOK) || '';

// --- LUCIDE ICONS INITIALIZATION ---
function initLucideIcons() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    } else {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
}

// --- MOBILE MENU ---
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const nav = document.getElementById('navbar');
    if (!menu || !nav) return;
    
    menu.classList.toggle('hidden');
    
    if (!menu.classList.contains('hidden')) {
        nav.classList.add('bg-white');
        nav.classList.remove('bg-transparent');
        
        const logo = document.getElementById('nav-logo');
        if(logo) { 
            logo.classList.remove('invert', 'brightness-0'); 
            logo.style.filter = "none"; 
        }

        const btn = document.getElementById('menu-btn');
        if(btn) { 
            btn.classList.remove('text-white'); 
            btn.classList.add('text-[#071F36]'); 
        }
    } else {
        handleScroll();
    }
}

// --- HEADER SCROLL HANDLING ---
function handleScroll() {
    const nav = document.getElementById('navbar');
    const logo = document.getElementById('nav-logo');
    const navLinks = document.getElementById('nav-links');
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!nav) return;
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) return;

    if (window.scrollY > 10) {
        nav.classList.add('nav-scrolled');
        nav.classList.remove('bg-transparent');
        
        if(logo) { 
            logo.classList.remove('invert', 'brightness-0'); 
            logo.style.filter = "none"; 
        }
        if(navLinks) { 
            navLinks.classList.remove('text-white'); 
            navLinks.classList.add('text-[#071F36]');
        }
        if(menuBtn) { 
            menuBtn.classList.remove('text-white'); 
            menuBtn.classList.add('text-[#071F36]'); 
        }
    } else {
        nav.classList.remove('nav-scrolled');
        nav.classList.add('bg-transparent');
        
        if(logo) { 
            logo.classList.add('invert', 'brightness-0'); 
            logo.style.filter = "brightness(0) invert(1)"; 
        }
        if(navLinks) { 
            navLinks.classList.add('text-white'); 
            navLinks.classList.remove('text-[#071F36]');
        }
        if(menuBtn) { 
            menuBtn.classList.add('text-white'); 
            menuBtn.classList.remove('text-[#071F36]'); 
        }
    }
}

// --- STICKY ANCHOR NAV (for index.html) ---
function initStickyAnchorNav() {
    const anchorLinks = document.querySelectorAll('.anchor-link');
    const sections = document.querySelectorAll('section[id]');
    
    if (anchorLinks.length === 0) return;
    
    const headerOffset = 180;

    function updateActiveSection() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - headerOffset) {
                current = section.getAttribute('id');
            }
        });

        anchorLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-target') === current) {
                link.classList.add('active');
                link.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }
        });
    }

    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection();
}

// --- CONTACT MODAL (Unified CTA: "Gespräch vereinbaren" / "Kontakt") ---
function openContactModal(e) {
    if(e) e.preventDefault();
    const modal = document.getElementById('contact-modal');
    if (!modal) return;
    
    const backdrop = document.getElementById('contact-backdrop');
    const content = document.getElementById('contact-content');
    const form = document.getElementById('contact-form');
    const formContainer = document.getElementById('contact-form-container');
    const successDiv = document.getElementById('contact-success');
    
    // Reset form
    if (form) form.reset();
    if (formContainer) formContainer.classList.remove('hidden');
    if (successDiv) successDiv.classList.add('hidden');

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        if (backdrop) backdrop.classList.remove('opacity-0');
        if (content) {
            content.classList.remove('scale-95', 'opacity-0', 'translate-y-4');
            content.classList.add('scale-100', 'opacity-100', 'translate-y-0');
        }
    }, 10);
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;
    
    const backdrop = document.getElementById('contact-backdrop');
    const content = document.getElementById('contact-content');
    
    if (backdrop) backdrop.classList.add('opacity-0');
    if (content) {
        content.classList.remove('scale-100', 'opacity-100', 'translate-y-0');
        content.classList.add('scale-95', 'opacity-0', 'translate-y-4');
    }
    
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

async function handleContactFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = document.getElementById('contact-submit-btn');
    const btnText = document.getElementById('contact-btn-text');
    const btnLoading = document.getElementById('contact-btn-loading');
    const formContainer = document.getElementById('contact-form-container');
    const successDiv = document.getElementById('contact-success');
    
    if (!form || !submitBtn) return;
    
    // Honeypot check
    if (form.b_address && form.b_address.value !== "") return;

    submitBtn.disabled = true;
    if (btnText) btnText.classList.add('hidden');
    if (btnLoading) btnLoading.classList.remove('hidden');
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(N8N_CONTACT_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                ...data, 
                submittedAt: new Date().toISOString(), 
                url: window.location.href, 
                type: 'contact_request' 
            }),
        });

        if (response.ok) {
            if (formContainer) formContainer.classList.add('hidden');
            if (successDiv) successDiv.classList.remove('hidden');
        } else { 
            throw new Error('Fehler'); 
        }
    } catch (error) {
        console.error(error);
        alert('Fehler bei der Übertragung. Bitte versuchen Sie es später erneut.');
    } finally {
        submitBtn.disabled = false;
        if (btnText) btnText.classList.remove('hidden');
        if (btnLoading) btnLoading.classList.add('hidden');
    }
}

// --- NEWSLETTER MODAL (Unified CTA: "Anmelden") ---
function openNewsletterModal(e) {
    if(e) e.preventDefault();
    const modal = document.getElementById('newsletter-modal');
    if (!modal) return;
    
    const backdrop = document.getElementById('newsletter-backdrop');
    const content = document.getElementById('newsletter-content');
    const form = document.getElementById('newsletter-form');
    const successDiv = document.getElementById('newsletter-success');
    
    // Reset state
    if (form) {
        form.reset();
        form.classList.remove('hidden');
    }
    if (successDiv) successDiv.classList.add('hidden');

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; 

    setTimeout(() => {
        if (backdrop) backdrop.classList.remove('opacity-0');
        if (content) {
            content.classList.remove('scale-95', 'opacity-0', 'translate-y-4');
            content.classList.add('scale-100', 'opacity-100', 'translate-y-0');
        }
    }, 10);
}

function closeNewsletterModal() {
    const modal = document.getElementById('newsletter-modal');
    if (!modal) return;
    
    const backdrop = document.getElementById('newsletter-backdrop');
    const content = document.getElementById('newsletter-content');
    
    if (backdrop) backdrop.classList.add('opacity-0');
    if (content) {
        content.classList.remove('scale-100', 'opacity-100', 'translate-y-0');
        content.classList.add('scale-95', 'opacity-0', 'translate-y-4');
    }
    
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

async function handleNewsletterSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = document.getElementById('nl-submit-btn');
    const text = document.getElementById('nl-btn-text');
    const load = document.getElementById('nl-btn-loading');
    const successDiv = document.getElementById('newsletter-success');
    const formDiv = document.getElementById('newsletter-form');

    if (!form || !btn) return;

    btn.disabled = true;
    if (text) text.classList.add('hidden');
    if (load) load.classList.remove('hidden');

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(N8N_NEWSLETTER_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstname: data.firstname,
                lastname: data.lastname, 
                email: data.email,
                source: 'newsletter_modal',
                timestamp: new Date().toISOString()
            })
        });

        if(response.ok) {
            if (formDiv) formDiv.classList.add('hidden');
            if (successDiv) successDiv.classList.remove('hidden');
        } else {
            throw new Error('API Error');
        }
    } catch (err) {
        console.error(err);
        alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
        btn.disabled = false;
        if (text) text.classList.remove('hidden');
        if (load) load.classList.add('hidden');
    }
}

// --- CONTACT PAGE FORM (kontakt.html) ---
async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');
    const formContainer = document.getElementById('form-container');
    const successMessage = document.getElementById('success-message');
    
    if (!form || !submitBtn) return;
    
    // Honeypot check
    if (form.b_address && form.b_address.value !== "") return;

    submitBtn.disabled = true;
    if (btnText) btnText.classList.add('hidden');
    if (btnLoading) btnLoading.classList.remove('hidden');
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(N8N_CONTACT_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                ...data, 
                submittedAt: new Date().toISOString(), 
                url: window.location.href, 
                type: 'contact_request' 
            }),
        });

        if (response.ok) {
            if (formContainer) formContainer.classList.add('hidden');
            if (successMessage) {
                successMessage.classList.remove('hidden');
                const formSection = document.getElementById('form-section');
                if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else { 
            throw new Error('Fehler'); 
        }
    } catch (error) {
        console.error(error);
        alert('Fehler bei der Übertragung.');
    } finally {
        submitBtn.disabled = false;
        if (btnText) btnText.classList.remove('hidden');
        if (btnLoading) btnLoading.classList.add('hidden');
    }
}

function resetForm() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    const formContainer = document.getElementById('form-container');
    
    if (form) form.reset();
    if (successMessage) successMessage.classList.add('hidden');
    if (formContainer) formContainer.classList.remove('hidden');
}

// --- KEYBOARD SHORTCUTS ---
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        const contactModal = document.getElementById('contact-modal');
        const newsletterModal = document.getElementById('newsletter-modal');
        
        if(contactModal && !contactModal.classList.contains('hidden')) {
            closeContactModal();
        }
        if(newsletterModal && !newsletterModal.classList.contains('hidden')) {
            closeNewsletterModal();
        }
    }
});

// --- INITIALIZATION ---
initLucideIcons();

// Initialize scroll handling
if (document.getElementById('navbar')) {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
}

// Initialize sticky anchor nav if present
initStickyAnchorNav();

// --- DROPDOWN NAVIGATION ---
function initDropdownNav() {
    // Desktop: Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const dropdowns = document.querySelectorAll('.nav-dropdown');
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    });

    // Keyboard navigation support
    const dropdownTriggers = document.querySelectorAll('.nav-dropdown-trigger');
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.closest('.nav-dropdown').classList.toggle('active');
            }
            if (e.key === 'Escape') {
                this.closest('.nav-dropdown').classList.remove('active');
            }
        });
    });

    // Arrow key navigation within dropdown menu
    const dropdownMenus = document.querySelectorAll('.nav-dropdown-menu');
    dropdownMenus.forEach(menu => {
        const items = menu.querySelectorAll('.nav-dropdown-item');
        items.forEach((item, index) => {
            item.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextItem = items[index + 1];
                    if (nextItem) nextItem.focus();
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevItem = items[index - 1];
                    if (prevItem) prevItem.focus();
                }
                if (e.key === 'Escape') {
                    e.preventDefault();
                    menu.closest('.nav-dropdown').classList.remove('active');
                    menu.closest('.nav-dropdown').querySelector('.nav-dropdown-trigger').focus();
                }
            });
        });
    });
}

function toggleMobileDropdown(id) {
    const content = document.getElementById(id);
    if (!content) return;

    const icon = content.previousElementSibling.querySelector('.mobile-dropdown-icon');

    content.classList.toggle('expanded');
    if (icon) {
        icon.style.transform = content.classList.contains('expanded') ? 'rotate(180deg)' : 'rotate(0deg)';
    }
}

// Initialize on page load
initDropdownNav();

// Make functions globally available
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;
window.handleContactFormSubmit = handleContactFormSubmit;
window.openNewsletterModal = openNewsletterModal;
window.closeNewsletterModal = closeNewsletterModal;
window.handleNewsletterSubmit = handleNewsletterSubmit;
window.handleFormSubmit = handleFormSubmit;
window.resetForm = resetForm;
window.toggleMobileMenu = toggleMobileMenu;
window.toggleMobileDropdown = toggleMobileDropdown;
window.initDropdownNav = initDropdownNav;

