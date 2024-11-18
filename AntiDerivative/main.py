import pygame,asyncio
from math import *
def bresenham(x0, y0, x1, y1):
    """Yield integer coordinates on the line from (x0, y0) to (x1, y1).

    Input coordinates should be integers.

    The result will contain both the start and the end point.
    """
    dx = x1 - x0
    dy = y1 - y0

    xsign = 1 if dx > 0 else -1
    ysign = 1 if dy > 0 else -1

    dx = abs(dx)
    dy = abs(dy)

    if dx > dy:
        xx, xy, yx, yy = xsign, 0, 0, ysign
    else:
        dx, dy = dy, dx
        xx, xy, yx, yy = 0, ysign, xsign, 0

    D = 2*dy - dx
    y = 0

    for x in range(dx + 1):
        yield x0 + x*xx + y*yx, y0 + x*xy + y*yy
        if D >= 0:
            y += 1
            D -= 2*dx
        D += 2*dy
#credits: https://github.com/encukou/bresenham
WIDTH,HEIGHT=700,700
WIN = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('AntiDerivativeSketcher')
running = True
set_of_points = set()
result_points = None
held = False
midY = HEIGHT/2
lastPoint = None
scale = 0.01
def computateAntiDerivative():
    global set_of_points,result_points
    print(len(set_of_points))
    set_of_points = sorted(set_of_points)
    xList = []
    result_points = []
    s=0
    for i in set_of_points:
        if i[0] in xList:
            continue
        s += (midY-i[1])*scale
        result_points.append((floor(i[0]),floor(midY-s)))
        xList.append(i[0])
async def main():
    global running,set_of_points,result_points,held,midY,lastPoint,WIN
    while running:
        x,y = pygame.mouse.get_pos()
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.MOUSEBUTTONDOWN:
                if event.button == 1:
                    set_of_points = set()
                    lastPoint = None
                    held = True
            elif event.type == pygame.MOUSEBUTTONUP:
                if event.button == 1:
                    held = False
                    computateAntiDerivative()
        WIN.fill((0,0,0))
        pygame.draw.line(WIN, (255,255,255), (0,midY), (WIDTH,midY), 1)
        if held:
            if lastPoint == None:
                set_of_points.add((x,y))
            else:
                for i in bresenham(lastPoint[0],lastPoint[1],x,y):
                    set_of_points.add(i)
            lastPoint = (x,y)
        for p in set_of_points:
            WIN.set_at(p,(255,0,0))
        if result_points != None:
            lastP = None
            for p in result_points:
                if lastP == None:
                    lastP = p
                    continue
                pygame.draw.line(WIN, (0,0,255), lastP, p, 1)
                lastP = p
        pygame.display.update()
        await asyncio.sleep(0)
asyncio.run(main())
