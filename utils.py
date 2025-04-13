from PIL import Image
from collections import Counter

def extract_brand_colors(image_path: str, top_n: int = 3) -> list:
    image = Image.open(image_path).convert('RGB')
    image = image.resize((100, 100))  # Resize for performance

    pixels = list(image.getdata())

    # Filter out very light colors (close to white)
    filtered = [
        pixel for pixel in pixels
        if not (pixel[0] > 220 and pixel[1] > 220 and pixel[2] > 220)  # light gray/white filter
    ]

    # Count most common colors from filtered pixels
    color_counts = Counter(filtered)
    top_colors = color_counts.most_common(top_n)

    hex_colors = ['#%02x%02x%02x' % color for color, _ in top_colors]
    return hex_colors
