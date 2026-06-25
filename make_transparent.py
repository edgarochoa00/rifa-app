from PIL import Image
import sys

def make_transparent(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    # The background is roughly #131320. Let's make any dark pixel transparent.
    # #131320 is rgb(19, 19, 32)
    for item in datas:
        # Check if the pixel is dark (r < 50, g < 50, b < 60)
        if item[0] < 50 and item[1] < 50 and item[2] < 60:
            newData.append((255, 255, 255, 0)) # transparent
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    make_transparent("public/auto/icon-crown.png", "public/auto/icon-crown-transparent.png")
