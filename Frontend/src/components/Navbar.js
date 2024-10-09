import { Link } from "react-router-dom";
import "../css/NavbarStyle.css";
import logo from '../assets/images/logo.png';


const Logo = () => {
	return (
		<Link to="/" className="logo">
			<img src={logo} alt="Logo" />
		</Link>
	);
};

const Navbar = () => {
	return (
		<nav className="navbar">
			<div className="container">
				<Logo />
				<div className="nav-buttons">
					<Link to="/login">
						<button className="nav-button">Login</button>
					</Link>
					<Link to="/register">
						<button className="nav-button">Register</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;