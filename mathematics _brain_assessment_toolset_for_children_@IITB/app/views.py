from django.shortcuts import render, redirect
from django.http import HttpResponse,HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from .forms import UserInfoForm,BatchUploadFileForm
from .forms import *
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.template import RequestContext
from django.shortcuts import render_to_response
from .models import *
from .queries import *
from app.leaderboard import *
from app.objects import *
from django.core.paginator import Paginator
from django.http import Http404
import os
from os import listdir
from os.path import isfile, join
from django.http import JsonResponse
from .scrabble1 import *
import requests
import xlrd
from django.contrib import messages
from django.core.mail import send_mail		
from django.conf import settings		
from django.core.mail import EmailMessage
from django.template import Context
from django.template.loader import render_to_string, get_template		
from django.core.mail import EmailMessage		
from django.shortcuts import get_object_or_404		
from django.contrib.auth import get_user_model		
from django.contrib.auth.models import User		
from django.contrib.auth.tokens import default_token_generator		
from django.db.models.query_utils import Q		
from django.contrib import messages		
from django.utils.encoding import force_bytes		
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode		
from django.template import loader		
from django.core.validators import validate_email		
from django.core.exceptions import ValidationError		
from django.views.generic import *
import datetime
import hashlib
import pytz
# Create your views here.



'''
View for the homepage
				
'''
def base(request):
	if 'login' in request.POST:
		print(request.POST.dict)
		return user_login(request)
	else:
		print(request)
		return register(request)




'''
user registration mechanism is implemented in this view.
User provides all the details in the platform.
Mail is verified and user is registered to the platform
	
'''
def register(request):
	print("i am here for registration")
	print(request.POST)
	print("Request end here")
	context = RequestContext(request)
	if request.method == 'POST': 
		gender = ""
		if request.POST.get('genderfemale') == 'on':
			gender = 'Female'
		if request.POST.get('gendermale') == 'on':
			gender = 'Male'
			
		if True:
			username = request.POST.get('username')
			password = request.POST.get('password')				#this form accepts username and password.
			first_name=request.POST.get('firstname')
			last_name=request.POST.get('lastname')
			DOB=request.POST.get('dob')
			parent_email=request.POST.get('email')
			parent_phone = request.POST.get('phone')
			school_name = request.POST.get('schoolname')
			gender=gender		#this form accepts all other details.

			
			instance = UserInfoForm().save(commit=False)

			instance.first_name= first_name
			instance.last_name= last_name
			studnt_dob = DOB.split('-')
			instance.DOB=datetime.date(int(studnt_dob[0]), int(studnt_dob[1]), int(studnt_dob[2]))

			instance.gender= gender
			instance.school_name=school_name
			instance.parent_email=parent_email
			instance.parent_phone= int(round(int(parent_phone)))
			
			try:
				user = User.objects.create_user(username,"",password)
		#		user.set_password(user.password)
				user.email = parent_email
				user.is_active = False
			# 	user.save()
				datas = {}
				datas['username']=username #user_form.cleaned_data['username']
				datas['email']=parent_email #profile_form.cleaned_data['parent_email']
				usernamesalt = username #user_form.cleaned_data['username']
				if isinstance(usernamesalt, str):
					usernamesalt = usernamesalt.encode('UTF-8','strict')      
				salt = hashlib.sha1()												#generate a hash object for encrypting the username
				salt.update(str(random.random()).encode('UTF-8','strict'))
				if isinstance(usernamesalt, str):
				   usernamesalt = usernamesalt.encode('UTF-8','strict')
				salt.update(usernamesalt)
				salt = salt.hexdigest()

				datas['activation_key'] =salt 
				datas['email_subject'] = "Activate your Account"
				datas['full_name'] = first_name + ' ' + last_name
				sendEmail(datas)
				pro = Profile()
				pro.user = user
				pro.activation_key = datas['activation_key']
				#mail verification has to be  done within 2days once the mail is sent to the email of the user , to complete the registration process
				key_expires=datetime.datetime.strftime(datetime.datetime.utcnow() + datetime.timedelta(days=2), "%Y-%m-%d %H:%M:%S")
				pro.key_expires = key_expires
				pro.last_report_sent = datetime.datetime.utcnow()            
				pro.save()
				user.save();


				instance.user=user;
				instance.save()
		
				# profile = profile_form.save(commit=False)
				# profile.user = user
				# profile.save()
				return render_to_response('registration.html',{"success":True})    #indicates successful registration
		
			except:
				return render_to_response('registration.html',{"success":False,'reason':'User Already exists!!'})	
		# if user_form.is_valid()*profile_form.is_valid():
		# 	user = user_form.save()
		
	else:
		user_form = UserForm()
		profile_form = UserInfoForm()
		batch_form = BatchUploadFileForm()

	return render_to_response('home.html',{'user_form':user_form,'profile_form':profile_form, 'batch_form':batch_form},context)





'''
this module handles the login of a user,
take username and password as input and validates it in the database
'''
def user_login(request):
	context = RequestContext(request)
	if request.method == 'POST':
		username = request.POST.get("username","")
		password = request.POST.get("password","")
		user = authenticate(username = username ,password = password)    
		#default django authentication

		#if the user is the admin, it will be redirected to the admin page directly
		if user and user.is_superuser:
			login(request,user)					
			return redirect('../admin')

		#login for all users other than admin
		elif user:
			if user.is_active:
				login(request,user)
				response =  HttpResponseRedirect('profile')
				return response
				
			#if mail is not verified yet
			else:
				return HttpResponse(" Your account is not activated! Please verify your email")
		else:
			#if username or password is invalid
			return HttpResponseRedirect('invalid',{})
	else:
		#successful login
		return render_to_response('home.html',{},context)



'''
Fetch all themeslist from database and load in context
'''
def themelist(request):
    context = {
        'theme_list' : addtheme.objects.all(),
    }
    return render(request, 'list.html', context)



'''
Fetch all subjectlist from database and load in context
'''
def subjectlist(request):
    context = {
        'subject_list' : addsubject.objects.all(),
    }
    return render(request, 'list2.html', context)






'''
It collects all the list of subjects and themes from the database, and displays the compatible games for the user to play.
'''
def profile(request):
	
	if not request.user.is_authenticated or request.user.username == '':
		return render(request,'invalid.html',{})	

	name = request.user.username
	print(name)
	list2 = get_dynamic_details(name)
	#name='adi'
	usr = get_detail(name)
	dob=usr.DOB
	firstname=usr.first_name
	lastname=usr.last_name
	email = usr.parent_email
	x = [f['subjectname'] for f in addsubject.objects.all().values('subjectname')]
	x = sorted(x)
	dict1 = {}

	dict2 = {}

	dict3={}

	for userrec in list2:
		if  userrec.subject in dict2.keys():
			dict2[userrec.subject] = max (dict2[userrec.subject], userrec.level)
		else:
			dict2[userrec.subject] = userrec.level
		
	for xi in CompatibilityMatricesMaths.objects.all():
		if xi.subjectname in dict1.keys():
			dict1[xi.subjectname].append(xi.themename)
		else:
			dict1[xi.subjectname] = [xi.themename]




	for xi in CompatibilityMatricesBrain.objects.all():
		if xi.subjectname in dict3.keys():
			dict3[xi.subjectname].append(xi.themename)
		else:
			dict3[xi.subjectname] = [xi.themename]





	subjectthemelist = {"Maths":[], "Brain":[]}
	for x in dict1.keys():
		if x in dict2.keys():
			subjectthemelist['Maths'].append(SubjectThemeList(x,dict1[x], dict2[x]))
		else:
			subjectthemelist['Maths'].append(SubjectThemeList(x,dict1[x] ))

	for x in dict3.keys():
		if x in dict2.keys():
			subjectthemelist['Brain'].append(SubjectThemeList(x,dict3[x], dict2[x]))
		else:
			subjectthemelist['Brain'].append(SubjectThemeList(x,dict3[x] ))


	
	#print(subjectthemelist)

	context = {'list':list2 ,'dob':dob,'email':email,'firstname':firstname,'lastname':lastname,'name':name,'subjectthemelist' : subjectthemelist }
	return render(request,'profile.html',context)


'''
redirection to the overall leaderboard of all the users
'''
def leaderboard_redirect(request):
	return redirect('/app/leaderboard/1')


'''
redirection to the subjectwise leaderboard
'''
def subject_leaderboard_redirect(request,subject_name):
	return redirect('/app/leaderboard/'+subject_name+'/1')


'''
this module generate the subjectwise leaderboard.
'''
def subject_leaderboard(request,subject_name,page_no):

	print('subject is here')
	print(subject_name)	
	if not request.user.is_authenticated or request.user.username == '':
		return render(request,'invalid.html',{})	

	#generate leaderboard for all
	name = request.user.username
	usr = get_detail(name)
	dob=usr.DOB
	firstname=usr.first_name
	lastname=usr.last_name
	email = usr.parent_email
	context = {}
	start_time = datetime.datetime(1, 1, 1, 1, 1, 1, 1)
	end_time = datetime.datetime.now()
	generate_leaderboard(start_time, end_time, DynamicRecord.objects(subject=subject_name))
	users_list = LeaderBoard.sorted_objects()	
	search_text = ""
	if request.method == 'POST':
		search_text = request.POST.get('search_text')
		print (search_text)
		users_list = LeaderBoard.filter(users_list,search_text)
		for p in users_list:
		    print(p)


	for p in users_list:
		print (p)

	p = Paginator(users_list,10)
	if int(p.num_pages) > int(page_no):
		raise Http404('Out of Bounds')
	context = {'users': p.page(page_no).object_list,'dob':dob,'email':email,'firstname':firstname,'lastname':lastname,'name':name}
	context['search_text']=search_text	
	return render(request,'LEADERBOARD.html',context)



'''
this module generates the overall leaderboard of all users.
Leaderboard can be filtered using username/school name
'''
def leaderboard(request,page_no):
	
	if not request.user.is_authenticated or request.user.username == '':
		return render(request,'invalid.html',{})	
	name = request.user.username
	usr = get_detail(name)
	dob=usr.DOB
	firstname=usr.first_name
	lastname=usr.last_name
	email = usr.parent_email
	context = {}
	start_time = datetime.datetime(1, 1, 1, 1, 1, 1, 1)
	end_time = datetime.datetime.now()
	generate_leaderboard(start_time, end_time, DynamicRecord.objects)
	users_list = LeaderBoard.sorted_objects()	
	search_text = ""
	if request.method == 'POST':
		search_text = request.POST.get('search_text')
		print (search_text)
		users_list = LeaderBoard.filter(users_list,search_text)
		print ('filtered')
	
		for p in users_list:
		    print(p)


	for p in users_list:
		print (p)

	#a single page will display only 10 users details in the leaderboard at a time
	p = Paginator(users_list,10)
	if int(p.num_pages) > int(page_no):
		raise Http404('Out of Bounds')
	context = {'users': p.page(page_no).object_list,'dob':dob,'email':email,'firstname':firstname,'lastname':lastname,'name':name}
	context['search_text']=search_text	
	return render(request,'LEADERBOARD.html',context)



'''
this module gets the details of a user from the database
'''
def get_detail(name):
	u = User.objects.get(username=name)
	usr = UserInfo.objects.all().get(user=u)
	return usr


'''
redirects to this template, if the credentials is invalid 
'''
def invalid(request):
	return render(request,'invalid.html',{})


'''
this modules logs a user out
'''
def loggedmeout(request):
	if not request.user.is_authenticated or request.user.username == '':
		return render(request,'invalid.html',{})	

	logout(request)
	context={'moovon':'You have been logged out.'}
	# response1 = render(request,'home.html',{})
	# response1.delete_cookie('logged_in_status')
	
	# return response1
	return redirect('/app')


'''
this modules gets the subjectfile and themefile on request and generates the game using the gameengine
and serves it to the user
'''
def getgamefiles(subject,theme):
	basedir=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
	mediadir = os.path.join(basedir, 'media')
	maths_games = []
	brain_games = []

	#for including the maths games
	for xi in CompatibilityMatricesMaths.objects.all():
		maths_games.append(xi.subjectname)

	#for including the maths games
	for xi in CompatibilityMatricesBrain.objects.all():
		brain_games.append(xi.subjectname)

	game_dir_name = ""
	if subject in maths_games:
		game_dir_name = 'maths'
	elif subject in brain_games:
		game_dir_name = 'brain'

	subjectdir= os.path.join(mediadir,game_dir_name,'subject')
	themedir=os.path.join(mediadir,game_dir_name,'theme')
	
	loadsubjectdir=os.path.join(subjectdir,subject)
	loadthemedir= os.path.join(themedir, theme)
	subjectfiles =[ '../../../app/media/'+ game_dir_name +'/subject/'+subject+'/'+f for f in listdir(loadsubjectdir) if isfile(join(loadsubjectdir, f))]
	themefiles =  [ '../../../app/media/'+ game_dir_name +'/theme/'+theme+  '/' +f for f in listdir(loadthemedir) if isfile(join(loadthemedir, f))]
	return subjectfiles+themefiles


'''
This modules transfers data (game-level and score) from database to client side and vice versa.
'''

def playgame(request,subjectname,themename):
	print ('called me',subjectname,themename)
		# if request.is_ajax():
		# 	data = {}
		# 	return JsonResponse(data)
	template_name = 'ltigametemplate.html'
	if request.user.is_authenticated and request.user.username != '':
		name = request.user.username
		print('check 1', 'name ',name)
		list = get_dynamic_details(name)
		#name='adi'
		usr = get_detail(name)
		dob=usr.DOB
		firstname=usr.first_name
		lastname=usr.last_name
		email = usr.parent_email
		lti_true_or_false = 0
		template_name = 'base2.html'
	else:
		list = []
		name="guest"
		usr = 'usr1'
		dob= 'dob'
		firstname='first_name'
		lastname='last_name'
		email = 'parent_email'
		context={}
		lti_true_or_false = 1
		template_name =  'ltigametemplate.html'
	print(name)

	gamefiles=getgamefiles(subjectname,themename)
	actualgamefiles=[]
	for i in gamefiles:
		i=i[i.find("media"):]
		relativepath=os.path.join('..','..')
		relativepath2=os.path.join(relativepath,'app')
		relativepath3=os.path.join(relativepath2,i)
	
	# print(gamefiles)
	try:
		users_games_record = DynamicRecord.objects(username=name,theme=themename,subject=subjectname)
		curr_user_stats = users_games_record[0]
		level= curr_user_stats.level
		
		score=curr_user_stats.score

		attempt= len(curr_user_stats.data[int(level)-1].attempt) + 1
		print('found user')
	except:
		print('not found user')
		level= 1
		
		score= 0

		attempt= 1		
	context={
	'list':list ,
	'dob':dob,'email':email,
	'name':name,
	'firstname':firstname,
	'lastname':lastname,
	'gamefiles':gamefiles,
	'level': level,
	'score':score,
	'attempt':attempt,
	'subjectname':subjectname,
	'themename':themename,
	'lti_var':lti_true_or_false,
	'template_name': 'ltigametemplate.html'

	}
	return render(request,'index.html',context)




'''
redirects to the game after integrating the subjectfile and theme file
'''
def test(request):
	subjectname=""
	themename=""
	if request.method=="POST":
		print ('data has come')
		subjectname=request.POST.get("subject")
		themename=request.POST.get("theme")
		return redirect('app/games/'+subjectname+'/'+themename)
		
	return render(request,'test.html',{})


'''
This modules receives data after the user plays the game and stores the data into the database
'''	
def submitdata(request):
	print('data aaya ')
	print(request.POST)
	if request.method=='POST':
		username=request.user.username 
		themename=request.POST.get("themename","")
		subjectname=request.POST.get("subjectname","")
		solvedtime=request.POST.get("solvedtime","")
		level=request.POST.get("level","")
		question=request.POST.get("subjectname","")
		userresponse=request.POST.get("userresponse")
		correctanswer=request.POST.get("correctanswer")
		options=request.POST.get("options")
		attempt=request.POST.get("attempt")
	
		# print(username, subjectname, themename, correctanswer, solvedtime)	
		if request.is_ajax():
			data = {}
			add_answer(username,themename,subjectname,level,attempt,options,correctanswer,userresponse,solvedtime)
			print(subjectname,themename,solvedtime,level,question,userresponse,correctanswer,options,attempt)
			return JsonResponse(data)

'''
redirects to the 404 page, if a invalid url is opened
'''
def handler404(request):
    response = render_to_response('404.html', {},
                                  context_instance=RequestContext(request))
    response.status_code = 404
    return response


'''
This modules enables the user to change the details of the user
'''
def settings(request):

	if not request.user.is_authenticated or request.user.username == '':
		return render(request,'invalid.html',{})	

	name = request.user.username
	if request.method == "POST":
		
		userinfo = get_detail(name)	
		form_first_name = request.POST.get('input_first_name')
		form_last_name = request.POST.get('input_last_name')
		# form_dateofbirth = request.POST.get('input_dob')
		form_school_name = request.POST.get('input_school_name')
		form_parent_email = request.POST.get('input_parent_email')
		form_parent_phone = request.POST.get('input_parent_phone')
		# print(form_dateofbirth)
		userinfo.first_name = form_first_name 
		userinfo.last_name = form_last_name  
		# userinfo.DOB = form_dateofbirth 
		userinfo.school_name = form_school_name  
		userinfo.parent_email = form_parent_email 
		userinfo.parent_phone = form_parent_phone 

		userinfo.save()

	print(name)
	userinfo = get_detail(name)
	
	form_first_name = userinfo.first_name
	form_last_name = userinfo.last_name
	form_dateofbirth = userinfo.DOB
	form_school_name = userinfo.school_name
	form_parent_email = userinfo.parent_email
	form_parent_phone = userinfo.parent_phone

	context = {
		'form_first_name':form_first_name,
		'form_last_name':form_last_name,
		'form_school_name':form_school_name,
		'form_parent_email':form_parent_email,
		'form_parent_phone':form_parent_phone,
		'firstname':form_first_name,
		'lastname':form_last_name,
		'email':form_parent_email,
		'phone':form_parent_phone,
		'name': name,
		'dob':form_dateofbirth
	}
	return render(request,'settings.html',context)

'''
anagram game 
'''
def anagrams(request):
	questiondict = get_anagram_question()

	options=questiondict['options']

	context={
	'answer':questiondict['answer'],
	'question':questiondict['question'],
	'options': options,
	}
	return render(request,'anagram.html',context)


'''
this module accepts the external request from edx and enables the edx user to play the game from edx itself
'''
@csrf_exempt
def lti_data(request):
	print (request)
	print (request.POST)
	subjectname = request.POST.get('custom_subject')
	themename = request.POST.get('custom_theme')
	# send_url = request.POST.get('back_url')
	send_url='http://10.105.43.177:8084/utp/back'
	lis_outcome_service_url = request.POST.get('lis_outcome_service_url')
	lis_result_sourcedid = request.POST.get('lis_result_sourcedid')
	oauth_consumer_key = request.POST.get('oauth_consumer_key')
	user_id = request.POST.get('user_id')
	print("-------------------------------------")
	print(send_url)

	request.session['lti_subjectname'] = subjectname
	request.session['lti_themename'] = themename
	request.session['lti_send_url'] = send_url

	request.session['lti_lis_outcome_service_url'] = lis_outcome_service_url
	request.session['lti_lis_result_sourcedid'] = lis_result_sourcedid
	request.session['lti_oauth_consumer_key'] = oauth_consumer_key
	request.session['lti_user_id'] = user_id

	
	return redirect('/app/games/'+subjectname+'/'+themename)	

'''
this module generates the the dashboard of individual users(no of questions solved)
'''
def lti_send_score(request):
	print('lti senddk')
	print(request.session)
	subjectname = request.session['lti_subjectname']
	themename = request.session['lti_themename']
	send_url = request.session['lti_send_url']
	lis_outcome_service_url = request.session['lti_lis_outcome_service_url']
	lis_result_sourcedid = request.session['lti_lis_result_sourcedid']
	oauth_consumer_key = request.session['lti_oauth_consumer_key']
	user_id = request.session['lti_user_id']
	score = request.POST['score']
	print('************************************************8')
	print(send_url)
	data ={
			'score':score,
			'lis_outcome_service_url': lis_outcome_service_url,
			'lis_result_sourcedid': lis_result_sourcedid,
			'oauth_consumer_key':oauth_consumer_key
	}
	r = requests.post(send_url,data)	
	print(r)

def dashboard(request):
	user_records = DynamicRecord.objects(username = request.user.username)
	start_time = datetime.datetime(1, 1, 1, 1, 1, 1, 1)
	end_time = datetime.datetime.now()
	name = request.user.username
	# print(name)
	listvar = get_dynamic_details(name)
	#name='adi'
	usr = get_detail(name)
	dob=usr.DOB
	firstname=usr.first_name
	lastname=usr.last_name
	email = usr.parent_email



	game_list = []
	for record in user_records:
		level_list = []
		level_count = 0 
		for data in record.data:
			level_count += 1
			level = Level(level_count,get_max_score_of_level(start_time,end_time,record, level_count)[0])
			level_list.append(level)
		game = GameObject(record.subject,level_list)
		game_list.append(game)	

	name = request.user.username
	dash_board = DashBoard(name,game_list)
	context = {
		'username': dash_board.name,
		'game_list': dash_board.game_list,
		'list':listvar,
		'dob':dob,
		'email':email,
		'name':name,
		'firstname':firstname,
		'lastname':lastname,

	}
	return render(request,'dashboard.html',context)



'''
this modules enables the registration of a batch
'''
def batch_registration(request):
	print('batch registration')
	if request.method == 'POST':
		username = request.POST.get("username","")
		password = request.POST.get("password","")
		user = authenticate(username = username ,password = password)
		if user and user.is_superuser:
			form=BatchUploadFileForm(request.POST,request.FILES)
			if form.is_valid():
				name1 = form.cleaned_data['data_excel_file']
				name=request.FILES['data_excel_file']
				print("name re")
				print(name1.name)
				print("save re")
				form.save()
				return batch_reg()
			else:
				return render_to_response('registration.html',{"success":False,"reason":""})
		else:
			return render_to_response('registration.html',{"success":False,"reason":"You are not an Admin ! "})
		# print(form.data_excel_file)
		# print ('post reccievd')
		# print(request.POST)
		# print(request.FILES)
		# if request.FILES:
		# 	print ('is having file')


'''
accepts the excel file uploaded by the user
'''
def batch_reg():
	filename = "media/batchfile/data.xlsx"
	# print filename
	workbook = xlrd.open_workbook(filename)
	sheet = workbook.sheet_by_index(0)
	x = sheet.nrows
	# print x
	print('start')
	for i in range(1,x):

		try:
			print('1')
			instance = UserInfoForm().save(commit=False)
			print('2')
			instance.first_name= str(sheet.cell_value(i,0))
			instance.last_name= str(sheet.cell_value(i,1))
			# DOB = str(sheet.cell_value(i,2))
			# DOB = DOB.split('-')
			# instance.DOB=datetime.datetime('1995', '2', '6','1','1','1')
			print('3')
			instance.gender= str(sheet.cell_value(i,3))
			instance.school_name=str(sheet.cell_value(i,4))
			instance.parent_email=str(sheet.cell_value(i,7))
			print(sheet.cell_value(i,8))
			print(str(sheet.cell_value(i,8)))
			instance.parent_phone= int(round(int(sheet.cell_value(i,8))))
			print('4')
			pass_wd = sheet.cell_value(i,6)
			print('5')
			try:
				pass_wd = int(round(int(pass_wd)))
				print (' no errp rhere')
			except:
				pass_wd = str(pass_wd)
				print('exebjept fhsd')

			print(pass_wd)
			user = User.objects.create_user(str(sheet.cell_value(i,5)),"",pass_wd)
			
			user.save();
			instance.user=user;

			print('going to save')
			print('instance is ' , instance.first_name)
			instance.save()
			print("Invalid credentials")
		except:
			print('ggjh')
			myreason = "Row Number " + str((i)) + "has error"
			return render_to_response('registration.html',{"success":False,'reason':myreason})
	return render_to_response('registration.html',{"success":True})
		

'''
module for resetting password
'''
@csrf_exempt
def reset(request,uidb64=None,token=None):		
	context = RequestContext(request)		
	if(request.method == 'POST'):		
		UserModel = get_user_model()		
		form = SetPasswordForm(data=request.POST)		
		assert uidb64 is not None and token is not None 		
		try :		
			uid = urlsafe_base64_decode(uidb64)		
			user = UserModel._default_manager.get(pk=uid)		
			#print(user.username)		
		except (TypeError,ValueError,OverflowError,UserModel.DoesnotExists):		
			user = None		
		if user is not None and default_token_generator.check_token(user,token):		
			if form.is_valid():		
				new_password = form.cleaned_data['new_password2']		
				user.set_password(new_password)		
				user.save()		
				m = 'Password has been reset.'		
				#return form_valid(form)		
			else:		
				m = 'Password reset Unsuccessfull.'		
				#return form_invalid(form)		
		else:		
			m = 'Link is no longer Valid.'		
			#return form_invalid(form)		
		return HttpResponse(m)		
	else :		
		form = SetPasswordForm()		
		return render_to_response('reset_confirm.html',{"form":form})		
	return HttpResponse("404")

'''
module for handling forget password
'''	
@csrf_exempt		
def forget(request):		
	context = RequestContext(request)		
	if request.method == 'POST' :		
		form = PasswordResetRequestForm(data = request.POST)		
		if(form.is_valid()):		
			data = form.cleaned_data["email"]		
			print("Form Valid")		
			associated_users = User.objects.filter(email=data)		
			for user in associated_users:		
				if(user.is_active):		
					email_template_name = 'password_reset_email.html'		
					subject = 'Reset Password'		
					c = {		
                        'email': user.email,		
                        'domain': 'http://localhost:8000',		
                        'site_name': 'e3store',		
                        'uid': urlsafe_base64_encode(force_bytes(user.pk)),		
                        'user': user,		
                        'token': default_token_generator.make_token(user),		
                        'protocol': 'http',		
                        }		
					email = loader.render_to_string(email_template_name, c)		
					send_mail(subject, email, 'postmaster@moovon.me', [user.email], fail_silently=False)		
					print("Email Sent")		
					break		
					
		return HttpResponse('OK')		
	else :		
		form = PasswordResetRequestForm ()		
		return render_to_response ('forget.html',{"form":form})


'''
this modules sends email for handling the verificaiton of a new user
'''
def sendEmail(datas):
    link="http://localhost:8000/app/activate/"+datas['activation_key']
    c={'activation_link':link,'username':datas['username'],"full_name":datas['full_name']}
    message =get_template('register_email.html').render(c)
    email = render_to_string('register_email.html', c)
    print (str(email))
    send_mail(datas['email_subject'],' ', 'postmaster@moovon.me', [datas['email']], fail_silently=False,html_message=email)
    return message



'''
this modules activates the profile of the user once the verfication mail is clicked
'''
def activation(request, key):
    activation_expired = False
    already_active = False
    profile = get_object_or_404(Profile, activation_key=key)
    #pro.key_expires = key_expires.replace(tzinfo=pytz.UTC)
    if profile.user.is_active == False:
        if datetime.datetime.utcnow().replace(tzinfo=pytz.UTC) > profile.key_expires:
            activation_expired = True #Display : offer to user to have another activation link (a link in template sending to the view new_activation_link)
            id_user = profil.user.id
        else: #Activation successful
            profile.user.is_active = True
            profile.user.save()

    #If user is already active, simply display error message
    else:
        already_active = True #Display : error message
        return HttpResponse("Email Already Activated")

    return HttpResponse("Email Verified!!! Now you can login!")
    #return render(request, 'app/activation.html', locals())

'''
once the validity of the verification mail is over, new verification mail can be generated
'''
def new_activation_link(request, user_id):
    form = RegistrationForm()
    datas={}
    user = User.objects.get(id=user_id)
    if user is not None and not user.is_active:
        datas['username']=user.username
        datas['email']=user.email
        datas['email_path']="/ResendEmail.txt"
        datas['email_subject']="Activate your Account"
        salt = hashlib.sha1()
        salt.update(str(random.random()).encode('UTF-8','strict'))
        if isinstance(usernamesalt, str):
        	usernamesalt = usernamesalt.encode('UTF-8','strict')
        salt.update(usernamesalt)
        salt = salt.hexdigest()
        datas['activation_key']= salt

        profil = Profil.objects.get(user=user)
        profil.activation_key = datas['activation_key']
        profil.key_expires = datetime.datetime.strftime(datetime.datetime.now() + datetime.timedelta(days=2), "%Y-%m-%d %H:%M:%S")
        profil.save()

        form.sendEmail(datas)
        request.session['new_link']=True #Display : new link send

    return redirect(home)

'''
!not important
'''
def test(request):
	subject = 'test'
	email = 'just kidding'
	a='http://www.google.com'
	ehtml = render_to_string('test_email.html',{"a":a})
	send_mail(subject, email, 'postmaster@moovon.me', ['adityank.adi@gmail.com'], fail_silently=False,html_message=ehtml)
	return HttpResponse("Email Sent")


def newDashBoard(request):
	name = request.user.username
	context = get_waste_list(name)
	return render(request, 'subjectwisedashboard.html',context)


def get_waste_list(name):

	print(name)
	list2 = get_dynamic_details(name)
	#name='adi'
	usr = get_detail(name)
	dob=usr.DOB
	firstname=usr.first_name
	lastname=usr.last_name
	email = usr.parent_email
	x = [f['subjectname'] for f in addsubject.objects.all().values('subjectname')]
	x = sorted(x)
	dict1 = {}

	dict2 = {}

	dict3={}

	for userrec in list2:
		if  userrec.subject in dict2.keys():
			dict2[userrec.subject] = max (dict2[userrec.subject], userrec.level)
		else:
			dict2[userrec.subject] = userrec.level
		
	for xi in CompatibilityMatricesMaths.objects.all():
		if xi.subjectname in dict1.keys():
			dict1[xi.subjectname].append(xi.themename)
		else:
			dict1[xi.subjectname] = [xi.themename]




	for xi in CompatibilityMatricesBrain.objects.all():
		if xi.subjectname in dict3.keys():
			dict3[xi.subjectname].append(xi.themename)
		else:
			dict3[xi.subjectname] = [xi.themename]





	subjectthemelist = {"Maths":[], "Brain":[]}
	for x in dict1.keys():
		if x in dict2.keys():
			subjectthemelist['Maths'].append(SubjectThemeList(x,dict1[x], dict2[x]))
		else:
			subjectthemelist['Maths'].append(SubjectThemeList(x,dict1[x] ))

	for x in dict3.keys():
		if x in dict2.keys():
			subjectthemelist['Brain'].append(SubjectThemeList(x,dict3[x], dict2[x]))
		else:
			subjectthemelist['Brain'].append(SubjectThemeList(x,dict3[x] ))

	context = {
		'subjectthemelist': subjectthemelist
	}

	print(subjectthemelist)
	return context;



@csrf_exempt
def get_user_performance(request, subjectname , themename):
	# print('Hello chart')
	# print(request.POST)
	username = request.user.username
	# subject = request.POST.get('subjectname')
	# theme = request.POST.get('themename')
	context = generateChart(username,subjectname,themename)
	return render(request, 'charts.html',context)

def generateChart(username,subjectname, themename):
	print('my chart')
	try:
		users_games_record = DynamicRecord.objects(username=username,theme=themename,subject=subjectname)
		#there is only one record always
		record = users_games_record[0]
		start_time = datetime.datetime(1, 1, 1, 1, 1, 1, 1)
		end_time = datetime.datetime.now()
		level = len(record.data)
		gamename = record.subject + ' - ' + record.theme
		right_list = []
		wrong_list = []
	



		for i in range(0,level):
			max_level_score = get_max_score_of_level(start_time,end_time,record, i+1)
			right_list.append(max_level_score[0])
			wrong_list.append(max_level_score[1])

		print("right list")
		print(right_list)

		print("wrong list")
		print(wrong_list)

	except:
		gamename = subjectname + '-' + themename + '(Not played yet)'
		level = 0
		right_list = []
		wrong_list = []

	context ={
		'gamename': gamename,
		'level': level,
		'right_list':right_list,
		'wrong_list':wrong_list,
		}

	return context

