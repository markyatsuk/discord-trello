import s from './Header.module.css';
import Container from '../Container/Container';
import Autorization from '../Autorization/Autorization';
const Header = ( ) => {
    return (
        <>
        <header className={s.header}>
            <Container>
                <div className={s.flexContainer}>
                    <a href='/discord-trello' className={s.logoText}>Lo<span className={s.logoTextSpan}>go</span></a>
                    <nav className={s.nav}>
                        <ul className={s.navList}>
                            <li className={s.navItem}><a href ='' className={s.navLink}>Blog</a></li>
                            <li className={s.navItem}><a href ='' className={s.navLink}>Support</a></li>
                            <li className={s.navItem}><a href ='' className={s.navLink}>Team</a></li>
                        </ul>
                    </nav>
                    <Autorization/>
                </div>
            </Container>
        </header>
        <div className={s.plug}></div>
        </>
    )
}

export default Header;