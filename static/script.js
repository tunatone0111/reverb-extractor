let musics,
	newOption,
	curMusic = null,
	song;
const base = 200;
const canvasSize = 512;
let angle, p, ox, oy, amp, r, x, y;
let darkMode = false;
let isLoading = false;
let isPlaying = false;

axios
	.get("/api/musics")
	.then(({ data: { musics: musicList } }) => {
		musics = musicList.map((m) => ({
			title: m.slice(0, m.length - 4),
			artist: "unknown",
			filename: m,
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
	const darkBtn = document.querySelector("#dark-btn");
	const resBpm = document.querySelector(".bpm");
	const resRev = document.querySelector(".rev");

	playbackBtn.setAttribute("disabled", true);

	function togglePlayback(e = null, forcePause = false) {
		if (forcePause || isPlaying) {
			isPlaying = false;
			playbackBtn.innerHTML = `Play`;
			song?.pause();
		} else {
			isPlaying = true;
			playbackBtn.innerHTML = `Pause`;
			song?.play();
		}
	}
	playbackBtn.addEventListener("click", togglePlayback);

	selectBox.addEventListener("change", (e) => {
		if (e.target.value !== curMusic) {
			togglePlayback(null, true);
			playbackBtn.setAttribute("disabled", true);
			playbackBtn.innerHTML = `<span class="spinner-border"></span>`;
			isLoading = true;
			curMusic = e.target.value;

			resBpm.innerHTML = `bpm: <span style="font-size: 2rem">loading...</span>`;
			resRev.innerHTML = `Reverb: <span style="font-size: 2rem">loading...</span>`;
			resRev.setAttribute("value", `0`);

			song = loadSound(`./audio/${curMusic}`, () => {
				isLoading = false;
				playbackBtn.innerHTML = `Play`;
				playbackBtn.removeAttribute("disabled");
			});

			axios
				.get(`/api/analyze?filename=${curMusic}`)
				.then(({ data: { curMusic: resMusic, bpm, rev } }) => {
					if (resMusic === curMusic) {
						resBpm.innerHTML = `bpm: ${bpm}`;
						resRev.innerHTML = `Reverb: ${Math.round(rev * 10) / 10}%`;
						resRev.setAttribute("value", `${rev}`);
					}
				});
		}
	});

	document.querySelector("#del-btn").addEventListener("click", () => {
		if (!curMusic) return;
		axios
			.delete(`/api/musics/${curMusic}`)
			.finally(() => window.location.reload());
	});

	darkBtn.addEventListener("click", (e) => {
		darkMode = !darkMode;
		e.target.innerHTML = darkMode ? "Light mode" : "Dark mode";
		document.querySelector("body").classList.toggle("dark");
		document.querySelector(".ctr").classList.toggle("dark");
		document.querySelectorAll(".btn:not(.btn-danger)").forEach((b) => {
			b.classList.toggle("btn-dark");
			b.classList.toggle("btn-light");
		});
	});
	darkBtn.dispatchEvent(new Event("click"));
};

function setup() {
	let cnv = createCanvas(canvasSize, canvasSize).addClass("cnv1");
	angleMode(DEGREES);

	cnv2 = createGraphics(canvasSize, canvasSize, WEBGL).background(255, 0, 0);
	cnv2.angleMode(DEGREES);
	cnv2.rotateX(-35);

	select(".vis").child(cnv);
	fft = new p5.FFT(0.7, 256);
}

function draw() {
	var spectrum = fft.analyze();
	clear();
	noStroke();
	translate(width / 2, height / 2);
	if (spectrum !== undefined) {
		for (var i = 0; i < spectrum?.length; i++) {
			angle = map(i, 0, spectrum?.length, 0, 360);
			ox = base * cos(angle);
			oy = base * sin(angle);
			amp = Math.pow(spectrum[i] / 256, 2);
			r = map(amp, 0, 1, base, canvasSize / 2);
			x = r * cos(angle);
			y = r * sin(angle);
			strokeWeight(2);
			darkMode ? stroke("white") : stroke("black");
			line(ox, oy, x, y);
		}
	}
	translate(-width / 2, -height / 2);
	cnv2.clear();
	cnv2.stroke(16, 16, 16);
	cnv2.box(Math.min(+select(".rev").attribute("value"), 100));
	cnv2.rotateY(1);
	image(cnv2, 0, 0);
}
