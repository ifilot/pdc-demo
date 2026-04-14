# Module 2: Mathematical Modelling Principles

# Why We Model

Process control depends on being able to describe how a process changes with
time, because without such a description it is difficult to predict how the
system will react to disturbances, operating changes, or control actions. A
mathematical model provides this description in a form that can be analyzed and
used for engineering decisions. In practice, models allow us to estimate
transient behavior, compare alternative equipment designs, determine which
variables most strongly influence the response, and judge whether a process is
likely to be easy or difficult to control.

In chemical engineering, the most useful dynamic models are often based on
conservation laws together with constitutive relationships for reaction, heat
transfer, and flow. This is important because such models do more than simply
reproduce data. They connect the physical structure of the process to its
dynamic behavior. As a result, modelling should not be seen as a purely
mathematical exercise, but as a structured engineering task in which we define
the goal, choose the system boundary, state assumptions, write balances, solve
the equations, interpret the result, and finally decide whether the model is
accurate enough for the intended use.

# Why First-Principles Models Matter

A first-principles model is built directly from physical laws, and that makes it
especially valuable in process control. One reason is that the same conservation
principles apply to a very wide range of systems. Tanks, heat exchangers,
reactors, distillation units, and piping networks may differ greatly in purpose,
but they can all be analyzed using the same general language of accumulation,
input, output, generation, and consumption. This gives engineers a consistent
and transferable way of thinking about dynamic systems.

A second advantage is that a first-principles model often remains useful when
operating conditions change. If the flow rate, volume, temperature, or nominal
operating point is altered, the model can usually be re-evaluated by changing
parameters rather than rebuilding the entire description from the beginning.
Most importantly, however, a physically based model explains why the process
behaves as it does. Volume influences accumulation, flow influences residence
time, reaction rate affects both steady-state behavior and response speed, and
heat-transfer parameters govern how quickly temperature moves toward a new
condition. A good model therefore links physical design and operating conditions
directly to dynamic response.

# A Practical Modelling Procedure

A reliable modelling workflow can be summarized in six steps:

1. Define the goal.
2. Prepare process information.
3. Formulate the model.
4. Choose a solution method.
5. Analyze the results.
6. Validate the model.

These steps are listed in order, but real modelling is iterative. If results
look unrealistic, the assumptions, data, or even the goal may need to be
revisited.

## 1. Define the Goal

The goal determines what kind of model is needed, and this is why model
formulation should never begin before the purpose of the calculation is clear. A
model built to estimate whether a response takes seconds or hours is quite
different from a model built to size a safety margin, interpret laboratory data,
or design a controller. In each case, the level of detail and the required
accuracy may be different.

Useful modelling goals usually answer questions such as what numerical value is
needed, which variables influence the response most strongly, whether the
response is monotonic or oscillatory, and how accurate the final answer must be.
A simple model may be perfectly acceptable when only rough insight is required,
but the same model may be inadequate if the result will be used for a tight
operating limit or a sensitive safety decision.

## 2. Prepare Information

Before writing equations, the system itself must be defined clearly. In
practice, this means sketching the process, identifying the system boundary,
listing the important inputs and outputs, and collecting the data needed for the
model. This step may seem simple, but it is essential because many modelling
errors come from uncertainty about what exactly is included in the system and
which variables are treated as external inputs.

This stage is also where assumptions are stated explicitly. Common examples
include assuming that a vessel is well mixed, that density is constant, that the
liquid volume remains constant, that heat losses can be neglected, or that
physical properties do not vary strongly over the operating range. Such
assumptions are often necessary to keep the model manageable, but they also
define the limits within which the model can be trusted. For that reason,
assumptions should always be seen as engineering choices rather than harmless
mathematical shortcuts.

## 3. Formulate the Model

Most dynamic process models are formed by combining conservation balances,
constitutive equations, and algebraic simplification. The balance equations
describe accumulation, input, output, generation, and consumption, while the
constitutive equations express how variables are related through physical laws
or engineering correlations. Typical examples include reaction rate laws,
heat-transfer expressions, and valve flow equations.

Once the equations have been written, it is good practice to check the degrees
of freedom of the model. The number of independent equations should match the
number of unknowns; otherwise, the model is incomplete or internally
inconsistent. This is a simple but important quality check, because it prevents
the engineer from spending time solving a system that has not yet been properly
specified.

## 4. Choose a Solution Method

Some models can be solved analytically, and this is especially useful for simple
first-order linear systems because the resulting expression shows the form of
the response very clearly. An analytical solution often reveals quantities such
as the time constant and steady-state gain directly, which makes physical
interpretation much easier.

More realistic models, however, are often nonlinear and cannot be solved in a
compact closed form. In those cases numerical methods are required. Analytical
solutions are usually more transparent and give stronger intuition, but
numerical methods become necessary when the underlying physics is more complex
than the mathematics we can solve by hand.

## 5. Analyze the Results

Solving the equations is not the end of the modelling task. The result must
still be interpreted carefully, because an answer is only useful if it is
physically meaningful and relevant to the original question. Important checks
include whether the solution satisfies the initial condition, whether it
approaches the expected steady state, whether the sign of the response is
physically reasonable, and whether the result shows oscillations, extrema, or
other important dynamic features.

Results analysis should also focus on parameter influence. A good model does not
merely produce a number; it helps explain which variables control the speed and
magnitude of the response. Sensitivity analysis is part of this interpretation.
If a small uncertainty in one parameter leads to a large change in the predicted
behavior, then that uncertainty matters in design, operation, and control.

## 6. Validate the Model

Validation means deciding whether the model is good enough for its intended use.
In practice, this usually requires comparing model predictions with measured
data and judging whether the level of agreement is acceptable for the
engineering question being addressed. A model used for rough conceptual
understanding does not need the same level of agreement as a model used to
support an operating limit or equipment specification.

It is important to remember that no model is ever proven universally true. At
best, a model is shown to be acceptable over a certain range of conditions and
for a certain purpose. That is normally sufficient for engineering, provided the
model’s limitations are understood and not ignored.

> # Example 2.1: A Stirred-Tank Mixer
>
> Consider a perfectly mixed tank of constant volume $V$ with inlet and outlet
> flow rate $F$. Suppose that the inlet concentration changes suddenly and we
> want to determine the concentration in the tank, $C_A(t)$. This is one of the
> simplest and most useful examples in process dynamics because it shows how a
> straightforward material balance leads directly to first-order behavior.
>
> For component A, the dynamic balance is:
>
> $$V\frac{dC_A}{dt} = FC_{A0} - FC_A$$
>
> or
>
> $$\frac{dC_A}{dt} + \frac{F}{V}C_A = \frac{F}{V}C_{A0}$$
>
> This is a first-order linear differential equation. When it is compared with
> the standard first-order form,
>
> $$\tau \frac{dy}{dt} + y = Kx$$
>
> the parameters are:
>
> $$\tau = \frac{V}{F}, \qquad K = 1$$
>
> we immediately obtain physical insight:
>
> - larger volume means slower response
> - larger flow rate means faster response
>
> For a step in inlet concentration, the response has the form:
>
> $$C_A(t) = C_{A,\mathrm{final}} + \left(C_{A,\mathrm{initial}} - C_{A,\mathrm{final}}\right)e^{-t/\tau}$$
>
> If $V = 2.1\ \mathrm{m^3}$ and $F = 0.085\ \mathrm{m^3/min}$, then:
>
> $$\tau = \frac{2.1}{0.085} = 24.7\ \mathrm{min}$$
>
> This means that after one time constant the concentration has completed about
> 63.2% of its total change, and after roughly $4\tau$ the tank is very close to
> its new steady state. The example is important because it shows how the
> mathematics and the physics align: a larger volume slows the response by
> increasing the system’s capacity to accumulate material, while a larger flow
> rate speeds the response by reducing the effective residence time.
>
> ![Example 2.1 concentration response](/generated/modules/02/example_2_1.svg "Figure 2.1: Concentration response for a stirred-tank mixer after an inlet step change | width=50%")

> # Example 2.2: An Isothermal CSTR
>
> Now consider a well-mixed isothermal reactor with a first-order reaction:
>
> $$A \rightarrow \text{products}, \qquad r_A = -kC_A$$
>
> The component balance becomes:
>
> $$V\frac{dC_A}{dt} = FC_{A0} - FC_A - VkC_A$$
>
> or
>
> $$\frac{dC_A}{dt} + \left(\frac{F}{V} + k\right)C_A = \frac{F}{V}C_{A0}$$
>
> This equation still has first-order form, but the presence of reaction changes
> both the time constant and the steady-state gain. In other words, the reactor
> may look similar to the mixer from the outside, but the internal chemistry
> changes the dynamic behavior in a physically meaningful way.
>
> The time constant is:
>
> $$\tau = \frac{1}{F/V + k} = \frac{V}{F + Vk}$$
>
> Compared with the simple mixer, the reactor responds faster because A is
> removed not only by outlet flow but also by reaction inside the tank.
>
> This point is worth interpreting carefully. In the mixer, the concentration
> can move toward a new condition only because material is washed out and
> replaced by the inlet stream, so the response speed is governed entirely by
> the flow term $F/V$. In the reactor, however, there is an additional mechanism
> that drives the concentration downward: A is also consumed by reaction. That
> means the effective rate at which the system removes A is larger than in the
> mixer alone, and this is exactly why the time constant becomes smaller.
> Physically, the reactor does not merely dilute A. It also destroys it, and
> that extra removal pathway makes the approach to the new steady state faster.
>
> At steady state:
>
> $$0 = FC_{A0} - (F + Vk)C_A$$
>
> so
>
> $$C_A = \frac{F}{F + Vk}C_{A0}$$
>
> The gain for inlet concentration changes is therefore:
>
> $$K = \frac{F}{F + Vk}$$
>
> Since $K < 1$, the reactor concentration changes less than the inlet
> concentration because the reaction damps the effect of the disturbance. This
> example shows clearly that similar equipment can have quite different dynamics
> once the internal process physics are changed. For control purposes, that
> difference matters because it changes both how fast the response occurs and
> how large the final output change will be.
>
> For an illustrative comparison, the figure below uses the same disturbance as
> Example 2.1 together with $V = 2.1\ \mathrm{m^3}$, $F = 0.085\
> \mathrm{m^3/min}$, and an isothermal first-order rate constant of $k = 0.04\
> \mathrm{min^{-1}}$. The CSTR responds faster than the simple mixer, but it
> settles to a lower final concentration because reaction removes A inside the
> vessel.
>
> ![Example 2.2 comparison response](/generated/modules/02/example_2_2.svg "Figure 2.2: Comparison of the mixer and isothermal CSTR responses to the same inlet concentration disturbance | width=50%")

# Linearization

Many real process models are nonlinear, while many control-analysis tools are
built around linear systems. Rather than abandoning realistic models completely,
engineers often linearize them around a steady operating point. The basic idea
is to approximate a nonlinear term using the first terms of its Taylor expansion
and then write the resulting model in deviation variables. This gives a local
approximation that is easier to analyze while still retaining the main influence
of the physical parameters.

Suppose a reactor has second-order kinetics:

$$V\frac{dC_A}{dt} = F(C_{A0} - C_A) - VkC_A^2$$

This model is nonlinear because of the $C_A^2$ term. Around a steady operating
point $C_{As}$, we approximate:

$$C_A^2 \approx C_{As}^2 + 2C_{As}(C_A - C_{As})$$

Now define deviation variables:

$$C_A' = C_A - C_{As}, \qquad C_{A0}' = C_{A0} - C_{A0s}$$

After substitution and simplification, the linearized model becomes:

$$V\frac{dC_A'}{dt} = FC_{A0}' - (F + 2VkC_{As})C_A'$$

or

$$\tau \frac{dC_A'}{dt} + C_A' = KC_{A0}'$$

with

$$\tau = \frac{V}{F + 2VkC_{As}}, \qquad K = \frac{F}{F + 2VkC_{As}}$$

This approximation is not exact, but it makes the effects of flow, kinetics, and
operating point much easier to interpret. That is the main value of
linearization in control: it turns a difficult nonlinear model into a simpler
local model whose gain and time constant can be understood directly and used in
later controller analysis.

> # Example 2.3: Linearization Compared with the Nonlinear Model
>
> To make the idea more concrete, consider a reactor with the same values of $V$
> and $F$ used in the previous examples, together with an illustrative
> second-order rate constant $k = 0.08\ \mathrm{m^3/(kmol\ min)}$. Suppose the
> steady inlet concentration is $C_{A0s} = 0.60\ \mathrm{kmol/m^3}$ and that the
> inlet concentration is then stepped to $0.75\ \mathrm{kmol/m^3}$. The figure
> below compares the full nonlinear response with the linearized approximation
> constructed around the original steady operating point.
>
> The agreement is quite good for this moderate disturbance, although it is not
> exact. That difference is important. The nonlinear model still retains the
> full curvature of the reaction term, while the linearized model only
> reproduces the local behavior near the operating point. Even so, the
> comparison shows why linearization is so useful in control work: near the
> nominal condition, it captures the main speed and direction of the response
> with much less mathematical effort.
>
> ![Example 2.3 linearization comparison](/generated/modules/02/example_2_3.svg "Figure 2.3: Comparison of the full nonlinear model and the linearized approximation near a steady operating point | width=50%")

# Numerical Solution of ODEs

When a model cannot be solved analytically, numerical integration is used. The
simplest method is Euler integration:

$$y_{i+1} = y_i + f(y_i,t_i)\Delta t$$

This method is easy to implement and easy to understand, but its accuracy
depends strongly on the step size. A more accurate and very common alternative
is fourth-order Runge-Kutta, which evaluates the derivative several times within
each step. It usually gives much better accuracy for the same step size,
although it requires more calculation.

The key numerical issue is step size:

- if $\Delta t$ is too large, the solution may be inaccurate
- if $\Delta t$ is too small, the computation may be inefficient

A useful practical rule is to choose the step size small relative to the
smallest time constant in the system and then check whether reducing the step
size further changes the answer significantly. In this way, numerical work
becomes not only a computational exercise but also another form of engineering
judgement.

In modern engineering work, however, we rarely solve process models by writing
Euler loops unless the goal is specifically to understand the numerical idea
itself. Most practical software uses higher-order methods with automatic
step-size control, because they are usually both more accurate and more
efficient. In Python, for example, `scipy.integrate.solve_ivp` provides modern
adaptive methods such as `RK45` for general nonstiff problems and implicit
methods such as `BDF` or `Radau` for stiff systems.

Stiffness matters because some process models contain both fast and slow dynamic
modes at the same time. In that situation an explicit method such as Euler may
require an extremely small step size just to remain stable, even when the
engineer is mainly interested in the slower part of the response. Implicit stiff
solvers are valuable because they can often take much larger stable steps while
still resolving the overall behavior correctly. For process control, this
becomes especially important in reacting systems, nonisothermal systems, and
coupled mass-energy models.

> # Example 2.4: Several Euler Steps
>
> To see the numerical logic clearly, consider the first-order model:
>
> $$\frac{dy}{dt} = -\frac{1}{\tau}y + \frac{K}{\tau}u$$
>
> Suppose:
>
> - $\tau = 5\ \mathrm{min}$
> - $K = 2$
> - $u = 3$
> - $y(0) = 0$
> - $\Delta t = 1\ \mathrm{min}$
>
> Because the input is constant, the final steady value is $Ku = 6$. Euler
> integration will not jump directly to that value. Instead, it moves forward
> one small step at a time, always using the slope at the current point.
>
> At $t = 0$:
>
> $$\frac{dy}{dt} = -\frac{1}{5}(0) + \frac{2}{5}(3) = 1.2$$
>
> Using Euler:
>
> $$y(1) \approx y(0) + \Delta t \left(\frac{dy}{dt}\right) = 0 + 1(1.2) = 1.2$$
>
> Now use this new value to estimate the slope at the next step:
>
> $$\frac{dy}{dt}\bigg|_{t=1} = -\frac{1}{5}(1.2) + \frac{2}{5}(3) = 0.96$$
>
> so
>
> $$y(2) \approx 1.2 + 1(0.96) = 2.16$$
>
> Repeating once more:
>
> $$\frac{dy}{dt}\bigg|_{t=2} = -\frac{1}{5}(2.16) + \frac{2}{5}(3) = 0.768$$
>
> and therefore
>
> $$y(3) \approx 2.16 + 1(0.768) = 2.928$$
>
> These few steps already show the main numerical pattern. The solution rises
> quickly at first, but each new slope is smaller than the previous one because
> the state is getting closer to its steady value. In that sense, Euler
> integration imitates the physical behavior step by step: the farther the
> system is from steady state, the larger the driving force for change.
>
> A minimal Python implementation of this repeated stepping is:
>
> ```python | Listing 2.1: Repeated explicit Euler steps for a first-order model
> tau = 5.0
> K = 2.0
> u = 3.0
> y = 0.0
> dt = 1.0
>
> for step in range(3):
>     dydt = -(1 / tau) * y + (K / tau) * u
>     y = y + dt * dydt
>     print(step + 1, y)
> ```
>
> The printed values are $1.2$, $2.16$, and $2.928$, matching the hand
> calculation above. Although this example is still simple, it now shows more
> clearly how Euler integration constructs an approximate trajectory: evaluate
> the current slope, advance one step, then repeat with the updated state.

> # Example 2.5: A Modern Python ODE Solver
>
> In practical work, it is often better to let a library choose the step size
> automatically. Consider again the first-order model
>
> $$\frac{dy}{dt} = -\frac{1}{\tau}y + \frac{K}{\tau}u$$
>
> with $\tau = 5\ \mathrm{min}$, $K = 2$, a constant input $u = 3$, and
> initial value $y(0)=0$. A compact SciPy implementation is:
>
> ```python | Listing 2.2: Solving a first-order model with scipy.integrate.solve_ivp
> import numpy as np
> from scipy.integrate import solve_ivp
>
> tau = 5.0
> K = 2.0
> u = 3.0
>
> def model(t, y):
>     return [-(1 / tau) * y[0] + (K / tau) * u]
>
> t_eval = np.linspace(0.0, 20.0, 200)
> sol = solve_ivp(model, (0.0, 20.0), [0.0], t_eval=t_eval, method="RK45")
> ```
>
> This code is short, but it already reflects a more modern numerical
> workflow. The solver automatically adjusts its internal step size and returns
> the solution at the times requested in `t_eval`. For a simple nonstiff model
> like this, `RK45` is usually a very good default. If the model were stiff,
> one would often change the method to `BDF` or `Radau` instead of reducing the
> step size by hand.

> # Example 2.6: The Nonisothermal Reactor
>
> A nonisothermal CSTR couples a material balance and an energy balance, so
> concentration and temperature influence each other through the reaction rate
> and the heat of reaction. As a result, the dynamic behavior can be much
> richer than in simple first-order mixing problems. Depending on kinetics,
> heat transfer, and operating conditions, the reactor may show slow overdamped
> behavior, fast but stable behavior, oscillatory transients, or strong
> sensitivity to changes in cooling.
>
> To make that coupling concrete, consider a reactor initially at steady state
> and then subjected to a step decrease in coolant flow from $15$ to
> $14\ \mathrm{m^3/min}$ at $t=1\ \mathrm{min}$. In this case both
> concentration and temperature respond, because the coolant disturbance
> changes the heat-removal rate, which changes the reactor temperature, which
> changes the reaction rate, which in turn feeds back into both balances. Even
> a single input disturbance therefore produces a coupled multivariable
> transient.
>
> The governing equations are a component balance and an energy balance:
>
> $$\frac{dC_A}{dt} = \frac{F}{V}(C_{A0} - C_A) - k(T)C_A$$
>
> $$\frac{dT}{dt} = \frac{\rho C_pF(T_0 - T) - UA(F_c)(T - T_{cin}) + (-\Delta H_r)Vk(T)C_A}{V\rho C_p}$$
>
> with a temperature-dependent rate constant
>
> $$k(T) = k_0 e^{-E/(RT)}$$
>
> These equations show why the dynamics are more complicated than in the
> earlier examples. Temperature affects the reaction rate, the reaction rate
> affects component consumption and heat release, and the coolant flow affects
> the rate at which heat can be removed. The model is therefore nonlinear and
> internally coupled.
>
> The figure below shows the resulting concentration and temperature
> trajectories. Before the disturbance, the reactor is exactly at steady state.
> After the coolant flow is reduced, the temperature rises and the
> concentration shifts in response to the faster reaction. This is a good
> example of why nonisothermal reactors are often much more challenging than
> simple first-order systems: the mass and energy effects reinforce one another
> rather than evolving independently.
>
> ![Example 2.6 non-isothermal CSTR response](/generated/modules/02/example_2_6.svg "Figure 2.4: Concentration and temperature response of a non-isothermal CSTR after a coolant-flow step disturbance | width=50%")
>
> This gives an important lesson for process control. Physical appearance alone
> does not reveal dynamic difficulty. Two vessels may both be stirred tanks,
> yet one may behave like a gentle first-order process while another behaves
> like a much more challenging coupled system because of the interaction
> between reaction and energy effects.

# Closing Perspective

Mathematical modelling in process control is a goal-oriented task, and the
model should always be chosen to answer a specific engineering question with
enough accuracy to support a real decision. Fundamental models are especially
valuable because they connect process physics to dynamic behavior, while
linearization helps turn difficult nonlinear problems into simpler local models
with interpretable gains and time constants. Numerical methods provide a
practical route forward when analytical solutions are not available.

The most important habit is to treat modelling as analysis rather than mere
calculation. A good engineer does not stop after solving the equations, but
asks whether the result is physically meaningful, whether it is sensitive to
uncertainty, and whether it is accurate enough for the problem at hand. In
that sense, a mathematical model is not just a tool for obtaining answers. It
is a structured way of thinking clearly about dynamic systems.
