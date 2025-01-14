import { useEffect, useState } from "react";
import "./App.css";
import SlideShow from "./components/SlideShow/SlideShow";
import JokeCard from "./components/JokeCard/JokeCard";
import FavoritePage from "./components/FavoritePage/FavoritePage";
import { JokeResponse, useAllJokes } from "./restAPI/jokesAPI";
import plantImage from "./assets/plant.png";

function App() {
	const [jokes, setJokes] = useState<JokeResponse[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [filtratedJokes, setFilteredJokes] = useState<JokeResponse[]>([]);
	const [selectedCategories, setCategories] = useState<string[]>([]);
	const { data: jokeData, error: jokeError, isLoading } = useAllJokes();
	const [showFavorites, setShowFavorites] = useState(false);
	const categories = [
		{ categoryID: 1, label: "Christmas" },
		{ categoryID: 2, label: "Spooky" },
		{ categoryID: 3, label: "Programming" },
	];

	// Effect hook to update displayed jokes when selected categories or jokes list changes
	useEffect(() => {
		if (!jokeError && selectedCategories.length > 0) {
			const filtratedJokes = jokes.filter((j) => selectedCategories.includes(j.category));
			setFilteredJokes(filtratedJokes);
		} else {
			setFilteredJokes(jokes);
		}
	}, [selectedCategories, jokes, jokeError]);

	// Effect hook to handle jokes and errors from the API response
	useEffect(() => {
		if (jokeError) {
			setError("Failed to fetch jokes");
		} else if (jokeData) {
			setJokes(jokeData);
		}
	}, [jokeData, jokeError]);

	// Effect hook to load saved categories from sessionStorage when the component mounts
	useEffect(() => {
		const savedCategories = JSON.parse(sessionStorage.getItem("savedCategories") || "[]");
		setCategories(savedCategories);
	}, []);

	// Toggle between showing favorite jokes or all jokes
	const handleToggleClick = () => {
		setShowFavorites((prevShowFavorites) => !prevShowFavorites); // Toggle between true and false
	};

	// Update the list of selected categories for filtering jokes
	const handleFilterInput = (checkedCategory: string) => {
		let updatedCategories = [];
		if (!selectedCategories.includes(checkedCategory)) {
			updatedCategories = [...selectedCategories, checkedCategory];
		} else {
			updatedCategories = selectedCategories.filter((cat) => cat != checkedCategory);
		}
		setCategories(updatedCategories);
		sessionStorage.setItem("savedCategories", JSON.stringify(updatedCategories));
	};

	//Drop-down box that displays the categories you can filter the jokes on
	const DropDownFilter = () => {
		return (
			<>
				<div className="dropdown">
					<button className="button">Filter</button>
					<div className="dropdown-content">
						{categories.map((category) => (
							<label key={category.categoryID}>
								<input
									type="checkbox"
									value={category.categoryID}
									onChange={() => handleFilterInput(category.label)}
									checked={selectedCategories.includes(category.label)}
								/>
								{category.label}
							</label>
						))}
					</div>
				</div>
			</>
		);
	};

	return (
		<>
			<div className="header-container">
				<img src={plantImage} className="plant plant-left" alt="Plant Left" />
				<h1 className="title">The Giggle Garden</h1>
				<img src={plantImage} className="plant plant-right" alt="Plant Right" />
			</div>
			<SlideShow />
			<h2>All jokes </h2>
			<div className="button-container">
				{!showFavorites && <DropDownFilter />}
				{/* Button text changes based on showFavorites state */}
				<button className="button" onClick={handleToggleClick}>
					{showFavorites ? "All jokes" : "Favorites"}
				</button>
			</div>
			{error && <p>{error}</p>}
			{/* Conditionally render FavoritePage or JokeCard based on state */}
			{showFavorites ? (
				<FavoritePage />
			) : isLoading ? (
				<p>Loading jokes...</p>
			) : (
				<div className="joke-flexbox">
					{" "}
					{/* Wrap JokeCard items in a flexbox container */}
					{filtratedJokes.map((joke) => (
						<div className="joke-flexbox-item" key={joke.id}>
							{" "}
							{/* Flexbox item */}
							<JokeCard jokeResponse={joke} />
						</div>
					))}
				</div>
			)}
		</>
	);
}

export default App;
