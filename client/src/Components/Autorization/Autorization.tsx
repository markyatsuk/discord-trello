import s from './Autorization.module.css';

const Autorization = () => {
    return (
        <ul className={s.authList}>
            <li className={s.authItem}><a href='/discord-trello/login' className={s.authLink}>Login</a></li>
            <li className={s.authItem}><a href='/discord-trello/signup' className={s.authLink}>Sign Up</a></li>
        </ul>
    )
}

export default Autorization;