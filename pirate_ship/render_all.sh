#!/bin/bash
# 本番レンダー（休みを入れながら 24 フレームずつ）。途中で止めても、もう一度実行すれば続きから描く。
cd "$(dirname "$0")"
START=${1:-0}
END=${2:-480}
CHUNK=24
REST=${REST:-20}
BLEND=${3:-build/pirate_ship.blend}   # ロゴは: ./render_all.sh 480 564 build/logo.blend
for ((s=START; s<END; s+=CHUNK)); do
  e=$((s+CHUNK)); [ $e -gt $END ] && e=$END
  nice -n 5 /opt/bvenv/bin/python render_video.py $s $e $BLEND 2>&1 | grep --line-buffered -E "^frame|Error|Traceback"
  echo "chunk $s-$e done $(date +%H:%M:%S); resting ${REST}s"
  sleep $REST
done
echo "ALL DONE"
