from mongoengine import *
from leaderboard import *
import datetime

db = connect('newTest')
#print db
#db.drop_database('newTest')
class AnswerRec(EmbeddedDocument):
    correct_ans = StringField()
    user_ans = StringField()
    solve_time = DecimalField()

    def __rep__(self):
        return 'Value %s %s %s' %(self.correct_ans, self.user_ans, self.solve_time)

class LevelDataRec(EmbeddedDocument):
    start_timestamp = DateTimeField()
    answer  = ListField(EmbeddedDocumentField(AnswerRec))

    

class DynamicRecord(Document):
    username = StringField()
    subject = StringField()
    theme = StringField()
    score = IntField()
    level = IntField()
    data = ListField(EmbeddedDocumentField(LevelDataRec))

def search_group(group_list,find_id):
    for x in group_list:
        if x.group_id == find_id:
            return x
    return None

def get_score_of_level(start_time, end_time ,record ,level=None):
    correct_ans = 0
    penalty = 0;
    time_taken = 0
    questions = record.data[level-1].answer
    level_completion_time = record.data[level-1].start_timestamp
    
    
    for question in questions:
        if level_completion_time >= start_time and level_completion_time <= end_time:
            if question.correct_ans == question.user_ans:
                correct_ans += 1
            else:
                penalty += 1
            time_taken += question.solve_time
    return [correct_ans, penalty, time_taken] 


def get_game_score(start_time, end_time ,record):
    level_done_size = len(record.data)
    total_score = 0
    total_penalty = 0
    total_time_taken = 0
    for level in range(0,level_done_size):
        result_ = get_score_of_level(start_time, end_time, record, level)
        total_score += result_[0]
        total_penalty += result_[1]
        total_time_taken += result_[2]
    return  [total_score, total_penalty, total_time_taken]


def create_and_save_leaderboard_record(username, score,penalty, time_taken, school_name):
    LeaderBoard(username,score,penalty, time_taken, school_name).save()

def update_user_score(username, score, penalty, time_taken):
    LeaderBoard.objects[username].score += score
    LeaderBoard.objects[username].penalty += penalty
    LeaderBoard.objects[username].time_taken += time_taken
    

def generate_leaderboard(start_time, end_time, users_list):
    for user in users_list:
        username = user.username
        [score, penalty, time_taken] = get_game_score(start_time, end_time, user)
        school_name = 'Dummy'
        if username in LeaderBoard.objects.keys():
            update_user_score(username, score, penalty, time_taken)
        else:    
            create_and_save_leaderboard_record(username, score,penalty, time_taken, school_name)



ac = AnswerRec(correct_ans='1', user_ans = '1', solve_time=4.5)


a = LevelDataRec(start_timestamp=datetime.datetime.now(),answer=[ac])


d = DynamicRecord()
d.username = 'mayank'
d.subject = 'Addition'
d.theme = 'Shapes'
d.score = 20
d.level = 2
d.data = [a]

#d.save()


#print get_game_score('1',d)

#here group id 1 reprresnts global


#generate leaderboard for all
start_time = datetime.datetime(1, 1, 1, 1, 1, 1, 1)
end_time = datetime.datetime.now()
#generate_leaderboard(start_time, end_time, DynamicRecord.objects)

#generate leaderboard specific to a subject
#generate_leaderboard(start_time, end_time, DynamicRecord.objects(Q(subject='Addition')))


# if want in a group give list of student that are part of group
def group_leaderboard_record(start_time, end_time, group_name_list):
    stud = []
    for name in group_name_list:
        my_list = DynamicRecord.objects(username = name)
        if len(my_list) > 0 :
            stud.extend(my_list)
    generate_leaderboard(start_time, end_time, stud)
    

group_name_list = ['mayank','adi']
group_leaderboard_record(start_time, end_time, group_name_list)

for p in LeaderBoard.sorted_objects():
    print p
