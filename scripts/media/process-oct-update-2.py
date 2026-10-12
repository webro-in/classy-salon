"""Media processing for the second client update (2026-10-03).

Usage: python3 scripts/media/process-oct-update-2.py <uploads-dir>
<uploads-dir> must contain the folders `oct3/`, `salon photos/` (client files).
Outputs high-quality progressive JPEGs into public/media; never upscales a
crop beyond its source except where noted (low-resolution client files).
"""
import os
import sys

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

U = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'media')
P = 'photos/'
G = os.path.join(OUT, 'gallery')


def load(rel):
    return ImageOps.exif_transpose(Image.open(os.path.join(U, rel))).convert('RGB')


def crop(im, ratio, cx=0.5, cy=0.5):
    W, H = im.size
    if W / H > ratio:
        h, w = H, H * ratio
    else:
        w, h = W, W / ratio
    x = min(max(cx * W - w / 2, 0), W - w)
    y = min(max(cy * H - h / 2, 0), H - h)
    return im.crop((round(x), round(y), round(x + w), round(y + h)))


def save(im, rel, size=None, q=85, allow_upscale=False):
    if size and (im.width > size[0] or allow_upscale):
        im = im.resize(size, Image.LANCZOS)
        if allow_upscale:
            im = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
    path = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, 'JPEG', quality=q, optimize=True, progressive=True)
    print(f'{rel:46s} {im.size} {os.path.getsize(path) // 1024} KB')


def feather_mask(w, h, f):
    a = np.ones((h, w), dtype=np.float32)
    ramp = np.linspace(0, 1, f, dtype=np.float32)
    a[:, :f] *= ramp
    a[:, -f:] *= ramp[::-1]
    return Image.fromarray((a * 255).astype('uint8'), 'L')


def panel(im, W, H, cx, bg='blur', feather=220, darken=0.78):
    """Whole portrait at full height, placed at `cx`, over a background:
    'night' = the hero's night tone, 'blur' = a soft, blurred extension of the photo."""
    fg = im.resize((round(im.width * H / im.height), H), Image.LANCZOS)
    if fg.height > im.height:  # low-resolution source: sharpen after upscaling
        fg = fg.filter(ImageFilter.UnsharpMask(radius=1.4, percent=70, threshold=2))
    if bg == 'night':
        canvas = Image.new('RGB', (W, H), (25, 23, 20))
    elif bg == 'edge':  # plain studio backdrop: a smooth vertical gradient sampled from the photo's side edges
        arr = np.asarray(fg, dtype=np.float32)
        col = np.concatenate([arr[:, :12], arr[:, -12:]], axis=1).mean(axis=1)  # (H, 3)
        k = np.exp(-0.5 * (np.arange(-150, 151) / 60.0) ** 2); k /= k.sum()
        pad = np.pad(col, ((150, 150), (0, 0)), mode='edge')
        smooth = np.stack([np.convolve(pad[:, c], k, mode='valid') for c in range(3)], axis=1)
        canvas = Image.fromarray(np.repeat(smooth[:, None, :], W, axis=1).clip(0, 255).astype('uint8'), 'RGB')
    else:
        canvas = crop(im, W / H).resize((W // 8, H // 8), Image.LANCZOS).filter(ImageFilter.GaussianBlur(6)).resize((W, H), Image.LANCZOS)
        canvas = ImageEnhance.Brightness(canvas).enhance(darken)
    x = round(W * cx - fg.width / 2)
    canvas.paste(fg, (x, 0), feather_mask(fg.width, H, feather))
    return canvas


src = {
    'men': 'oct3/men-model.webp',                       # 341x512 (client file "men model.png")
    'salon26': 'oct3/IMG_20260911_195226.jpg',          # 1080x1440
    'flatlay': 'oct3/pexels-n-voitkevich-8467976.jpg',  # keratin
    'kerastase': 'oct3/kerastase-scalp-rituals-2.webp',  # 450x450
    'curls': 'oct3/pexels-aksioart-6100174.jpg',        # signature hair services
    'facialRoom': 'oct3/IMG_7586.jpg',                  # radiant skin
    'hairWash': 'salon photos/hair.jpg',                # scalp treatments
    'salonFloor': 'salon photos/IMG_4527.jpg',          # about wide image
    'staffWash': 'salon photos/hair .png',              # real work (Classy staff)
}
cache = {}


def I(k):
    if k not in cache:
        cache[k] = load(src[k])
    return cache[k]


# Home hero: slide 1 = men model (low-res source, shown whole on a soft studio-grey extension)
save(panel(I('men'), 2400, 1350, 0.72, bg='edge', feather=160), P + 'heroSlide01.jpg')
save(crop(I('men'), 4 / 5, 0.5, 0.4), P + 'heroSlide01-m.jpg', (1080, 1350), allow_upscale=True)
# Home hero: slide 3 = salon (IMG_20260911_195226)
save(panel(I('salon26'), 2400, 1350, 0.72, bg='night', feather=260), P + 'heroSlide03.jpg')
save(crop(I('salon26'), 4 / 5, 0.5, 0.55), P + 'heroSlide03-m.jpg', (1080, 1350))
# Our Services hero (21:9) = the same salon photo
save(crop(I('salon26'), 21 / 9, 0.5, 0.56), P + 'servicesHero.jpg', (2400, 1029), allow_upscale=True)
save(crop(I('salon26'), 4 / 5, 0.5, 0.55), P + 'servicesHero-m.jpg', (1080, 1350))

# Service images (4:5 masters)
save(crop(I('flatlay'), 4 / 5, 0.47, 0.5), P + 'service-keratin-treatment.jpg', (1200, 1500))
save(crop(I('kerastase'), 4 / 5, 0.45, 0.5), P + 'service-hair-kerastase.jpg', (1200, 1500))
save(crop(I('curls'), 4 / 5, 0.5, 0.4), P + 'service-other-hair-serices.jpg', (1200, 1500))
save(crop(I('hairWash'), 4 / 5, 0.5, 0.42), P + 'service-hair-scalp-treatments.jpg', (1200, 1500))
save(crop(I('facialRoom'), 4 / 5, 0.5, 0.55), P + 'service-radiant-skin-solutions.jpg', (1200, 1500))

# About: replaces the blow-dry photo
save(crop(I('salonFloor'), 21 / 9, 0.5, 0.5), P + 'aboutApproach.jpg', (2400, 1029))
save(crop(I('salonFloor'), 4 / 5, 0.5, 0.55), P + 'aboutApproach-m.jpg', (1080, 1350))

# Home Real Work: replaces the straightening video and photo
save(crop(I('staffWash'), 9 / 16, 0.42, 0.5), P + 'work05.jpg', (1080, 1920))
save(crop(Image.open(os.path.join(G, 'work-bride-portrait.jpg')).convert('RGB'), 1, 0.5, 0.42), P + 'work04.jpg', (1600, 1600))


# Gallery: the pedicure-lounge photo is replaced by the facial room
def gallery(gid, im):
    for suffix, long in (('', 1800), ('-sm', 960)):
        s = long / max(im.size)
        save(im, f'gallery/{gid}{suffix}.jpg', (round(im.width * s), round(im.height * s)), q=84 if not suffix else 80)


gallery('space-facial-room', crop(I('facialRoom'), 3 / 4, 0.5, 0.55))
