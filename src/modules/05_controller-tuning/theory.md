Controller tuning is the practical task of choosing parameters that deliver
acceptable speed, stability, and robustness.

Even when a formal rule is used, the engineer still judges the operating
context, actuator limits, and disturbance environment.

A common proportional-integral-derivative form is
$$u(t)=K_c\left(e(t)+\frac{1}{\tau_I}\int e(t)dt + \tau_D \frac{de}{dt}\right).$$

```python | A compact PID calculation loop
Kc = 2.5
tau_i = 4.0
tau_d = 0.5
dt = 1.0
integral = 0.0
last_error = 0.0

for error in [1.2, 0.8, 0.3, 0.1]:
    integral += error * dt
    derivative = (error - last_error) / dt
    u = Kc * (error + integral / tau_i + tau_d * derivative)
    print(f"error={error:.2f}, controller_output={u:.2f}")
    last_error = error
```
