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
const hc = .6;
const rf = .4 + .2 * Math.pow(random.getFloat(), 2.2);
const dotChance = .005 + .01 * Math.pow(random.getFloat(), 1.9);
const gradient = context.createRadialGradient(
    width * .5 / scale,
    height * hc / scale,
    radius * rf,
    width * .5 / scale,
    height * .3 / scale,
    Math.sqrt(radius * radius + radius * radius) * 1.2);
const hue1 = random.getFloat() * 360;
const hue2 = (hue1 + random.getFloat() * 280 + 40) % 360;
const s = "40%";
const l = "38%";

gradient.addColorStop(0, "hsl(" + Math.round(hue1).toString() + ",50%," + l + ")");
gradient.addColorStop(.0015, "hsl(" + Math.round(hue2).toString() + "," + s + ",20%)");
gradient.addColorStop(1, "hsl(" + Math.round(hue2).toString() + "," + s + ",1%)");

context.scale(scale, scale);
context.fillStyle = gradient;
context.fillRect(0, 0, width / scale, height / scale);
context.translate(width * .5 / scale, height * hc / scale);

const dropletCount = 600;
const steps = 800;
const speed = 20;
const noiseScale = .0047;
const ox = radius * 8 * random.getFloat();
const oy = radius * 8 * random.getFloat();
const xFlow = cubicNoiseConfig(random.getFloat());
const yFlow = cubicNoiseConfig(random.getFloat());
const droplets = [];

for (let i = 0; i < dropletCount; ++i) {
    const f = i / (dropletCount - 1);
    const r = radius * rf;

    droplets.push(new Vector(
        Math.cos(f * Math.PI * 2) * r,
        Math.sin(f * Math.PI * 2) * r,
    ));
}

const overlay = context.createRadialGradient(0, 0, 0, 0, radius * -.05, radius * rf * 1.1);

overlay.addColorStop(0, "rgba(255,255,255,0)");
overlay.addColorStop(.8, "rgba(255,255,255,0.34)");
overlay.addColorStop(1, "#ffffff");

context.globalCompositeOperation = "lighten";
context.fillStyle = overlay;
context.beginPath();
context.arc(0, 0, radius * rf, 0, Math.PI * 2);
context.fill();

context.lineCap = "round";
context.lineWidth = 5;

const dots = [];

for (const droplet of droplets) {
    let direction = 0;

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
            y * noiseScale + radius) - .3;

        if (direction === 0) {
            if (dy < 0)
                direction = 1;
            else
                direction = -1;
        }

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

context.lineWidth = 3;
context.beginPath();
context.arc(0, 0, radius * rf, 0, Math.PI * 2);
context.stroke();

for (const dot of dots) {
    context.beginPath();
    context.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
    context.fill();
}