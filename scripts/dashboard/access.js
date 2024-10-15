const register = document.getElementById('register');
register.addEventListener('click', function() {
    push(usersRef, {
        username: 'alanisawesome',
        date_of_birth: 'June 23, 1912',
        full_name: 'Alan Turing'
    });
    
    push(usersRef, {
        username: 'gracehop',
        date_of_birth: 'December 9, 1906',
        full_name: 'Grace Hopper'
    });
});