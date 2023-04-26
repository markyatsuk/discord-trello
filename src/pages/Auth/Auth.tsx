import s from './Auth.module.css';
import { useLocation } from 'react-router-dom';
// import AuthForm from '../../Components/AuthForm/AuthForm';

const Auth = () => {
    const location = useLocation();
    if(location.pathname === '/login'){
        return (
            <section className={s.authBackdrop}>
                <div className={s.authContainer}>
                    <h1 className={s.title}>Welcome back!</h1>
                    {/* <AuthForm/> */}
                </div>
            </section>
        )
    }else if(location.pathname === '/signup'){
        return (
            <section className={s.authBackdrop}>
                <div className={s.authContainer}>
                <h1 className={s.title}>Welcome!</h1>
                </div>
            </section>
        )
    }else{
        console.log('e');
        return null;
    }
}

export default Auth;