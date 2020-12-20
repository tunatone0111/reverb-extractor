const base = 200;
const canvasSize = 512;
let angle, p, ox, oy, amp, r, x, y;

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
			stroke("black");
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
