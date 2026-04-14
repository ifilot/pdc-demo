"""Generate the figure for Module 2, Example 2.3.

The figure compares the full nonlinear second-order CSTR model

    V dC_A/dt = F(C_A0 - C_A) - V k C_A^2

with its linearized model around a steady operating point. The values of
V and F are reused from the previous examples, while the kinetic
parameter and operating point are illustrative choices selected to show
the local accuracy of linearization after a moderate inlet disturbance.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

from plot_style import apply_course_plot_style

V = 2.1  # m^3
F = 0.085  # m^3/min
K_SECOND_ORDER = 0.08  # m^3/(kmol min), illustrative

CA0_STEADY = 0.60  # kmol/m^3
CA0_STEP = 0.75  # kmol/m^3

T_START = 0.0
T_END = 60.0
TIME_STEP = 0.05


def steady_state_concentration(ca0: float) -> float:
    discriminant = F**2 + 4.0 * V * K_SECOND_ORDER * F * ca0
    return (-F + np.sqrt(discriminant)) / (2.0 * V * K_SECOND_ORDER)


CA_STEADY = steady_state_concentration(CA0_STEADY)
TAU_LINEAR = V / (F + 2.0 * V * K_SECOND_ORDER * CA_STEADY)
GAIN_LINEAR = F / (F + 2.0 * V * K_SECOND_ORDER * CA_STEADY)


def nonlinear_rhs(ca: float, ca0: float) -> float:
    return (F * (ca0 - ca) - V * K_SECOND_ORDER * ca**2) / V


def rk4_step(ca: float, dt: float, ca0: float) -> float:
    k1 = nonlinear_rhs(ca, ca0)
    k2 = nonlinear_rhs(ca + 0.5 * dt * k1, ca0)
    k3 = nonlinear_rhs(ca + 0.5 * dt * k2, ca0)
    k4 = nonlinear_rhs(ca + dt * k3, ca0)
    return ca + (dt / 6.0) * (k1 + 2.0 * k2 + 2.0 * k3 + k4)


def simulate_nonlinear() -> tuple[np.ndarray, np.ndarray]:
    time = np.arange(T_START, T_END + TIME_STEP, TIME_STEP)
    concentration = np.empty_like(time)
    concentration[0] = CA_STEADY

    for i in range(time.size - 1):
        concentration[i + 1] = rk4_step(concentration[i], TIME_STEP, CA0_STEP)

    return time, concentration


def linearized_response(time_min: np.ndarray) -> np.ndarray:
    deviation_step = CA0_STEP - CA0_STEADY
    deviation = GAIN_LINEAR * deviation_step * (1.0 - np.exp(-time_min / TAU_LINEAR))
    return CA_STEADY + deviation


def make_figure(
    time_min: np.ndarray,
    nonlinear_concentration: np.ndarray,
    linear_concentration: np.ndarray,
) -> plt.Figure:
    fig, ax = plt.subplots(figsize=(6, 4))

    ax.plot(
        time_min,
        nonlinear_concentration,
        color="black",
        linewidth=1.9,
        label="Nonlinear model",
    )
    ax.plot(
        time_min,
        linear_concentration,
        color="#4c6258",
        linewidth=1.9,
        linestyle="--",
        label="Linearized model",
    )

    ax.axhline(CA_STEADY, color="black", linestyle=":", linewidth=1.0, alpha=0.75)
    ax.annotate(
        "Steady operating point",
        xy=(5.0, CA_STEADY),
        xytext=(11.0, CA_STEADY - 0.05),
        arrowprops={"arrowstyle": "->", "linewidth": 1.0, "color": "black"},
        fontsize=9,
    )

    ax.set_title("Example 2.3: Linear and nonlinear responses", fontsize=12)
    ax.set_xlabel("Time (min)")
    ax.set_ylabel(r"Concentration, $C_A$ (kmol/m$^3$)")
    ax.set_xlim(T_START, T_END)
    ax.set_ylim(CA_STEADY - 0.08, max(nonlinear_concentration.max(), linear_concentration.max()) + 0.05)
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
        default=Path("public/generated/modules/02/example_2_3.png"),
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
    time_min, nonlinear_concentration = simulate_nonlinear()
    linear_concentration = linearized_response(time_min)
    fig = make_figure(time_min, nonlinear_concentration, linear_concentration)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(args.output, dpi=200, bbox_inches="tight")

    if args.no_show:
        plt.close(fig)
    else:
        plt.show()


if __name__ == "__main__":
    main()
