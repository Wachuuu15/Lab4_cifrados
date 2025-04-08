import { Link } from "react-router-dom";
import classNames from "classnames";

const NotFound = () => {
  return (
    <main className={classNames(styles.Page)}>
      <h1>Oops! Esta página parece no existir</h1>
      <Link to="/home">
      </Link>
    </main>
  );
};

export default NotFound;