/**
 * The Identity Artist Method™ - Interactive Scripting
 * Version: 1.0.0
 * Author: Antigravity AI (Pair Programming with User)
 */

// CONFIGURATION: Replace this with your live Zapier/Make/CRM webhook URL
const WEBHOOK_URL = 'https://httpbin.org/post';

document.addEventListener('DOMContentLoaded', () => {
  initCountdownTimer();
  initStickyHeader();
  initSmoothScroll();
  initFAQAccordion();
  extractUTMParameters();
  initFormSubmission();
  initProgressBarAnimation();
  initVSL();
  initScrollIndicator();
  initScarcityLiveUpdates();
});

/**
 * 1. COUNTDOWN TIMER
 * Target: July 18, 2026, 10:00:00 AM EST (UTC-5)
 */
function initCountdownTimer() {
  // ISO-8601 string representing July 18, 2026, 10:00 AM EST
  const targetDate = new Date('2026-07-18T10:00:00-05:00').getTime();
  
  // Find all timer containers on the page
  const timers = document.querySelectorAll('.timer-display');
  
  if (timers.length === 0) return;

  const updateTimer = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    timers.forEach(timer => {
      if (distance < 0) {
        // Event has started
        timer.innerHTML = `<div class="event-started-msg">The Event Has Started!</div>`;
        return;
      }

      // Time calculations
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Map to visual components
      const daysVal = timer.querySelector('.days-val');
      const hoursVal = timer.querySelector('.hours-val');
      const minutesVal = timer.querySelector('.minutes-val');
      const secondsVal = timer.querySelector('.seconds-val');

      if (daysVal) daysVal.textContent = String(days).padStart(2, '0');
      if (hoursVal) hoursVal.textContent = String(hours).padStart(2, '0');
      if (minutesVal) minutesVal.textContent = String(minutes).padStart(2, '0');
      if (secondsVal) secondsVal.textContent = String(seconds).padStart(2, '0');
    });

    // If still in the future, continue polling
    if (distance >= 0) {
      setTimeout(updateTimer, 1000);
    }
  };

  updateTimer();
}

/**
 * 2. STICKY HEADER
 * Appears when scrolling past the Hero section
 */
function initStickyHeader() {
  const header = document.querySelector('.sticky-header');
  const hero = document.getElementById('hero');
  
  if (!header || !hero) return;

  window.addEventListener('scroll', () => {
    // Show sticky header when top of window is below the bottom of the Hero section
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    if (window.scrollY > heroBottom - 100) {
      header.classList.add('visible');
    } else {
      header.classList.remove('visible');
    }
  });
}

/**
 * 3. SMOOTH SCROLL FOR CTA BUTTONS
 * All CTA buttons on the page scroll to the registration form
 */
function initSmoothScroll() {
  const ctaButtons = document.querySelectorAll('.btn-cta, .sticky-cta');
  const formSection = document.getElementById('registration-section');

  if (!formSection) return;

  ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Calculate scroll destination with offset for sticky header if visible
      const stickyHeaderHeight = 48;
      const targetOffset = formSection.offsetTop - stickyHeaderHeight;

      window.scrollTo({
        top: targetOffset,
        behavior: 'smooth'
      });
      
      // Optional: Focus the first input field after scroll animation finishes
      setTimeout(() => {
        const firstInput = formSection.querySelector('input[required]');
        if (firstInput) firstInput.focus();
      }, 800);
    });
  });
}

/**
 * 4. FAQ ACCORDION
 * Handles click expansion and smooth height transition
 */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionButton = item.querySelector('.faq-question');
    const answerWrapper = item.querySelector('.faq-answer-wrapper');

    if (!questionButton || !answerWrapper) return;

    questionButton.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Collapse all other items first (accordion behavior)
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer-wrapper').style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        answerWrapper.style.maxHeight = null;
      } else {
        item.classList.add('active');
        // Set max-height to scrollHeight to animate open
        answerWrapper.style.maxHeight = answerWrapper.scrollHeight + 'px';
      }
    });
  });
}

/**
 * 5. UTM PARAMETER EXTRACTION
 * Extracts UTM parameters from URL query string and populates hidden fields
 */
function extractUTMParameters() {
  try {
    const params = new URLSearchParams(window.location.search);
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    
    utmParams.forEach(p => {
      const field = document.querySelector(`input[name="${p}"]`);
      if (field) {
        field.value = params.get(p) || '';
      }
    });
  } catch (error) {
    console.error('Error extracting UTM parameters:', error);
  }
}

/**
 * 6. FORM SUBMISSION & PIXEL TRACKING
 * Sends JSON payload via POST and fires tracking tags on success
 */
function initFormSubmission() {
  const form = document.querySelector('.reg-form');
  const formCard = document.querySelector('.form-card');
  
  if (!form || !formCard) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable the submit button to prevent double clicks
    const submitBtn = form.querySelector('.btn-submit');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    // Collect data
    const formData = new FormData(form);
    const payload = {};
    formData.forEach((value, key) => {
      payload[key] = value;
    });

    try {
      // Send POST request
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      // Success branch
      handleSuccess(formCard);

    } catch (error) {
      console.error('Registration failed:', error);
      
      // Fallback/Mock success behavior for development/testing if hitting arbitrary URL fails,
      // but alerting the user if they're testing in production.
      if (WEBHOOK_URL.includes('httpbin.org') || WEBHOOK_URL.includes('[WEBHOOK_URL_HERE]')) {
        console.warn('Simulating success state in development/mock environment.');
        handleSuccess(formCard);
      } else {
        alert('We experienced a connection issue. Please check your internet connection and try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
  });
}

/**
 * Handle successful registration: replace form with success state & fire tracking pixels
 */
function handleSuccess(formCard) {
  // Fire Meta Pixel Lead event
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead');
    console.log('Meta Pixel: Lead event fired successfully.');
  } else {
    console.warn('Meta Pixel is not initialized or blocked.');
  }

  // Fire Google Ads conversion event
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-660929827/bl6lCNDhnKkcEKP6k7sC'
    });
    console.log('Google Ads: Conversion event fired successfully.');
  } else {
    console.warn('Google Ads (gtag) is not initialized or blocked.');
  }

  // Replace form with Thank You message
  formCard.innerHTML = `
    <div class="success-box">
      <div class="success-icon">🎉</div>
      <h3 class="form-title" style="margin-bottom: 12px; font-size: 1.5rem;">You're In!</h3>
      <p class="success-message">
        Check your email for confirmation and Meet access details.<br>
        See you on July 18th!
      </p>
    </div>
  `;
}

/**
 * 7. SCARCITY PROGRESS BAR ANIMATION
 * Animates the fill width when it enters the viewport
 */
function initProgressBarAnimation() {
  const progressFills = document.querySelectorAll('.scarcity-progress-fill');
  
  if (progressFills.length === 0) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          obs.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, {
      threshold: 0.1
    });

    progressFills.forEach(fill => observer.observe(fill));
  } else {
    // Fallback if IntersectionObserver is not supported
    progressFills.forEach(fill => fill.classList.add('animated'));
  }
}

/**
 * 8. FLOATING VSL VIDEO WIDGET
 * A docked, looping, muted teaser (bottom-left) that expands into a large
 * centered popup over a dimmed page.
 *   - First open starts the video from 0.
 *   - Re-opening after a minimize resumes from where it paused.
 *   - An in-video "Reserve My Spot" CTA appears partway through, then routes
 *     to the registration form and minimizes the video.
 *
 * >>> To use the real video, replace VSL_VIDEO_SRC below (ideally a vertical
 *     9:16 MP4). Everything else stays the same.
 */
const VSL_VIDEO_SRC = 'assets/vsl-test.mp4'; // TEST PLACEHOLDER — swap for the final vertical (9:16) video (drop the file in /assets and update this path)
const VSL_CTA_REVEAL_RATIO = 0.5; // reveal the in-video CTA once this fraction has played

function initVSL() {
  const dock = document.getElementById('vsl-dock');
  const modal = document.getElementById('vsl-modal');
  if (!dock || !modal) return;

  const teaser = document.getElementById('vsl-teaser');
  const main = document.getElementById('vsl-main');
  const closeBtn = modal.querySelector('.vsl-modal__close');
  const backdrop = modal.querySelector('.vsl-modal__backdrop');
  const cta = modal.querySelector('.vsl-modal__cta');
  const dismiss = dock.querySelector('.vsl-dock__dismiss');

  // Honor a prior dismissal for this browsing session
  if (sessionStorage.getItem('vslDismissed') === '1') {
    dock.style.display = 'none';
    return;
  }

  // Wire the same source into both players (teaser loop + real player)
  teaser.src = VSL_VIDEO_SRC;
  main.src = VSL_VIDEO_SRC;

  let started = false;

  const playTeaser = () => { teaser.play().catch(() => {}); };
  playTeaser();

  // Force autoplay start on first user interaction (bypasses mobile autoplay/low power mode restrictions)
  const forceAutoplay = () => {
    playTeaser();
    document.removeEventListener('click', forceAutoplay);
    document.removeEventListener('touchstart', forceAutoplay);
    document.removeEventListener('scroll', forceAutoplay);
  };
  document.addEventListener('click', forceAutoplay);
  document.addEventListener('touchstart', forceAutoplay);
  document.addEventListener('scroll', forceAutoplay);

  const lockScroll = () => document.body.classList.add('vsl-lock');
  const unlockScroll = () => document.body.classList.remove('vsl-lock');

  function expand() {
    teaser.pause();
    if (!started) {
      try { main.currentTime = 0; } catch (e) { /* metadata not ready yet */ }
      started = true;
    }
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    dock.classList.add('is-hidden');
    lockScroll();
    main.muted = false;
    main.play().catch(() => {});
    setTimeout(() => closeBtn.focus(), 60);
  }

  function minimize() {
    main.pause(); // pausing keeps currentTime so re-opening resumes
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    dock.classList.remove('is-hidden');
    unlockScroll();
    playTeaser();
  }

  // Reveal the in-video CTA partway through (and keep it once the video ends)
  main.addEventListener('timeupdate', () => {
    if (main.duration && (main.currentTime / main.duration) >= VSL_CTA_REVEAL_RATIO) {
      cta.classList.add('is-visible');
    }
  });
  main.addEventListener('ended', () => cta.classList.add('is-visible'));

  // Toggle play/pause on clicking the video itself
  main.addEventListener('click', () => {
    if (main.paused) {
      main.play().catch(() => {});
    } else {
      main.pause();
    }
  });

  // Open interactions
  dock.addEventListener('click', (e) => {
    if (e.target.closest('.vsl-dock__dismiss')) return;
    expand();
  });
  dock.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      expand();
    }
  });

  // Close interactions
  closeBtn.addEventListener('click', minimize);
  backdrop.addEventListener('click', minimize);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) minimize();
  });

  // In-video CTA -> minimize, then route to the registration form
  cta.addEventListener('click', (e) => {
    e.preventDefault();
    minimize();
    const formSection = document.getElementById('registration-section');
    if (formSection) {
      const stickyHeaderHeight = 48;
      window.scrollTo({ top: formSection.offsetTop - stickyHeaderHeight, behavior: 'smooth' });
      setTimeout(() => {
        const firstInput = document.querySelector('#registration-form input[required]');
        if (firstInput) firstInput.focus();
      }, 800);
    }
  });

  // Dismiss the whole widget for this session
  if (dismiss) {
    dismiss.addEventListener('click', (e) => {
      e.stopPropagation();
      minimize();
      dock.style.display = 'none';
      sessionStorage.setItem('vslDismissed', '1');
    });
  }
}

/**
 * 9. SCROLL TO LEARN MORE INDICATOR
 * Scrolls smoothly to the Problem section when clicked
 */
function initScrollIndicator() {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const problemSection = document.getElementById('problem');

  if (scrollIndicator && problemSection) {
    scrollIndicator.addEventListener('click', () => {
      const stickyHeaderHeight = 48;
      window.scrollTo({
        top: problemSection.offsetTop - stickyHeaderHeight,
        behavior: 'smooth'
      });
    });
  }
}

/**
 * 10. SCARCITY LIVE UPDATES
 * Automatically increments spots filled from 73% to 75% (after 4s)
 * and to 78% (after another 7s) once user scrolls to the final section.
 * Updates both the Hero and form progress bars in sync.
 */
function initScarcityLiveUpdates() {
  const targetSection = document.getElementById('registration-section');
  if (!targetSection) return;

  let hasTriggered = false;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasTriggered) {
        hasTriggered = true;
        obs.unobserve(entry.target); // Run only once

        // 1st update: 4 seconds after reaching the section
        setTimeout(() => {
          updateScarcityPercentage(75);

          // 2nd update: 7 seconds later
          setTimeout(() => {
            updateScarcityPercentage(78);
          }, 7000);
        }, 4000);
      }
    });
  }, {
    threshold: 0.15 // trigger when 15% of the section is visible
  });

  observer.observe(targetSection);
}

function updateScarcityPercentage(percentage) {
  // Update all percentage labels
  const percentLabels = document.querySelectorAll('.scarcity-percent');
  percentLabels.forEach(label => {
    label.textContent = percentage + '%';
  });

  // Update all progress fill widths and ARIA values
  const fills = document.querySelectorAll('.scarcity-progress-fill');
  fills.forEach(fill => {
    fill.style.width = percentage + '%';
    const bar = fill.closest('.scarcity-progress-bar');
    if (bar) {
      bar.setAttribute('aria-valuenow', percentage);
    }
  });
}
