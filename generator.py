from PIL import Image
from backend.utils import extract_brand_colors
import os
import textwrap

def generate_ui_code(prompt: str, font: str, image_path: str, format: str = "html") -> dict:
    # Extract brand colors from image
    colors = extract_brand_colors(image_path)

    # Placeholder Tailwind-compatible class for fallback
    primary_text_color = "blue-700"

    # Cleaned Tailwind-styled HTML template
    html_template = textwrap.dedent(f"""\
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Generated UI</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="bg-gray-100 font-{font}">
            <div class="max-w-xl mx-auto mt-20 bg-white rounded-xl shadow-md overflow-hidden">
                <div class="p-8 text-center">
                    <h1 class="text-3xl font-bold mb-2 text-{primary_text_color}">{prompt}</h1>
                    <p class="text-gray-600">This is a sample generated UI component aligned to your brand style.</p>
                </div>
            </div>
        </body>
        </html>
    """)

    # Shopify-compatible JSX React component
    react_jsx = textwrap.dedent(f"""\
        import React from 'react';

        // Shopify-compatible JSX component
        const GeneratedComponent = () => {{
          return (
            <div className="bg-gray-100 font-{font} min-h-screen p-8">
              <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8 text-center">
                  <h1 className="text-3xl font-bold mb-2 text-{primary_text_color}">{prompt}</h1>
                  <p className="text-gray-600">This is a sample generated UI component aligned to your brand style.</p>
                </div>
              </div>
            </div>
          );
        }};

        export default GeneratedComponent;
    """)

    return {
        "code": {
            "html": html_template,
            "jsx": react_jsx,
            "shopify": react_jsx  # You can customize later if needed
        },
        "colors": colors
    }
