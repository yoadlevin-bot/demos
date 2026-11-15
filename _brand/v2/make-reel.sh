#!/bin/bash
# usage: ./make-reel.sh out.mp4   (needs reel/*.png from gfx.js and frames/ from rec-scroll.js)
# timeline: intro1 0-1.3s, intro2 1.3-3s, phone+captions 3-18s, end card 18-22s
L="-loop 1 -t 22 -framerate 30 -i"
ffmpeg -y -loglevel error $L reel/bg.png -framerate 30 -i frames/%04d.jpg -loop 1 -i mask.png $L reel/frame.png $L reel/cap1.png $L reel/cap2.png $L reel/cap3.png $L reel/intro1.png $L reel/intro2.png $L reel/end.png \
 -filter_complex "[1:v]scale=670:1450:flags=lanczos,setpts=PTS-STARTPTS+3/TB,format=rgba[v];[2:v]format=gray,scale=670:1450[m];[v][m]alphamerge[vm];\
[0:v][vm]overlay=205:300:eof_action=pass:enable='between(t,3,18)'[a];[a][3:v]overlay=0:0:enable='between(t,3,18)'[b];\
[b][4:v]overlay=0:0:enable='between(t,3,8)'[c];[c][5:v]overlay=0:0:enable='between(t,8,13)'[d];[d][6:v]overlay=0:0:enable='between(t,13,18)'[e];\
[e][7:v]overlay=0:0:enable='lt(t,1.3)'[f];[f][8:v]overlay=0:0:enable='between(t,1.3,3)'[g];[g][9:v]overlay=0:0:enable='gte(t,18)',format=yuv420p[out]" \
 -map "[out]" -t 22 -r 30 -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -movflags +faststart -an "$1"
