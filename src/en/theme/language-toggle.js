// Language Toggle for mdbook - replaces print button
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        // Find and hide the print button
        var printButton = document.querySelector('#print-button');
        if (printButton) {
            var printLink = printButton.parentElement;
            if (printLink) {
                printLink.style.display = 'none';
            }
        }

        var rightButtons = document.querySelector('.right-buttons');
        if (!rightButtons) return;

        // Create language toggle link styled like other buttons
        var langLink = document.createElement('a');
        langLink.href = '#';
        langLink.title = 'Switch Language';
        langLink.setAttribute('aria-label', 'Switch Language');
        langLink.style.cssText = 'display:flex;align-items:center;padding:0 8px;font-weight:bold;font-size:14px;text-decoration:none;';

        var currentPath = window.location.pathname;
        var isEnglish = currentPath.indexOf('/en/') !== -1;

        // Show the other language option
        langLink.textContent = isEnglish ? 'CN' : 'EN';
        langLink.style.color = 'var(--icons)';

        langLink.onmouseover = function() {
            this.style.color = 'var(--icons-hover)';
        };
        langLink.onmouseout = function() {
            this.style.color = 'var(--icons)';
        };

        langLink.onclick = function(e) {
            e.preventDefault();
            var path = window.location.pathname;
            if (isEnglish) {
                // Switch to Chinese
                window.location.href = path.replace('/en/', '/');
            } else {
                // Switch to English
                window.location.href = '/en' + path;
            }
        };

        // Insert before the GitHub icon (second to last position)
        var githubIcon = document.querySelector('#git-repository-button');
        if (githubIcon && githubIcon.parentElement) {
            rightButtons.insertBefore(langLink, githubIcon.parentElement);
        } else {
            rightButtons.insertBefore(langLink, rightButtons.firstChild);
        }
    });
})();
