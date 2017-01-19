from mongoengine import *
from .object import *
from .objects import *
from datetime import *


'''
Get the dynamic record for an username
'''


def get_dynamic_details(name):
	#db=connect('newtest')
	result = DynamicRecord.objects(username= name)
	return result
	
# def update_score(name,theme,subject,score):
# 	result = DynamicRecord.objects(username=name,theme=theme,subject=subject)

'''
Create a new group 
'''

def create_group(uname,gp_name,gp_id):
	#db=connect('newTest')
	d= UserDataRec(user_name=uname,join_timestamp=datetime.utcnow())
	gp = GroupDetail(group_name=gp_name,group_id=gp_id,admin_name=uname,user_data=[d])
	gp.save()

'''
Add a user to an group
'''
def add_user_to_group(uname,gp_id):
	group = GroupDetail.objects.get(group_id=gp_id)
	ur = UserDataRec(user_name=uname,join_timestamp=datetime.utcnow())
	group.update(add_to_set__user_data=[ur])

'''
Update score for a game for an user
'''
def update_score(name,theme,subject,score):
	result = DynamicRecord.objects(username=name,theme=theme,subject=subject)
	for user in result:
		user.score = score;
		user.save()

'''
Update level for a game for an user
'''

def update_level(name,theme,subject,level):
	result = DynamicRecord.objects(username=name,theme=theme,subject=subject)
	for user in result:
		user.level = level
		user.save()


'''
Update the dynamic record for a new game
'''
def add_subject_theme(name,theme,subject):
	new = DynamicRecord()
	new.username = name
	new.subject = subject
	new.theme = theme
	new.level = 0 
	new.data = []
	new.save()


'''
Store each answer for an user
'''
def add_answer(name,theme,subject,level,attempt,options,correct_ans,user_ans,solve_time):
	result = DynamicRecord.objects(username=name,theme=theme,subject=subject)
	print ('result', result)
	if len(result) <= 0:
		new_attempt_rec = AttemptRec()
		new_level_rec = LevelDataRec()
		new_level_rec.attempt = [new_attempt_rec]
		new_attempt_rec.start_timestamp=datetime.utcnow()

		new_record = DynamicRecord()
		new_record.username = name
		new_record.subject = subject
		new_record.theme = theme
		new_record.score = 0
		new_record.level = 1
		new_record.groups = []
		new_record.data = [new_level_rec]

		new_record.save()

		result = DynamicRecord.objects(username=name,theme=theme,subject=subject)

		print('inside')
	ans=AnswerRec(question=subject,options=options.split(','),correct_ans=correct_ans,user_ans=user_ans,solve_time=solve_time)

	# ans=AnswerRec(question="Counting",options=options.split(','),correct_ans=,user_ans=,solve_time=)
	at=AttemptRec(start_timestamp=datetime.utcnow())

	for user in result:
		if(int(level)>len(user.data)):
			print("Level Not Accessible")
			lev= LevelDataRec()

			user.data.append(lev)
			user.save()

		if int(user.level) < int(level):
			print('Level UP')
			user.level = level
		print ("Appending...." + str(int(attempt)-1))
		print ('shdsh ',int(attempt) ,'>' ,len(user.data[int(level)-1].attempt))
		if(int(attempt) > len(user.data[int(level)-1].attempt)):
			print("Creating new attempt!!"+ str(int(level)-1))
			user.data[int(level)-1].attempt.append(at)
		user.data[int(level)-1].attempt[int(attempt)-1].answers.append(ans)
		user.save()
