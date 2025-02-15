const usersArray=localStorage.getItem('users');
let users;
if(usersArray){
    users=JSON.parse(usersArray);
}
else{
    users=[];
}
const regForm=document.getElementById('registerForm');
regForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(regForm.elements['password'].value!==regForm.elements['confirm password'].value){
        alert('Confirm password not matched');
        return;
    }
    let flag=false;
    users.forEach(user => {
        if(user.username===regForm.elements['username'].value || user.aadhaar===regForm.elements['aadhaar'].value || user.mobile===regForm.elements['mobile'].value || user.email===regForm.elements['email'].value){
            flag=true;
            return;
        }        
    });
    if(flag){
        alert(`A user with similar unique credentials already registered`);
        return;
    }
    let user={
        username:regForm.elements['username'].value,
        password:regForm.elements['password'].value,
        email:regForm.elements['email'].value,
        mobile:regForm.elements['mobile'].value,
        aadhaar:regForm.elements['aadhaar'].value
    };
    users.push(user);
    localStorage.setItem('users',JSON.stringify(users));
    alert(`New user: ${user.username} registered`);
});