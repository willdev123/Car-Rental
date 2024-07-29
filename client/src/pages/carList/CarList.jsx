import "./carList.scss";
import Car from "../../components/car/Car";
import { Link, useLocation } from "react-router-dom";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import { useContext, useEffect, useState } from "react";

const CarList = () => {
	const param = useLocation().pathname.split("/")[1];
	const [pageNumber, setPageNumber] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const { user } = useContext(AuthContext);
	const [result, setResult] = useState([]);
	const [err, setErr] = useState(null);

	const fetchCars = async () => {
		try {
			const result = await makeRequest.get("/cars/find/" + user.owner_id, {
				params: {
					page: pageNumber,
				},
			});
			if (result.data.length < 5) {
				setHasMore(false);
			}
			setResult((prev) => [...prev, ...result.data]);
		} catch (err) {
			console.log(err);
			setErr(err.response.data);
		}
	};

	const fetchAvailibleCars = async () => {
		try {
			const result = await makeRequest.get("/cars/find/", {
				params: {
					page: pageNumber,
				},
			});
			if (result.data.length < 5) {
				setHasMore(false);
			}
			setResult((prev) => [...prev, ...result.data]);
		} catch (err) {
			console.log(err);
			setErr(err.response.data);
		}
	};
	useEffect(() => {
		if (param === "carList") {
			fetchCars();
		}
		if (param === "") {
			fetchAvailibleCars();
		}
	}, [pageNumber]);

	if (err) {
		return (
			<div className="container-noCar">
				<div className="message">{err}</div>
			</div>
		);
	}
	if (result.length === 0) {
		return (
			<div className="container-noCar">
				<div className="message">No Cars Registered Yet!!</div>
				{param === "carList" ? (
					<Link className="link" to="/car">
						+ Register New Car
					</Link>
				) : null}
			</div>
		);
	}

	return (
		<div className="carList">
			<div className="container">
				{param === "carList" ? (
					<Link className="link" to="/car">
						+ Register New Car
					</Link>
				) : null}

				<div className="list">
					{result?.map((c) => {
						return <Car key={c.car_id} data={c} />;
					})}
				</div>
				{hasMore ? (
					<button
						className="load-button"
						onClick={() => {
							setPageNumber((prev) => prev + 1);
						}}>
						load more
					</button>
				) : (
					<div style={{ color: "lightcoral", marginTop: "30px" }}>
						No Cars left to show!!
					</div>
				)}
			</div>
		</div>
	);
};

export default CarList;
