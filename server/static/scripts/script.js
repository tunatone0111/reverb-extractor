let musics, newOption, curMusic, song;

axios
	.get("https://revex.lawgic.website/api/musics")
	.then(({ data: { musics: musicList } }) => {
		musics = musicList.map((m) => ({
			title: m.slice(0, m.length - 4),
			artist: "unknown",
			filename: m
		}));
	})
	.then(() => {
		musics.forEach((music) => {
			newOption = document.createElement("option");
			newOption.innerHTML = music.title;
			newOption.setAttribute("value", music.filename);
			document.querySelector("select").appendChild(newOption);
		});
		document.createElement("option");
	})
	.catch((e) => {
		alert(`An error occured: ${e}`);
	});

window.onload = function () {
	const selectBox = document.getElementById("music");
	const playbackBtn = document.querySelector("#playback-btn");
	const resBpm = document.querySelector(".bpm");
	const resRev = document.querySelector(".rev");

	function togglePlayback(e = null, forcePause = false) {
		console.log("click", forcePause);
		if (!forcePause && playbackBtn.innerHTML === "Play") {
			playbackBtn.innerHTML = "Pause";
			song?.play();
		} else {
			playbackBtn.innerHTML = "Play";
			song?.pause();
		}
	}
	playbackBtn.addEventListener("click", togglePlayback);

	selectBox.addEventListener("change", (e) => {
		if (e.target.value !== curMusic) {
			togglePlayback((forcePause = true));
			playbackBtn.setAttribute("disabled", true);
			curMusic = e.target.value;

			resBpm.innerHTML = `bpm: ...`;
			resRev.innerHTML = `Reverb: ...`;
			resRev.setAttribute("value", `0`);

			song = loadSound(`./audio/${curMusic}`, () => {
				togglePlayback();
				playbackBtn.removeAttribute("disabled");
			});

			axios
				.get(`https://revex.lawgic.website/api/analyze?filename=${curMusic}`)
				.then(({ data: { bpm, rev } }) => {
					resBpm.innerHTML = `bpm: ${bpm}`;
					resRev.innerHTML = `Reverb: ${Math.round(rev * 10) / 10}%`;
					resRev.setAttribute("value", `${rev}`);
				});
		}
	});
};
