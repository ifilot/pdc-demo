"""Generate a comparison figure for Module 2, Example 2.2.

The figure compares the concentration response to the same inlet
concentration step for:

1. Example 2.1: a perfectly mixed tank
2. Example 2.2: an isothermal CSTR with first-order reaction

The plotting style intentionally matches the existing Example 2.1 figure.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

from plot_style import apply_course_plot_style

V = 2.1  # m^3
F = 0.085  # m^3/min
K_REACTION = 0.04  # 1/min, illustrative value for Example 2.2

CA_INITIAL = 0.15  # kmol/m^3
CA0_STEP = 1.00  # kmol/m^3

T_START = 0.0
T_END = 120.0
NUM_POINTS = 600

TAU_MIXER = V / F
TAU_CSTR = 1.0 / (F / V + K_REACTION)
GAIN_CSTR = F / (F + V * K_REACTION)
CA_FINAL_MIXER = CA0_STEP
CA_FINAL_CSTR = GAIN_CSTR * CA0_STEP


def mixer_response(time_min: np.ndarray) -> np.ndarray:
    return CA_FINAL_MIXER + (CA_INITIAL - CA_FINAL_MIXER) * np.exp(-time_min / TAU_MIXER)


def cstr_response(time_min: np.ndarray) -> np.ndarray:
    return CA_FINAL_CSTR + (CA_INITIAL - CA_FINAL_CSTR) * np.exp(-time_min / TAU_CSTR)


def make_figure(
    time_min: np.ndarray,
    mixer_concentration: np.ndarray,
    cstr_concentration: np.ndarray,
) -> plt.Figure:
    fig, ax = plt.subplots(figsize=(6, 4))

    ax.plot(
        time_min,
        mixer_concentration,
        color="black",
        linewidth=1.9,
        label="Example 2.1: mixer",
    )
    ax.plot(
        time_min,
        cstr_concentration,
        color="#4c6258",
        linewidth=1.9,
        linestyle="--",
        label="Example 2.2: isothermal CSTR",
    )

    mixer_at_tau = mixer_response(np.array([TAU_MIXER]))[0]
    cstr_at_tau = cstr_response(np.array([TAU_CSTR]))[0]

    ax.scatter([TAU_MIXER], [mixer_at_tau], color="black", s=28, zorder=3)
    ax.scatter([TAU_CSTR], [cstr_at_tau], color="#4c6258", s=28, zorder=3)

    ax.annotate(
        rf"Mixer $\tau = {TAU_MIXER:.1f}$ min",
        xy=(TAU_MIXER, mixer_at_tau),
        xytext=(TAU_MIXER + 8.0, mixer_at_tau - 0.12),
        arrowprops={"arrowstyle": "->", "linewidth": 1.0, "color": "black"},
        fontsize=9,
    )
    ax.annotate(
        rf"CSTR $\tau = {TAU_CSTR:.1f}$ min",
        xy=(TAU_CSTR, cstr_at_tau),
        xytext=(TAU_CSTR + 10.0, 0.4),
        arrowprops={"arrowstyle": "->", "linewidth": 1.0, "color": "#4c6258"},
        fontsize=9,
        color="#4c6258",
    )

    ax.axhline(CA_FINAL_MIXER, color="black", linestyle=":", linewidth=1.0, alpha=0.75)
    ax.axhline(CA_FINAL_CSTR, color="#4c6258", linestyle=":", linewidth=1.0, alpha=0.75)

    ax.text(78.0, CA_FINAL_MIXER + 0.015, "Mixer final value", fontsize=8.5, color="black")
    ax.text(68.0, CA_FINAL_CSTR + 0.015, "CSTR final value", fontsize=8.5, color="#4c6258")

    ax.set_xlabel("Time (min)")
    ax.set_ylabel(r"Concentration, $C_A$ (kmol/m$^3$)")
    ax.set_xlim(T_START, T_END)
    ax.set_ylim(0.1, 1.05)
    ax.tick_params(direction="in", top=True, right=True, length=4, width=1)
    ax.legend(
        frameon=True,
        fancybox=False,
        edgecolor="black",
        facecolor="white",
        framealpha=1.0,
        loc="lower right",
    )
    ax.grid(linestyle="--", color="black", alpha=0.5)

    fig.tight_layout()
    return fig


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("public/generated/modules/02/example_2_2.svg"),
        help="Path to save the generated figure.",
    )
    parser.add_argument(
        "--no-show",
        action="store_true",
        help="Do not open an interactive plot window.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    apply_course_plot_style()
    time_min = np.linspace(T_START, T_END, NUM_POINTS)
    mixer_concentration = mixer_response(time_min)
    cstr_concentration = cstr_response(time_min)
    fig = make_figure(time_min, mixer_concentration, cstr_concentration)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(args.output, format="svg", bbox_inches="tight")

    if args.no_show:
        plt.close(fig)
    else:
        plt.show()


if __name__ == "__main__":
    main()
