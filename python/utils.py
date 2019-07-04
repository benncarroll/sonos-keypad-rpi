import sys

def error(message="", terminate=False):
    if terminate:
        sys.exit(message+'\n')
    else:
        print(message)
