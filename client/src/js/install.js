const butInstall = document.getElementById('buttonInstall');

// Logic for installing the PWA
window.addEventListener('beforeinstallprompt', (event) => {

    // Store the triggered event
    window.deferredPrompt = event;

    // Show the button
    butInstall.classList.toggle("hidden", false);
});

butInstall.addEventListener('click', async () => {

    // When button is clicked, access the stored event
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
        return;
    }

    // Show prompt 
    promptEvent.prompt();

    // Reset deferred prompt variable
    window.deferredPrompt = null;

    // Hide button
    butInstall.classList.toggle("hidden", true);
});

window.addEventListener('appinstalled', (event) => {

    // Clear prompt
    window.deferredPrompt = null;
});
