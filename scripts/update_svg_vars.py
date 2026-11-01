# -*- coding: utf-8 -*-
with open('src/components/notes/TechnicalVisualSvg.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

replacements = [
    ('fill="#050B14"', 'fill="var(--svg-node-bg, #050B14)"'),
    ('fill="#02060C"', 'fill="var(--svg-bg, #02060C)"'),
    ('fill="#E8F2FF"', 'fill="var(--svg-text, #E8F2FF)"'),
    ('fill="#9BB1C9"', 'fill="var(--svg-text-subtle, #9BB1C9)"'),
    ('fill="#63D9FF"', 'fill="var(--svg-cyan, #63D9FF)"'),
    ('fill="#168BFF"', 'fill="var(--svg-blue, #168BFF)"'),
    ('stroke="#63D9FF"', 'stroke="var(--svg-cyan, #63D9FF)"'),
    ('stopColor="#02060C"', 'stopColor="var(--svg-bg, #02060C)"'),
]

for old, new in replacements:
    code = code.replace(old, new)

with open('src/components/notes/TechnicalVisualSvg.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated TechnicalVisualSvg.tsx successfully with CSS variables!')

