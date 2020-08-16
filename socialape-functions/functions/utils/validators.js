const isEmpty = (string)=>{
    if (string==='') return true;
    else return false;
}
const isEmail = (string)=>{
    const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(String(string).toLowerCase());
}

exports.validateSignUpData = (newUser)=>{
    let errors = {};
    if(isEmpty(newUser.email)) errors.email = 'Email must not be empty';
    else if(!isEmail(newUser.email)) errors.email = 'Must be a valid email address';
    
    if(isEmpty(newUser.password)) errors.password = 'Password must not be empty';

    if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords must match';
    
    if(isEmpty(newUser.handle)) errors.handle = 'Handle must not be empty';
    
    return{
        errors,
        valid: Object.keys(errors).length===0?true:false
    }
}

exports.validateLoginData = (user)=>{
    let errors = {};
    if(isEmpty(user.email)) errors.email = 'Email must not be empty';
    else if(!isEmail(user.email)) errors.email = 'Must be a valid email address';
    
    if(isEmpty(user.password)) errors.password = 'Password must not be empty';

    return{
        errors,
        valid: Object.keys(errors).length===0?true:false
    }
}