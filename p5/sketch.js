var song, fft, button, info;
const base = 200;
const canvasSize = 512;
let title = "";
let dur;
let bar, bpm, rev;
let volSlider;
let loading;
let cnv2;
let shadowbox;
const shift_factor = -128;

function musicPause() {
	song?.pause();
	button.html("Play");
}

function musicPlay() {
	song?.play();
	button.html("Pause");
}

function toggleSong() {
	song.isPlaying() ? musicPause() : musicPlay();
}

function changeSong(s) {
	if (s == title) return;
	musicPause();
	button.addClass("disabled");
	button.html(
		`
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Loading...
    `
	);
	title = s;
	song = loadSound(`./audio/${s}.mp3`, () => {
		dur = song.duration();
		button.removeClass("disabled");
		button.html("Play");
	});
}

function setValue(bpmV, revV) {
	bpm.html(`BPM: ${bpmV}`);
	rev.html(`Reverb: ${revV}%`);
}

function preload() {}

function setup() {
	let container = createDiv().addClass("box container-fluid");
	let boxes = [...Array(5)].map((_, i) => createDiv().addClass(`box${i}`));
	boxes.forEach((box) => container.child(box));

	info = createElement("h1", "Reverb Extractor");
	boxes[0].child(info);

	let cnv = createCanvas(canvasSize * 2, canvasSize);
	angleMode(DEGREES);
	boxes[1].child(cnv);

	cnv2 = createGraphics(canvasSize, canvasSize, WEBGL).background(255, 0, 0);
	cnv2.angleMode(DEGREES);
	cnv2.rotateX(-35);

	const jacket = createDiv().addClass("jacket");
	boxes[1].child(jacket);

	volSlider = createSlider(0, 1, 0.5, 0).addClass("vol-slider");
	boxes[4].child(volSlider);

	const selectMusic = createDiv(
		`
    <select class="custom-select" onchange="changeSong(this.value)">
      <option selected>Select Music...</option>
      <option value="madworld">Mad World</option>
      <option value="shampoo">Shampoo</option>
      <option value="everything">Everything</option>
    </select>
    `
	);
	boxes[4].child(selectMusic);

	newfile = createDiv("New").addClass(
		"btn btn-lg btn-outline-secondary new-button"
	);
	boxes[4].child(newfile);

	button = createButton("Play");
	button.addClass("btn btn-lg btn-secondary disabled");
	button.mousePressed(toggleSong);
	boxes[4].child(button);

	bpm = createElement("p", "").addClass("result");
	rev = createElement("p", "").addClass("result");
	boxes[2].child(bpm);
	boxes[2].child(rev);

	shadowbox = createDiv().addClass("extra-shadow-box shadow");
	container.child(shadowbox);

	fft = new p5.FFT(0.7, 256);
}

function draw() {
	var spectrum = fft.analyze();
	const power = fft.getEnergy("bass");
	clear();
	noStroke();
	translate(width / 2 - shift_factor, height / 2);
	if (spectrum !== undefined) {
		for (var i = 0; i < spectrum?.length; i++) {
			const angle = map(i, 0, spectrum?.length, 0, 360);
			const p = map(power / 10, 0, 256, base, canvasSize / 2);
			const ox = p * cos(angle);
			const oy = p * sin(angle);

			const amp = Math.pow(spectrum[i] / 256, 2);
			const r = map(amp, 0, 1, base, canvasSize / 2);
			const x = (r > p ? r : p) * cos(angle);
			const y = (r > p ? r : p) * sin(angle);

			strokeWeight(2);
			stroke("black");
			line(ox - shift_factor, oy, x - shift_factor, y);
		}
	}
	translate(-width / 2 + shift_factor, -height / 2);
	cnv2.clear();
	cnv2.stroke(16, 16, 16);
	cnv2.box(map(power, 0, 256, 0, 100));
	cnv2.rotateY(1);
	image(cnv2, 0, 0);
	song?.setVolume(volSlider.value());
	setValue(0, 0);
}
