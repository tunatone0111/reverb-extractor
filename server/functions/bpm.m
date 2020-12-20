function bpm = bpm(filename)

% Read audio
[x, Fs] = audioread(filename);
x_mono = x(:,1) + x(:,2);

bpm_v = tempo(x_mono, Fs);
bpm = bpm_v(1);
while bpm < 60
    bpm = bpm * 2;
end
bpm = round(bpm);

end