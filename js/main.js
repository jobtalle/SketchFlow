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
const gradient = context.createRadialGradient(
    width * .5 / scale,
    height * .5 / scale,
    radius * .5,
    width * .5 / scale,
    height * .7 / scale,
    Math.sqrt(radius * radius + radius * radius));

const hue1 = random.getFloat() * 360;
const hue2 = (hue1 + random.getFloat() * 80 + 120) % 360;
const s = "30%";
const l = "38%";

gradient.addColorStop(0, "hsl(" + Math.round(hue1).toString() + ",50%," + l + ")");
gradient.addColorStop(.003, "hsl(" + Math.round(hue2).toString() + "," + s + ",20%)");
gradient.addColorStop(1, "hsl(" + Math.round(hue2).toString() + "," + s + ",1%)");

context.scale(scale, scale);
context.fillStyle = gradient;
context.fillRect(0, 0, width / scale, height / scale);
context.translate(width * .5 / scale, height * .5 / scale);

const dropletCount = 400;
const steps = 6000;
const speed = 20;
const noiseScale = .0047;
const ox = radius * 8 * random.getFloat();
const oy = radius * 8 * random.getFloat();

const xFlow = cubicNoiseConfig(random.getFloat());
const yFlow = cubicNoiseConfig(random.getFloat());
const droplets = [];

for (let i = 0; i < dropletCount; ++i) {
    const f = i / (dropletCount - 1);
    const r = radius * .5;

    droplets.push(new Vector(
        Math.cos(f * Math.PI * 2) * r,
        Math.sin(f * Math.PI * 2) * r,
    ));
}

const overlay = context.createRadialGradient(0, 0, 0, 0, radius * -.05, radius * .55);

overlay.addColorStop(.7, "#000000");
overlay.addColorStop(1, "#ffffff");

context.globalCompositeOperation = "lighten";
context.fillStyle = overlay;
context.beginPath();
context.arc(0, 0, radius * .5, 0, Math.PI * 2);
context.fill();

context.lineCap = "round";
context.lineWidth = 5;

for (const droplet of droplets) {
    context.beginPath();
    context.moveTo(droplet.x, droplet.y);

    for (let step = 0; step < steps; ++step) {
        context.lineTo(droplet.x, droplet.y);

        const x = droplet.x + ox;
        const y = droplet.y + oy;

        const dx = cubicNoiseSample2(xFlow,
            x * noiseScale + radius,
            y * noiseScale + radius) - .5;
        const dy = cubicNoiseSample2(yFlow,
            x * noiseScale + radius,
            y * noiseScale + radius) - .5;

        droplet.x += dx * speed;
        droplet.y += dy * speed;
    }

    context.fillStyle = "hsla(" + hue1 + "," + s + "," + l + ",.01)";
    context.strokeStyle = "rgba(255,255,255,0.16)";
    context.stroke();
    context.fill();
}