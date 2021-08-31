const renderer = document.getElementById("renderer");
const width = renderer.width;
const height = renderer.height;
const context = renderer.getContext("2d");

const gradient = context.createRadialGradient(
    width * .5,
    height * .5,
    512,
    width * .5,
    height * .5,
    Math.sqrt(1024 * 1024 + 1024 * 1024));

gradient.addColorStop(0, "#ffcf76");
gradient.addColorStop(0, "#501c1c");
gradient.addColorStop(1, "#000000");

context.fillStyle = gradient;
context.fillRect(0, 0, width, height);

const dropletCount = 300;
const steps = 3000;
const speed = 20;
const noiseScale = .0027;

const xFlow = cubicNoiseConfig(Math.random());
const yFlow = cubicNoiseConfig(Math.random());
const droplets = [];

for (let i = 0; i < dropletCount; ++i) {
    const f = i / (dropletCount - 1);
    const r = 512;

    droplets.push(new Vector(
        width * .5 + Math.cos(f * Math.PI * 2) * r,
        height * .5 + Math.sin(f * Math.PI * 2) * r,
    ));
}

context.lineCap = "round";
context.lineWidth = 4;

for (const droplet of droplets) {
    context.beginPath();
    context.moveTo(droplet.x, droplet.y);

    for (let step = 0; step < steps; ++step) {
        const shift = step * -.0;

        context.lineTo(droplet.x, droplet.y);

        const dx = cubicNoiseSample2(xFlow,
            droplet.x * noiseScale + shift,
            droplet.y * noiseScale) - .5;
        const dy = cubicNoiseSample2(yFlow,
            droplet.x * noiseScale,
            droplet.y * noiseScale + shift) - .5;

        droplet.x += dx * speed;
        droplet.y += dy * speed;
    }

    context.fillStyle = "rgba(204,116,47,0.01)";
    context.strokeStyle = "rgba(255,255,255,0.16)";
    context.stroke();
    context.fill();
}

// const overlay = context.createRadialGradient(
//     width * .5,
//     height * .5,
//     512,
//     width * .5,
//     height * .5,
//     Math.sqrt(1024 * 1024 + 1024 * 1024));
//
// overlay.addColorStop(0, "rgba(0, 0, 0,0)");
// overlay.addColorStop(1, "rgb(0,0,0)");
//
// context.fillStyle = overlay;
// context.beginPath();
// context.rect(0, 0, width, height);
// context.fill();