"""Shared plotting style for Module 2 figures."""

from __future__ import annotations

import matplotlib as mpl
from pathlib import Path
from matplotlib import font_manager


LOCAL_FONT_DIR = Path(__file__).resolve().parents[3] / "assets" / "fonts" / "noto-sans"


def register_local_fonts() -> None:
    """Register vendored fonts so figures do not depend on system installs."""

    for font_path in (
        LOCAL_FONT_DIR / "NotoSans-Regular.ttf",
        LOCAL_FONT_DIR / "NotoSans-Bold.ttf",
        LOCAL_FONT_DIR / "NotoSans-Italic.ttf",
        LOCAL_FONT_DIR / "NotoSans-BoldItalic.ttf",
    ):
        if font_path.exists():
            font_manager.fontManager.addfont(str(font_path))


def pick_course_sans_font() -> str:
    """Return the best available sans font for course figures."""

    register_local_fonts()
    available_fonts = {font.name for font in font_manager.fontManager.ttflist}

    for font_name in ("Noto Sans", "Aptos", "Segoe UI", "DejaVu Sans", "Liberation Sans"):
        if font_name in available_fonts:
            return font_name

    return "sans-serif"


def apply_course_plot_style() -> None:
    """Apply a consistent visual identity to course figures.

    Prefer Aptos for a modern course-note feel, while keeping robust
    fallbacks for Linux and other environments where Aptos is not
    installed.
    """

    mpl.rcParams.update(
        {
            "font.family": pick_course_sans_font(),
            "mathtext.fontset": "dejavusans",
            "axes.titlesize": 12,
            "axes.labelsize": 10.5,
            "xtick.labelsize": 9.5,
            "ytick.labelsize": 9.5,
            "legend.fontsize": 9.5,
            "figure.titlesize": 12,
        }
    )
