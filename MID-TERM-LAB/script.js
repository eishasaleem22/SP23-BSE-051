document.addEventListener("DOMContentLoaded", function() {
    const profilePicDiv = document.getElementById('pfp-div');
    const introBox = document.getElementById('intro-box');

    
    profilePicDiv.addEventListener('mouseover', function() {
        introBox.style.display = 'block';
    });

    
    profilePicDiv.addEventListener('mouseout', function() {
        introBox.style.display = 'none';
    });
});
