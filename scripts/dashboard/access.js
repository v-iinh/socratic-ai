const register = document.getElementById('register')

register.addEventListener('click', function() {
    users.push({
        username: 'gracehop',
        date_of_birth: 'December 9, 1906',
        full_name: 'Grace Hopper'
    });
});