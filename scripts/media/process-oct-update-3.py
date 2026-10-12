"""Third client update (2026-10-06): hero slides 3 and 4, Instagram tile 4.
Usage: python3 scripts/media/process-oct-update-3.py <uploads-dir>
Reuses the helpers from process-oct-update-2.py."""
import importlib.util, os, sys
spec = importlib.util.spec_from_file_location('u2', os.path.join(os.path.dirname(__file__), 'process-oct-update-2.py'))
src = open(spec.origin).read().split('\nsrc = {')[0]  # helpers only, not the processing
ns = {'__file__': spec.origin}
sys.argv = [spec.origin, sys.argv[1]]
exec(compile(src, spec.origin, 'exec'), ns)
load, crop, save, panel, P, G = ns['load'], ns['crop'], ns['save'], ns['panel'], ns['P'], ns['G']
from PIL import Image

# Slide 3: model with makeup brush (portrait on a white studio backdrop)
m = load('models photos/pexels-mart-production-7290682.jpg')
save(crop(m, 16 / 9, 0.5, 0.43), P + 'heroSlide03.jpg', (2400, 1350))  # wide crop: head and shoulders, subject sits right of centre
save(crop(m, 4 / 5, 0.5, 0.55), P + 'heroSlide03-m.jpg', (1080, 1350))
# Slide 4: curly-hair portrait (iStock preview, 612x408: low resolution)
c = load('oct3/istockphoto-486949044-612x612.jpg')
save(panel(c, 2400, 1350, 0.66, bg='edge', feather=160), P + 'heroSlide04.jpg')
save(crop(c, 4 / 5, 0.48, 0.5), P + 'heroSlide04-m.jpg', (1080, 1350), allow_upscale=True)
# Instagram tile 4 (was the pedicure lounge): the facial room
save(crop(Image.open(os.path.join(G, 'space-facial-room.jpg')).convert('RGB'), 4 / 5, 0.5, 0.5), P + 'instagram04.jpg', (1080, 1350))
