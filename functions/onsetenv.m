function [E,D] = onsetenv(d,sr,swin)

% no onsetenv provided - have to calculate it

sro = 8000;

  swin = 1024;
  shop = 32;
  % mel channels
  nmel = 40;
  % sample rate for specgram frames (granularity for rest of processing)
  oesr = sro/shop;

% resample to 8 kHz
if (sr ~= sro)
  gg = gcd(sro,sr);
  d = resample(d,sro/gg,sr/gg);
  sr = sro;
end

D = specgram(d,swin,sr,swin,swin-shop);

% Construct db-magnitude-mel-spectrogram
mlmx = fft2melmx(swin,sr,nmel);
D = 20*log10(max(1e-10,mlmx(:,1:(swin/2+1))*abs(D)));

% Only look at the top 80 dB
D = max(D, max(max(D))-80);

%imgsc(D)
  
% The raw onset decision waveform
mm = (mean(max(0,diff(D')')));
eelen = length(mm);

% dc-removed mm
E = filter([1 -1], [1 -.99],mm);