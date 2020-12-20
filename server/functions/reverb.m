function rev = reverb(filename)

% Read audio
[x, Fs] = audioread(filename);
x_mono = x(:,1) + x(:,2);

rev = reverbExt(x_mono, Fs);

end