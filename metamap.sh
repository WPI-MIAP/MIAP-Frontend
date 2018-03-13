#!/bin/bash
mmnetstat="$(lsof -i:8066 -sTCP:LISTEN -t)"
kill "$mmnetstat"
skrmednetstat="$(lsof -i:1795 -sTCP:LISTEN -t)"
kill "$skrmednetstat"
/maras/public_mm/bin/skrmedpostctl start
/maras/public_mm/bin/mmserver14
