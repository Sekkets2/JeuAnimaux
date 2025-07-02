let tabImJeu = ["vache.png", "mouton.png", "oiseau.png", "lapin.png", "cheval.png", "canard.png", "cochon.png", "chat.png", "chien.png"];
let tabImJeuNiv2 = ["caniche.png", "Chartreux.png", "Labrador.png", "percheron.png", "Ragdoll.png"];
let score = 0;
let meilleurscore = 0;
let voices;
let selectionV = document.getElementById("VoixDisponible");
var recognition = new webkitSpeechRecognition();
recognition.lang = "fr-FR";



speechSynthesis.onvoiceschanged = function () {  // Creation liste de voix pour message
	voices = window.speechSynthesis.getVoices();
	voices.forEach(function (voice, i) {
		const optionListe = document.createElement("option");
		optionListe.value = i;
		optionListe.innerText = voice.name;
		selectionV.appendChild(optionListe);
	});
}
function EnregisterParole() {
	Parole.style.color = "black";
	Parole.value = "";
	recognition.onresult = function (event) {
		for (var i = 0; i < event.results.length; i++) {
			// parcours des resultats
			var result = event.results[i];
			if (result.isFinal) {
				for (var j = 0; j < result.length; j++) {

					Parole.value = result[j].transcript;
				}
			}
		}
	}
	recognition.start();
}
function VerifReponse() {
	if (Parole.value == "") { return 0 }
	if (document.getElementById("imgAnimal").src.includes(Parole.value)) {
		Parole.style.color = "green";
		score = score + 10;
		document.getElementById("Idscore").innerHTML = score;
		document.getElementById("ScorePoint10").style.display = "block";
		setTimeout(function () { document.getElementById("ScorePoint10").style.display = "none"; }, 1000);    /* Permet de faire disparaitre l'animation Scorepoint10 apres son exec.*/
		var ParoleVictoire = new SpeechSynthesisUtterance("Bien joué ! Bonne réponse");
		ParoleVictoire.lang = 'fr-FR';
		voixId = document.getElementById("VoixDisponible").value;
		ParoleVictoire.voice = voices[voixId];
		ParoleVictoire.rate = 1.0;  // vitesse parole
		if (speechSynthesis.speaking == true) { speechSynthesis.cancel(); }
		else { speechSynthesis.speak(ParoleVictoire); }
		return 1;
	}
	else {
		var ParoleDefaite = new SpeechSynthesisUtterance("Dommage, continuer vos efforts !");
		ParoleDefaite.lang = 'fr-FR';
		voixId = document.getElementById("VoixDisponible").value;
		ParoleDefaite.voice = voices[voixId];
		ParoleDefaite.rate = 1.0;  // vitesse parole
		speechSynthesis.speak(ParoleDefaite);
		Parole.style.color = "red";
		if (score > meilleurscore) {
			meilleurscore = score;
			document.getElementById("IdsMeilleurcore").innerHTML = meilleurscore;
		}
		score = 0;
		document.getElementById("Idscore").innerHTML = 0;
		document.getElementById("imgAnimal").src = "Image/poule.png";
		tabImJeu = ["vache.png", "mouton.png", "oiseau.png", "lapin.png", "cheval.png", "canard.png", "cochon.png", "chat.png", "chien.png"];

		return 0;
	}
}
function ImageRandom() {
	if (tabImJeu.length <= 0) {
		if (tabImJeuNiv2.length == 5) {
			AjouterPuisRetirerClasseTitre();
		}
		document.getElementById("TitreNiveau").textContent = "Niveau 2: Trouve la race !";
		var Rdm = Math.floor(Math.random() * tabImJeuNiv2.length);
		let Reponse = VerifReponse();
		if (Reponse == 1) {
			document.getElementById("imgAnimal").src = "Image/" + tabImJeuNiv2[Rdm];
			console.log(tabImJeuNiv2.splice(Rdm, 1));  // Supprime l'image ayant déja été afficher du tableau
			tabImJeuNiv2.lenght = tabImJeuNiv2.length - 1;
		}
		else if (Reponse == 0 || Reponse == null) {
			console.log("Réponse incorrect, réessayer");
			document.getElementById("TitreNiveau").textContent = "Niveau 1: Trouve l'animal !";
			AjouterPuisRetirerClasseTitre();
		}
	}
	if (tabImJeu.length >= 1) {
		var Rdm = Math.floor(Math.random() * tabImJeu.length);
		let Reponse = VerifReponse();
		if (Reponse == 1) {
			document.getElementById("imgAnimal").src = "Image/" + tabImJeu[Rdm];
			tabImJeu.splice(Rdm, 1);  // Supprime l'image ayant déja été afficher du tableau
			tabImJeu.lenght = tabImJeu.length - 1;
		}
		else if (Reponse == 0 || Reponse == null) {
			console.log("Réponse incorrect, réessayer");
		}
	}
	if (tabImJeuNiv2.length <= 0) {
		if (confirm("Félicitations, vous avez réussi toutes les questions !")) {
			window.location.reload();
		}
	}
}
function RetirerAide() {
	document.getElementById("bod").classList.remove("bloquerAvCl");
	document.getElementById("scblo").classList.remove("bloquerAvCl");
	document.getElementById("micblo").classList.remove("bloquerAvCl");
	document.getElementById("Aideguide").style.display = "none";
}

function AjouterPuisRetirerClasseTitre() {
	document.getElementById("TitreNiveau").classList.add("ColorAnim");
	setTimeout(function () { document.getElementById("TitreNiveau").classList.remove("ColorAnim"); }, 2000);
}

document.getElementById("BoutonVoc").onclick = EnregisterParole;
document.getElementById("buttoncompris").onclick = RetirerAide;
document.getElementById("vali").onclick = ImageRandom;