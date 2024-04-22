import sys
from spleeter.separator import Separator

def separate_audio(audio_path, output_path):
    separator = Separator('spleeter:2stems')
    separator.separate_to_file(audio_path, output_path)

if __name__ == '__main__':
    audio_path = sys.argv[1]
    output_path = sys.argv[2]
    separate_audio(audio_path, output_path)