#!/bin/bash
# macOS-kompatibel (Bash 3.2). Nur Dateien direkt im angegebenen Ordner.
# Aufruf: bash rename-screenshots.sh [--dry-run] [Ordner]
set -euo pipefail

preview=false
if [[ "${1:-}" == '--dry-run' ]]; then
  preview=true
  shift
fi
if [[ $# -gt 1 || "${1:-}" == '--help' ]]; then
  echo "Aufruf: $0 [--dry-run] [Ordner]"
  exit 0
fi
cd -- "${1:-.}"

# Das feste Datumsformat wird lexikografisch auch chronologisch sortiert.
# LC_ALL=C macht die Reihenfolge unabhängig von der Spracheinstellung.
export LC_ALL=C
shopt -s nullglob
sources=()
for file in Bildschirmfoto\ ????-??-??\ um\ ??.??.??*; do
  [[ -f "$file" && ! -L "$file" ]] || continue
  if [[ "$file" =~ ^Bildschirmfoto\ [0-9]{4}-[0-9]{2}-[0-9]{2}\ um\ [0-9]{2}\.[0-9]{2}\.[0-9]{2}(\.[[:alnum:]]+)?$ ]]; then
    sources+=("$file")
  fi
done

if [[ ${#sources[@]} -eq 0 ]]; then
  echo 'Keine passenden Bildschirmfotos gefunden.'
  exit 0
fi

# Erst alle Ziele prüfen, danach umbenennen: keine bestehenden Dateien ersetzen.
targets=()
for ((i=0; i<${#sources[@]}; i++)); do
  file=${sources[i]}
  # Endung separat aus dem vollständig geprüften Dateinamen ermitteln.
  suffix=${file#Bildschirmfoto ????-??-?? um ??.??.??}
  printf -v number '%02d' "$((i+1))"
  target="${number}${suffix}"
  if [[ -e "$target" || -L "$target" ]]; then
    printf 'Abbruch: Ziel existiert bereits: %s\n' "$target" >&2
    exit 1
  fi
  targets+=("$target")
done

for ((i=0; i<${#sources[@]}; i++)); do
  printf '%s -> %s\n' "${sources[i]}" "${targets[i]}"
  if [[ "$preview" == false ]]; then
    mv -n -- "${sources[i]}" "${targets[i]}"
  fi
done
