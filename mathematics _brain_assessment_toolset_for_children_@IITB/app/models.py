from django.db import models
from django.contrib.auth.models import User
from mongoengine import *
import datetime
import os
from django.core.files.storage import *

'''
Method for determining upload path for batch registration file
'''
def batchfileuploadpath(instance, filename):
	filename="data.xlsx"
	print("paath>>")
	BASE_DIR=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
	filepath= os.path.join(BASE_DIR, 'media','batchfile/')
	print(filepath+filename)
	if os.path.isfile(filepath+filename):
		directory = 'batchfile/oldfiles'
		return directory+'/'+filename
		os.remove(filepath+filename)
	directory = 'batchfile'
	if not os.path.exists(directory):
		os.makedirs(directory)
	return directory+'/'+filename


'''
Class 
	Batch Upload file model for form
'''
class BatchUploadModel(models.Model):
	# filename=models.CharField(max_length=100)
	filename='data'
	data_excel_file=models.FileField(upload_to=batchfileuploadpath)


'''
Class 
	Custom User model 
'''
class UserInfo(models.Model):

	temp = User();
	first_name = models.CharField(max_length = 120,blank = True,null=True)
	last_name = models.CharField(max_length = 120,blank = True,null=True)
	DOB = models.DateField(null=True)
	gender = models.CharField(max_length = 120,blank = True,null=True)
	school_name = models.CharField(max_length = 120,blank = True,null=True)
	user = models.OneToOneField(User)
	#password = models.CharField(max_length = 120,blank = True,null=Tr
	parent_email = models.EmailField(null=True)
	parent_phone = models.IntegerField(null=True)

	def __str__(self):
		return str(self.user.username)

'''
Determines path for each subject
'''

def subject_content_file_name(instance, filename):
	directory = '/'.join(['subject',instance.subjectname])
	if not os.path.exists(directory):
		os.makedirs(directory)
	return directory+'/'+filename


'''
Determines path for each theme
'''

def theme_content_file_name(instance, filename):
	directory = '/'.join(['theme',instance.themename])
	if not os.path.exists(directory):
		os.makedirs(directory)
	return directory+'/'+filename

'''
Class
	Model for theme
'''

class addtheme(models.Model):
	themename=models.CharField(max_length=100)
	themefile=models.FileField(upload_to=theme_content_file_name)
	class Meta:
		verbose_name='Theme'
		verbose_name_plural='Themes'
	def __str__(self):
		return self.themename
'''
Class 
	Model for subject
'''

class addsubject(models.Model):
	subjectname=models.CharField(max_length=100)
	subjectfile=models.FileField(upload_to=subject_content_file_name)
	# subjectimage=models.ImageField(upload_to=subject_content_file_name)
	class Meta:
		verbose_name='Subject'
		verbose_name_plural='Subjects'


	def __str__(self):
		return self.subjectname

'''
Class
	Model for Compablity matrices between themes and subjects for Brain Games
'''

class CompatibilityMatricesBrain(models.Model):
	subjectname = models.CharField(max_length=100)
	themename = models.CharField(max_length=100)
	class Meta:
		verbose_name='Compatibility Matrix (Brain)'
		verbose_name_plural='Compatibilty Matrices (Brain)'
	def __str__(self):
		return str(self.subjectname+' '+self.themename)

'''
Class
	Model for Compablity matrices between themes and subjects for Math Games
'''


class CompatibilityMatricesMaths(models.Model):
	subjectname = models.CharField(max_length=100)
	themename = models.CharField(max_length=100)
	class Meta:
		verbose_name='Compatibility Matrix (Math)'
		verbose_name_plural='Compatibilty Matrices (Math)'
	def __str__(self):
		return str(self.subjectname+' '+self.themename)


'''
Class for list of themes corresponding to a subject

'''

class SubjectThemeList():

	def __init__(self,name,theme_list,level=0):
		self.name = name

		self.theme_list = theme_list
		self.level = level
	def __repr__(self):
		return self.name+' '+ str(self.theme_list)

'''
Class for DashBoard
'''

class DashBoard():
	
	def __init__(self,name,game_list):
		self.name = name
		self.game_list = game_list
'''
Class for GameObjects 
'''
class GameObject():

	def __init__(self,name,levels):
		self.levels = levels
		self.name  = name
'''
Class for each level
'''

class Level():

	def __init__(self,number, score):
		self.number = number
		self.score = score

'''
Class
	Model for saving the activation key for an new user
'''

class Profile(models.Model):
    user = models.OneToOneField(User, related_name='profile') #1 to 1 link with Django User
    activation_key = models.CharField(max_length=40)
    key_expires = models.DateTimeField()
    last_report_sent = models.DateTimeField(default = datetime.datetime.utcnow())

