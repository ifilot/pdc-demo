"""Generate the concentration response figure for Module 2, Example 2.1.

The model is the perfectly mixed tank from the module notes:

    dC_A/dt = (F/V) * (C_A0 - C_A)

For a step in inlet concentration, the analytical response is:

    C_A(t) = C_A,final + (C_A,initial - C_A,final) * exp(-t/tau)

with tau = V/F.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

from plot_style import apply_course_plot_style

V = 2.1  # m^3
F = 0.085  # m^3/min
tau = V / F

CA_INITIAL = 0.15  # kmol/m^3
CA0_STEP = 1.00  # kmol/m^3

T_START = 0.0
T_END = 120.0
NUM_POINTS = 600


def concentration_response(time_min: np.ndarray) -> np.ndarray:
    return CA0_STEP + (CA_INITIAL - CA0_STEP) * np.exp(-time_min / tau)


def make_figure(time_min: np.ndarray, concentration: np.ndarray) -> plt.Figure:
    fig, ax = plt.subplots(figsize=(6, 4))

    ax.plot(time_min, concentration, color="black", linewidth=1.9, label=r"$C_A(t)$")

    concentration_at_tau = concentration_response(np.array([tau]))[0]
    ax.scatter([tau], [concentration_at_tau], color="black", s=28, zorder=3)
    ax.annotate(
        r"$t=\tau$ (63.2% response)",
        xy=(tau, concentration_at_tau),
        xytext=(tau + 12.0, concentration_at_tau - 0.09),
        arrowprops={"arrowstyle": "->", "linewidth": 1.0, "color": "black"},
        fontsize=9,
    )

    ax.axhline(CA0_STEP, color="#4c6258", linestyle="--", linewidth=1.0, label="Final concentration")

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
        default=Path("public/generated/modules/02/example_2_1.svg"),
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
    concentration = concentration_response(time_min)
    fig = make_figure(time_min, concentration)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(args.output, format="svg", bbox_inches="tight")

    if args.no_show:
        plt.close(fig)
    else:
        plt.show()


if __name__ == "__main__":
    main()
