import {
	createBrowserRouter,
	RouterProvider,
	Outlet,
	Navigate,
} from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import Profile from "./pages/profile/Profile";
import { QueryClient, QueryClientProvider } from "react-query";
import RegisterCar from "./pages/createCar/RegisterCar";
import CarList from "./pages/carList/CarList";
import BookDetail from "./pages/bookDetail/BookDetail";
import RentList from "./pages/rentList/RentList";
import DriverRentList from "./pages/driverRentList/DriverRentList";
import CarRentList from "./pages/carRentList/CarRentList";
function App() {
	const { user } = useContext(AuthContext);
	const queryClient = new QueryClient();
	const ProtectedRoute = ({ children }) => {
		if (!user) {
			return <Navigate to="/login" />;
		}
		return children;
	};

	const Layout = () => {
		return (
			<div>
				<Navbar />
				<Outlet />
			</div>
		);
	};
	const router = createBrowserRouter([
		{
			path: "/",
			element: (
				<ProtectedRoute>
					<QueryClientProvider client={queryClient}>
						<Layout />
					</QueryClientProvider>
				</ProtectedRoute>
			),
			children: [
				{
					path: "/",
					element: <Home />,
				},
				{
					path: "/profile/:id",
					element: <Profile />,
				},
				{
					path: "/car",
					element: <RegisterCar />,
				},
				{
					path: "/carList",
					element: <CarList />,
				},
				{
					path: "/carRents/:carId",
					element: <CarRentList />,
				},
				{
					path: "/bookDetail",
					element: <BookDetail />,
				},
				{
					path: "/userRents/:userId",
					element: <RentList />,
				},
				{
					path: "/driverRents/:driverId",
					element: <DriverRentList />,
				},
			],
		},
		{
			path: "/login",
			element: <Login />,
		},
		{
			path: "/register",
			element: <Register />,
		},
	]);
	return (
		<div className="App">
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
