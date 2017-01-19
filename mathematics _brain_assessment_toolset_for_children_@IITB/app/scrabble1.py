from random import shuffle, randint
from .utils.maths import *
import os


def checkAnagram(word1, word2):
	'''
	check if two words are anagram of one another
	'''
	w1 = ''.join(sorted(word1)).upper()
	w2 = ''.join(sorted(word2)).upper()
	return w1 == w2


def scrabbleWord(word):
	'''
	scrabbles / shuffles a word
	'''
	word = list(word)
	shuffle(word)
	return ''.join(word)


def loadWordlist():

	data = dict()
	for i in range(5,10+1):
		data[i] = []
	BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
	path = 'app/corncob_caps.txt'
	pathfile = os.path.join(BASE_DIR, path)

	print (pathfile)
	with open(pathfile) as f:
		for line in f:
			if not line[:-1].isalpha():
				continue
			line = line.strip()
			if len(line) > 4 and len(line) < 11:
				data[len(line)] += [line]
	return data


def addNew(answer):

	choices= [None]*4
	data = loadWordlist()
	wlen = randint(5,10)
	# print('data is ',data)
	pos = randint(0,len(data[wlen])-1)
	print (pos)
	word = data[wlen][pos]
	scrabbled = scrabbleWord(word)
	while word == scrabbled:
		scrabbled = scrabbleWord(word)
	#answer = randint(0,3)
	poss = [pos]
	leftPoint = 0 if (pos-5 < 0) else pos-5
	rightPoint = len(data[wlen]) - 1 if (pos + 5 > len(data[wlen]) - 1) else pos + 5
	

	for i in range(4):
			if i == answer:
				choices[i]= word.upper()
			else:
				pos = poss[0]
				while pos in poss or checkAnagram(data[wlen][pos], word) == True:
					pos = randint(leftPoint, rightPoint)
				choices[i] = data[wlen][pos].upper()
				poss += [pos]
	
	return [scrabbled,choices]




def get_anagram_question():
	answer = randint(0,3)
	
	[word,choices]= addNew(answer)
	print (word)
	for i in choices:
		print (i)
	print(answer)
	return {'answer': answer,'options':choices, 'question': word}