import Router from './Router'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './App.css'

function App() {
	const isLoggedIn = !!localStorage.getItem("token");
	const navigate = useNavigate();


	return (
		<>
			<div className="navbar bg-red-500 shadow-sm z-50 fixed top-0">
				<div className="navbar-start text-white">
					<ul className="menu menu-horizontal px-1 text-white">
						<li><Link className="font-outfit" to="/">Accueil</Link></li>
						<li><Link className="font-outfit" to="/a-propos">A propos</Link></li>
					</ul>
				</div>
				<div className="navbar-center hidden lg:flex">
					<Link
						to="/"
						className="ml-8 btn btn-ghost border-0 hover:scale-110 duration-100 hover:bg-transparent hover:border-0 hover:shadow-none text-xl"
					>
						<img src="./pokemon-svgrepo-com.svg" className='w-32' alt="" />
					</Link>
				</div>
				<div className="navbar-end">
					<ul className="menu menu-horizontal px-1 text-white">
						{!isLoggedIn ? (
							<>
								<li>
									<Link className="font-outfit" to={"/connexion"}>Connexion</Link>
								</li>
								<li>
									<Link className="font-outfit" to={"/inscription"}>Inscription</Link>
								</li>
							</>
						) : (
							<>
								<li>
									<Link className="font-outfit" to={"/user_en_ligne"}>Utilisateurs</Link></li>
								<li>
									<button
										className="font-outfit"
										onClick={() => {
											localStorage.removeItem("token");
											navigate("/login"); // Redirige vers la page de connexion
										}}
									>
										Déconnexion
									</button>

								</li>
							</>
						)}
					</ul>
				</div>
			</div>

			<div className="">
				<Router />
			</div>
		</>
	)
}

export default App
