/**
 * TEXFOREVER - Universal Printer Utility for APK & Web
 */

window.appPrint = function(customContent) {
    console.log("TEXFOREVER Print Initiated...");
    
    // குறிப்பிட்ட கன்டென்ட் இல்லாவிட்டால் மெயின் கார்டு அல்லது பாடியை எடுக்கும்
    const printableArea = document.querySelector('.main-card') || document.body;
    const printContent = customContent || printableArea.innerHTML;

    try {
        // Capacitor Native Printer Plugin இருக்கிறதா என சோதித்தல்
        if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Printer) {
            window.Capacitor.Plugins.Printer.print({
                content: printContent,
                name: 'TEXFOREVER Design Sheet'
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
