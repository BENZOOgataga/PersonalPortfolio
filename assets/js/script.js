document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });

    // Project filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

            // Animation for filtered items
            setTimeout(() => {
                projectCards.forEach(card => {
                    if (card.style.display === 'block') {
                        card.classList.add('fade-in');
                        setTimeout(() => card.classList.remove('fade-in'), 500);
                    }
                });
            }, 100);
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });

            // Close mobile nav if open
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Custom dropdown functionality
    const customSelectContainer = document.querySelector('.custom-select-container');
    const customSelectSelected = document.querySelector('.custom-select-selected');
    const customSelectOptions = document.querySelector('.custom-select-options');
    const customSelectItems = document.querySelectorAll('.custom-select-item');
    const hiddenSelect = document.querySelector('.hidden-select');

    if (customSelectContainer && customSelectSelected && customSelectOptions) {
        // Toggle dropdown on click
        customSelectSelected.addEventListener('click', function(e) {
            e.stopPropagation();
            customSelectContainer.classList.toggle('open');
        });

        // Handle option selection
        customSelectItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Remove selected class from all items
                customSelectItems.forEach(option => option.classList.remove('selected'));
                
                // Add selected class to clicked item
                this.classList.add('selected');
                
                // Update the displayed text
                customSelectSelected.textContent = this.textContent;
                
                // Update the hidden select value
                const value = this.getAttribute('data-value');
                if (hiddenSelect) {
                    hiddenSelect.value = value;
                    
                    // Trigger change event for form validation
                    const changeEvent = new Event('change', { bubbles: true });
                    hiddenSelect.dispatchEvent(changeEvent);
                }
                
                // Close the dropdown
                customSelectContainer.classList.remove('open');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!customSelectContainer.contains(e.target)) {
                customSelectContainer.classList.remove('open');
            }
        });

        // Close dropdown on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && customSelectContainer.classList.contains('open')) {
                customSelectContainer.classList.remove('open');
            }
        });

        // Keyboard navigation with auto-scroll
        let currentIndex = 0;
        const items = Array.from(customSelectItems);
        
        // Function to scroll item into view
        function scrollItemIntoView(index) {
            const item = items[index];
            const container = customSelectOptions;
            const itemTop = item.offsetTop;
            const itemBottom = itemTop + item.offsetHeight;
            const containerTop = container.scrollTop;
            const containerBottom = containerTop + container.clientHeight;
            
            if (itemTop < containerTop) {
                // Item is above visible area
                container.scrollTop = itemTop;
            } else if (itemBottom > containerBottom) {
                // Item is below visible area
                container.scrollTop = itemBottom - container.clientHeight;
            }
        }
        
        customSelectContainer.addEventListener('keydown', function(e) {
            if (!customSelectContainer.classList.contains('open')) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    customSelectContainer.classList.add('open');
                    currentIndex = items.findIndex(item => item.classList.contains('selected'));
                    if (currentIndex === -1) currentIndex = 0;
                    items[currentIndex].focus();
                    scrollItemIntoView(currentIndex);
                }
                return;
            }

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    currentIndex = (currentIndex + 1) % items.length;
                    items[currentIndex].focus();
                    scrollItemIntoView(currentIndex);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    currentIndex = (currentIndex - 1 + items.length) % items.length;
                    items[currentIndex].focus();
                    scrollItemIntoView(currentIndex);
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    items[currentIndex].click();
                    break;
                case 'Escape':
                    e.preventDefault();
                    customSelectContainer.classList.remove('open');
                    customSelectSelected.focus();
                    break;
                case 'Home':
                    e.preventDefault();
                    currentIndex = 0;
                    items[currentIndex].focus();
                    scrollItemIntoView(currentIndex);
                    break;
                case 'End':
                    e.preventDefault();
                    currentIndex = items.length - 1;
                    items[currentIndex].focus();
                    scrollItemIntoView(currentIndex);
                    break;
            }
        });

        // Make items focusable for keyboard navigation
        customSelectItems.forEach((item, index) => {
            item.setAttribute('tabindex', '-1');
            item.addEventListener('focus', () => {
                currentIndex = index;
                scrollItemIntoView(index);
            });
            
            // Add hover effect to sync with keyboard navigation
            item.addEventListener('mouseenter', () => {
                currentIndex = index;
                item.focus();
            });
        });

        // Make the main selector focusable
        customSelectSelected.setAttribute('tabindex', '0');
    }
});