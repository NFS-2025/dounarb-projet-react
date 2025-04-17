import Router from './Router'
import './App.css'

function App() {
	const isLoggedIn = !!localStorage.getItem("token"); // lire le token, vrai si présent

	return (
		<>
			<div className="navbar bg-red-500 shadow-sm z-50 fixed top-0">
				<div className="navbar-start text-white">
					<ul className="menu menu-horizontal px-1 text-white">
						<li><a className="font-outfit" href="/">Accueil</a></li>
						<li><a className="font-outfit" href="/a-propos">A propos</a></li>
					</ul>
				</div>
				<div className="navbar-center hidden lg:flex">
					<a href="/" className="ml-8 btn btn-ghost border-0 hover:scale-110 duration-100 hover:bg-transparent hover:border-0 hover:shadow-none text-xl">
						<img src="./public/pokemon-svgrepo-com.svg" className='w-32' alt="" />
					</a>
				</div>
				<div className="navbar-end">
					<ul className="menu menu-horizontal px-1 text-white">
						{!isLoggedIn ? (
							<>
								<li><a className="font-outfit" href="/connexion">Connexion</a></li>
								<li><a className="font-outfit" href="/inscription">Inscription</a></li>
							</>
						) : (
							<>
								<li><a className="font-outfit" href="/user_en_ligne">Utilisateurs</a></li>
								<li>
									<button
										className="font-outfit"
										onClick={() => {
											localStorage.removeItem("token");
											window.location.reload(); // pour forcer le refresh
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
