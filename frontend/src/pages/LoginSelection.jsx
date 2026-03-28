
import { Link } from 'react-router-dom';
import '../App.css';

function LoginSelection() {
  return (
    <div className="container">
      <div className="login-selection-container">
        <h1 className="title">Choose Your Role</h1>
        <div className="button-group">
          <Link to="/signup" className="btn-primary">
            Login as Customer
          </Link>
          <Link to="/admin/login" className="btn-secondary">
            Login as Admin
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginSelection;
