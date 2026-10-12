"""Fourth client update (2026-10-06): gallery additions from the `salon content`
folder and the Reviews page image. Usage: python3 scripts/media/process-oct-update-4.py <uploads-dir>"""
import os, sys
from PIL import Image, ImageOps

U = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'media')

def load(rel):
    return ImageOps.exif_transpose(Image.open(os.path.join(U, rel))).convert('RGB')

def crop(im, ratio, cx=0.5, cy=0.5):
    W, H = im.size
    w, h = (H * ratio, H) if W / H > ratio else (W, W / ratio)
    x = min(max(cx * W - w / 2, 0), W - w); y = min(max(cy * H - h / 2, 0), H - h)
    return im.crop((round(x), round(y), round(x + w), round(y + h)))

def save(im, rel, long=None, q=84):
    if long and max(im.size) > long:
        s = long / max(im.size); im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    p = os.path.join(OUT, rel); os.makedirs(os.path.dirname(p), exist_ok=True)
    im.save(p, 'JPEG', quality=q, optimize=True, progressive=True)
    print(f'{rel:44s} {im.size} {os.path.getsize(p)//1024} KB')
    return im.size

def gallery(gid, im):
    size = save(im, f'gallery/{gid}.jpg', 1800)
    save(im, f'gallery/{gid}-sm.jpg', 960, 80)
    print('  ratio', f'{size[0]}:{size[1]}')

S = 'salon content/'
# `_.jpeg` (736px wide, no source) is not used: 736px is Pinterest's download size, and Pinterest media is excluded.
gallery('look-nails-emerald', load(S + 'istockphoto-1458684276-612x612.jpg'))
gallery('look-nails-blush', load(S + 'istockphoto-1459288984-612x612.jpg'))
gallery('look-nails-polka', crop(load(S + 'pexels-cristina-perez-2163041378-38784150.jpg'), 3 / 4))
gallery('look-nails-statement', crop(load(S + 'pexels-mertcoskunraw-33992618.jpg'), 3 / 4, 0.5, 0.45))

# Reviews page: the rose still life beside "Read every review on Google"
rose = load('salon photos/pexels-igor-meghega-315695093-15935557.jpg')
save(crop(rose, 4 / 3, 0.52, 0.5), 'photos/reviewsGoogle.jpg', 1600)
