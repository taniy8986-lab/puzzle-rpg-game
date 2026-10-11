#!/bin/bash
# 本番: 本編 0–479 → ロゴ 480–563 → 音と合わせて MP4
cd "$(dirname "$0")"
./render_all.sh 0 480 build/pirate_ship.blend
./render_all.sh 480 564 build/logo.blend
n=$(ls build/frames/f_*.png | wc -l)
echo "frames: $n"
ffmpeg -y -loglevel error -framerate 24 -i build/frames/f_%04d.png -i build/audio.wav \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest \
  -movflags +faststart out/pirate_ship.mp4
echo "ENCODED $(ls -la out/pirate_ship.mp4)"
