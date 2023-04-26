import s from './Hero.module.css';
import Container from '../Container/Container';
const Hero = () => {
    return (
        <section className={s.hero}>
            <Container>
                <div className={s.titleContainer}>
                    <h1 className={s.mainTitle}>IMAGINE…</h1>
                    <p className={s.afterTitle}>…a place where any company will feel comfortable: a school circle, a play group or an international community of artists. A place where you can chat with your friends. Daily communication has never been so easy.</p>
                </div>
                <div className={s.future}>to be continued...</div>
            </Container>
        </section>
    )
}

export default Hero;