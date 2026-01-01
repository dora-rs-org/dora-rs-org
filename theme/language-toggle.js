// Language Toggle for mdbook
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        var rightButtons = document.querySelector('.right-buttons');
        if (!rightButtons) return;

        // Hide print button
        var printBtn = rightButtons.querySelector('a[href="print.html"]');
        if (printBtn) {
            printBtn.style.display = 'none';
        }

        // Detect current language from URL
        var currentPath = window.location.pathname;
        var isEnglish = currentPath.indexOf('/en/') !== -1 || currentPath.startsWith('/en');

        // Create language toggle link
        var langLink = document.createElement('a');
        langLink.href = '#';
        langLink.className = 'lang-toggle';
        langLink.title = isEnglish ? 'Switch to Chinese' : 'Switch to English';
        langLink.textContent = isEnglish ? 'CN' : 'EN';
        langLink.style.cssText = 'margin-right:8px;font-weight:bold;font-size:14px;cursor:pointer;';

        langLink.addEventListener('click', function(e) {
            e.preventDefault();
            var path = window.location.pathname;
            var newPath;

            if (isEnglish) {
                // Currently English, switch to Chinese
                // Remove /en from the path
                newPath = path.replace(/^\/en/, '').replace(/\/en\//, '/');
                if (newPath === '' || newPath === '/en') newPath = '/';
            } else {
                // Currently Chinese, switch to English
                // Add /en to the beginning
                newPath = '/en' + (path === '/' ? '/index.html' : path);
            }

            window.location.href = newPath;
        });

        // Find the GitHub link and insert before it
        var githubLink = rightButtons.querySelector('a[href*="github"]');
        if (githubLink) {
            rightButtons.insertBefore(langLink, githubLink);
        } else {
            rightButtons.appendChild(langLink);
        }
    });
})();
