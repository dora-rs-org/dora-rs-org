// Language Toggle for mdbook
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        var rightButtons = document.querySelector('.right-buttons');
        if (!rightButtons) return;

        var langDiv = document.createElement('div');
        langDiv.className = 'language-toggle';
        langDiv.style.cssText = 'display:flex;align-items:center;margin-right:10px;';

        var select = document.createElement('select');
        select.id = 'language-select';
        select.style.cssText = 'background:transparent;border:1px solid var(--icons);color:var(--icons);padding:4px 8px;border-radius:4px;cursor:pointer;font-size:14px;';

        var currentPath = window.location.pathname;
        var isEnglish = currentPath.indexOf('/en/') !== -1;

        var zhOption = document.createElement('option');
        zhOption.value = 'zh';
        zhOption.textContent = 'CN';
        zhOption.selected = !isEnglish;

        var enOption = document.createElement('option');
        enOption.value = 'en';
        enOption.textContent = 'EN';
        enOption.selected = isEnglish;

        select.appendChild(zhOption);
        select.appendChild(enOption);

        select.onchange = function() {
            var path = window.location.pathname;
            if (this.value === 'en') {
                if (path.indexOf('/en/') === -1) {
                    window.location.href = '/en' + path;
                }
            } else {
                window.location.href = path.replace('/en/', '/');
            }
        };

        langDiv.appendChild(select);
        rightButtons.insertBefore(langDiv, rightButtons.firstChild);
    });
})();
