import { useContext } from "react";
import "./navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";

export const Navbar = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await makeRequest.post("/auth/logout");
			localStorage.setItem("user", null);
			navigate("/login");
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="navbar">
			<div className="left">
				<Link to="/" className="link">
					<h1>Auto Heroes</h1>
				</Link>
				<div className="search">
					<SearchOutlinedIcon />
					<input type="text" placeholder="Search..." />
				</div>
			</div>
			<div className="right">
				<div className="icons">
					<Link to={`/profile/${user.id}`} className="link">
						<PersonOutlinedIcon />
					</Link>

					{/* User rents */}
					<Link to={`/userRents/${user.id}`} className="link">
						<EmailOutlinedIcon />
					</Link>

					{/* Driver rents */}
					{user?.driver_status === 1 && (
						<Link to={`/driverRents/${user.driver_id}`} className="link">
							<NotificationsIcon />{" "}
						</Link>
					)}

					{user?.owner_status === 1 && (
						<Link to="/carList" className="link">
							<TimeToLeaveIcon />
						</Link>
					)}
				</div>
				<span onClick={handleLogout}>Log out</span>
			</div>
		</div>
	);
};

export default Navbar;
