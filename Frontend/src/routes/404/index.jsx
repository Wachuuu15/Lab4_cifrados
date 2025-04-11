import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main>
      <h1>Oops! Esta página parece no existir</h1>
      <Link to="/home">
      </Link>
    </main>
  );
};

export default NotFound;