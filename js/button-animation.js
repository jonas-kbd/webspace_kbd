/**
 * KBD Button Text-Swap Animation
 * All styles are set inline to bypass CSS specificity issues.
 * Hover is handled via JS event listeners for full reliability.
 *
 * Key: span-mother STAYS in flow (never position:absolute) so the
 * button keeps its size. Its children just slide down out of view.
 */
(function () {
    function initButtonAnimations() {
        var buttons = document.querySelectorAll('.btn-primary, .btn-white, .btn-outline, .btn-white-outline, [data-text-swap]');

        buttons.forEach(function (btn) {
            if (btn.querySelector('.span-mother')) return;
            if (btn.children.length > 0) return;
            if (btn.type === 'submit') return;

            var text = btn.textContent.trim();
            if (!text) return;

            // Force button styles inline (highest specificity)
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';

            // span-mother: in-flow, gives the button its size
            var spanMother = document.createElement('span');
            spanMother.className = 'span-mother';
            spanMother.style.cssText = 'display:inline-flex;overflow:hidden;';

            // span-mother2: absolutely positioned overlay, hidden above via translateY
            var spanMother2 = document.createElement('span');
            spanMother2.className = 'span-mother2';
            spanMother2.style.cssText = 'display:inline-flex;position:absolute;overflow:hidden;pointer-events:none;';

            for (var i = 0; i < text.length; i++) {
                var char = text[i];
                var delay = (0.2 + i * 0.03).toFixed(2);

                var s1 = document.createElement('span');
                s1.textContent = char === ' ' ? '\u00A0' : char;
                s1.style.cssText = 'display:inline-block;transition:transform ' + delay + 's;';
                spanMother.appendChild(s1);

                var s2 = document.createElement('span');
                s2.textContent = char === ' ' ? '\u00A0' : char;
                s2.style.cssText = 'display:inline-block;transform:translateY(-1.2em);transition:transform ' + delay + 's;';
                spanMother2.appendChild(s2);
            }

            btn.textContent = '';
            btn.appendChild(spanMother);
            btn.appendChild(spanMother2);

            // Hover: slide span-mother chars DOWN (out of view), span-mother2 chars to 0 (into view)
            // span-mother stays in flow so button keeps its dimensions
            btn.addEventListener('mouseenter', function () {
                for (var j = 0; j < spanMother.children.length; j++) {
                    spanMother.children[j].style.transform = 'translateY(1.2em)';
                }
                for (var k = 0; k < spanMother2.children.length; k++) {
                    spanMother2.children[k].style.transform = 'translateY(0)';
                }
            });

            btn.addEventListener('mouseleave', function () {
                for (var j = 0; j < spanMother.children.length; j++) {
                    spanMother.children[j].style.transform = '';
                }
                for (var k = 0; k < spanMother2.children.length; k++) {
                    spanMother2.children[k].style.transform = 'translateY(-1.2em)';
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initButtonAnimations);
    } else {
        initButtonAnimations();
    }
})();
