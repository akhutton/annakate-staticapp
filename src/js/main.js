'use strict';

// populate copyright in footer with current year
const copyrightYear = document.querySelector('.copyright-year');
const now = new Date();
copyrightYear.innerHTML = now.getFullYear();
