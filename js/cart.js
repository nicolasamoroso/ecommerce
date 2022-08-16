document.addEventListener("DOMContentLoaded", function(){
    const location = window.location.href;
    localStorage.setItem("prev_location", JSON.stringify(location));
});