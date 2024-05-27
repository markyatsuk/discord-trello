import s from './Hero.module.css';
import Container from '../Container/Container';
import { NavLink } from 'react-router-dom';
const Hero = () => {
    return (
        <section className={s.hero}>
            <Container>
                <div className={s.titleContainer}>
                    <h1 className={s.mainTitle}>IMAGINE…</h1>
                    <p className={s.afterTitle}>…a place where any company will feel comfortable: a school circle, a play group or an international community of artists. A place where you can chat with your friends. Daily communication has never been so easy.</p>
                </div>
                <NavLink to={'/room'}><button className={s.createBtn}>Create room</button></NavLink>
                
            </Container>
        </section>
    )
}

export default Hero;