import LocalizedStrings from 'react-localization';

class CordovaCompatibleLocalizedStrings extends LocalizedStrings {
    setLanguage(language) {
        if (!language) {
            language = navigator.language || "en-US";
        }
        super.setLanguage(language);
    }
}

export default new CordovaCompatibleLocalizedStrings({
    en: {
        Ok: 'OK',
        Home: 'Home',
        Profile: 'Profile',
        Logout: 'Logout',
        Help: 'Help',
        SignUp: 'Sign Up',
        Login: 'Login',
        Username: 'Username',
        Password: 'Password',
        ForgotPassword: 'Forgot password?'
    }
});
