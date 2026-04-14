"""Generate the figure for Module 2, Example 2.6: non-isothermal CSTR response.

This script implements the nonlinear mass and energy balances for a
non-isothermal CSTR and integrates them with explicit Euler using a
small step size. The disturbance is a step change in coolant flow.

The simulated disturbance is a step change in coolant flow from
15 to 14 m^3/min at t = 1 min.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

from plot_style import apply_course_plot_style


# Data from Appendix C.2
F = 1.0  # m^3/min
V = 1.0  # m^3
CA0 = 2.0  # kmol/m^3
T0 = 323.0  # K
CP = 1.0  # cal/(g K)
RHO = 1.0e6  # g/m^3
K0 = 1.0e10  # 1/min
E_OVER_R = 8330.1  # K
DELTA_H_RELEASE = 130.0e6  # cal/kmol, corresponds to (-ΔH_rxn)
T_CIN = 365.0  # K
FC_STEADY = 15.0  # m^3/min
CP_C = 1.0  # cal/(g K)
RHO_C = 1.0e6  # g/m^3
A = 1.678e6  # cal/(min K)
B = 0.5

# Rounded steady-state values listed in the appendix:
# T_s = 394 K, C_A,s = 0.265 kmol/m^3
# The script solves the nonlinear steady-state equations directly so the
# trajectory is exactly flat before the disturbance at t = 1 min.

# Numerical settings used for Example 2.6
T_START = 0.0
T_END = 6.0
T_STEP = 0.005
DISTURBANCE_TIME = 1.0
FC_STEP = -1.0  # m^3/min


def coolant_flow(time_min: float) -> float:
    """Cooling-flow input used in Example 2.6."""
    return FC_STEADY if time_min < DISTURBANCE_TIME else FC_STEADY + FC_STEP


def reaction_rate_constant(temperature_k: float) -> float:
    return K0 * np.exp(-E_OVER_R / temperature_k)


def heat_transfer_term(flow_coolant: float) -> float:
    numerator = A * flow_coolant ** (B + 1.0)
    denominator = flow_coolant + (A * flow_coolant**B) / (2.0 * RHO_C * CP_C)
    return numerator / denominator


def steady_state_concentration(temperature_k: float) -> float:
    """Steady-state C_A obtained from equation (C.9) with dC_A/dt = 0."""
    k = reaction_rate_constant(temperature_k)
    return F * CA0 / (F + V * k)


def steady_state_temperature(
    lower_k: float = 390.0,
    upper_k: float = 398.0,
    max_iterations: int = 100,
) -> float:
    """Solve the nonlinear steady-state energy balance by bisection."""

    def residual(temperature_k: float) -> float:
        ca = steady_state_concentration(temperature_k)
        k = reaction_rate_constant(temperature_k)
        ua = heat_transfer_term(FC_STEADY)
        sensible_heat = RHO * CP * F * (T0 - temperature_k)
        coolant_heat = ua * (temperature_k - T_CIN)
        reaction_heat = DELTA_H_RELEASE * V * k * ca
        return sensible_heat - coolant_heat + reaction_heat

    left = lower_k
    right = upper_k
    left_value = residual(left)
    right_value = residual(right)

    if left_value == 0.0:
        return left
    if right_value == 0.0:
        return right
    if left_value * right_value > 0.0:
        raise ValueError("Steady-state temperature bracket does not contain a root.")

    for _ in range(max_iterations):
        midpoint = 0.5 * (left + right)
        midpoint_value = residual(midpoint)
        if abs(midpoint_value) < 1e-9:
            return midpoint
        if left_value * midpoint_value <= 0.0:
            right = midpoint
            right_value = midpoint_value
        else:
            left = midpoint
            left_value = midpoint_value

    return 0.5 * (left + right)


def derivatives(ca: float, temperature_k: float, time_min: float) -> tuple[float, float]:
    """Return dCA/dt and dT/dt from equations (C.9) and (C.10)."""
    fc = coolant_flow(time_min)
    k = reaction_rate_constant(temperature_k)
    ua = heat_transfer_term(fc)

    dca_dt = (F * (CA0 - ca) - V * k * ca) / V

    reaction_heat = DELTA_H_RELEASE * V * k * ca
    sensible_heat = RHO * CP * F * (T0 - temperature_k)
    coolant_heat = ua * (temperature_k - T_CIN)
    dtemp_dt = (sensible_heat - coolant_heat + reaction_heat) / (V * RHO * CP)

    return dca_dt, dtemp_dt


def simulate() -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """Integrate the nonlinear model with explicit Euler."""
    time = np.arange(T_START, T_END + T_STEP, T_STEP)
    ca = np.empty_like(time)
    temperature = np.empty_like(time)
    fc = np.empty_like(time)

    temperature[0] = steady_state_temperature()
    ca[0] = steady_state_concentration(temperature[0])
    fc[0] = coolant_flow(time[0])

    for i in range(time.size - 1):
        fc[i] = coolant_flow(time[i])
        dca_dt, dtemp_dt = derivatives(ca[i], temperature[i], time[i])
        ca[i + 1] = ca[i] + T_STEP * dca_dt
        temperature[i + 1] = temperature[i] + T_STEP * dtemp_dt

    fc[-1] = coolant_flow(time[-1])
    return time, ca, temperature, fc


def make_figure(time: np.ndarray, ca: np.ndarray, temperature: np.ndarray) -> plt.Figure:
    fig, axes = plt.subplots(2, 1, figsize=(7.6, 5.8), sharex=True)

    axes[0].plot(time, ca, color="black", linewidth=1.8)
    axes[0].set_ylabel(r"Reactor concentration (kmol/m$^3$)")
    axes[0].set_xlim(T_START, T_END)
    axes[0].set_ylim(0.23, 0.27)
    axes[0].set_yticks([0.24, 0.26])
    axes[0].set_xlabel("Time (min)")
    axes[0].tick_params(direction="in", top=True, right=True, length=4, width=1)
    axes[0].grid(linestyle="--", color="black", alpha=0.5)

    axes[1].plot(time, temperature, color="black", linewidth=1.8)
    axes[1].set_ylabel("Reactor temperature (K)")
    axes[1].set_xlabel("Time (min)")
    axes[1].set_xlim(T_START, T_END)
    axes[1].set_ylim(393.0, 397.0)
    axes[1].set_yticks([394.0, 396.0])
    axes[1].tick_params(direction="in", top=True, right=True, length=4, width=1)
    axes[1].grid(linestyle="--", color="black", alpha=0.5)

    fig.tight_layout()
    return fig


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("public/generated/modules/02/example_2_6.svg"),
        help="Optional path to save the generated figure instead of only showing it.",
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
    time, ca, temperature, _ = simulate()
    figure = make_figure(time, ca, temperature)

    if args.output is not None:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        figure.savefig(args.output, format="svg", bbox_inches="tight")

    if args.no_show:
        plt.close(figure)
    else:
        plt.show()


if __name__ == "__main__":
    main()
