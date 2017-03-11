
//Todo: нужно написать что-нибудь получше, этот скрипт не универсален
function showModalWin() {

    var modalWin = document.getElementById('callback-modal');
    var darkOverlay = document.createElement('div');

    darkOverlay.id = 'dark-overlay';
    document.body.appendChild(darkOverlay);
    modalWin.style.display = 'block';
    darkOverlay.onclick = function () {
        darkOverlay.parentNode.removeChild(darkOverlay);
        modalWin.style.display = 'none';
        return false;
    };
    var closeModalWin = document.getElementById('callback-modal-close');

    closeModalWin.onclick = function() {

        darkOverlay.parentNode.removeChild(darkOverlay); // remove dark layer
        modalWin.style.display = 'none'; // remove popup
        return false;

    };

}