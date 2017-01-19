from datetime import *
from mongoengine import *


"""
    Database stucture for mongodb
"""


'''
Dynamic Records
    |-- username 
    |-- subject
    |-- theme
    |-- score
    |-- level
    |-- groups
    |-- data
        |-- attemp
            |-- start_timestamp
            |-- answers
                |-- question 
                |-- options
                    |-- option1
                    |-- option2
                |-- correct_ans
                |-- user_ans
                |-- solve_time

            |-- ....
        |-- .....
                    

'''
class AnswerRec(EmbeddedDocument):
    question = StringField()
    options = ListField(StringField())
    correct_ans = StringField()
    user_ans = StringField()
    solve_time = DecimalField()

    def __rep__(self):
        return 'Value %s %s %s' %(self.correct_ans, self.user_ans, self.solve_time)

class AttemptRec(EmbeddedDocument):
    start_timestamp = DateTimeField()
    answers = ListField(EmbeddedDocumentField(AnswerRec))

class LevelDataRec(EmbeddedDocument):
    #start_timestamp = DateTimeField()
    attempt  = ListField(EmbeddedDocumentField(AttemptRec))

    
class DynamicRecord(Document):
    username = StringField()
    subject = StringField()
    theme = StringField()
    score = IntField()
    level = IntField()
    groups = ListField(ObjectIdField())
    data = ListField(EmbeddedDocumentField(LevelDataRec))


