import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import styles from './NavBar.module.scss';

const NavBar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <span>SecureFile</span>
      </div>
      
      <ul className={styles.navLinks}>
        <li>
          <NavLink 
            to="/AsyStorage/files" 
            className={({ isActive }) => 
              classNames(styles.navLink, { [styles.active]: isActive })
            }
            end
          >
            Inicio
          </NavLink>
        </li>
      </ul>
      
    </nav>
  );
};

export default NavBar;