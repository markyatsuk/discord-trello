import s from './Container.module.css';

interface IProps {
    children: React.ReactNode, 
}

const Container = ({ children }: IProps) => (
  <div className={s.container}>{children}</div>
);

export default Container;