const { Jimp } = require('jimp');

async function main() {
  const image = await Jimp.read('public/auto/icon-crown.png');
  const w = image.bitmap.width;
  const h = image.bitmap.height;
  const cx = w / 2;
  const cy = h / 2;
  const r = (w / 2) - 10; // slightly smaller than half width

  image.scan((x, y, idx) => {
    // calculate distance from center
    const dx = x - cx;
    const dy = y - cy;
    
    // Instead of a circle, let's just make the pure white corners transparent
    const red = image.bitmap.data[idx];
    const green = image.bitmap.data[idx + 1];
    const blue = image.bitmap.data[idx + 2];
    
    // The white corners are at the edges. 
    // Let's just check if it's near the corner and white.
    // Actually, any white pixel that is far from the center (like distance > r) should be transparent.
    const distance = Math.sqrt(dx*dx + dy*dy);
    
    if (distance > r && red > 240 && green > 240 && blue > 240) {
      image.bitmap.data[idx + 3] = 0; // Transparent
    }
  });
  
  await image.write('public/auto/icon-crown.png');
}

main().catch(console.error);
