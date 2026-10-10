/**
 * TEXFOREVER - Advanced Universal Printer Utility
 * Handles Capacitor Native Printer Plugin with automatic fallback & auto-binding
 */

window.appPrint = function(customContent) {
    console.log("TEXFOREVER Print Initiated...");
    
    // குறிப்பிட்ட கன்டென்ட் இல்லாவிட்டால் முழு பாடியையும் அல்லது பிரிண்ட் ஏரியாவை எடுக்கும்
    const printContent = customContent || document.body.innerHTML;

    try {
        // Capacitor Native Printer Plugin இருக்கிறதா என சோதித்தல்
        if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Printer) {
            window.Capacitor.Plugins.Printer.print({
                content: printContent,
                name: 'TEXFOREVER Receipt'
            }).catch(err => {
                console.error("Capacitor Printer error, falling back to web print:", err);
                window.print();
            });
        } else {
            // சாதாரண பிரவுசர் / வெப் வியூ ஃபால்பேக்
            window.print();
        }
    } catch (e) {
        console.error("Print execution failed:", e);
        window.print();
    }
};

// பக்கத்தில் உள்ள பிரிண்ட் பட்டன்களைத் தானாகவே கண்டறிந்து இணைப்பது (Auto-bind)
document.addEventListener("DOMContentLoaded", () => {
    const bindPrintButtons = () => {
        const buttons = document.querySelectorAll('button, .print-btn, [id*="print"], [class*="print"], a');
        
        buttons.forEach(btn => {
            const text = (btn.innerText || btn.value || "").toLowerCase();
            const id = (btn.id || "").toLowerCase();
            const className = (typeof btn.className === 'string' ? btn.className : "").toLowerCase();
            
            if (text.includes('print') || id.includes('print') || className.includes('print')) {
                // ஒரே பட்டன் பலமுறை பைண்ட் ஆவதைத் தடுக்கிறது
                if (!btn.getAttribute('data-print-bound')) {
                    btn.setAttribute('data-print-bound', 'true');
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        
                        // இன்வாய்ஸ் அல்லது குறிப்பிட்ட பிரிண்ட் ஏரியா இருக்கிறதா எனத் தேடும்
                        const printableArea = document.querySelector('.invoice-container, .print-area, #printable-section') || document.body;
                        window.appPrint(printableArea.innerHTML);
                    });
                }
            }
        });
    };

    // முதல்முறையாக லோட் ஆகும்போது இயக்குவது
    bindPrintButtons();

    // பிற்காலத்தில் மாற்றங்கள் (Dynamic load) நிகழ்ந்தாலும் செயல்பட observer
    const observer = new MutationObserver(() => {
        bindPrintButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });
});
