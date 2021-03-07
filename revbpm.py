import os
import matlab.engine

base_dir = os.path.dirname(os.path.abspath(__file__))


class Revbpm(object):
    def __init__(self):
        self.eng = matlab.engine.start_matlab()
        self.eng.addpath(base_dir+'/functions')
        self.eng.cd(base_dir+'/static/audio')

    def analyze(self, filename):
        print('analyze'+filename)
        try:
            rev = self.eng.reverb(filename)
            bpm = self.eng.bpm(filename)
            return rev, bpm
        except:
            return -1, -1


if __name__ == '__main__':
    revbpm = Revbpm()
    rev, bpm = revbpm.analyze('everything.mp3')
    print(f'rev: {rev}, bpm: {bpm}')
