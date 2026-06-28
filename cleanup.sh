#!/usr/bin/env bash
#
# cleanup.sh — Reorganización estructural del repositorio achetiq-lab
# ---------------------------------------------------------------------------
# Qué hace, en un solo paso:
#   1. PURGA  los volcados temporales de auditoría del agente impeccable
#            (.impeccable/critique/ — ficheros .md con timestamp).
#   2. CONSOLIDA toda la documentación de ingeniería/producto suelta en la
#            raíz dentro de docs/, dejando en la base SÓLO README.md.
#   3. PRESERVA intacto el ecosistema de inteligencia (.claude/skills/*,
#            .impeccable/design.json), el código fuente web y la
#            configuración de despliegue.
#
# Por qué docs/ (y no architecture/):
#   El skill «impeccable» (context.mjs → resolveContextDir) busca PRODUCT.md
#   y DESIGN.md en: (1) la raíz, y como fallback (2) docs/. Al mover esos dos
#   ficheros a docs/ el skill los sigue encontrando SIN configuración extra.
#   Por eso PRODUCT.md y DESIGN.md deben quedar directamente en docs/ (no en
#   un subdirectorio): el skill sólo mira docs/ a un nivel de profundidad.
#
# Lo que NO se toca (contenido vivo / fuente / config):
#   docs/*.pdf .................. documentos institucionales servidos al sitio
#                                 (referenciados por data/documentos.json)
#   docs/security-headers.md .... documentación de despliegue ya organizada
#   assets/ pages/ partials/ .... código fuente del front-end
#   content/ data/ design-system/ scripts/ tokens.css site.config.mjs
#   .gitignore .nojekyll _headers  configuración de despliegue
#   README.md ................... único .md narrativo que permanece en la raíz
#
# Seguro de ejecutar: idempotente (re-ejecutarlo no rompe nada) y se aborta
# ante cualquier error. NO ejecuta git: revise el resultado y haga el commit.
# ---------------------------------------------------------------------------

set -euo pipefail

# --- Anclar el script a la raíz del repositorio --------------------------------
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

# --- Guardia de seguridad: verificar que estamos en el repo correcto -----------
if [[ ! -f "package.json" || ! -d ".claude/skills/impeccable" ]]; then
  echo "✗ Abortado: '$ROOT' no parece ser la raíz de achetiq-lab." >&2
  echo "  (faltan package.json y/o .claude/skills/impeccable)" >&2
  exit 1
fi

echo "▶ Reorganizando achetiq-lab en: $ROOT"

# ── 1. PURGA: volcados temporales de auditoría del agente ──────────────────────
if [[ -d ".impeccable/critique" ]]; then
  echo "  ✗ Eliminando .impeccable/critique/ (volcados de auditoría con timestamp)"
  rm -rf ".impeccable/critique"
else
  echo "  · .impeccable/critique/ ya no existe — nada que purgar"
fi

# ── 2. CONSOLIDACIÓN: documentación suelta de la raíz → docs/ ──────────────────
# docs/ ya existe (alberga los PDF institucionales); -p lo hace idempotente.
mkdir -p docs

# Lista explícita (NUNCA un glob *.md): así README.md jamás se mueve por error.
DOCS=(
  "PRODUCT.md"                              # leído por el skill impeccable
  "DESIGN.md"                               # leído por el skill impeccable
  "DIRECCION_EDITORIAL.md"
  "FASE_0_Arquitectura.md"
  "FASE_1_Catalogo_Componentes.md"
  "FASE_1_Wireframes.md"
  "FLUJO_APORTE_APUNTES.md"
  "INSTRUCCION_PROYECTO.md"
  "INVENTARIO_Solicitud_de_Contenido.md"
  "PENDIENTES_CONTENIDO.md"
  "PLAN_MAESTRO_FASES_3-7.md"
  "PROMPT_CONTINUACION.md"
  "RENDIMIENTO_Presupuesto.md"
  "AUDITORIA_UIUX_Bateria_Skills.md"
  "AUDITORIA_UIUX_Elevacion_Editorial.md"
)

for doc in "${DOCS[@]}"; do
  if [[ -f "$doc" ]]; then
    echo "  → docs/$doc"
    mv "$doc" "docs/$doc"
  elif [[ -f "docs/$doc" ]]; then
    echo "  · docs/$doc ya estaba movido — omitido"
  else
    echo "  ! $doc no encontrado — omitido" >&2
  fi
done

# ── 3. COHERENCIA: actualizar los enlaces del README a su nueva ruta ───────────
# Idempotente: el backtick antes de 'FASE' no coincide si ya lleva 'docs/'.
if [[ -f "README.md" ]]; then
  sed -i \
    -e 's|`FASE_0_Arquitectura.md`|`docs/FASE_0_Arquitectura.md`|g' \
    -e 's|`FASE_1_Catalogo_Componentes.md`|`docs/FASE_1_Catalogo_Componentes.md`|g' \
    -e 's|`FASE_1_Wireframes.md`|`docs/FASE_1_Wireframes.md`|g' \
    README.md
  echo "  ✎ README.md: enlaces FASE_* actualizados a docs/"
fi

echo "✔ Listo. Raíz limpia; documentación en docs/; ecosistema de skills intacto."
echo "  Revise con 'git status' y confirme con un commit."
