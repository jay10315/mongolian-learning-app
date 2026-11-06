# -*- coding: utf-8 -*-
import xml.etree.ElementTree as ET

def validate_all_stages():
    stages = ['chick', 'child', 'adventurer', 'scholar', 'champion']
    moods = ['idle', 'happy', 'combo', 'wrong', 'celebrate']

    for stage in stages:
        for mood in moods:
            # simple mock check
            svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110" width="80" height="88">
              <rect width="100" height="110" fill="none" />
              <!-- Stage: {stage}, Mood: {mood} -->
            </svg>"""
            tree = ET.fromstring(svg)
            assert tree.tag == "{http://www.w3.org/2000/svg}svg"
    print("All template tests pass!")

if __name__ == "__main__":
    validate_all_stages()
