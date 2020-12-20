function rev = reverbExt(x, Fs)

% Autocorrelation
% t_diff = ceil(length(x_mono)/Fs);
t_diff = 2.4;
l = Fs * t_diff * 2 + 1;
t = linspace(-t_diff, t_diff, l);
y = abs(xcorr(x, Fs*t_diff, 'normalized'));

% Reverb calculation
rev_y = log(abs(t) + 1) .* (transpose(y));
rev = sum(rev_y) * 20000 / (2*length(rev_y));

% % Plotting
% plot(t, y);
% title(strtok(filename, '.'))
% xlabel('lag[s]')

end