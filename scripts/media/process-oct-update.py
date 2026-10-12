"""One-off media processing for the October 2026 client update.

Crops client-supplied files (salon photos, models photos, bridal photos) to the
site's slot ratios and saves high-quality progressive JPEGs.
Usage: python3 scripts/media/process-oct-update.py <uploads-dir>
"""
import sys, os
from PIL import Image, ImageOps

U = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'media')

def load(rel):
    im = Image.open(os.path.join(U, rel))
    im = ImageOps.exif_transpose(im).convert('RGB')
    return im

def crop(im, ratio, cx=0.5, cy=0.5, zoom=1.0):
    """Largest crop of `ratio` (w/h) centred on (cx, cy), optionally zoomed in."""
    W, H = im.size
    if W / H > ratio:
        h = H; w = H * ratio
    else:
        w = W; h = W / ratio
    w /= zoom; h /= zoom
    x = min(max(cx * W - w / 2, 0), W - w)
    y = min(max(cy * H - h / 2, 0), H - h)
    return im.crop((round(x), round(y), round(x + w), round(y + h)))

def save(im, rel, size, q=84):
    w, h = size
    if im.width > w:  # never upscale
        im = im.resize((w, h), Image.LANCZOS)
    path = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, 'JPEG', quality=q, optimize=True, progressive=True, subsampling='4:2:0')
    print(f'{rel:48s} {im.size} {os.path.getsize(path)//1024} KB')

S, M, B = 'salon photos/', 'models photos/', 'bridal photos/'
src = {
    'salonShelves': S + 'IMG_4521_2.jpg',
    'salonFloor': S + 'IMG_4527.jpg',
    'salonMirrors': S + 'IMG_4536_2.jpg',
    'salonWash': S + 'hair .png',
    'botox': S + 'hair botex treatment.jpg',
    'hairWash': S + 'hair.jpg',
    'textures': S + 'pexels-krivitskiy-18156217.jpg',
    'gloss': S + 'pexels-yulianaphoto-9197357.jpg',
    'mua1': M + 'pexels-mart-production-7290682.jpg',
    'mua2': M + 'pexels-mart-production-7290686.jpg',
    'mua3': M + 'pexels-mart-production-7290698.jpg',
    'men': M + 'pexels-mer0omex-11153470.jpg',
    'bw': M + 'pexels-midory-niwa-12168994-12955059.jpg',
    'gown': M + 'pexels-mihaela-claudia-puscas-836545137-31132239.jpg',
    'red': M + 'pexels-stardustmultimedia-11844262.jpg',
    'bride0': B + 'pexels-1054048-14847827.jpg',
    'bride1': B + 'pexels-adeteroshniamaacademy-30795554.jpg',
    'bride2': B + 'pexels-adeteroshniamaacademy-30825617.jpg',
    'bride3': B + 'pexels-amodita-s-frame-485464413-33078532.jpg',
    'bride4': B + 'pexels-dinar-sheikh-2277522-5187135.jpg',
    'bride5': B + 'pexels-skgphotography-29133465.jpg',
    'bride6': B + 'pexels-skgphotography-29370695.jpg',
    'bride7': B + 'pexels-skgphotography-5376740.jpg',
}
cache = {}
def I(k):
    if k not in cache: cache[k] = load(src[k])
    return cache[k]

P = 'photos/'
# Home hero: salon · model · salon · model
hero = [('heroSlide01', 'salonShelves', (0.5, 0.45), (0.5, 0.5)),
        ('heroSlide02', 'bw', (0.5, 0.29), (0.5, 0.42)),
        ('heroSlide03', 'salonMirrors', (0.5, 0.52), (0.5, 0.55)),
        ('heroSlide04', 'men', (0.5, 0.37), (0.5, 0.42))]
for sid, k, d, m in hero:
    save(crop(I(k), 16 / 9, *d), P + f'{sid}.jpg', (2400, 1350))
    save(crop(I(k), 4 / 5, *m), P + f'{sid}-m.jpg', (1080, 1350))

# Service group lead images (4:5)
save(crop(I('salonWash'), 4 / 5, 0.5, 0.55), P + 'serviceHairImage.jpg', (1200, 1500), q=88)
save(crop(I('mua3'), 4 / 5, 0.52, 0.62, zoom=1.35), P + 'serviceSkinImage.jpg', (1200, 1500))
save(crop(I('bride6'), 4 / 5, 0.5, 0.4), P + 'serviceMakeupImage.jpg', (1200, 1500))

# Per-service images (4:5 master; shown 4:5 on Home, 4:3 on Our Services with a focal point)
for sid, k, c in [('hair-botox-treatment', 'botox', (0.5, 0.45)),
                  ('hair-glossing', 'gloss', (0.5, 0.4)),
                  ('hair-textures', 'textures', (0.5, 0.5)),
                  ('bridal-makeup', 'bride4', (0.5, 0.4)),
                  ('hd-makeup', 'bride2', (0.5, 0.38)),
                  ('airbrush-makeup', 'bride1', (0.5, 0.38))]:
    save(crop(I(k), 4 / 5, *c), P + f'service-{sid}.jpg', (1200, 1500))

# Replacements for removed photos
save(crop(I('salonMirrors'), 4 / 5, 0.5, 0.55), P + 'aboutCta.jpg', (1200, 1500))
save(crop(I('salonFloor'), 3 / 2, 0.5, 0.52), P + 'salonInterior01.jpg', (1800, 1200))
G = os.path.join(OUT, 'gallery')
def gimg(n): return Image.open(os.path.join(G, n)).convert('RGB')
save(crop(gimg('space-lit-shelves.jpg'), 1, 0.5, 0.45), P + 'instagram01.jpg', (1080, 1080))
save(crop(gimg('space-arched-mirrors.jpg'), 1, 0.5, 0.5), P + 'instagram03.jpg', (1080, 1080))
save(crop(gimg('space-styling-floor.jpg'), 4 / 5, 0.5, 0.5), P + 'instagram06.jpg', (1080, 1350))

# Gallery additions: full (long edge 1800) + grid thumb (long edge 960)
def gallery(gid, k, ratio=None, c=(0.5, 0.5)):
    im = I(k)
    if ratio: im = crop(im, ratio, *c)
    for suffix, long in (('', 1800), ('-sm', 960)):
        s = long / max(im.size)
        size = (round(im.width * s), round(im.height * s))
        save(im, f'gallery/{gid}{suffix}.jpg', size, q=84 if suffix else 80)
    return f'{im.width}:{im.height}'

ratios = {}
for gid, k, r, c in [
    ('space-wash-station', 'salonShelves', 3 / 4, (0.5, 0.5)),
    ('space-styling-bar', 'salonFloor', 3 / 4, (0.5, 0.5)),
    ('space-oval-mirrors', 'salonMirrors', 3 / 4, (0.5, 0.5)),
    ('work-hair-wash', 'salonWash', 3 / 4, (0.5, 0.5)),
    ('look-bridal-red', 'bride0', 3 / 4, (0.5, 0.4)),
    ('look-bridal-mandap', 'bride3', 3 / 4, (0.5, 0.4)),
    ('look-bridal-emerald', 'bride5', 3 / 4, (0.5, 0.4)),
    ('look-bridal-maroon', 'bride6', 3 / 4, (0.5, 0.4)),
    ('look-bridal-bangles', 'bride7', 3 / 4, (0.5, 0.4)),
    ('look-bridal-roses', 'bride4', 3 / 4, (0.5, 0.4)),
    ('look-bridal-glow', 'bride1', 3 / 4, (0.5, 0.4)),
    ('look-bridal-kundan', 'bride2', 3 / 4, (0.5, 0.4)),
    ('look-evening-mono', 'bw', 3 / 4, (0.5, 0.42)),
    ('look-colour-pop', 'red', 3 / 4, (0.5, 0.45)),
    ('look-black-gown', 'gown', 9 / 16, (0.5, 0.5)),
    ('look-studio-makeup', 'mua3', 3 / 4, (0.5, 0.6)),
    ('look-mens-style', 'men', 3 / 4, (0.5, 0.45)),
    ('look-glossy-hair', 'gloss', 3 / 4, (0.5, 0.42)),
    ('look-textured-hair', 'textures', 1, (0.5, 0.5)),
    ('look-hair-ritual', 'botox', 3 / 4, (0.5, 0.45)),
    ('look-scalp-care', 'hairWash', 3 / 4, (0.5, 0.45)),
]:
    ratios[gid] = gallery(gid, k, r, c)
print(ratios)

# Home "Bridal & Makeup" cards (client: use the bridal photos folder)
for sid, k, c in [('makeupBridal', 'bride5', (0.5, 0.4)), ('makeupHD', 'bride0', (0.5, 0.35)), ('makeupAirbrush', 'bride7', (0.5, 0.38))]:
    save(crop(I(k), 4 / 5, *c), P + f'{sid}.jpg', (1000, 1250))

# Portrait model photos on the 16:9 desktop hero: show the whole portrait on the
# right (text sits on the left) over a soft, blurred extension of the same photo.
from PIL import ImageFilter, ImageEnhance
def hero_portrait(k, out, cx=0.7, top_crop=0.0):
    im = I(k)
    if top_crop: im = im.crop((0, round(im.height * top_crop), im.width, im.height))
    W, H = 2400, 1350
    fg = im.resize((round(im.width * H / im.height), H), Image.LANCZOS)
    x = round(W * cx - fg.width / 2)
    # Background: the hero's own night tone, so the portrait reads as an editorial panel.
    bg = Image.new('RGB', (W, H), (25, 23, 20))
    # feather the portrait's side edges into the background
    import numpy as np
    a = np.ones((H, fg.width), dtype=np.float32)
    f = 260
    ramp = np.linspace(0, 1, f, dtype=np.float32)
    a[:, :f] *= ramp; a[:, -f:] *= ramp[::-1]
    mask = Image.fromarray((a * 255).astype('uint8'), 'L')
    bg.paste(fg, (x, 0), mask)
    save(bg, P + out, (W, H))
hero_portrait('bw', 'heroSlide02.jpg', cx=0.72)
hero_portrait('men', 'heroSlide04.jpg', cx=0.72, top_crop=0.04)
