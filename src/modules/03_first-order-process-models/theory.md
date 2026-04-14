Many process units can be approximated as first-order systems over a useful
operating region. This gives an intuitive bridge between physics and control
design.

The two most recognizable parameters are process gain $K$ and time constant
$\tau$. Together they explain how far and how fast the output responds.

$$G_p(s)=\frac{K}{\tau s + 1}$$

```python | Generate a first-order step response sample
import math

K = 2.0
tau = 5.0

for t in range(0, 21, 5):
    y = K * (1 - math.exp(-t / tau))
    print(f"t={t:>2} min -> y={y:.3f}")
```
