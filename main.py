# %%
import matplotlib.pyplot as plt
import numpy as np
from audio2numpy import open_audio
import os
import csv
# %%
x, Fs = open_audio('./audio/everything.mp3')
x = x.mean(1)
# %%
T = len(x)/Fs/60
print(T)
# %%
plt.figure(figsize=(10, 1))
plt.plot(np.linspace(0, T, len(x)), x)
# %%
plt.figure(figsize=(10, 1))
plt.plot(np.linspace(0, T, len(x))[::10000], x[::10000])

# %%

x, Fs = open_audio('./audio/shampoo.mp3')
x = x.mean(1)

with open('temp1.csv', 'w') as f:
    cr = csv.writer(f)
    cr.writerow(x[::10000])
