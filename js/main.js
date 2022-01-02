const wrapper = document.getElementById("wrapper");
const renderer = document.getElementById("renderer");

renderer.width = wrapper.clientWidth;
renderer.height = wrapper.clientHeight;

const random = new Random();
const width = renderer.width;
const height = renderer.height;
const context = renderer.getContext("2d");
const radius = 777;
const scale = Math.min(width, height) / (radius * 2);
const hc = .55;
const dotChance = .005 + .01 * Math.pow(random.getFloat(), 1.9);
const gradient = context.createRadialGradient(
    width * .5 / scale,
    height * hc / scale,
    0,
    width * .5 / scale,
    height * .3 / scale,
    Math.sqrt(radius * radius + radius * radius) * 1.2);
const hue1 = random.getFloat() * 360;
const hue2 = (hue1 + random.getFloat() * 280 + 40) % 360;
const s = "30%";
const l = "48%";
const tilt = (random.getFloat() < .5 ? -1 : 1) * (.08 + random.getFloat() * .05);

gradient.addColorStop(0, "hsl(" + Math.round(hue1).toString() + ",50%," + l + ")");
gradient.addColorStop(.0015, "hsl(" + Math.round(hue2).toString() + "," + s + ",40%)");
gradient.addColorStop(1, "hsl(" + Math.round(hue2).toString() + "," + s + ",1%)");

context.scale(scale, scale);
context.fillStyle = gradient;
context.fillRect(0, 0, width / scale, height / scale);
context.translate(width * .5 / scale, height * hc / scale);
context.rotate(tilt * Math.PI);

const dropletCount = 200;
const steps = 800;
const speed = 20;
const noiseScale = .0047;
const ox = radius * 8 * random.getFloat();
const oy = radius * 8 * random.getFloat();
const xFlow = cubicNoiseConfig(random.getFloat());
const yFlow = cubicNoiseConfig(random.getFloat());
const droplets = [];
const diamondX = 400;
const diamondY = 600;
const diamondCore = 100;
const xScale = .5 + random.getFloat();

for (let i = 0; i < dropletCount; ++i) {
    const f = i / (dropletCount - 1);

    droplets.push(new Vector(
        -diamondX + diamondX * f,
        -diamondY * f
    ));

    droplets.push(new Vector(
        diamondX - diamondX * f,
        -diamondY * f
    ));

    droplets.push(new Vector(
        -diamondX + diamondX * f,
        diamondY * f
    ));

    droplets.push(new Vector(
        diamondX - diamondX * f,
        diamondY * f
    ));
}

const overlayScale = 2;
const ld = "80%";
let overlay = context.createRadialGradient(0, -diamondCore, 0, 0, -diamondCore, diamondY * overlayScale);
overlay.addColorStop(0, "hsla(" + hue1 + "," + s + "," + ld + ",1)");
overlay.addColorStop(1, "hsla(" + hue1 + "," + s + "," + ld + ",0)");

context.globalCompositeOperation = "lighten";
context.fillStyle = overlay;
context.beginPath();
context.moveTo(-diamondX, 0);
context.lineTo(0, -diamondY);
context.lineTo(0, diamondCore);
context.closePath();
context.fill();

overlay = context.createRadialGradient(0, -diamondCore, 0, 0, -diamondCore, diamondY * overlayScale);
overlay.addColorStop(0, "hsla(" + hue1 + "," + s + "," + ld + ",.8)");
overlay.addColorStop(1, "hsla(" + hue1 + "," + s + "," + ld + ",0)");

context.fillStyle = overlay;
context.beginPath();
context.moveTo(diamondX, 0);
context.lineTo(0, -diamondY);
context.lineTo(0, diamondCore);
context.closePath();
context.fill();
context.beginPath();
context.moveTo(-diamondX, 0);
context.lineTo(0, diamondY);
context.lineTo(0, diamondCore);
context.closePath();
context.fill();

overlay = context.createRadialGradient(0, -diamondCore, 0, 0, -diamondCore, diamondY * overlayScale);
overlay.addColorStop(0, "hsla(" + hue1 + "," + s + "," + ld + ",.5)");
overlay.addColorStop(1, "hsla(" + hue1 + "," + s + "," + ld + ",0)");

context.fillStyle = overlay;
context.beginPath();
context.moveTo(diamondX, 0);
context.lineTo(0, diamondY);
context.lineTo(0, diamondCore);
context.closePath();
context.fill();

context.lineCap = "round";
context.lineWidth = 4;

const dots = [];

for (const droplet of droplets) {
    let direction = Math.sign(droplet.x);

    if (direction === 0)
        direction = 1;

    context.beginPath();
    context.moveTo(droplet.x, droplet.y);

    for (let step = 0; step < steps; ++step) {
        context.lineTo(droplet.x, droplet.y);

        const x = droplet.x + ox;
        const y = droplet.y + oy;
        const dx = (cubicNoiseSample2(xFlow,
            x * noiseScale + radius,
            y * noiseScale + radius) - .5) * xScale;
        const dy = cubicNoiseSample2(yFlow,
            x * noiseScale + radius,
            y * noiseScale + radius) - .3;

        droplet.x += dx * speed * direction;
        droplet.y += dy * speed * direction;

        if (random.getFloat() < dotChance)
            dots.push(droplet.copy());
    }

    context.fillStyle = "hsla(" + hue1 + "," + s + "," + l + ",.01)";
    context.strokeStyle = "rgba(255,255,255,0.16)";
    context.stroke();
    context.fill();
}

context.globalCompositeOperation = "source-over";
context.fillStyle = "rgba(255,255,255,.42)";
context.strokeStyle = "rgba(255,255,255,.4)";

context.beginPath();
context.moveTo(-diamondX, 0);
context.lineTo(0, -diamondY);
context.lineTo(diamondX, 0);
context.lineTo(0, diamondY);
context.closePath();
context.stroke();

context.beginPath();
context.moveTo(-diamondX, 0);
context.lineTo(0, diamondCore);
context.lineTo(diamondX, 0);
context.stroke();

context.beginPath();
context.moveTo(0, -diamondY);
context.lineTo(0, diamondY);
context.stroke();

for (const dot of dots) {
    context.beginPath();
    context.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
    context.fill();
}