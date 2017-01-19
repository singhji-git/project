from mongoengine import *
from app.leaderboard import *
import datetime
from django.contrib.auth.models import User
from  .models import *
 

"""
    Method
        Get details of User with username user  
    @return object of User class 
"""
def get_detail(name):
    u = User.objects.get(username=name)
    usr = UserInfo.objects.all().get(user=u)
    return usr


"""
    Method
        Search group with group id equal to find_id  
    @return  None or group 
"""
def search_group(group_list,find_id):
    for x in group_list:
        if x.group_id == find_id:
            return x
    return None 

"""
    Method
        Return score of a particular student record from mongodb within in a particular time  and for a particular game and level
        uncommment this line
             "if level_play_time >= start_time and level_play_time <= end_time:"
        for checking with in a particular range
    @return  number of correct answer i.e. correct_ans , number of wrong ans i.e. penalty, time taken to play the level i.e. time_takeb  
"""
def get_score_of_level(start_time, end_time, attempt_record):
    penalty = 0
    time_taken = 0
    correct_ans = 0
    level_play_time = attempt_record.start_timestamp
    questions = attempt_record.answers

    for question in questions:
        # if level_play_time >= start_time and level_play_time <= end_time:
            if question.correct_ans == question.user_ans or ( type(question.correct_ans) == 'str' and type(question.user_ans) == 'str' and question.correct_ans in question.user_ans)  :
                correct_ans += 1
            else:
                penalty += 1
            time_taken += question.solve_time
    return [correct_ans, penalty, time_taken] 


"""
    Method
        Returns the maximum score of a particular student record from mongodb within in a particular time range and for a particular game and level
    @return  number of correct answer i.e. correct_ans , number of wrong ans i.e. penalty, time taken to play the level i.e. time_takeb  
"""
def get_max_score_of_level(start_time, end_time ,record ,level=None):
    max_correct_ans = 0
    max_penalty = 0
    max_time_taken = 0
    attempts = record.data[level-1].attempt
    correct_ans = 0
    penalty = 0
    time_taken  =0
    for attempt in attempts:
        [correct_ans, penalty, time_taken] = get_score_of_level(start_time,end_time,attempt)
        if max_correct_ans < correct_ans:
            max_correct_ans = correct_ans
            max_penalty = penalty
            max_time_taken = time_taken

    return [correct_ans, penalty, time_taken] 



"""
    Method
        Returns the score of a particular student record from mongodb within in a particular time range and for a particular game
    @return  number of total correct answer i.e. total_score , number of wrong ans i.e. total_penalty, time taken to play the level i.e. total_time_takeb  
"""
def get_game_score(start_time, end_time ,record):
    level_done_size = len(record.data)
    total_score = 0
    total_penalty = 0
    total_time_taken = 0
    for level in range(0,level_done_size):
        result_ = get_max_score_of_level(start_time, end_time, record, level)
        total_score += result_[0]
        total_penalty += result_[1]
        total_time_taken += result_[2]
    return  [total_score, total_penalty, total_time_taken]


"""
    Method
        Create a new object of LeaderBoard class and save it
    @return  Nothing
"""

def create_and_save_leaderboard_record(username, score,penalty, time_taken, school_name):
    LeaderBoard(username,score,penalty, time_taken, school_name).save()

"""
    Method
        Update object of LeaderBoard class
    @return  Nothing
"""
def update_user_score(username, score, penalty, time_taken):
    LeaderBoard.objects[username].score += score
    LeaderBoard.objects[username].penalty += penalty
    LeaderBoard.objects[username].time_taken += time_taken
    

"""
    Method
        Generate leaderboard for a list of users within a particular time limit 
        for time limit refer to get_level_score method
    @return  Nothing
"""    
def generate_leaderboard(start_time, end_time, users_list):
    for user in users_list:
        username = user.username
        if username != '':
            print("USERNAME "+username)
            userinfo = get_detail(username)
            [score, penalty, time_taken] = get_game_score(start_time, end_time, user)
            try:
                school_name = userinfo.school_name
            except:
                school_name = 'Delhi Public School'
            if username in LeaderBoard.objects.keys():
                update_user_score(username, score, penalty, time_taken)
            else:    
                create_and_save_leaderboard_record(username, score,penalty, time_taken, school_name)

"""
    Method
        Generate leaderboard for a particular group within a particular time limit 
        for time limit refer to get_level_score method @return  Nothing
"""
def group_leaderboard_record(start_time, end_time, group_name_list):
    stud = []
    for name in group_name_list:
        my_list = DynamicRecord.objects(username = name)
        if len(my_list) > 0 :
            stud.extend(my_list)
    generate_leaderboard(start_time, end_time, stud)


"""
    Usage of above method
"""

# generate leaderboard for all
# start_time = datetime.datetime(1, 1, 1, 1, 1, 1, 1)
# end_time = datetime.datetime.now()
# generate_leaderboard(start_time, end_time, DynamicRecord.objects)

# generate leaderboard specific to a subject
# generate_leaderboard(start_time, end_time, DynamicRecord.objects(subject='Addition'))



# user1, user2, user3 should be valid users
# group_name_list = ['user1','user2','user3']
#group_leaderboard_record(start_time, end_time, group_name_list)

