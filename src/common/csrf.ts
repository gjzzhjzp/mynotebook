const getCsrfToken = () => {
    // 从cookie中获取csrfToken
    const name = 'csrfToken=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    let token:string='';
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            token= cookie.substring(name.length, cookie.length);
        }
    }
    console.log('csrfToken:', token);
    return token;
};

export default getCsrfToken