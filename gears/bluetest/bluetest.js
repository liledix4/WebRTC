const btPermission = await navigator.permissions.query({ name: "bluetooth" });

window.addEventListener('click', function(event) {
    console.log('Click TRIGGERED');
    if (btPermission.state !== "denied") {
    // Do something
    }
})